"use client";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, Menu, X } from "lucide-react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const locale = useLocale();
  const pathname = usePathname();
  const { items, setIsOpen: openCart } = useCart();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: locale === 'es' ? "Soluciones" : "Solutions", href: `/${locale}/services` },
    { name: locale === 'es' ? "Nosotros" : "About Us", href: `/${locale}/about` },
    { name: locale === 'es' ? "Soluciones Personalizadas" : "Custom Solutions", href: `/${locale}/pricing` },
    { name: locale === 'es' ? "Contacto" : "Contact", href: `/${locale}/contact` },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md py-3 shadow-sm border-b border-border"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <span className="font-bold text-2xl tracking-tight text-foreground">
                Virexa<span className="text-[var(--virexa-blue)]">media</span>
              </span>
            </Link>

            {/* Desktop Navigation - Centrada para equilibrar */}
            <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-full px-2 py-1 border border-border shadow-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-5 py-2 text-sm font-semibold transition-all rounded-full ${
                      isActive 
                        ? "text-white bg-gradient-to-r from-[var(--virexa-blue)] to-[var(--virexa-cyan)] shadow-md" 
                        : "text-slate-600 hover:text-[var(--virexa-blue)] hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => openCart(true)}
                className="p-2 text-slate-600 hover:text-[var(--virexa-blue)] transition-colors relative bg-white/50 rounded-full border border-border shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--virexa-blue)] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-800 bg-white/50 rounded-full border border-border shadow-sm"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-28 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-8 p-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-bold text-slate-800 hover:text-[var(--virexa-blue)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}