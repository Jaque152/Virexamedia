import Link from 'next/link';
import { T } from "@/components/shared/T";
import { ArrowRight } from 'lucide-react';
import { HeroVisuals } from '@/components/home/Hero';
import { HeroTags } from '@/components/home/HeroTags'; 

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <main className="flex flex-col min-h-screen bg-[var(--navy)] bg-grain overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Glow Effects de fondo */}
        <div className="absolute top-1/4 left-10 w-[40vw] h-[40vw] bg-[var(--copper)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[var(--amber)]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* COLUMNA IZQUIERDA: Textos, Globos y CTA */}
            <div className="max-w-2xl relative z-20 mt-10 lg:mt-0">
              <span className="text-[var(--copper)] text-sm font-bold uppercase tracking-[0.3em] font-sans mb-6 block">
                {isEs ? 'Agencia de Marketing' : 'Marketing Agency'}
              </span>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-[1.1] text-[var(--cream)] mb-6">
                <T>Marketing</T> <br />
                <span className="text-gradient"><T>Resultados</T></span>
              </h1>
              
              <p className="text-xl md:text-2xl text-[var(--cream)]/60 font-sans mb-12 max-w-xl leading-relaxed">
                {isEs 
                  ? 'Transformamos el potencial de tu marca en resultados medibles. Combinamos creatividad disruptiva y análisis de datos para escalar tu negocio al siguiente nivel.'
                  : 'We transform your brand\'s potential into measurable results. We combine disruptive creativity and data analysis to scale your business to the next level.'}
              </p>

              {/* LOS GLOBOS FLOTANTES SE INSERTAN AQUÍ */}
              <HeroTags locale={locale} />

              <div className="flex flex-col sm:flex-row gap-6 font-sans mt-10">
                <Link 
                  href={`/${locale}/services`}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[var(--copper)] text-white font-bold text-lg hover:opacity-90 transition-all group shadow-lg shadow-[var(--copper)]/20"
                >
                  {isEs ? 'Ver Estrategias' : 'View Strategies'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* COLUMNA DERECHA: Composición Visual Asimétrica */}
            <HeroVisuals locale={locale} />

          </div>
        </div>
      </section>

    </main>
  );
}