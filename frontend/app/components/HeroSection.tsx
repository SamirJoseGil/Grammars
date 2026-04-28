import { motion } from "framer-motion";

import { GlassCard } from "./GlassCard";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export function HeroSection() {
  return (
    <section id="inicio" className="min-h-screen mx-auto flex max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8 scroll-mt-20 relative overflow-hidden">
      {/* Animated gradient background - CSS only, no JS animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/20 rounded-full mix-blend-multiply filter blur-3xl dark:bg-sky-800/20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200/20 rounded-full mix-blend-multiply filter blur-3xl dark:bg-violet-800/20" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl dark:bg-pink-800/20" />
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] w-full">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
          <motion.div 
            variants={fadeUp} 
            className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-sm text-slate-700 shadow-sm dark:text-slate-200 backdrop-blur-sm"
          >
            Gramática, derivación y árbol
          </motion.div>
          <motion.div variants={fadeUp} className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">
              Parser moderno para{" "}
              <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">gramáticas</span>.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Escribe, genera y visualiza. Soporta formato académico y BNF.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <a href="#herramienta" className="rounded-full bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:shadow-lg hover:shadow-sky-400/40 hover:scale-105">
              Comenzar
            </a>
            <a href="#info" className="rounded-full border border-slate-300/70 bg-white/60 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur-xl transition hover:bg-white hover:scale-105 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
              Más info
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-300/20 via-transparent to-violet-300/20 blur-3xl dark:from-sky-800/20 dark:to-violet-800/20" />
          <GlassCard className="overflow-hidden p-0 border-white/30 dark:border-white/10">
            <div className="border-b border-white/20 bg-gradient-to-r from-slate-950/5 to-slate-950/0 px-6 py-4 dark:border-white/10 dark:from-white/5 dark:to-white/0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ejemplo rápido</p>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-2xl border border-sky-300/30 bg-gradient-to-br from-sky-400/15 to-sky-400/5 p-4 dark:border-sky-500/30 dark:from-sky-500/15 dark:to-sky-500/5">
                <p className="text-xs uppercase tracking-[0.25em] text-sky-600 dark:text-sky-300 font-semibold">Entrada</p>
                <p className="mt-2 font-mono text-sm text-slate-800 dark:text-slate-100 font-medium">E = E + T | T<br/>n + n</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-100/40 to-slate-100/10 p-4 dark:border-white/10 dark:from-white/5 dark:to-white/0">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-600 dark:text-slate-400 font-semibold">Salida</p>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 font-medium">Derivación paso a paso y árbol de análisis sintáctico.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
