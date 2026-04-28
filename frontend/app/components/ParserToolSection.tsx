import { GlassCard } from "./GlassCard";
import { SectionTitle } from "./SectionTitle";
import { DerivationStepper } from "./DerivationStepper";
import { TreeGallery } from "./TreeGallery";
import { TreePanel } from "./TreePanel";
import { ImageUploadSection } from "./ImageUploadSection";
import { ImageUploadSmall } from "./ImageUploadSmall";

type ParserTreeNode = { name: string; children?: ParserTreeNode[] };
type ParseInfo = { tree_count?: number; ambiguous?: boolean } | null;

export function ParserToolSection({
  grammar,
  setGrammar,
  text,
  setText,
  derivationType,
  setDerivationType,
  derivation,
  treeJson,
  loading,
  error,
  parseInfo,
  onGenerate,
}: {
  grammar: string;
  setGrammar: (value: string) => void;
  text: string;
  setText: (value: string) => void;
  derivationType: string;
  setDerivationType: (value: string) => void;
  derivation: string[];
  treeJson: ParserTreeNode | ParserTreeNode[] | null;
  loading: boolean;
  error: string | null;
  parseInfo: ParseInfo;
  onGenerate: () => void;
}) {
  const examples = {
    expresiones: {
      label: "Expresiones aritméticas",
      grammar: `E = E + T | E - T | T
T = T * F | T / F | F
F = ( E ) | n`,
      text: "n + n * n",
    },
    suma: {
      label: "Suma simple",
      grammar: `E = E + T | T
T = n`,
      text: "n + n + n",
    },
    simple: {
      label: "Concatenación",
      grammar: `S = a S b | ab`,
      text: "a a a b b b",
    },
    balanceado: {
      label: "Paréntesis",
      grammar: `S = ( S ) | S S | ε`,
      text: "( ) ( ( ) )",
    },
  };

  const handleLoadExample = (key: keyof typeof examples) => {
    const example = examples[key];
    setGrammar(example.grammar);
    setText(example.text);
  };
  return (
    <section id="herramienta" className="min-h-screen mx-auto flex max-w-7xl items-start px-4 py-16 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="w-full space-y-8">
        <SectionTitle eyebrow="Herramienta" title="Genera el análisis" description="Solo gramática, derivación y árbol." />

        {/* <ImageUploadSection onGrammarExtracted={setGrammar} /> */}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="h-full">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Gramática</label>
                <textarea
                  className="min-h-40 w-full rounded-2xl border border-slate-300/70 bg-white/80 p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:placeholder:text-slate-500"
                  value={grammar}
                  onChange={(e) => setGrammar(e.target.value)}
                  placeholder="E = E + T | T&#10;Soporta formatos: E = ... o E -> ..."
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Ejemplos:</span>
                  {(Object.entries(examples) as Array<[keyof typeof examples, typeof examples[keyof typeof examples]]>).map(([key, example]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleLoadExample(key)}
                      className="text-xs rounded-full bg-sky-400/10 px-2.5 py-1 text-sky-600 hover:bg-sky-400/20 transition dark:text-sky-300 dark:hover:bg-sky-400/30"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
                <ImageUploadSmall
                  onTextExtracted={setGrammar}
                  label="Subir imagen de gramática"
                  placeholder="Gramática desde foto"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Expresión</label>
                <input
                  className="w-full rounded-2xl border border-slate-300/70 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:placeholder:text-slate-500"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <ImageUploadSmall
                  onTextExtracted={setText}
                  label="Subir imagen de expresión"
                  placeholder="Expresión desde foto"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Derivación</label>
                  <div className="flex rounded-2xl border border-slate-300/70 bg-white/80 p-1 dark:border-white/10 dark:bg-slate-950/40">
                    {([
                      ["left", "Left"],
                      ["right", "Right"],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDerivationType(value)}
                        className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                          derivationType === value ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={onGenerate} disabled={loading} className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "Procesando…" : "Generate"}
                </button>
              </div>

              {error && <div className="rounded-2xl border border-rose-200/50 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100">{error}</div>}

              {parseInfo && <p className="text-sm text-slate-500 dark:text-slate-400">{parseInfo.ambiguous ? "Árboles múltiples." : "Análisis listo."}</p>}
            </div>
          </GlassCard>

          <div className="space-y-6">
            <DerivationStepper steps={derivation} />
          </div>
        </div>

        {/* Tree section below */}
        {parseInfo?.ambiguous && Array.isArray(treeJson) ? (
          <TreeGallery trees={treeJson} />
        ) : (
          <TreePanel data={treeJson} />
        )}
      </div>
    </section>
  );
}
