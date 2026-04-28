export function SiteFooter() {
  return (
    <footer id="footer" className="border-t border-white/40 bg-white/35 px-4 py-8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/35 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Grammar Studio</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Parser visual para gramáticas libres de contexto</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a
              href="https://www.sglabs.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-200 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              sglabs
            </a>
            <a
              href="https://portfolio.sglabs.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-200 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Portfolio
            </a>
          </div>
        </div>
        <div className="border-t border-white/20 dark:border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <p>
            Hecho por{" "}
            <a
              href="https://www.sglabs.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-200 transition"
            >
              sglabs
            </a>
          </p>
          <p>© 2026 Grammar Studio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
