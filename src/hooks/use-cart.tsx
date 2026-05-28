'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CartItem } from '@/types'; 

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  total: number;
  addToCart: (planId: number, quantity?: number, customPrice?: number | null, quoteId?: string | null) => Promise<boolean>;
  removeFromCart: (cartItemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getSessionId = () => {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('nc_session_id');
  if (!sid) {
    sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('nc_session_id', sid);
  }
  return sid;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const supabase = createClient();

  const refreshCart = useCallback(async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const { data, error } = await supabase
      .from('cart_items_virexa')
      .select('*, plans_virexa(*)')
      .eq('session_id', sessionId) 
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error al obtener el carrito:", error);
      return;
    }

    setItems((data as unknown as CartItem[]) || []);
  }, [supabase]);

  const addToCart = useCallback(async (planId: number,quantity: number = 1, customPrice: number | null = null, quoteId: string | null = null) => {
    const sessionId = getSessionId();
    const numericPlanId = Number(planId);
    const { data, error } = await supabase
      .from('cart_items_virexa')
      .insert({
        session_id: sessionId,
        plan_id: numericPlanId,
        quantity: quantity,
        custom_price: customPrice,
        quote_id: quoteId
      })
      .select('*, plans_virexa(*)')
      .single();

    if (error || !data) {
      console.error(" Detalle del error BD:", error?.message || error);
      return false;
    }

    setItems((prev) => [data as unknown as CartItem, ...prev]);
    setIsOpen(true);
    return true;
  }, [supabase]);

  // --- 2. ELIMINAR DEL CARRITO ---
  const removeFromCart = useCallback(async (cartItemId: number) => {
    // 1. Borramos de la BD
    const { error } = await supabase
      .from('cart_items_virexa')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error("Error al eliminar del carrito:", error);
      return;
    }

    // 2. Filtramos el estado local instantáneamente
    setItems((prev) => prev.filter(item => item.id !== cartItemId));
  }, [supabase]);

  const clearCart = useCallback(() => {
    setItems([]); 
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = item.custom_price !== null 
        ? Number(item.custom_price) 
        : Number(item.plans_virexa?.price || 0);
        
      return acc + (price * item.quantity);
    }, 0);
  }, [items]);

  const value = useMemo<CartContextType>(() => ({
    items,
    isOpen,
    setIsOpen,
    refreshCart,
    clearCart,
    total,
    addToCart,
    removeFromCart
  }), [items, isOpen, refreshCart, clearCart, total, addToCart, removeFromCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse estrictamente dentro de un CartProvider');
  }
  return context;
};