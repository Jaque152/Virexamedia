"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { submitContact } from "@/actions/contact";
import { ContactFormData } from "@/lib/mail";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<ContactFormData>({
    nombre_completo: "",
    empresa_negocio: "",
    telefono: "",
    correo_electronico: "",
    asunto: "",
    mensaje: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await submitContact(formData, locale);

    if (res.success) {
      // 1. Limpiamos el formulario
      setFormData({
        nombre_completo: "",
        empresa_negocio: "",
        telefono: "",
        correo_electronico: "",
        asunto: "",
        mensaje: ""
      });
      // 2. Mostramos pantalla de éxito
      setShowSuccess(true);
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(res.message || "Ocurrió un error.");
    }
    setIsSubmitting(false);
  };

  const inputClass = "h-14 bg-input border border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg px-5 text-foreground placeholder:text-muted-foreground transition-all w-full";

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
        <div className="max-w-lg w-full text-center bg-card rounded-3xl p-10 md:p-16 border border-border shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground font-serif tracking-tight">
            {locale === 'es' ? '¡Mensaje Enviado!' : 'Message Sent!'}
          </h1>
          <p className="text-muted-foreground mb-10 text-lg">
            {locale === 'es' 
              ? 'Hemos recibido tus datos correctamente. Nuestro equipo se pondrá en contacto contigo pronto.' 
              : 'We received your information successfully. Our team will contact you soon.'}
          </p>
          <Button asChild className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold h-14 rounded-xl transition-all shadow-lg shadow-primary/20">
            <Link href={`/${locale}/`}>{locale === 'es' ? 'Volver al Inicio' : 'Back to Home'}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background bg-grain pt-32 pb-24 text-foreground relative">
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient">Contacto</h1>
        
        {errorMsg && <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-8">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="bg-card p-8 md:p-12 border border-border rounded-2xl shadow-lg space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input placeholder="Nombre Completo *" required value={formData.nombre_completo} onChange={(e)=>setFormData({...formData, nombre_completo:e.target.value})} className={inputClass} />
            <Input placeholder="Empresa / Negocio *" required value={formData.empresa_negocio} onChange={(e)=>setFormData({...formData, empresa_negocio:e.target.value})} className={inputClass} />
            <Input placeholder="Teléfono *" required type="tel" value={formData.telefono} onChange={(e)=>setFormData({...formData, telefono:e.target.value})} className={inputClass} />
            <Input placeholder="Correo Electrónico *" required type="email" value={formData.correo_electronico} onChange={(e)=>setFormData({...formData, correo_electronico:e.target.value})} className={inputClass} />
          </div>
          <Input placeholder="Asunto *" required value={formData.asunto} onChange={(e)=>setFormData({...formData, asunto:e.target.value})} className={inputClass} />
          <textarea 
            placeholder="Escribe tu mensaje aquí... *" 
            required 
            value={formData.mensaje} 
            onChange={(e)=>setFormData({...formData, mensaje:e.target.value})} 
            className="w-full min-h-[150px] bg-input border border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg p-5 text-foreground placeholder:text-muted-foreground transition-all resize-y" 
          />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold h-14 rounded-lg text-lg">
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : <span className="flex items-center gap-2"><Send className="w-5 h-5"/> Enviar Mensaje</span>}
          </Button>
        </form>
      </div>
    </main>
  );
}