import { Resend } from 'resend';
import { Checkout, CartItem } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);

// Actualización de correos a la nueva marca
const FROM_EMAIL = 'ventas@virexamedia.com'; 
const INTERNAL_EMAIL = 'ventas@virexamedia.com';

const formatPrice = (price: number) => 
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

// Nueva Paleta de colores - Estilo SaaS Claro
const emailTheme = {
  bgLight: '#F8FAFC',       // slate-50
  cardLight: '#FFFFFF',     // white
  textDark: '#0F172A',      // slate-900
  textAccent: '#2196F3',    // virexa-blue
  textMuted: '#64748B',     // slate-500
  border: '#E2E8F0'         // slate-200
};

// ==========================================
// 1. EMAIL DE CHECKOUT 
// ==========================================
export async function sendReceiptEmail(
  checkout: Checkout, 
  items: CartItem[], 
  isEnglish: boolean = false
) {
  // ---PLANTILLA PARA EL CLIENTE ---
  const subjectClient = isEnglish 
    ? `Project Confirmation - Welcome to Virexamedia` 
    : `Confirmación de Proyecto - Bienvenido a Virexamedia`;

  const htmlClient = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; color: ${emailTheme.textDark}; background-color: ${emailTheme.bgLight}; padding: 20px;">
      <div style="background-color: ${emailTheme.cardLight}; border: 1px solid ${emailTheme.border}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        
        <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid ${emailTheme.border};">
          <h1 style="color: ${emailTheme.textDark}; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Virexamedia</h1>
          <p style="color: ${emailTheme.textAccent}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">Tech & Digital Growth</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: ${emailTheme.textDark}; margin-top: 0; font-size: 18px; font-weight: 600;">Hola ${checkout.nombre},</h2>
          <p style="font-size: 15px; color: ${emailTheme.textMuted}; line-height: 1.6;">
            ${isEnglish 
              ? 'Your payment has been successfully processed. We are provisioning your workspace and will contact you shortly to kick off the development.' 
              : 'Tu pago ha sido procesado exitosamente. Estamos configurando tu entorno de trabajo y nos pondremos en contacto a la brevedad para el kick-off del desarrollo.'}
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
            <thead>
              <tr style="border-bottom: 2px solid ${emailTheme.border}; text-align: left;">
                <th style="padding: 12px 0; color: ${emailTheme.textMuted}; font-size: 12px; text-transform: uppercase; font-weight: 700;">${isEnglish ? 'Solution' : 'Solución Adquirida'}</th>
                <th style="padding: 12px 0; color: ${emailTheme.textMuted}; font-size: 12px; text-transform: uppercase; text-align: right; font-weight: 700;">${isEnglish ? 'Investment' : 'Inversión'}</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid ${emailTheme.border};">
                  <td style="padding: 16px 0; color: ${emailTheme.textDark}; font-size: 15px; font-weight: 500;">
                    ${item.plans_virexa?.title || 'Desarrollo a Medida'} 
                    ${item.quote_id ? `<br><span style="font-size:12px; color:${emailTheme.textMuted}; font-weight: normal;">REF: ${item.quote_id}</span>` : ''}
                  </td>
                  <td style="padding: 16px 0; text-align: right; color: ${emailTheme.textDark}; font-size: 15px; font-weight: 500;">
                    ${formatPrice(item.custom_price || item.plans_virexa?.price || 0)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="background-color: ${emailTheme.bgLight}; border-radius: 12px; padding: 25px; text-align: right; border: 1px solid ${emailTheme.border};">
            <span style="font-size: 12px; color: ${emailTheme.textMuted}; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Total Pagado</span>
            <span style="font-size: 28px; font-weight: 700; color: ${emailTheme.textDark}; display: block; margin-top: 5px; letter-spacing: -0.5px;">${formatPrice(checkout.total_estimado)}</span>
          </div>
        </div>
      </div>
      <p style="text-align: center; color: ${emailTheme.textMuted}; font-size: 12px; margin-top: 20px;">
        © ${new Date().getFullYear()} Virexamedia. Todos los derechos reservados.
      </p>
    </div>
  `;

  // --- B. PLANTILLA PARA EL EQUIPO INTERNO ---
  const htmlInternal = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; padding: 30px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">
      <h2 style="color: #0F172A; margin-top: 0;">🚀 Nuevo Proyecto Pagado</h2>
      <p style="color: #64748B; font-size: 14px;"><strong>ID Transacción:</strong> ${checkout.id}</p>
      
      <div style="background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; font-size: 14px; color: #0F172A; text-transform: uppercase;">Datos del Cliente</h3>
        <p style="margin: 5px 0; color: #334155;"><strong>Nombre:</strong> ${checkout.nombre} ${checkout.apellidos}</p>
        <p style="margin: 5px 0; color: #334155;"><strong>Email:</strong> <a href="mailto:${checkout.correo_electronico}" style="color: #2196F3;">${checkout.correo_electronico}</a></p>
        <p style="margin: 5px 0; color: #334155;"><strong>Teléfono:</strong> ${checkout.telefono || 'No proporcionado'}</p>
      </div>

      <h3 style="color: #0F172A; font-size: 16px;">Servicios Solicitados:</h3>
      <ul style="color: #334155; padding-left: 20px;">
        ${items.map(item => `
          <li style="margin-bottom: 8px;">
            ${item.quantity}x <strong>${item.plans_virexa?.title || 'Desarrollo Personalizado'}</strong> 
            ${item.quote_id ? `<span style="color:#64748B;">(REF: ${item.quote_id})</span>` : ''} 
          </li>
        `).join('')}
      </ul>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 2px dashed #E2E8F0;">
        <p style="margin: 0; font-size: 20px; color: #0F172A;"><strong>Ingreso Total: <span style="color: #10B981;">${formatPrice(checkout.total_estimado)}</span></strong></p>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: `Virexamedia <${FROM_EMAIL}>`,
      to: [checkout.correo_electronico],
      subject: subjectClient,
      html: htmlClient,
    }),
    resend.emails.send({
      from: `Sales Bot <${FROM_EMAIL}>`,
      to: [INTERNAL_EMAIL],
      subject: `Nueva Venta: ${checkout.nombre} ${checkout.apellidos} - ${formatPrice(checkout.total_estimado)}`,
      html: htmlInternal,
    })
  ]);
}

// ==========================================
// 2. EMAIL DE CONTACTO (Cliente e Interno)
// ==========================================

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
    ? "Request Received - Virexamedia" 
    : "Solicitud Recibida - Virexamedia";
  
  const htmlClient = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; color: ${emailTheme.textDark}; background-color: ${emailTheme.bgLight}; padding: 20px;">
      <div style="background-color: ${emailTheme.cardLight}; border: 1px solid ${emailTheme.border}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        
        <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid ${emailTheme.border};">
          <h1 style="color: ${emailTheme.textDark}; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Virexamedia</h1>
          <p style="color: ${emailTheme.textAccent}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">Tech & Digital Growth</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: ${emailTheme.textDark}; margin-top: 0; font-size: 18px; font-weight: 600;">
            ${isEnglish ? `Hi ${data.nombre_completo},` : `Hola ${data.nombre_completo},`}
          </h2>
          <p style="font-size: 15px; color: ${emailTheme.textMuted}; line-height: 1.6;">
            ${isEnglish 
              ? 'We have received your technical requirements. One of our specialists is reviewing your information and will reach out to you shortly to discuss the next steps.' 
              : 'Hemos recibido tus requerimientos técnicos. Uno de nuestros especialistas está evaluando la información y te contactará a la brevedad para agendar una llamada.'}
          </p>

          <div style="background-color: ${emailTheme.bgLight}; border-radius: 12px; padding: 20px; margin-top: 30px; border: 1px solid ${emailTheme.border};">
            <h3 style="color: ${emailTheme.textDark}; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">
              ${isEnglish ? 'Request Details' : 'Detalles de la solicitud'}
            </h3>
            <p style="font-size: 14px; color: ${emailTheme.textMuted}; margin: 8px 0;"><strong>${isEnglish ? 'Subject:' : 'Asunto:'}</strong> ${data.asunto}</p>
            <p style="font-size: 14px; color: ${emailTheme.textMuted}; margin: 8px 0;"><strong>${isEnglish ? 'Company:' : 'Empresa:'}</strong> ${data.empresa_negocio}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- PLANTILLA PARA EL EQUIPO INTERNO ---
  const htmlInternal = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; padding: 30px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">
      <h2 style="color: #0F172A; margin-top: 0; font-size: 20px;">📥 Nuevo Lead Entrante</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; width: 30%; color: #64748B;"><strong>Nombre:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${data.nombre_completo}</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #64748B;"><strong>Empresa:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${data.empresa_negocio}</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #64748B;"><strong>Email:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0;"><a href="mailto:${data.correo_electronico}" style="color: #2196F3;">${data.correo_electronico}</a></td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #64748B;"><strong>Teléfono:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${data.telefono}</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #64748B;"><strong>Asunto:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-weight: bold;">${data.asunto}</td></tr>
      </table>

      <div style="margin-top: 25px;">
        <h3 style="color: #0F172A; font-size: 14px; text-transform: uppercase;">Mensaje del Cliente:</h3>
        <div style="white-space: pre-wrap; color: #334155; background: #F8FAFC; padding: 20px; border-radius: 8px; font-size: 14px; line-height: 1.6; border: 1px solid #E2E8F0;">${data.mensaje}</div>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: `Virexamedia <${FROM_EMAIL}>`,
      to: [data.correo_electronico],
      subject: subjectClient,
      html: htmlClient,
    }),
    resend.emails.send({
      from: `Web Bot <${FROM_EMAIL}>`,
      to: [INTERNAL_EMAIL],
      subject: `Lead: ${data.empresa_negocio} - ${data.asunto}`,
      html: htmlInternal,
    })
  ]);
}