"use client";

import { motion } from "framer-motion";

export function HeroVisuals({ locale }: { locale: string }) {
  return (
    /* Contenedor principal: Altura fija y cuadrícula uniforme para que las 3 imágenes midan exactamente lo mismo */
    <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-8">
      
      {/* IMAGEN 1: Izquierda */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border border-[var(--virexa-silver)] group cursor-pointer bg-white"
      >
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop" 
          alt="Analytics and Strategy" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {/* Capa de color que aparece en hover - Tono Azul */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--virexa-blue)]/70 via-[var(--virexa-blue)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              {locale === 'es' ? 'Análisis Profundo' : 'Deep Analytics'}
            </span>
        </div>
      </motion.div>

      {/* IMAGEN 2: Central */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border border-[var(--virexa-cyan)]/30 group cursor-pointer bg-white z-10"
      >
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=1000&fit=crop" 
          alt="Digital Interface" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {/* Capa de color que aparece en hover - Tono Cian */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--virexa-cyan)]/70 via-[var(--virexa-cyan)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              {locale === 'es' ? 'Diseño de Interfaces' : 'Interface Design'}
            </span>
        </div>
      </motion.div>

      {/* IMAGEN 3: Derecha */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border border-[var(--virexa-silver)] hidden sm:block group cursor-pointer bg-white"
      >
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=800&fit=crop" 
          alt="Team collaboration" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {/* Capa de color que aparece en hover - Tono Teal */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--virexa-teal)]/70 via-[var(--virexa-teal)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              {locale === 'es' ? 'Desarrollo Ágil' : 'Agile Development'}
            </span>
        </div>
      </motion.div>

    </div>
  );
}