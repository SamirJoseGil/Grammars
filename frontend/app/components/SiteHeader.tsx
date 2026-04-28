export function SiteHeader({ theme, onToggleTheme }: { theme: "light" | "dark"; onToggleTheme: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/35 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/35">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-300/30 bg-sky-400/15 text-lg font-black text-sky-500 shadow-lg shadow-sky-400/10">G</div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-500/80 dark:text-sky-200/80">Grammar Studio</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Parser visual</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex">
          <a href="#inicio" className="transition hover:text-sky-500 dark:hover:text-sky-200">Inicio</a>
          <a href="#info" className="transition hover:text-sky-500 dark:hover:text-sky-200">Info</a>
          <a href="#equipo" className="transition hover:text-sky-500 dark:hover:text-sky-200">Team</a>
          <a href="#herramienta" className="transition hover:text-sky-500 dark:hover:text-sky-200">Herramienta</a>
        </nav>

        <button type="button" onClick={onToggleTheme} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
          {theme === "dark" ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span className="hidden sm:inline">{theme === "dark" ? "Día" : "Noche"}</span>
        </button>
      </div>
    </header>
  );
}
