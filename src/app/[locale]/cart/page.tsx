"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Trash2, ArrowRight, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';

export default function CartPage() {
  const { items, total, removeFromCart } = useCart();
  const locale = useLocale();

  const formatPrice = (price: number) => 
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 pb-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
          <PackageOpen className="w-20 h-20 text-slate-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4 text-slate-900">
            {locale === 'es' ? 'Tu espacio de trabajo está vacío' : 'Your workspace is empty'}
          </h1>
          <p className="text-slate-500 mb-8">
            {locale === 'es' 
              ? 'Aún no has añadido ninguna solución tecnológica a tu proyecto.' 
              : 'You haven\'t added any technological solution to your project yet.'}
          </p>
          <Button asChild className="w-full bg-[var(--virexa-blue)] hover:bg-[var(--virexa-cyan)] text-white h-14 rounded-xl font-bold transition-colors">
            <Link href={`/${locale}/services`}>
              {locale === 'es' ? 'Explorar Soluciones' : 'Explore Solutions'}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-slate-900 tracking-tight">
          {locale === 'es' ? 'Resumen de Inversión' : 'Investment Summary'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Lista de Items - Estilo Tarjetas Independientes */}
          <div className="w-full lg:w-2/3 space-y-6">
            {items.map((item: CartItem) => {
              const itemPrice = item.custom_price !== null 
                ? Number(item.custom_price) 
                : Number(item.plans_virexa?.price || 0);

              return (
                <div key={item.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-[var(--virexa-blue)]/30 transition-colors">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-2xl text-slate-900">
                        {item.plans_virexa?.title || (locale === 'es' ? 'Desarrollo a Medida' : 'Custom Development')}
                      </h3>
                      <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-bold">
                        x{item.quantity}
                      </span>
                    </div>
                    {item.quote_id && (
                      <span className="text-[var(--virexa-blue)] text-sm font-mono font-medium">
                        REF: {item.quote_id}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t border-slate-100 md:border-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="block text-sm text-slate-400 font-medium md:hidden mb-1">
                        {locale === 'es' ? 'Subtotal' : 'Subtotal'}
                      </span>
                      <span className="font-bold text-2xl text-slate-900">
                        {formatPrice(itemPrice * item.quantity)}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title={locale === 'es' ? 'Eliminar' : 'Remove'}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Panel Lateral de Pago - Contrastante */}
          <div className="w-full lg:w-1/3 bg-slate-900 text-white p-8 md:p-10 rounded-3xl shadow-xl sticky top-32">
            <h2 className="text-2xl font-bold mb-8">
              {locale === 'es' ? 'Desglose' : 'Breakdown'}
            </h2>

            <div className="space-y-4 mb-8 text-slate-300">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-medium text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{locale === 'es' ? 'IVA (16%)' : 'VAT (16%)'}</span>
                <span className="font-medium text-white">{formatPrice(total * 0.16)}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6 mb-10">
              <span className="block text-sm text-[var(--virexa-cyan)] uppercase tracking-widest font-bold mb-2">
                {locale === 'es' ? 'Total' : 'Total'}
              </span>
              <span className="text-4xl font-bold text-white">
                {formatPrice(total * 1.16)}
              </span>
            </div>
            
            <Button asChild className="w-full bg-gradient-to-r from-[var(--virexa-blue)] to-[var(--virexa-cyan)] hover:opacity-90 text-white font-bold h-16 rounded-2xl text-lg transition-all border-0 shadow-lg shadow-[var(--virexa-blue)]/20">
              <Link href={`/${locale}/checkout`} className="flex items-center justify-center">
                {locale === 'es' ? 'Continuar al Checkout' : 'Proceed to Checkout'} 
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </main>
  );
}