"use client";

import { motion } from "framer-motion";
import { Layers, MousePointerClick, Cpu } from "lucide-react";

export function HeroTags({ locale }: { locale: string }) {
  const isEs = locale === 'es';

  const tags = [
    {
      id: 1,
      icon: <Layers className="w-4 h-4" />,
      text: isEs ? "Estructuras UX/UI" : "UX/UI Structures",
      delay: 0.2
    },
    {
      id: 2,
      icon: <MousePointerClick className="w-4 h-4" />,
      text: isEs ? "Conversión Óptima" : "Optimal Conversion",
      delay: 0.4
    },
    {
      id: 3,
      icon: <Cpu className="w-4 h-4" />,
      text: isEs ? "Desarrollo Ágil" : "Agile Development",
      delay: 0.6
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 relative z-30">
      {tags.map((tag) => (
        <motion.div
          key={tag.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: tag.delay, ease: "easeOut" }}
          whileHover={{ y: -5 }}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[var(--virexa-silver)] text-slate-700 px-6 py-3 rounded-full text-sm font-semibold shadow-sm cursor-default transition-all hover:shadow-[var(--virexa-blue)]/20 hover:border-[var(--virexa-cyan)]/50"
        >
          <span className="text-[var(--virexa-blue)]">{tag.icon}</span>
          {tag.text}
        </motion.div>
      ))}
    </div>
  );
}