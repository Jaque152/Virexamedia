"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocale } from "next-intl";
import { Code2, MonitorSmartphone, TrendingUp, ArrowRight } from "lucide-react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const locale = useLocale();
  const isEs = locale === 'es';

  return (
    <section ref={ref} className="relative pt-32 pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Cabecera Monumental Centrada */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            {isEs ? 'Transformamos ideas en ' : 'We transform ideas into '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--virexa-blue)] to-[var(--virexa-cyan)]">
              {isEs ? 'Ecosistemas Digitales' : 'Digital Ecosystems'}
            </span>
          </h2>
          <p className="mt-8 text-xl text-slate-500 font-medium">
            {isEs 
              ? 'En Virexamedia fusionamos código limpio, diseño UX/UI y estrategias de conversión para liderar tu industria.'
              : 'At Virexamedia we merge clean code, UX/UI design, and conversion strategies to lead your industry.'}
          </p>
        </motion.div>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          
          {/* Caja 1: Misión (Grande) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 bg-slate-50 rounded-3xl p-10 border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            <div>
              <span className="text-[var(--virexa-blue)] text-sm font-bold uppercase tracking-widest mb-4 block">
                {isEs ? 'Nuestra Misión' : 'Our Mission'}
              </span>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                {isEs ? 'Desarrollo Orientado al Rendimiento' : 'Performance-Driven Development'}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                {isEs 
                  ? 'No solo hacemos páginas web, construimos herramientas de negocio. Optimizamos cada línea de código y cada pixel para garantizar velocidad, accesibilidad y un impacto real en tus métricas.'
                  : 'We don\'t just make websites, we build business tools. We optimize every line of code and every pixel to ensure speed, accessibility, and a real impact on your metrics.'}
              </p>
            </div>
          </motion.div>

          {/* Caja 2: Visión (Alta, color de marca) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 bg-gradient-to-br from-[var(--virexa-blue)] to-[var(--virexa-cyan)] rounded-3xl p-10 shadow-lg flex flex-col text-white"
          >
            <span className="text-white/80 text-sm font-bold uppercase tracking-widest mb-4 block">
              {isEs ? 'Visión' : 'Vision'}
            </span>
            <h3 className="text-2xl font-bold mb-4">
              {isEs ? 'El Futuro es Digital y Ágil' : 'The Future is Digital & Agile'}
            </h3>
            <p className="text-white/90 leading-relaxed mb-8 flex-grow">
              {isEs 
                ? 'Ser el estándar de excelencia tecnológica para empresas que buscan escalar sin límites en la web moderna.'
                : 'To be the standard of technological excellence for companies looking to scale without limits on the modern web.'}
            </p>
            <a href={`/${locale}/contact`} className="inline-flex items-center gap-2 font-bold text-white group">
              {isEs ? 'Inicia tu proyecto' : 'Start your project'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Cajas de Servicios (3 seguidas) */}
          {[
            {
              icon: <MonitorSmartphone className="w-8 h-8" />,
              title: isEs ? "UX/UI Design" : "UX/UI Design",
              desc: isEs ? "Interfaces intuitivas que enamoran y convierten." : "Intuitive interfaces that captivate and convert."
            },
            {
              icon: <Code2 className="w-8 h-8" />,
              title: isEs ? "Desarrollo Frontend" : "Frontend Dev",
              desc: isEs ? "Arquitecturas web rápidas, seguras y escalables." : "Fast, secure, and scalable web architectures."
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: isEs ? "Growth & Analytics" : "Growth & Analytics",
              desc: isEs ? "Decisiones basadas en datos para maximizar el ROI." : "Data-driven decisions to maximize ROI."
            }
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:border-[var(--virexa-cyan)] hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[var(--virexa-blue)] mb-6 group-hover:bg-[var(--virexa-blue)] group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h4>
              <p className="text-slate-500">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}