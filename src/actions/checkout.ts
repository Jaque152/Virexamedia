'use server';
import { CheckoutPayload, CartItem, Checkout } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { sendReceiptEmail } from '@/lib/mail';

const ETOMIN_EMAIL = process.env.ETOMIN_EMAIL!;
const ETOMIN_PASSWORD = process.env.ETOMIN_PASSWORD!;
const ETOMIN_BASE_URL = 'https://pagos.etomin.com/api/v1';

const getEtominHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'MarketingResultados /1.0',
  ...extraHeaders
});

async function safeEtominFetch(url: string, options: RequestInit, stepName: string) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Error en ${stepName}: ${text.slice(0, 50)}`);
  }
}

export async function processCheckout(formData: CheckoutPayload) {
  try {
    const { locale, contactInfo, billingInfo, cardInfo, items, total } = formData;
    const supabase = await createClient();

    // 1 & 2. LOGIN Y TOKENIZAR
    const signinData = await safeEtominFetch(`${ETOMIN_BASE_URL}/signin`, {
      method: 'POST',
      headers: getEtominHeaders(),
      body: JSON.stringify({ email: ETOMIN_EMAIL, password: ETOMIN_PASSWORD })
    }, 'Login Etomin');

    if (!signinData.authToken) throw new Error("Falla de autenticación con el procesador.");
    const authToken = signinData.authToken;

    const tokenData = await safeEtominFetch(`${ETOMIN_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify({
        cardData: {
          cardNumber: cardInfo.number,
          cardholderName: cardInfo.name,
          expirationMonth: cardInfo.expiry.split('/')[0],
          expirationYear: cardInfo.expiry.split('/')[1],
        }
      })
    }, 'Tokenización');

    if (!tokenData.cardNumberToken) throw new Error("Tarjeta no válida.");

    // 3. PROCESAR VENTA
    const salePayload = {
      amount: Number(total.toFixed(2)),
      currency: 484, // MXN
      reference: `NC-${Date.now()}`,
      customerInformation: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone1: contactInfo.phone,
        city: billingInfo.localidad,
        address1: billingInfo.direccion,
        postalCode: billingInfo.codigo_postal,
        state: billingInfo.estado,
        country: 'MX'
      },
      cardData: {
        cardNumberToken: tokenData.cardNumberToken,
        cvv: cardInfo.cvv
      },
      items: items.map((i: CartItem) => ({
        title: i.plans_nc?.title || 'Estrategia Personalizada',
        amount: i.custom_price || i.plans_nc?.price || 0,
        quantity: i.quantity,
        id: i.plan_id.toString()
      }))
    };

    const saleData = await safeEtominFetch(`${ETOMIN_BASE_URL}/sale`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');

    if (saleData.status !== 'APPROVED') {
      throw new Error(saleData.message || "Pago declinado.");
    }

    // 4. GUARDAR EN BD: checkouts_nc
    const subtotalCalc = total / 1.16;
    const { data: checkoutRecord, error: dbError } = await supabase
      .from('checkouts_nc')
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
        subtotal: subtotalCalc,
        impuesto: total - subtotalCalc,
        total_estimado: total,
        payment_status: 'paid'
      })
      .select()
      .single();

    if (dbError || !checkoutRecord) throw new Error("Error guardando el registro.");

    // 5. GUARDAR ITEMS EN checkout_items_nc
    const checkoutItems = items.map((item: CartItem) => ({
      checkout_id: checkoutRecord.id,
      plan_id: item.plan_id,
      quantity: item.quantity,
      unit_price: item.plans_nc?.price || 0,
      custom_price: item.custom_price,
      quote_id: item.quote_id
    }));

    await supabase.from('checkout_items_nc').insert(checkoutItems);

    // 6. ENVIAR CORREO
    await sendReceiptEmail(checkoutRecord as Checkout, items, locale === 'en');

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado.";
    return { success: false, message: errorMessage };
  }
}