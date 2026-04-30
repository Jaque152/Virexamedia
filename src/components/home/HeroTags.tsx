"use client";

import { motion } from "framer-motion";
import { Target, Zap, CalendarDays } from "lucide-react";

export function HeroTags({ locale }: { locale: string }) {
  const isEs = locale === 'es';

  const tags = [
    {
      id: 1,
      icon: <Target className="w-4 h-4" />,
      text: isEs ? "Estrategias Dirigidas" : "Targeted Strategies",
      delay: 0.2
    },
    {
      id: 2,
      icon: <Zap className="w-4 h-4" />,
      text: isEs ? "Comunicación Disruptiva" : "Disruptive Communication",
      delay: 0.4
    },
    {
      id: 3,
      icon: <CalendarDays className="w-4 h-4" />,
      text: isEs ? "Eventos Estratégicos" : "Strategic Events",
      delay: 0.6
    }
  ];

  return (
    <div className="flex flex-wrap gap-3 my-8 relative z-30">
      {tags.map((tag) => (
        <motion.div
          key={tag.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: tag.delay, ease: "easeOut" }}
          whileHover={{ y: -5, scale: 1.05 }}
          className="flex items-center gap-2 bg-[var(--charcoal)]/80 backdrop-blur-md border border-[var(--copper)]/40 text-[var(--cream)] px-5 py-2.5 rounded-full text-sm font-medium font-sans shadow-xl cursor-default transition-shadow hover:shadow-[var(--copper)]/20 hover:border-[var(--copper)]"
        >
          <span className="text-[var(--copper)]">{tag.icon}</span>
          {tag.text}
        </motion.div>
      ))}
    </div>
  );
}