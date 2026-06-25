"use client";

import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { CheckCircle, Loader2, Lock, ArrowLeft, Code2 } from "lucide-react";
import { processCheckout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem, CheckoutPayload } from "@/types";

export default function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [billingInfo, setBillingInfo] = useState({ pais: "México", direccion: "", localidad: "", estado: "", codigo_postal: "" });
  const [cardInfo, setCardInfo] = useState({ number: "", name: "", expiry: "", cvv: "" });

  useEffect(() => {
    const savedData = sessionStorage.getItem("nc_temp_contact");
    if (savedData) {
      const { firstName, lastName, email } = JSON.parse(savedData);
      setContactInfo(prev => ({ ...prev, firstName, lastName, email }));
      sessionStorage.removeItem("nc_temp_contact"); 
    }
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");
    
    const payload: CheckoutPayload = { locale, contactInfo, billingInfo, cardInfo, items, total };
    const res = await processCheckout(payload);

    if (res.success) {
      clearCart();
      setShowSuccess(true);
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(res.message || (isEs ? "Error al procesar el pago." : "Error processing payment."));
      setIsProcessing(false);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  const inputClass = "h-14 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:border-[var(--virexa-blue)] focus-visible:ring-4 focus-visible:ring-[var(--virexa-blue)]/10 rounded-xl px-5 text-slate-900 placeholder:text-slate-400 transition-all w-full shadow-sm";

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-[var(--virexa-blue)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 md:p-14 text-center shadow-2xl">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-slate-900">
            {isEs ? '¡Pago Exitoso!' : 'Payment Successful!'}
          </h1>
          <p className="text-slate-500 mb-10">
            {isEs 
              ? 'El entorno de tu proyecto ha sido provisionado. Recibirás un correo con los accesos en breve.' 
              : 'Your project environment has been provisioned. You will receive an email with access shortly.'}
          </p>
          <Button asChild className="w-full bg-[var(--virexa-blue)] hover:bg-[var(--virexa-cyan)] text-white h-14 rounded-xl font-bold">
            <Link href={`/${locale}/`}>{isEs ? 'Ir al Dashboard' : 'Go to Dashboard'}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    /* SPLIT SCREEN LAYOUT */
    <main className="min-h-screen flex flex-col-reverse lg:flex-row bg-white">
      
      {/* LADO IZQUIERDO: Formulario  */}
      <div className="w-full lg:w-[60%] p-8 py-12 md:p-16 lg:p-24 lg:pt-32">
        <Link href={`/${locale}/cart`} className="inline-flex items-center text-slate-500 hover:text-[var(--virexa-blue)] font-medium mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isEs ? 'Volver al carrito' : 'Back to cart'}
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          {isEs ? 'Completa tu información' : 'Complete your information'}
        </h1>
        
        {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-medium">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-12 max-w-2xl">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">{isEs ? 'Contacto' : 'Contact'}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder={isEs ? "Nombre *" : "First Name *"} required value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} className={inputClass} />
              <Input placeholder={isEs ? "Apellidos *" : "Last Name *"} required value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} className={inputClass} />
              <Input placeholder={isEs ? "Email *" : "Email *"} type="email" required value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} className={inputClass} />
              <Input placeholder={isEs ? "Teléfono *" : "Phone *"} type="tel" required value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} className={inputClass} />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">{isEs ? 'Facturación' : 'Billing'}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder={isEs ? "País *" : "Country *"} required value={billingInfo.pais} disabled className={inputClass + " opacity-70 cursor-not-allowed"} />
              <Input placeholder={isEs ? "Dirección *" : "Address *"} required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className={inputClass} />
              <Input placeholder={isEs ? "Ciudad *" : "City *"} required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className={inputClass} />
              <div className="grid grid-cols-2 gap-4 col-span-1 sm:col-span-1">
                <Input placeholder={isEs ? "Estado *" : "State *"} required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className={inputClass} />
                <Input placeholder={isEs ? "C.P. *" : "ZIP *"} required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className={inputClass} />
              </div>
            </div>
          </section>

          <section className="relative">
            {/* HEADER: Título a la izquierda, logo Octano a la derecha */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {isEs ? 'Pago Seguro' : 'Secure Payment'}
              </h2>
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                <Image
                  src="/octano_logo.jpeg"
                  alt="Octano"
                  width={54}
                  height={36}
                  className="object-contain"
                />
              </div>
            </div>
            
            <div className="bg-slate-50 p-1 rounded-2xl border border-slate-100">
              <Input placeholder={isEs ? "Número de tarjeta" : "Card number"} required maxLength={19} value={cardInfo.number} onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} className="h-14 bg-transparent border-0 focus-visible:ring-0 rounded-none border-b border-slate-200 px-5 font-mono text-lg" />
              <div className="grid grid-cols-2">
                <Input placeholder="MM/AA" required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className="h-14 bg-transparent border-0 focus-visible:ring-0 rounded-none border-r border-slate-200 px-5" />
                <Input placeholder="CVV" type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} className="h-14 bg-transparent border-0 focus-visible:ring-0 rounded-none px-5 tracking-widest" />
              </div>
              <Input placeholder={isEs ? "Titular de la tarjeta" : "Cardholder name"} required value={cardInfo.name} onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} className="h-14 bg-transparent border-0 focus-visible:ring-0 rounded-none border-t border-slate-200 px-5" />
            </div>
          </section>

          <Button type="submit" disabled={isProcessing} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-16 rounded-xl text-lg shadow-xl shadow-slate-900/20">
            {isProcessing ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : (isEs ? `Pagar ${formatPrice(total)}` : `Pay ${formatPrice(total)}`)}
          </Button>
          
          <p className="text-center text-slate-400 text-sm flex items-center justify-center gap-2 mt-4">
            <Lock className="w-4 h-4" />
            {isEs ? 'Tus datos están encriptados y seguros.' : 'Your data is encrypted and secure.'}
          </p>

        </form>
      </div>

      {/* LADO DERECHO: Resumen de Orden */}
      <div className="w-full lg:w-[40%] bg-slate-50 border-b lg:border-b-0 lg:border-l border-slate-200 p-8 pt-28 md:p-16 md:pt-32 lg:p-24 lg:pt-32 lg:sticky top-0 lg:h-screen overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-8">
          {isEs ? 'Resumen del Proyecto' : 'Project Summary'}
        </h3>
        
        <div className="space-y-6 mb-10">
          {items.map((item: CartItem, idx: number) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center flex-shrink-0 relative">
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-xs font-bold flex items-center justify-center rounded-full">
                  {item.quantity}
                </span>
                <Code2 className="w-6 h-6 text-[var(--virexa-blue)]" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-bold text-slate-900 leading-tight">
                  {item.plans_virexa?.title || (isEs ? 'Desarrollo a medida' : 'Custom Build')}
                </h4>
                <p className="text-slate-500 text-sm mt-1">Ref: {item.quote_id || 'STD'}</p>
              </div>
              <span className="font-bold text-slate-900 pt-1">
                {formatPrice((item.custom_price || item.plans_virexa?.price || 0) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-6 space-y-4 text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>{isEs ? 'IVA (16%)' : 'VAT (16%)'}</span>
            <span className="font-medium text-slate-900">{formatPrice(total * 0.16)}</span>
          </div>
          <div className="flex justify-between items-end pt-6">
            <span className="text-lg font-bold text-slate-900">{isEs ? 'Total a Pagar' : 'Total to Pay'}</span>
            <span className="text-4xl font-bold text-slate-900 tracking-tight">{formatPrice(total * 1.16)}</span>
          </div>
        </div>

      </div>
      
    </main>
  );
}