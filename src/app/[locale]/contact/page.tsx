"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { submitContact } from "@/actions/contact";
import { ContactFormData } from "@/lib/mail";
import { CheckCircle, Loader2, Send, MapPin, Phone, Mail as MailIcon, ArrowRight } from "lucide-react";
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
        nombre_completo: "", empresa_negocio: "", telefono: "",
        correo_electronico: "", asunto: "", mensaje: ""
      });
      setShowSuccess(true);
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(res.message || (isEs ? "Ocurrió un error." : "An error occurred."));
    }
    setIsSubmitting(false);
  };

  const inputClass = "h-14 bg-slate-50 border border-slate-200 focus-visible:bg-white focus-visible:border-[var(--virexa-blue)] focus-visible:ring-4 focus-visible:ring-[var(--virexa-blue)]/10 rounded-xl px-5 text-slate-900 placeholder:text-slate-400 transition-all w-full shadow-sm";

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-slate-900">
            {isEs ? '¡Conexión Establecida!' : 'Connection Established!'}
          </h1>
          <p className="text-slate-500 mb-10 text-lg">
            {isEs 
              ? 'Hemos recibido tus datos correctamente. Nuestro equipo técnico se pondrá en contacto contigo en breve.' 
              : 'We received your information successfully. Our technical team will contact you shortly.'}
          </p>
          <Button asChild className="w-full bg-[var(--virexa-blue)] hover:bg-[var(--virexa-cyan)] text-white font-bold h-14 rounded-xl transition-all shadow-md">
            <Link href={`/${locale}/`}>{isEs ? 'Volver al Inicio' : 'Back to Home'}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* LADO IZQUIERDO: Tipografía y datos de contacto */}
          <div className="w-full lg:w-5/12 space-y-12 lg:sticky lg:top-32">
            <div>
              <span className="text-[var(--virexa-blue)] uppercase tracking-widest text-sm font-bold mb-4 block">
                {isEs ? 'Inicia un Proyecto' : 'Start a Project'}
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
                {isEs ? 'Hablemos de tecnología.' : 'Let\'s talk tech.'}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed">
                {isEs 
                  ? '¿Listo para escalar tu ecosistema digital? Déjanos tus datos y un especialista analizará tus requerimientos.' 
                  : 'Ready to scale your digital ecosystem? Leave us your details and a specialist will analyze your requirements.'}
              </p>
            </div>

            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--virexa-blue)] group-hover:bg-[var(--virexa-blue)] group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{isEs ? 'Sede Central' : 'Headquarters'}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Álvaro Obregón No. 151, Ofi. 1301<br />
                    Roma Norte, CDMX 06700
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--virexa-blue)] group-hover:bg-[var(--virexa-blue)] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{isEs ? 'Línea Directa' : 'Direct Line'}</h3>
                  <a href="tel:+525555256732" className="text-slate-500 text-sm hover:text-[var(--virexa-blue)] transition-colors">
                    +52 55 5525 6732
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--virexa-blue)] group-hover:bg-[var(--virexa-blue)] group-hover:text-white transition-colors">
                  <MailIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                  <a href="mailto:ventas@virexamedia.com" className="text-slate-500 text-sm hover:text-[var(--virexa-blue)] transition-colors">
                    ventas@virexamedia.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* LADO DERECHO: Formulario Limpio */}
          <div className="w-full lg:w-7/12">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/40 space-y-6">
              
              {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">{errorMsg}</div>}

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">{isEs ? "Nombre Completo" : "Full Name"}</label>
                  <Input required value={formData.nombre_completo} onChange={(e)=>setFormData({...formData, nombre_completo:e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">{isEs ? "Empresa" : "Company"}</label>
                  <Input required value={formData.empresa_negocio} onChange={(e)=>setFormData({...formData, empresa_negocio:e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">{isEs ? "Teléfono" : "Phone"}</label>
                  <Input required type="tel" value={formData.telefono} onChange={(e)=>setFormData({...formData, telefono:e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Email</label>
                  <Input required type="email" value={formData.correo_electronico} onChange={(e)=>setFormData({...formData, correo_electronico:e.target.value})} className={inputClass} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">{isEs ? "Asunto del Proyecto" : "Project Subject"}</label>
                <Input required value={formData.asunto} onChange={(e)=>setFormData({...formData, asunto:e.target.value})} className={inputClass} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">{isEs ? "Detalles" : "Details"}</label>
                <textarea 
                  required 
                  value={formData.mensaje} 
                  onChange={(e)=>setFormData({...formData, mensaje:e.target.value})} 
                  className="w-full min-h-[150px] bg-slate-50 border border-slate-200 focus-visible:bg-white focus-visible:border-[var(--virexa-blue)] focus-visible:ring-4 focus-visible:ring-[var(--virexa-blue)]/10 rounded-xl p-5 text-slate-900 placeholder:text-slate-400 transition-all resize-y shadow-sm" 
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-[var(--virexa-blue)] text-white font-bold h-14 rounded-xl text-lg mt-4 transition-colors shadow-md group">
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : <span className="flex items-center justify-center gap-2">{isEs ? 'Enviar Requerimientos' : 'Send Requirements'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></span>}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}