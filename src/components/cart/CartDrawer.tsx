'use client';

import { useCart } from '@/hooks/use-cart';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItemComponent } from './CartItem';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, total } = useCart();
  const locale = useLocale();

  if (!isOpen) return null;

  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay con blur */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* Panel lateral */}
      <div className="relative w-full max-w-md bg-card border-l border-border h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col bg-grain">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-serif text-foreground flex items-center gap-3">
            <ShoppingBag className="text-primary w-6 h-6" /> {locale === 'es' ? 'Tu Carrito' : 'Your Cart'}
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground font-sans">
                {locale === 'es' ? 'Aún no has seleccionado ninguna estrategia.' : 'You haven\'t selected any strategy yet.'}
              </p>
            </div>
          ) : (
            items.map((item) => <CartItemComponent key={item.id} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-border bg-card/50 backdrop-blur-md">
            <div className="flex justify-between items-end mb-8 font-sans">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">
                {locale === 'es' ? 'Total de Inversión' : 'Total Investment'}
              </span>
              <div className="text-right">
                <span className="text-3xl font-bold text-gradient block">{formatPrice(total * 1.16)}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                  {locale === 'es' ? '+ 16% IVA Agregado' : '+ 16% VAT Added'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              {/* BOTÓN VER CARRITO */}
              <Button asChild className="w-full h-14 rounded-lg font-bold border-2 border-border bg-transparent text-foreground hover:bg-muted transition-all p-0">
                <Link 
                  href={`/${locale}/cart`} 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full h-full"
                >
                  {locale === 'es' ? 'Ver carrito' : 'View cart'}
                </Link>
              </Button>

              {/* BOTÓN CHECKOUT */}
              <Button asChild className="w-full bg-primary hover:opacity-90 text-primary-foreground h-14 rounded-lg group transition-all p-0">
                <Link 
                  href={`/${locale}/checkout`} 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full h-full"
                >
                  {locale === 'es' ? 'Continuar al Checkout' : 'Proceed to Checkout'} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}