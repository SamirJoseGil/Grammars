import { useEffect, useMemo, useState } from "react";

import { useElementWidth } from "~/hooks/useElementWidth";
import { useThemeMode } from "~/hooks/useThemeMode";
import { GlassCard } from "./GlassCard";
import { exportTreeAsPNG } from "~/utils/export";

type ParserTreeNode = { name: string; children?: ParserTreeNode[] };

function normalizeTree(data: ParserTreeNode | ParserTreeNode[] | null): ParserTreeNode | null {
  if (!data) return null;
  return Array.isArray(data) ? data[0] ?? null : data;
}

export function TreePanel({ data }: { data: ParserTreeNode | ParserTreeNode[] | null }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const { theme } = useThemeMode();
  const [TreeLib, setTreeLib] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(1);

  const isDark = theme === "dark";
  const nodeColor = isDark ? "#3b82f6" : "#0ea5e9";
  const nodeStroke = isDark ? "#0369a1" : "#1e3a8a";
  const textColor = isDark ? "#ffffff" : "#1e293b";
  useEffect(() => {
    let alive = true;
    import("react-d3-tree").then((module) => {
      if (alive) setTreeLib(() => module.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  const normalized = useMemo(() => normalizeTree(data), [data]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      await exportTreeAsPNG("tree-container", `parse-tree-${timestamp}.png`);
    } catch (error) {
      console.error("Failed to export tree:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.3));
  const handleResetZoom = () => setZoom(1);

  return (
    <GlassCard className="min-h-[30rem]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-4 dark:border-white/10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-sky-300/90">Árbol</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Árbol de derivación</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={!normalized || isExporting}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:text-emerald-400"
            title="Descargar árbol como PNG"
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Exportando…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PNG
              </>
            )}
          </button>
          <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-500 dark:text-sky-200">react-d3-tree</span>
        </div>
      </div>
      <div id="tree-container" ref={ref} className="relative mt-6 h-[26rem] overflow-hidden rounded-2xl bg-slate-950/5 dark:bg-white/5">
        {/* Zoom Controls */}
        {normalized && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.3}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:text-sky-300 dark:hover:bg-sky-500/30 border border-sky-300/30 dark:border-sky-500/30"
              title="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-slate-950/5 border border-slate-300/30 dark:bg-white/5 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[3rem]">
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:text-sky-300 dark:hover:bg-sky-500/30 border border-sky-300/30 dark:border-sky-500/30"
              title="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={handleResetZoom}
              disabled={zoom === 1}
              className="inline-flex items-center justify-center px-2 h-9 rounded-lg bg-slate-300/20 text-slate-600 hover:bg-slate-300/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 border border-slate-300/30 dark:border-white/10 text-xs font-medium"
              title="Reset zoom"
            >
              Reset
            </button>
          </div>
        )}

        {!normalized ? (
          <div className="flex h-full items-center justify-center px-8 text-center text-sm text-slate-500 dark:text-slate-400">Ejecuta el análisis para ver el árbol.</div>
        ) : TreeLib ? (
          <TreeLib
            data={normalized}
            orientation="vertical"
            zoomable
            zoom={zoom}
            scaleExtent={{ min: 0.3, max: 2 }}
            collapsible
            translate={{ x: width / 2 || 320, y: 90 }}
            nodeSize={{ x: 220, y: 120 }}
            pathFunc="elbow"
            separation={{ siblings: 1.2, nonSiblings: 1.5 }}
            renderCustomNodeElement={({ nodeDatum }: any) => (
              <g>
                <circle r="18" fill={nodeColor} stroke={nodeStroke} strokeWidth="2" />
                <text
                  x="26"
                  y="6"
                  fill={textColor}
                  style={{ pointerEvents: "none", fontSize: "14px", fontWeight: 600, textAnchor: "start" }}
                >
                  {nodeDatum.name}
                </text>
              </g>
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">Cargando árbol…</div>
        )}
      </div>
    </GlassCard>
  );
}
