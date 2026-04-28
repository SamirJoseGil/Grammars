import { GlassCard } from "./GlassCard";
import { TreePanel } from "./TreePanel";

type ParserTreeNode = { name: string; children?: ParserTreeNode[] };

export function TreeGallery({ trees }: { trees: ParserTreeNode[] }) {
  if (trees.length <= 1) {
    return <TreePanel data={trees[0] ?? null} />;
  }

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-4 dark:border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sky-300/90">Árboles</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Todos los parse trees</h3>
          </div>
          <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-500 dark:text-sky-200">
            {trees.length}
          </span>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          La gramática es ambigua, así que mostramos todas las derivaciones posibles.
        </p>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-2">
        {trees.map((tree, index) => (
          <div key={`${tree.name}-${index}`} className="space-y-3">
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-950 dark:text-white">Árbol {index + 1}</h4>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Tree</span>
              </div>
            </GlassCard>
            <TreePanel data={tree} />
          </div>
        ))}
      </div>
    </div>
  );
}
