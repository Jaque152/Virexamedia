import { T } from "@/components/shared/T";
import { HeroVisuals } from '@/components/home/Hero';
import { HeroTags } from '@/components/home/HeroTags'; 

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <main className="flex flex-col min-h-screen bg-background bg-grain overflow-hidden">
      
      {/* HERO SECTION - NUEVO ACOMODO CENTRADO */}
      <section className="relative min-h-screen flex flex-col items-center pt-32 pb-16">
        {/* Glow Effects de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-gradient-to-b from-[var(--virexa-cyan)]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative z-10 text-center flex flex-col items-center">
            
          <span className="text-[var(--virexa-blue)] text-sm font-bold uppercase tracking-[0.3em] font-sans mb-6 block">
            {isEs ? 'Marketing Digital & UX' : 'Digital Marketing & UX'}
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-foreground mb-8">
            <T>Innovación</T> <br />
            <span className="text-gradient"><T>Digital</T></span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-sans mb-10 max-w-2xl leading-relaxed mx-auto">
            {isEs 
              ? 'En Virexamedia transformamos tu identidad corporativa. Fusionamos tecnología, diseño UI/UX y estrategias precisas para liderar en el ecosistema web moderno.'
              : 'At Virexamedia we transform your corporate identity. We merge technology, UI/UX design, and precise strategies to lead in the modern web ecosystem.'}
          </p>

          {/* GLOBOS FLOTANTES CENTRADOS */}
          <div className="mb-16">
            <HeroTags locale={locale} />
          </div>

        </div>

        {/* COMPOSICIÓN VISUAL - AHORA EN FORMATO PANORÁMICO ABAJO */}
        <div className="w-full relative z-20 mt-auto px-4 md:px-8 max-w-7xl mx-auto">
           <HeroVisuals locale={locale} />
        </div>
      </section>

    </main>
  );
}