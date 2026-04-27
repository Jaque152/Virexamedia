'use server';
import { createClient } from '@/lib/supabase/server';
import { sendContactConfirmationEmail, ContactFormData } from '@/lib/mail';

export async function submitContact(formData: ContactFormData, locale: string = 'es') {
  try {
    const supabase = await createClient();
    
    // 1. Guardar en Base de Datos
    const { error } = await supabase.from('contacts_nc').insert({
      nombre_completo: formData.nombre_completo,
      empresa_negocio: formData.empresa_negocio,
      telefono: formData.telefono,
      correo_electronico: formData.correo_electronico,
      asunto: formData.asunto,
      mensaje: formData.mensaje,
    });

    if (error) throw error;

    // 2. Enviar correo de confirmación al cliente
    await sendContactConfirmationEmail(formData, locale === 'en');

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al enviar el mensaje";
    return { success: false, message: errorMessage };
  }
}