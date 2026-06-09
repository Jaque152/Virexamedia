"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Loader2, Plus } from "lucide-react";
import { useLocale } from "next-intl";

interface AddToCartButtonProps {
  planId: number;
}

export function AddToCartButton({ planId }: AddToCartButtonProps) {
  const locale = useLocale();
  const { addToCart } = useCart();
  const [isPending, setIsPending] = useState(false);

  const handleAdd = async () => {
    setIsPending(true);
    await addToCart(planId);
    setIsPending(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isPending}
      className="w-full relative overflow-hidden h-16 rounded-xl bg-slate-900 text-white font-bold text-lg group flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-70 hover:shadow-xl hover:shadow-[var(--virexa-blue)]/20"
    >
      {/* Capa de hover con el gradiente de la marca */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--virexa-blue)] to-[var(--virexa-cyan)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <span className="relative z-10 flex items-center gap-2">
        {isPending ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            {locale === 'es' ? 'Añadir al Carrito' : 'Add to Cart'}
          </>
        )}
      </span>
    </button>
  );
}