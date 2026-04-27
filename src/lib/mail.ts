import { Resend } from 'resend';
import { Checkout, CartItem } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'ventas@marketingresultados.com'; 
const INTERNAL_EMAIL = 'info@marketingresultados.com';

const formatPrice = (price: number) => 
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

// --- 1. EMAIL DE CHECKOUT ---
export async function sendReceiptEmail(
  checkout: Checkout, 
  items: CartItem[], 
  isEnglish: boolean = false
) {
  const bgDark = '#0F0F1A';     
  const cardDark = '#1A1B2E';   
  const textAccent = '#C87941'; 
  const textLight = '#F5F0E8';  
  const textMuted = '#9ca3af';  

  const subjectClient = isEnglish 
    ? `Purchase Confirmation - Welcome to Marketing Resultados` 
    : `Confirmación de Compra - Bienvenido a Marketing Resultados`;

  const htmlClient = `
    <div style="font-family: 'Times New Roman', Times, serif; max-width: 600px; margin: auto; color: ${textLight}; background-color: ${bgDark}; border: 1px solid #2d2e40; border-radius: 12px; overflow: hidden;">
      <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #2d2e40;">
        <h1 style="color: ${textLight}; margin: 0; font-size: 26px; font-weight: normal; letter-spacing: 2px;">Marketing Resultados</h1>
        <p style="color: ${textAccent}; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-family: Arial, sans-serif; margin-top: 10px;">Estrategias de Élite</p>
      </div>
      <div style="padding: 40px 30px; font-family: Arial, sans-serif;">
        <h2 style="color: ${textLight}; margin-top: 0; font-size: 20px; font-weight: normal; font-family: 'Times New Roman', Times, serif;">Estimado/a ${checkout.nombre},</h2>
        <p style="font-size: 15px; color: ${textMuted}; line-height: 1.6;">Hemos recibido su pago correctamente. Su estrategia de marketing ha entrado en fase de desarrollo.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr style="border-bottom: 1px solid #2d2e40; text-align: left;">
              <th style="padding: 12px 0; color: ${textMuted}; font-size: 12px; text-transform: uppercase; font-weight: normal;">Servicio Adquirido</th>
              <th style="padding: 12px 0; color: ${textMuted}; font-size: 12px; text-transform: uppercase; text-align: right; font-weight: normal;">Inversión</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #2d2e40;">
                <td style="padding: 15px 0; color: ${textLight}; font-size: 14px;">
                  ${item.plans_nc?.title || 'Plan Personalizado'} 
                  ${item.quote_id ? `<br><span style="font-size:12px; color:${textAccent}">Ref: ${item.quote_id}</span>` : ''}
                </td>
                <td style="padding: 15px 0; text-align: right; color: ${textLight}; font-size: 14px;">${formatPrice(item.custom_price || item.plans_nc?.price || 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background-color: ${cardDark}; border-radius: 8px; padding: 25px; text-align: right; border: 1px solid #2d2e40;">
          <span style="font-size: 12px; color: ${textMuted}; text-transform: uppercase; letter-spacing: 1px;">Total (IVA Incluido)</span>
          <span style="font-size: 26px; font-family: 'Times New Roman', Times, serif; color: ${textAccent}; display: block; margin-top: 5px;">${formatPrice(checkout.total_estimado)}</span>
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: `Marketing Resultados <${FROM_EMAIL}>`,
    to: [checkout.correo_electronico],
    subject: subjectClient,
    html: htmlClient,
  });
}

// --- 2. EMAIL DE CONTACTO ---
export interface ContactFormData {
  nombre_completo: string;
  empresa_negocio: string;
  telefono: string;
  correo_electronico: string;
  asunto: string;
  mensaje: string;
}

export async function sendContactConfirmationEmail(data: ContactFormData, isEnglish: boolean = false) {
  const subject = isEnglish ? "We received your message - Marketing Resultados" : "Hemos recibido tu mensaje - Marketing Resultados";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #C87941;">Hola ${data.nombre_completo},</h2>
      <p style="color: #555; line-height: 1.5;">Hemos recibido tu mensaje correctamente. Nuestro equipo revisará tu solicitud sobre <strong>"${data.asunto}"</strong> y se pondrá en contacto contigo a la brevedad.</p>
      <br/>
      <p style="color: #888; font-size: 12px;">Marketing Resultados - Agencia de Marketing</p>
    </div>
  `;

  await resend.emails.send({
    from: `Marketing Resultados <${FROM_EMAIL}>`,
    to: [data.correo_electronico],
    subject: subject,
    html: html,
  });
}