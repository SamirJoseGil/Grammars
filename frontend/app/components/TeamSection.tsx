import { motion } from "framer-motion";

import { GlassCard } from "./GlassCard";
import { SectionTitle } from "./SectionTitle";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

const team = [
  {
    name: "Samir Jose Osorio Gil",
    role: "Full Stack",
    roles: ["Backend", "Frontend", "Project Manager"],
    description: "Líder del proyecto. Desarrollo completo de la API REST, lógica del parser con NLTK, interfaz de usuario con React/Remix, gestión del proyecto y arquitectura general del sistema.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    portfolio: "https://portfolio.sglabs.site/",
  },
  {
    name: "Integrante",
    role: "Apoyo",
    roles: ["Testing", "Documentación"],
    description: "Soporte en pruebas unitarias, validación de casos de uso, documentación técnica y preparación de la presentación del proyecto.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    portfolio: "https://example.com",
  },
];

export function TeamSection() {
  return (
    <section id="equipo" className="min-h-screen mx-auto flex max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="w-full space-y-8">
        <SectionTitle eyebrow="Team" title="Somos dos" description="Colaboración y dedicación en cada línea de código." />
        <div className="grid gap-6 md:grid-cols-2">
          {team.map((member, index) => (
            <motion.div key={member.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }}>
              <GlassCard className="h-full flex flex-col">
                <div className="flex gap-4 items-start mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-16 w-16 rounded-2xl object-cover border border-sky-300/30"
                  />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-500 dark:text-sky-200 font-semibold">{member.role}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{member.name}</h3>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {member.roles.map((r) => (
                      <span key={r} className="inline-block text-xs rounded-full bg-sky-400/10 px-2.5 py-1 text-sky-600 dark:text-sky-300">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 flex-grow">{member.description}</p>

                <button
                  onClick={() => window.open(member.portfolio, "_blank")}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-600 hover:bg-sky-500/20 transition-colors dark:text-sky-200 dark:hover:bg-sky-500/30 w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver Portafolio
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
