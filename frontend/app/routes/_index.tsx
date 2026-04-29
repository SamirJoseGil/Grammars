import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

import { HeroSection } from "~/components/HeroSection";
import { InfoSection } from "~/components/InfoSection";
import { ParserToolSection } from "~/components/ParserToolSection";
import { SiteFooter } from "~/components/SiteFooter";
import { SiteHeader } from "~/components/SiteHeader";
import { TeamSection } from "~/components/TeamSection";
import { useThemeMode } from "~/hooks/useThemeMode";
import { ENV } from "~/env.server";

export function loader({}: LoaderFunctionArgs) {
  return json({ apiBaseUrl: ENV.API_BASE_URL });
}

type ParserTreeNode = { name: string; children?: ParserTreeNode[] };

export const meta: MetaFunction = () => [
  { title: "Grammar Studio" },
  { name: "description", content: "Parser de gramáticas con derivación y árbol." },
];

export default function Index() {
  const { apiBaseUrl } = useLoaderData<typeof loader>();
  const { theme, toggleTheme } = useThemeMode();
  const [grammar, setGrammar] = useState<string>(
    `E = E + T | E - T | T
T = T * F | T / F | F
F = ( E ) | n`
  );
  const [text, setText] = useState<string>("n + n * n");
  const [derivationType, setDerivationType] = useState<string>("left");
  const [derivation, setDerivation] = useState<string[]>([]);
  const [treeJson, setTreeJson] = useState<ParserTreeNode | ParserTreeNode[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseInfo, setParseInfo] = useState<{ tree_count?: number; ambiguous?: boolean } | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setDerivation([]);
    setTreeJson(null);
    setParseInfo(null);

    try {
      const body = { grammar, text };

      const parseRes = await fetch(`${apiBaseUrl}/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseData = await parseRes.json();
      if (!parseRes.ok) throw new Error(parseData.error || "No se pudo analizar.");
      setParseInfo(parseData);

      const derRes = await fetch(`${apiBaseUrl}/derivation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, derivation_type: derivationType }),
      });
      const derData = await derRes.json();
      if (!derRes.ok) throw new Error(derData.error || "No se pudo derivar.");
      setDerivation(derData.steps || []);

      const treeRes = await fetch(`${apiBaseUrl}/tree`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const treeData = await treeRes.json();
      if (treeRes.ok) setTreeJson(treeData.tree ?? treeData.trees ?? null);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.55),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(to_bottom,_#f8fbff,_#eef4ff_45%,_#e2e8f0_100%)] text-slate-950 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_26%),linear-gradient(to_bottom,_#020617,_#0f172a_55%,_#111827_100%)] dark:text-white">
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <HeroSection />
        <InfoSection />
        <TeamSection />
        <ParserToolSection
          grammar={grammar}
          setGrammar={setGrammar}
          text={text}
          setText={setText}
          derivationType={derivationType}
          setDerivationType={setDerivationType}
          derivation={derivation}
          treeJson={treeJson}
          loading={loading}
          error={error}
          parseInfo={parseInfo}
          onGenerate={handleGenerate}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
