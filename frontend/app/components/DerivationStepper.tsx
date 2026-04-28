import { useEffect, useMemo, useState } from "react";

import { GlassCard } from "./GlassCard";
import { exportDerivationAsText, exportDerivationAsImage } from "~/utils/export";

function tokenize(step: string) {
  return step.trim().split(/\s+/).filter(Boolean);
}

function diffWindow(previousStep: string, currentStep: string) {
  const previousTokens = tokenize(previousStep);
  const currentTokens = tokenize(currentStep);

  let start = 0;
  while (start < previousTokens.length && start < currentTokens.length && previousTokens[start] === currentTokens[start]) {
    start += 1;
  }

  let previousEnd = previousTokens.length - 1;
  let currentEnd = currentTokens.length - 1;
  while (previousEnd >= start && currentEnd >= start && previousTokens[previousEnd] === currentTokens[currentEnd]) {
    previousEnd -= 1;
    currentEnd -= 1;
  }

  return { start, currentEnd, currentTokens };
}

function renderStepTokens(previousStep: string, currentStep: string) {
  const { start, currentEnd, currentTokens } = diffWindow(previousStep, currentStep);

  return currentTokens.map((token, index) => {
    const changed = index >= start && index <= currentEnd;
    return (
      <span
        key={`${token}-${index}`}
        className={`inline-block rounded-md px-1.5 py-0.5 ${changed ? "bg-sky-400/20 text-sky-700 dark:text-sky-200" : ""}`}
      >
        {token}
      </span>
    );
  });
}

export function DerivationStepper({ steps }: { steps: string[] }) {
  const [stepByStep, setStepByStep] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExporting, setIsExporting] = useState<"text" | "image" | null>(null);

  useEffect(() => {
    setCurrentIndex(steps.length > 0 ? steps.length - 1 : 0);
  }, [steps]);

  const currentStep = useMemo(() => steps[currentIndex] ?? "", [steps, currentIndex]);
  const previousStep = currentIndex > 0 ? steps[currentIndex - 1] : "";

  const handleExportText = async () => {
    setIsExporting("text");
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      await exportDerivationAsText(steps, `derivation-${timestamp}.txt`);
    } catch (error) {
      console.error("Failed to export derivation:", error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportImage = async () => {
    setIsExporting("image");
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      await exportDerivationAsImage("derivation-container", `derivation-${timestamp}.png`);
    } catch (error) {
      console.error("Failed to export derivation as image:", error);
    } finally {
      setIsExporting(null);
    }
  };

  if (steps.length === 0) {
    return (
      <GlassCard>
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-4 dark:border-white/10">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Derivación</h3>
          <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-500 dark:text-sky-200">step by step</span>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Aquí verás los pasos.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/10">
        <div>
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Derivación</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Resalta el símbolo que cambia en cada paso.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportText}
            disabled={isExporting !== null}
            className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-400/15 disabled:opacity-50 disabled:cursor-not-allowed dark:text-emerald-200"
            title="Descargar pasos como texto"
          >
            {isExporting === "text" ? (
              <svg className="w-3 h-3 inline animate-spin mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <>
                <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                TXT
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleExportImage}
            disabled={isExporting !== null}
            className="rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-600 transition hover:bg-violet-400/15 disabled:opacity-50 disabled:cursor-not-allowed dark:text-violet-200"
            title="Descargar pasos como imagen"
          >
            {isExporting === "image" ? (
              <svg className="w-3 h-3 inline animate-spin mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <>
                <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PNG
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStepByStep((value) => !value)}
            className="rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 transition hover:bg-sky-400/15 dark:text-sky-200"
          >
            {stepByStep ? "Salir" : "Step by step"}
          </button>
        </div>
      </div>

      <div id="derivation-container" className="mt-4 space-y-4">
        {stepByStep ? (
          <>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Paso {currentIndex + 1} / {steps.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                  disabled={currentIndex === 0}
                  className="rounded-full border border-slate-300/70 px-3 py-1 text-xs font-semibold text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((value) => Math.min(steps.length - 1, value + 1))}
                  disabled={currentIndex === steps.length - 1}
                  className="rounded-full border border-slate-300/70 px-3 py-1 text-xs font-semibold text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/60 px-4 py-4 font-mono text-sm leading-8 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
              {renderStepTokens(previousStep, currentStep)}
            </div>
          </>
        ) : (
          <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {steps.map((step, index) => (
              <li key={index} className={`rounded-2xl border px-4 py-3 font-mono text-xs sm:text-sm ${index === currentIndex ? "border-sky-300/40 bg-sky-400/10 text-slate-900 dark:text-white" : "border-white/20 bg-white/60 dark:border-white/10 dark:bg-white/5"}`}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        )}
      </div>
    </GlassCard>
  );
}
