'use server';

import { createClient } from '@/lib/supabase/server';

export interface CustomPlanFormData {
  nombre: string;
  apellidos: string;
  correo_electronico: string; 
  id_cotizacion: string; // <-- 1. Añadimos el folio aquí
  monto: number;
}

export async function processCustomPlan(formData: CustomPlanFormData) {
  try {
    const supabase = await createClient();

    const { data: planData, error: planError } = await supabase
      .from('plans_virexa')
      .select('id')
      .eq('slug', 'plan-personalizado')
      .single();

    if (planError || !planData) {
      throw new Error("No se encontró la configuración del Plan Personalizado en la base de datos.");
    }

    // 2. Usamos el folio que escribió el usuario directamente
    const { error: insertError } = await supabase
      .from('custom_plan_payments_virexa')
      .insert({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo_electronico: formData.correo_electronico,
        id_cotizacion: formData.id_cotizacion, 
        monto_a_pagar: formData.monto,
        payment_status: 'pending'
      });

    if (insertError) {
      console.error("Error al guardar cotización:", insertError);
      throw new Error("Ocurrió un error al registrar la cotización.");
    }

    return { 
      success: true, 
      planId: planData.id, 
      quoteId: formData.id_cotizacion, // 3. Devolvemos el mismo folio al carrito
      customPrice: formData.monto 
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado del servidor.";
    return { success: false, message: errorMessage };
  }
}