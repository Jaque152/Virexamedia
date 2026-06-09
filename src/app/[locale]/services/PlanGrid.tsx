"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Plan } from "@/types";
import { ArrowRight, MonitorSmartphone } from "lucide-react";

export function PlanGrid({ plans, locale }: { plans: Plan[], locale: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {plans.map((plan, index) => (
        <PlanCard key={plan.id} plan={plan} index={index} isInView={isInView} locale={locale} />
      ))}
    </div>
  );
}

function PlanCard({ plan, index, isInView, locale }: { plan: Plan; index: number; isInView: boolean; locale: string }) {
  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);
  const isEs = locale === 'es';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full flex flex-col"
    >
      <div className="relative flex flex-col w-full h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[var(--virexa-blue)]/10 hover:border-[var(--virexa-blue)]/30 transition-all duration-300 overflow-hidden">
        
        {/* Imagen / Placeholder Moderno */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          {plan.image_url ? (
            <img 
              src={plan.image_url} 
              alt={plan.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <MonitorSmartphone className="w-16 h-16 text-slate-300" />
            </div>
          )}
          {/* Capa de hover visual sobre la imagen */}
          <div className="absolute inset-0 bg-[var(--virexa-blue)]/0 group-hover:bg-[var(--virexa-blue)]/10 transition-colors duration-300" />
        </div>

        {/* Contenido */}
        <div className="relative p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-[var(--virexa-blue)] transition-colors">
              {plan.title}
            </h3>
          </div>
          
          <div className="mt-auto mb-6">
            <span className="block text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
              {isEs ? 'Inversión' : 'Investment'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {formatPrice(plan.price)}
              </span>
              <span className="text-sm font-medium text-slate-400">MXN + IVA (16%)</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Link 
              href={`/${locale}/services/${plan.slug}`}
              className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 text-slate-700 font-bold group-hover:bg-[var(--virexa-blue)] group-hover:text-white transition-colors duration-300"
            >
              <span>{isEs ? 'Ver Especificaciones' : 'View Specs'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}