"use client";

import { motion } from "framer-motion";
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, MessageSquare, MapPin, Phone, Mail } from 'lucide-react';

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
      { name: locale === 'es' ? "Soluciones Personalizadas" : "Custom Solutions", href: `/${locale}/pricing` },
    ],
    legal: [
      { name: locale === 'es' ? "Aviso de Privacidad" : "Privacy Policy", href: `/${locale}/legal/privacy` },
      { name: locale === 'es' ? "Términos y Condiciones" : "Terms and Conditions", href: `/${locale}/legal/terms-conditions` },
      { name: locale === 'es' ? "Política de Devoluciones y Reembolsos" : "Returns and Refunds Policy", href: `/${locale}/legal/cancellation` },
    ],
  };

  return (
    <footer className="relative bg-slate-50 border-t border-border font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-12">
          
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

          {/* Nueva Sección de Contacto */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4">
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                  <MapPin className="w-4 h-4 text-[var(--virexa-blue)]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{locale === 'es' ? 'Sede Central' : 'Headquarters'}</p>
                  <p className="text-slate-500">Álvaro Obregón No. 151, Ofi. 1301</p>
                  <p className="text-slate-500">Roma Norte, CDMX 06700</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                  <Phone className="w-4 h-4 text-[var(--virexa-blue)]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{locale === 'es' ? 'Línea Directa' : 'Direct Line'}</p>
                  <a href="tel:+525555256732" className="text-slate-500 hover:text-[var(--virexa-blue)] transition-colors">
                    +52 55 5525 6732
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                  <Mail className="w-4 h-4 text-[var(--virexa-blue)]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <a href="mailto:ventas@virexamedia.com" className="text-slate-500 hover:text-[var(--virexa-blue)] transition-colors">
                    ventas@virexamedia.com
                  </a>
                </div>
              </li>
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

          {/* Payment Icons */}
          <div className="flex gap-2">
            <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
              <svg className="h-4" viewBox="0 0 780 500" fill="none"><rect width="780" height="500" rx="40" fill="white"/><path fill="#1434CB" d="M293.2 348.7l33.3-190.4h53.3l-33.3 190.4h-53.3zM500.8 163c-10.5-3.9-27-8.1-47.6-8.1-52.4 0-89.3 26.4-89.6 64.2-.3 28 26.5 43.6 46.7 52.9 20.7 9.5 27.7 15.6 27.6 24.1-.1 13-16.6 19-31.9 19-21.3 0-32.6-3-50.1-10.3l-6.9-3.1-7.5 43.8c12.4 5.4 35.5 10.1 59.4 10.4 55.7 0 91.9-26.1 92.3-66.5.2-22.2-14-39.1-44.6-53-18.6-9-30-15-29.9-24.1 0-8.1 9.6-16.7 30.5-16.7 17.4-.3 30 3.5 39.8 7.5l4.8 2.3 7.2-42.4h.8zM581.8 158.3h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.2h55.7l11.1-29.1h68.1l6.5 29.1H624l-42.2-194.4zm-65.6 125.2c4.4-11.2 21.3-54.4 21.3-54.4-.3.5 4.4-11.4 7.1-18.7l3.6 16.9s10.2 46.6 12.4 56.2h-44.4z"/><path fill="#1434CB" d="M239.5 158.3L187.4 289l-5.5-26.8c-9.6-30.7-39.5-64-73-80.6l47.5 166.9h56l83.2-190.2h-56.1z"/><path fill="#F7B600" d="M146.9 158.3H61.3l-.6 3.5c66.4 16 110.3 54.7 128.5 101.2l-18.5-88.8c-3.2-12.1-12.5-15.5-23.8-15.9z"/></svg>
            </div>
            <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
              <svg className="h-4" viewBox="0 0 152 100" fill="none"><rect width="152" height="100" rx="8" fill="white"/><circle cx="55" cy="50" r="30" fill="#EB001B"/><circle cx="97" cy="50" r="30" fill="#F79E1B"/><path d="M76 27.5C82.6 32.8 87 40.8 87 50C87 59.2 82.6 67.2 76 72.5C69.4 67.2 65 59.2 65 50C65 40.8 69.4 32.8 76 27.5Z" fill="#FF5F00"/></svg>
            </div>
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