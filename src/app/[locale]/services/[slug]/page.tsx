import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AddToCartButton } from './AddToCartButton';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { T } from '@/components/shared/T';
import { getTranslation } from '@/lib/translator';

// === 1. METADATOS SEO DINÁMICOS TRADUCIDOS ===
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string, slug: string }> 
}) {
  const { locale, slug } = await params; 
  
  const supabase = await createClient();
  const { data: plan } = await supabase.from('plans_virexa').select('title, description').eq('slug', slug).single();
  
  if (!plan) return { title: 'Solución no encontrada | Virexamedia' };
  
  const translatedTitle = await getTranslation(plan.title, locale);
  const translatedDescription = await getTranslation(plan.description, locale);

  return {
    title: `${translatedTitle} | Virexamedia`,
    description: translatedDescription,
  };
}

// === 2. PÁGINA DEL SERVIDOR ===
export default async function PlanDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string, slug: string }> 
}) {
  const { locale, slug } = await params; 
  const isEs = locale === 'es';

  const supabase = await createClient();

  const { data: plan } = await supabase
    .from('plans_virexa')
    .select('*, categories_virexa(name)')
    .eq('slug', slug)
    .single();

  if (!plan || !plan.is_active) {
    notFound(); 
  }

  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);
  
  let featuresList: string[] = [];
  try {
    if (typeof plan.features === 'string') featuresList = JSON.parse(plan.features);
    else if (Array.isArray(plan.features)) featuresList = plan.features;
  } catch (e) {
    console.error("Error parseando features", e);
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <Link 
          href={`/${locale}/services`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-[var(--virexa-blue)] transition-colors mb-12 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEs ? 'Volver a soluciones' : 'Back to solutions'}
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: Detalles del producto */}
          <div className="w-full lg:w-7/12 space-y-12">
            <div>
              <span className="inline-block py-1 px-3 rounded-md bg-[var(--virexa-blue)]/10 text-[var(--virexa-blue)] text-xs font-bold uppercase tracking-widest mb-6">
                {plan.categories_virexa?.name ? <T>{plan.categories_virexa.name}</T> : <T>Tecnología</T>}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                <T>{plan.title}</T>
              </h1>
              <p className="mt-8 text-xl text-slate-500 leading-relaxed">
                <T>{plan.description}</T>
              </p>
            </div>

            {/* Lista de características minimalista */}
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">
                {isEs ? 'Especificaciones de la solución' : 'Solution Specifications'}
              </h3>
              <ul className="space-y-5">
                {featuresList.map((feature, idx) => (
                  <li key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[var(--virexa-blue)]" />
                    </div>
                    <span className="text-slate-700 leading-relaxed font-medium pt-1">
                      <T>{feature}</T>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMNA DERECHA: Tarjeta de Inversión Flotante */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-32">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50">
              
              <div className="mb-2">
                <span className="text-slate-400 uppercase tracking-widest text-xs font-bold">
                  {isEs ? 'Inversión del Proyecto' : 'Project Investment'}
                </span>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2">
                  {formatPrice(plan.price)}
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  {isEs ? 'Facturación única • + IVA' : 'One-time billing • Plus Tax'}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  {isEs ? 'Garantía de calidad técnica' : 'Technical quality guarantee'}
                </div>
              </div>

              <AddToCartButton planId={plan.id} />

              <div className="mt-6 text-center text-xs text-slate-400 font-medium">
                <p>{isEs ? 'Transacción encriptada de extremo a extremo.' : 'End-to-end encrypted transaction.'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}