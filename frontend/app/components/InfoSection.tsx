import { motion } from "framer-motion";

import { GlassCard } from "./GlassCard";
import { SectionTitle } from "./SectionTitle";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const features = [
  {
    title: "Gramática",
    description: "Define las reglas de tu lenguaje. Soporta formato académico (E = E + T) y BNF tradicional.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    title: "Derivación",
    description: "Visualiza paso a paso cómo se genera una expresión. Elige derivación izquierda o derecha.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Árbol de Derivación",
    description: "Mira la estructura jerárquica de cómo se parsea tu expresión con el árbol sintáctico.",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
];

const capabilities = [
  "Reconocimiento óptico de gramáticas (OCR)",
  "Exporta árbol como PNG",
  "Detecta gramáticas ambiguas",
  "Exporta derivación paso a paso",
  "Ejemplos predefinidos editables",
  "Soporte para ambiguedad y múltiples árboles",
];

export function InfoSection() {
  return (
    <section id="info" className="min-h-screen mx-auto flex max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8 scroll-mt-20">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="w-full space-y-12">
        <SectionTitle 
          eyebrow="Info" 
          title="¿Cómo funciona?" 
          description="Un parser visual que convierte tus gramáticas en derivaciones y árboles de análisis sintáctico." 
        />

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp}>
              <GlassCard className="h-full border-white/30 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 mb-4">
                  <svg className="w-6 h-6 text-sky-500 dark:text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 flex-grow">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp}>
          <GlassCard className="border-white/30 bg-gradient-to-r from-sky-400/10 via-violet-400/10 to-pink-400/10 dark:from-sky-500/10 dark:via-violet-500/10 dark:to-pink-500/10">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white mb-2">Características incluidas</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Todo lo que necesitas para analizar y visualizar gramáticas:</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {capabilities.map((capability) => (
                  <motion.div key={capability} variants={fadeUp} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-sky-500 dark:text-sky-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{capability}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="border-white/30 bg-white/60 dark:bg-white/5">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Sobre gramáticas y derivación</h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-6">
                <p>
                  Una <strong>gramática libre de contexto (CFG)</strong> es un conjunto de reglas que define un lenguaje. Cada regla especifica cómo un símbolo no-terminal puede ser reemplazado por una secuencia de símbolos.
                </p>
                <p>
                  La <strong>derivación</strong> es el proceso de generar una expresión aplicando las reglas de la gramática. Puedes hacer derivación <strong>izquierda</strong> (expandiendo el símbolo no-terminal más a la izquierda) o <strong>derecha</strong> (expandiendo el más a la derecha).
                </p>
                <p>
                  El <strong>árbol de derivación</strong> es una representación gráfica de cómo se genera la expresión. Cada nodo es un símbolo, y los arcos muestran qué regla se aplicó.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
