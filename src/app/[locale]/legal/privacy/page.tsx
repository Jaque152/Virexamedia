import { useTranslations } from 'next-intl';

export default function CancellationPage() {
  return (
    <main className="min-h-screen bg-background bg-grain pt-32 pb-24 text-foreground relative">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif text-gradient">
          Política de Cancelación
        </h1>
        
        <div className="bg-card p-8 md:p-12 border border-border rounded-2xl shadow-lg prose prose-invert max-w-none font-sans">
          <p className="text-muted-foreground leading-relaxed">
            Aquí van los detalles de tu política de cancelación y reembolsos para las estrategias de Marketing Resultados.
          </p>
          {/* Añade el resto de tus cláusulas legales aquí */}
        </div>
      </div>
    </main>
  );
}