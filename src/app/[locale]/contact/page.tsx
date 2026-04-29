"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { submitContact } from "@/actions/contact";
import { ContactFormData } from "@/lib/mail";
import { CheckCircle, Loader2, Send, MapPin, Phone, Mail as MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const locale = useLocale();
  const isEs = locale === 'es';
  
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
      setFormData({
        nombre_completo: "",
        empresa_negocio: "",
        telefono: "",
        correo_electronico: "",
        asunto: "",
        mensaje: ""
      });
      setShowSuccess(true);
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(res.message || (isEs ? "Ocurrió un error." : "An error occurred."));
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
            {isEs ? '¡Mensaje Enviado!' : 'Message Sent!'}
          </h1>
          <p className="text-muted-foreground mb-10 text-lg">
            {isEs 
              ? 'Hemos recibido tus datos correctamente. Nuestro equipo se pondrá en contacto contigo pronto.' 
              : 'We received your information successfully. Our team will contact you soon.'}
          </p>
          <Button asChild className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold h-14 rounded-xl transition-all shadow-lg shadow-primary/20">
            <Link href={`/${locale}/`}>{isEs ? 'Volver al Inicio' : 'Back to Home'}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background bg-grain pt-32 pb-24 text-foreground relative">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            {isEs ? 'Contacto' : 'Contact'}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isEs 
              ? '¿Listo para llevar tu marca al siguiente nivel? Escríbenos o visítanos, estamos aquí para ayudarte.' 
              : 'Ready to take your brand to the next level? Write to us or visit us, we are here to help.'}
          </p>
        </div>
        
        {/* === TARJETAS DE INFORMACIÓN DE CONTACTO === */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          
          {/* Tarjeta 1: Dirección */}
          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center shadow-lg hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">
              {isEs ? 'Dirección' : 'Address'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Álvaro Obregón No. 151, Ofi. 1301<br />
              Roma Norte, Cuauhtémoc<br />
              C.P. 06700, CDMX
            </p>
          </div>

          {/* Tarjeta 2: Teléfono */}
          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center shadow-lg hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">
              {isEs ? 'Teléfono' : 'Phone'}
            </h3>
            <p className="text-muted-foreground text-sm">
              <a href="tel:+525555256732" className="hover:text-primary transition-colors">
                +52 55 5525 6732
              </a>
            </p>
          </div>

          {/* Tarjeta 3: Email */}
          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center shadow-lg hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MailIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">
              {isEs ? 'Mail' : 'Email'}
            </h3>
            <p className="text-muted-foreground text-sm">
              <a href="info@marketingresultados.com" className="hover:text-primary transition-colors">
                info@marketingresultados.com
              </a>
            </p>
          </div>

        </div>

        {errorMsg && <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-8">{errorMsg}</div>}

        {/* === FORMULARIO === */}
        <form onSubmit={handleSubmit} className="bg-card p-8 md:p-12 border border-border rounded-2xl shadow-lg space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input placeholder={isEs ? "Nombre Completo *" : "Full Name *"} required value={formData.nombre_completo} onChange={(e)=>setFormData({...formData, nombre_completo:e.target.value})} className={inputClass} />
            <Input placeholder={isEs ? "Empresa / Negocio *" : "Company / Business *"} required value={formData.empresa_negocio} onChange={(e)=>setFormData({...formData, empresa_negocio:e.target.value})} className={inputClass} />
            <Input placeholder={isEs ? "Teléfono *" : "Phone Number *"} required type="tel" value={formData.telefono} onChange={(e)=>setFormData({...formData, telefono:e.target.value})} className={inputClass} />
            <Input placeholder={isEs ? "Correo Electrónico *" : "Email Address *"} required type="email" value={formData.correo_electronico} onChange={(e)=>setFormData({...formData, correo_electronico:e.target.value})} className={inputClass} />
          </div>
          <Input placeholder={isEs ? "Asunto *" : "Subject *"} required value={formData.asunto} onChange={(e)=>setFormData({...formData, asunto:e.target.value})} className={inputClass} />
          <textarea 
            placeholder={isEs ? "Escribe tu mensaje aquí... *" : "Write your message here... *"} 
            required 
            value={formData.mensaje} 
            onChange={(e)=>setFormData({...formData, mensaje:e.target.value})} 
            className="w-full min-h-[150px] bg-input border border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg p-5 text-foreground placeholder:text-muted-foreground transition-all resize-y" 
          />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold h-14 rounded-lg text-lg">
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : <span className="flex items-center gap-2"><Send className="w-5 h-5"/> {isEs ? 'Enviar Mensaje' : 'Send Message'}</span>}
          </Button>
        </form>
      </div>
    </main>
  );
}