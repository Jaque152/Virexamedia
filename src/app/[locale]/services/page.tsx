import { createClient } from '@/lib/supabase/server';
import { Plan } from '@/types';
import { PlanGrid } from './PlanGrid';

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  
  const { data: plans } = await supabase
    .from('plans_virexa')
    .select('*')
    .eq('is_active', true)
    .neq('slug', 'plan-personalizado')
    .order('price', { ascending: false });

  const isEs = locale === 'es';

  return (
    <main className="relative min-h-screen pt-32 pb-24 bg-white">
      
      {/* Elemento de fondo sutil tech */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-gradient-to-bl from-[var(--virexa-cyan)]/10 to-transparent pointer-events-none rounded-bl-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Cabecera Alineada a la Izquierda para un look más tech */}
        <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-left-8 duration-700">
          <span className="inline-block py-1 px-3 rounded-full bg-[var(--virexa-blue)]/10 text-[var(--virexa-blue)] uppercase tracking-widest text-xs font-bold mb-6">
            {isEs ? 'Nuestras Soluciones' : 'Our Solutions'}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
            {isEs ? 'Productos ' : 'Digital '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--virexa-blue)] to-[var(--virexa-cyan)]">
              {isEs ? 'Digitales' : 'Products'}
            </span>
          </h1>
          <p className="mt-6 text-xl text-slate-500 font-medium leading-relaxed">
            {isEs 
              ? 'Arquitecturas web y estrategias UX/UI empaquetadas para escalar tu negocio con rapidez y precisión.'
              : 'Web architectures and UX/UI strategies packaged to scale your business with speed and precision.'}
          </p>
        </div>

        {/* Grid de Planes */}
        {plans && plans.length > 0 ? (
          <PlanGrid plans={plans as Plan[]} locale={locale} />
        ) : (
          <div className="text-center text-slate-400 py-20 bg-slate-50 rounded-3xl border border-slate-100">
            {isEs ? 'Configurando soluciones. Vuelve pronto.' : 'Configuring solutions. Check back soon.'}
          </div>
        )}
      </div>
    </main>
  );
}