"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { processCustomPlan, CustomPlanFormData } from "@/actions/custom-plan";
import { Loader2, Calculator, ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function CustomPricingPage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState<CustomPlanFormData>({
    nombre: "", apellidos: "", correo_electronico: "", id_cotizacion: "", monto: 0, 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.monto <= 0) {
      setErrorMsg(isEs ? "El monto calculado debe ser mayor a cero." : "The calculated amount must be greater than zero.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await processCustomPlan(formData);

    if (res.success && res.planId && res.customPrice && res.quoteId) {
      sessionStorage.setItem("nc_temp_contact", JSON.stringify({
        firstName: formData.nombre, lastName: formData.apellidos, email: formData.correo_electronico
      }));
      const added = await addToCart(res.planId, 1, res.customPrice, res.quoteId);
      if (added) {
        router.push(`/${locale}/checkout`);
      } else {
        setErrorMsg(isEs ? "Error al sincronizar con el workspace." : "Error syncing with the workspace.");
        setIsSubmitting(false);
      }
    } else {
      setErrorMsg(res.message || (isEs ? "Error al procesar la cotización." : "Error processing the quote."));
      setIsSubmitting(false);
    }
  };

  const inputClass = "h-14 bg-white border border-slate-200 focus-visible:border-[var(--virexa-blue)] focus-visible:ring-4 focus-visible:ring-[var(--virexa-blue)]/10 rounded-xl px-5 text-slate-900 placeholder:text-slate-400 transition-all w-full shadow-sm";

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
          
          {/* LADO IZQUIERDO: Propuesta de Valor */}
          <div className="w-full lg:w-5/12 space-y-8 lg:sticky lg:top-32">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm mb-8">
              <Code2 className="w-8 h-8 text-[var(--virexa-blue)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              {isEs ? 'Activa tu ' : 'Activate your '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--virexa-blue)] to-[var(--virexa-cyan)]">
                {isEs ? 'Desarrollo a Medida' : 'Custom Build'}
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {isEs 
                ? 'Si ya tienes una cotización aprobada por nuestro equipo de ingeniería, ingresa tu código REF (ej. REF-1234) para provisionar tu entorno e iniciar el proyecto.' 
                : 'If you already have an approved quote from our engineering team, enter your REF code (e.g. REF-1234) to provision your environment and start the project.'}
            </p>
            <ul className="space-y-4 pt-6">
              {[
                isEs ? "Infraestructura escalable" : "Scalable infrastructure",
                isEs ? "Diseño UI/UX exclusivo" : "Exclusive UI/UX design",
                isEs ? "Soporte técnico directo" : "Direct technical support"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* LADO DERECHO: Calculadora / Formulario */}
          <div className="w-full lg:w-7/12">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50">
              
              {errorMsg && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 font-medium">{errorMsg}</div>}

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">{isEs ? "Nombre" : "First Name"}</label>
                    <Input required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">{isEs ? "Apellidos" : "Last Name"}</label>
                    <Input required value={formData.apellidos} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} className={inputClass} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Email</label>
                  <Input type="email" required value={formData.correo_electronico} onChange={(e) => setFormData({...formData, correo_electronico: e.target.value})} className={inputClass} />
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6 mt-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--virexa-blue)]">{isEs ? "Folio de Proyecto (REF)" : "Project Reference (REF)"}</label>
                    <Input placeholder="Ej. REF-2026" required value={formData.id_cotizacion} onChange={(e) => setFormData({...formData, id_cotizacion: e.target.value.toUpperCase()})} className={inputClass + " font-mono uppercase text-lg"} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">{isEs ? 'Inversión Acordada (MXN) + IVA (16%)' : 'Agreed Investment (MXN) + VAT (16%)'}</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                      <Input type="number" min="0" step="0.01" required value={formData.monto || ""} onChange={(e) => setFormData({...formData, monto: Number(e.target.value)})} className={`${inputClass} pl-10 text-xl font-bold`} />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--virexa-blue)] hover:bg-[var(--virexa-cyan)] text-white font-bold h-16 rounded-xl text-lg mt-8 shadow-lg shadow-[var(--virexa-blue)]/20 transition-all group">
                  {isSubmitting ? (
                    <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Calculator className="w-6 h-6"/> {isEs ? 'Procesar Proyecto' : 'Process Project'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}