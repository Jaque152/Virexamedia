import { Resend } from 'resend';
import { Checkout, CartItem } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'ventas@marketingresultados.com'; 
const INTERNAL_EMAIL = 'info@marketingresultados.com';

const formatPrice = (price: number) => 
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

// Paleta de colores 
const emailTheme = {
  bgDark: '#0F0F1A',
  cardDark: '#1A1B2E',
  textAccent: '#C87941',
  textLight: '#F5F0E8',
  textMuted: '#9ca3af'
};

// 1. EMAIL DE CHECKOUT 

export async function sendReceiptEmail(
  checkout: Checkout, 
  items: CartItem[], 
  isEnglish: boolean = false
) {
  // ---PLANTILLA PARA EL CLIENTE ---
  const subjectClient = isEnglish 
    ? `Purchase Confirmation - Welcome to Marketing Resultados` 
    : `Confirmación de Compra - Bienvenido a Marketing Resultados`;

  const htmlClient = `
    <div style="font-family: 'Times New Roman', Times, serif; max-width: 600px; margin: auto; color: ${emailTheme.textLight}; background-color: ${emailTheme.bgDark}; border: 1px solid #2d2e40; border-radius: 12px; overflow: hidden;">
      <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #2d2e40;">
        <h1 style="color: ${emailTheme.textLight}; margin: 0; font-size: 26px; font-weight: normal; letter-spacing: 2px;">Marketing Resultados</h1>
        <p style="color: ${emailTheme.textAccent}; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-family: Arial, sans-serif; margin-top: 10px;">Estrategias de Élite</p>
      </div>
      <div style="padding: 40px 30px; font-family: Arial, sans-serif;">
        <h2 style="color: ${emailTheme.textLight}; margin-top: 0; font-size: 20px; font-weight: normal; font-family: 'Times New Roman', Times, serif;">Estimado/a ${checkout.nombre},</h2>
        <p style="font-size: 15px; color: ${emailTheme.textMuted}; line-height: 1.6;">Hemos recibido su pago correctamente. Su estrategia de marketing ha entrado en fase de desarrollo.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr style="border-bottom: 1px solid #2d2e40; text-align: left;">
              <th style="padding: 12px 0; color: ${emailTheme.textMuted}; font-size: 12px; text-transform: uppercase; font-weight: normal;">Servicio Adquirido</th>
              <th style="padding: 12px 0; color: ${emailTheme.textMuted}; font-size: 12px; text-transform: uppercase; text-align: right; font-weight: normal;">Inversión</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #2d2e40;">
                <td style="padding: 15px 0; color: ${emailTheme.textLight}; font-size: 14px;">
                  ${item.plans_nc?.title || 'Plan Personalizado'} 
                  ${item.quote_id ? `<br><span style="font-size:12px; color:${emailTheme.textAccent}">Ref: ${item.quote_id}</span>` : ''}
                </td>
                <td style="padding: 15px 0; text-align: right; color: ${emailTheme.textLight}; font-size: 14px;">${formatPrice(item.custom_price || item.plans_nc?.price || 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background-color: ${emailTheme.cardDark}; border-radius: 8px; padding: 25px; text-align: right; border: 1px solid #2d2e40;">
          <span style="font-size: 12px; color: ${emailTheme.textMuted}; text-transform: uppercase; letter-spacing: 1px;">Total (IVA Incluido)</span>
          <span style="font-size: 26px; font-family: 'Times New Roman', Times, serif; color: ${emailTheme.textAccent}; display: block; margin-top: 5px;">${formatPrice(checkout.total_estimado)}</span>
        </div>
      </div>
    </div>
  `;

  // --- B. PLANTILLA PARA EL EQUIPO INTERNO ---
  const htmlInternal = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">💰 Nueva Venta Procesada</h2>
      <p style="color: #555;"><strong>ID Transacción:</strong> ${checkout.id}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td colspan="2" style="background: #f4f6f8; padding: 10px; font-weight: bold; color: #333;">Datos del Cliente</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 30%;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${checkout.nombre} ${checkout.apellidos}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${checkout.correo_electronico}">${checkout.correo_electronico}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${checkout.telefono || 'No proporcionado'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Dirección:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${checkout.direccion_calle}, ${checkout.localidad_ciudad}, ${checkout.region_estado}, ${checkout.codigo_postal}, ${checkout.pais_region}</td></tr>
      </table>

      <h3 style="margin-top: 25px; color: #333;">Detalle del Pedido</h3>
      <ul style="color: #444;">
        ${items.map(item => `
          <li style="margin-bottom: 8px;">
            ${item.quantity}x <strong>${item.plans_nc?.title || 'Plan Personalizado'}</strong> 
            ${item.quote_id ? `<span style="color:#888;">(Cotización: ${item.quote_id})</span>` : ''} 
            - ${formatPrice(item.custom_price || item.plans_nc?.price || 0)}
          </li>
        `).join('')}
      </ul>
      
      <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 6px; text-align: right;">
        <p style="margin: 5px 0; color: #666;">Subtotal: ${formatPrice(checkout.subtotal)}</p>
        <p style="margin: 5px 0; color: #666;">Impuestos: ${formatPrice(checkout.impuesto)}</p>
        <p style="margin: 10px 0 0 0; font-size: 18px; color: #2e7d32;"><strong>TOTAL COBRADO: ${formatPrice(checkout.total_estimado)}</strong></p>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: `Marketing Resultados <${FROM_EMAIL}>`,
      to: [checkout.correo_electronico],
      subject: subjectClient,
      html: htmlClient,
    }),
    resend.emails.send({
      from: `Sistema de Ventas <${FROM_EMAIL}>`,
      to: [INTERNAL_EMAIL],
      subject: `Nueva Venta: ${checkout.nombre} ${checkout.apellidos} - ${formatPrice(checkout.total_estimado)}`,
      html: htmlInternal,
    })
  ]);
}

// 2. EMAIL DE CONTACTO (Cliente e Interno)

export interface ContactFormData {
  nombre_completo: string;
  empresa_negocio: string;
  telefono: string;
  correo_electronico: string;
  asunto: string;
  mensaje: string;
}

export async function sendContactConfirmationEmail(data: ContactFormData, isEnglish: boolean = false) {
  
  // ---  PLANTILLA PARA EL CLIENTE ---
  const subjectClient = isEnglish 
    ? "We received your message - Marketing Resultados" 
    : "Hemos recibido su mensaje - Marketing Resultados";
  
  const htmlClient = `
    <div style="font-family: 'Times New Roman', Times, serif; max-width: 600px; margin: auto; color: ${emailTheme.textLight}; background-color: ${emailTheme.bgDark}; border: 1px solid #2d2e40; border-radius: 12px; overflow: hidden;">
      <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #2d2e40;">
        <h1 style="color: ${emailTheme.textLight}; margin: 0; font-size: 26px; font-weight: normal; letter-spacing: 2px;">Marketing Resultados</h1>
        <p style="color: ${emailTheme.textAccent}; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-family: Arial, sans-serif; margin-top: 10px;">Estrategias de Élite</p>
      </div>
      
      <div style="padding: 40px 30px; font-family: Arial, sans-serif;">
        <h2 style="color: ${emailTheme.textLight}; margin-top: 0; font-size: 20px; font-weight: normal; font-family: 'Times New Roman', Times, serif;">
          ${isEnglish ? `Dear ${data.nombre_completo},` : `Estimado/a ${data.nombre_completo},`}
        </h2>
        <p style="font-size: 15px; color: ${emailTheme.textMuted}; line-height: 1.6;">
          ${isEnglish 
            ? 'We have successfully received your message. Our team is currently reviewing your inquiry and will contact you shortly.' 
            : 'Hemos recibido su mensaje correctamente. Nuestro equipo se encuentra revisando su solicitud y se pondrá en contacto a la brevedad.'}
        </p>

        <div style="background-color: ${emailTheme.cardDark}; border-radius: 8px; padding: 25px; margin-top: 30px; border: 1px solid #2d2e40;">
          <h3 style="color: ${emailTheme.textAccent}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; font-weight: normal;">
            ${isEnglish ? 'Inquiry Summary' : 'Resumen de su consulta'}
          </h3>
          <p style="font-size: 14px; color: ${emailTheme.textMuted}; margin: 8px 0;"><strong>${isEnglish ? 'Subject:' : 'Asunto:'}</strong> ${data.asunto}</p>
          <p style="font-size: 14px; color: ${emailTheme.textMuted}; margin: 8px 0;"><strong>${isEnglish ? 'Company:' : 'Empresa:'}</strong> ${data.empresa_negocio}</p>
          <p style="font-size: 14px; color: ${emailTheme.textMuted}; margin: 8px 0;"><strong>${isEnglish ? 'Phone:' : 'Teléfono:'}</strong> ${data.telefono}</p>
        </div>
        
        <p style="font-size: 13px; color: ${emailTheme.textMuted}; line-height: 1.6; margin-top: 30px; text-align: center;">
          ${isEnglish ? 'Thank you for trusting' : 'Gracias por confiar en'} Marketing Resultados.
        </p>
      </div>
    </div>
  `;

  // --- PLANTILLA PARA EL EQUIPO INTERNO ---
  const htmlInternal = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">📋 Nuevo Lead de Contacto</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%; color: #555;"><strong>Nombre:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;">${data.nombre_completo}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Empresa:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;">${data.empresa_negocio}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Email:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;"><a href="mailto:${data.correo_electronico}">${data.correo_electronico}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Teléfono:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;">${data.telefono}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;"><strong>Asunto:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #111;">${data.asunto}</td>
        </tr>
      </table>

      <div style="margin-top: 25px;">
        <h3 style="color: #333; margin-bottom: 10px;">Mensaje Original:</h3>
        <div style="white-space: pre-wrap; color: #333; background: #f4f6f8; padding: 15px; border-left: 4px solid #1a73e8; border-radius: 4px; font-size: 14px; line-height: 1.6;">${data.mensaje}</div>
      </div>
      
      <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">Notificación generada automáticamente por Marketing Resultados</p>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: `Marketing Resultados <${FROM_EMAIL}>`,
      to: [data.correo_electronico],
      subject: subjectClient,
      html: htmlClient,
    }),
    resend.emails.send({
      from: `Web Bot <${FROM_EMAIL}>`,
      to: [INTERNAL_EMAIL],
      subject: `Lead Web: ${data.asunto} - ${data.empresa_negocio}`,
      html: htmlInternal,
    })
  ]);
}