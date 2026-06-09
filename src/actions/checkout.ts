'use server';
import { CheckoutPayload, CartItem, Checkout } from '@/types';
import { createClient } from '@supabase/supabase-js'; 
import { sendReceiptEmail } from '@/lib/mail';

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[CRÍTICO] Variable de entorno faltante: ${name}`);
    throw new Error(`Error de configuración en el servidor.`);
  }
  return value;
}

const getOctanoHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Explonix/1.0', // Puedes ajustar el User-Agent
  ...extraHeaders
});

async function safeOctanoFetch(url: string, options: RequestInit, stepName: string) {
  try {
    console.log(`📡 [Octano] Conectando a: ${url}`);
    const res = await fetch(url, options);
    const text = await res.text();
    
    if (!res.ok) {
      console.warn(`⚠️ [Octano] Código HTTP ${res.status} en ${stepName}`);
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error(`[Octano API Error - ${stepName}]: El servidor no devolvió JSON. HTTP Status: ${res.status}`);
      console.error(` Snippet del HTML recibido:\n`, text.substring(0, 300));
      
      throw new Error(`Error ${res.status}: La ruta de pago es incorrecta o está bloqueada.`);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[CRÍTICO - ${stepName}]:`, msg);
    throw new Error(`Falla de red en: ${stepName}.`);
  }
}

export async function processCheckout(formData: CheckoutPayload) {
  try {
    const { locale, contactInfo, billingInfo, cardInfo, items, total } = formData;
    
    const supabaseAdmin = createClient(
      requireEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnvVar('SUPABASE_SERVICE_ROLE_KEY')
    );

    // Cambia estas variables en tu archivo .env
    const OCTANO_BASE_URL = requireEnvVar('OCTANO_BASE_URL');
    const OCTANO_EMAIL = requireEnvVar('OCTANO_EMAIL');
    const OCTANO_PASSWORD = requireEnvVar('OCTANO_PASSWORD');

    // 1. LOGIN 
    const loginParams = new URLSearchParams();
    loginParams.append('email', OCTANO_EMAIL);
    loginParams.append('password', OCTANO_PASSWORD);

    const signinData = await safeOctanoFetch(`${OCTANO_BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: loginParams.toString()
    }, 'Login Octano');

    if (!signinData.authToken) throw new Error("Credenciales del procesador rechazadas.");
    
    // 2. TOKENIZAR
    const tokenData = await safeOctanoFetch(`${OCTANO_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getOctanoHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify({
        cardData: {
          cardNumber: cardInfo.number.replace(/\s+/g, ''), // Asegurar limpieza de espacios según PHP
          cardholderName: cardInfo.name,
          expirationMonth: cardInfo.expiry.split('/')[0].trim(),
          expirationYear: cardInfo.expiry.split('/')[1].trim(),
        }
      })
    }, 'Tokenización');

    if (!tokenData.cardNumberToken) throw new Error("Tarjeta declinada o inválida.");

    // 3. VENTA
    const salePayload = {
      amount: Number((total * 1.16).toFixed(2)),
      currency: 484,
      reference: `NC-${Date.now()}`,
      customerInformation: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        middleName: '',
        email: contactInfo.email,
        phone1: contactInfo.phone,
        city: billingInfo.localidad,
        address1: billingInfo.direccion,
        postalCode: billingInfo.codigo_postal,
        state: billingInfo.estado,
        country: 'MX',
        ip: '127.0.0.1' // Requerido comúnmente para validaciones antifraude
      },
      cardData: {
        cardNumberToken: tokenData.cardNumberToken,
        cvv: cardInfo.cvv
      },
      items: items.map((i: CartItem) => ({
        title: i.plans_virexa?.title || 'Estrategia Personalizada',
        amount: i.custom_price || i.plans_virexa?.price || 0,
        quantity: i.quantity,
        id: i.plan_id.toString()
      })),
      redirectUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tusitio.com' // Octano requiere un redirectUrl para flujos 3DS
    };

    const saleData = await safeOctanoFetch(`${OCTANO_BASE_URL}/sale`, {
      method: 'POST',
      headers: getOctanoHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');

    if (saleData.status !== 'APPROVED') {
      throw new Error(saleData.message || "El banco declinó la transacción.");
    }

    // 4. GUARDAR EN BD

    const subtotalCalc = total;                  // El total actual es el subtotal
    const impuestoCalc = total * 0.16;           // Calculamos el 16% de IVA
    const granTotal = total * 1.16;              // Sumamos el subtotal + IVA

    const { data: checkoutRecord, error: dbError } = await supabaseAdmin
      .from('checkouts_virexa')
      .insert({
        session_id: `session_${Date.now()}`, 
        nombre: contactInfo.firstName,
        apellidos: contactInfo.lastName,
        pais_region: billingInfo.pais,
        direccion_calle: billingInfo.direccion,
        localidad_ciudad: billingInfo.localidad,
        region_estado: billingInfo.estado,
        codigo_postal: billingInfo.codigo_postal,
        telefono: contactInfo.phone,
        correo_electronico: contactInfo.email,
        indicaciones_pedido: null,
        subtotal: Number(subtotalCalc.toFixed(2)),
        impuesto: Number(impuestoCalc.toFixed(2)),
        total_estimado: Number(granTotal.toFixed(2)),
        payment_status: 'paid'
      })
      .select()
      .single();

    if (dbError || !checkoutRecord) {
      console.error("[CRÍTICO] Detalle del error al insertar Checkout:", dbError);
      throw new Error("Pago exitoso, pero falló la generación del recibo.");
    }

    // 5. GUARDAR ITEMS
    const checkoutItems = items.map((item: CartItem) => ({
      checkout_id: checkoutRecord.id,
      plan_id: item.plan_id,
      quantity: item.quantity,
      unit_price: item.plans_virexa?.price || 0,
      custom_price: item.custom_price,
      quote_id: item.quote_id
    }));

    const { error: itemsError } = await supabaseAdmin.from('checkout_items_virexa').insert(checkoutItems);
    if (itemsError) console.error("[CRÍTICO] Detalle del error en Items:", itemsError);

    // 6. ENVIAR CORREO
    await sendReceiptEmail(checkoutRecord as Checkout, items, locale === 'en');

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado.";
    return { success: false, message: errorMessage };
  }
}