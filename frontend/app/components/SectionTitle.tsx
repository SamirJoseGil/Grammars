export function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/90">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">{description}</p>
    </div>
  );
}
