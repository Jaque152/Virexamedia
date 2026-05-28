"use client";

import { motion } from "framer-motion";
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, MessageSquare } from 'lucide-react';

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const footerLinks = {
    services: [
      { name: locale === 'es' ? "Nosotros" : "About Us", href: `/${locale}/about` },
      { name: locale === 'es' ? "Soluciones" : "Solutions", href: `/${locale}/services` },
      { name: locale === 'es' ? "Planes" : "Plans", href: `/${locale}/pricing` },
    ],
    legal: [
      { name: locale === 'es' ? "Privacidad" : "Privacy Policy", href: `/${locale}/legal/privacy` },
      { name: locale === 'es' ? "Términos" : "Terms", href: `/${locale}/legal/terms-conditions` },
    ],
  };

  return (
    <footer className="relative bg-slate-50 border-t border-border font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2 space-y-4">
            <Link href={`/${locale}`} className="inline-block">
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                Virexa<span className="text-[var(--virexa-blue)]">media</span>
              </span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
              {locale === 'es' 
                ? 'Potenciamos negocios digitales mediante estrategias de alto impacto, diseño UX/UI y desarrollo tecnológico avanzado.'
                : 'We empower digital businesses through high-impact strategies, UX/UI design, and advanced technological development.'}
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-4">
              {locale === 'es' ? 'Explorar' : 'Explore'}
            </h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-[var(--virexa-blue)] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-[var(--virexa-blue)] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Virexamedia. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-border shadow-sm">
            <Globe className="w-5 h-5 text-slate-400 ml-2" />
            <button
              onClick={() => switchLocale('es')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                locale === 'es' ? 'bg-[var(--virexa-blue)] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => switchLocale('en')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                locale === 'en' ? 'bg-[var(--virexa-blue)] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Floating Contact Button - Estilo Tech/Azul */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Link 
          href={`/${locale}/contact`}
          className="w-14 h-14 bg-gradient-to-br from-[var(--virexa-cyan)] to-[var(--virexa-blue)] rounded-full flex items-center justify-center shadow-lg shadow-[var(--virexa-blue)]/30 hover:scale-110 active:scale-95 transition-transform text-white"
        >
          <MessageSquare className="w-6 h-6" />
        </Link>
      </motion.div>
    </footer>
  );
}