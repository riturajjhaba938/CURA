import FAB from "@/components/FAB";

export default function CuraVoiceTrace() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Pane: Raw Text */}
      <section className="flex-1 overflow-y-auto bg-surface-bright p-12 border-r border-outline-variant/10">
        <div className="max-w-xl mx-auto">
          {/* Source Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">forum</span>
            </div>
            <div>
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Source Input</span>
              <div className="flex items-center gap-2">
                <span className="font-[Manrope] font-bold text-on-surface">u/patient_voice_77</span>
                <span className="text-xs bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant font-mono">
                  Comment #r8k9p2
                </span>
              </div>
            </div>
          </div>

          {/* Raw Text */}
          <div className="text-xl leading-relaxed text-on-surface space-y-6">
            <p>
              Starting the new regimen on Monday. By Wednesday, I noticed a crushing sense of{" "}
              <span className="relative group cursor-pointer inline-block">
                <span className="border-b-2 border-primary/40 group-hover:border-primary transition-colors">fatigue</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
              </span>{" "}
              that I haven&apos;t felt before. It&apos;s like moving through molasses.
            </p>
            <p>
              Woke up at 3 AM with intense{" "}
              <span className="relative group cursor-pointer inline-block">
                <span className="border-b-2 border-primary/40 group-hover:border-primary transition-colors">nausea</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
              </span>{" "}
              and a cold sweat. It seems to peak about 4 hours after the evening dose. Has anyone else experienced this? The{" "}
              <span className="relative group cursor-pointer inline-block">
                <span className="border-b-2 border-primary/40 group-hover:border-primary transition-colors">dizziness</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
              </span>{" "}
              makes it hard to even stand up to get water.
            </p>
          </div>

          {/* Sentiment Bar */}
          <div className="mt-16 p-6 rounded-xl border-b-2 border-primary-fixed-dim bg-surface-container-low">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Contextual Sentiment
              </span>
              <span className="text-xs font-mono text-primary">High Urgency</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[82%]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Pane: Structured Insights */}
      <section className="flex-1 overflow-y-auto bg-surface-container-low p-12">
        <div className="max-w-xl mx-auto flex flex-col gap-8 relative">
          {/* Insight 1: Fatigue */}
          <div className="relative group">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 connector-line opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <div className="glass-panel p-6 rounded-xl antigravity-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/5">
                    <span className="material-symbols-outlined text-primary">monitor_heart</span>
                  </div>
                  <h3 className="font-[Manrope] font-bold text-lg">Systemic Fatigue</h3>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  92% FDA MATCH
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Bytez API Vector</span>
                  <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded">ae-4492-f01</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-surface-bright rounded-lg border-b border-outline-variant/10">
                    <span className="block text-[10px] uppercase font-bold text-outline mb-1">Severity</span>
                    <span className="text-primary font-bold">Grade 3</span>
                  </div>
                  <div className="p-3 bg-surface-bright rounded-lg border-b border-outline-variant/10">
                    <span className="block text-[10px] uppercase font-bold text-outline mb-1">Duration</span>
                    <span className="text-primary font-bold">Persistent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insight 2: Nausea */}
          <div className="relative group translate-x-4">
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 connector-line opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <div className="glass-panel p-6 rounded-xl antigravity-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-tertiary/5">
                    <span className="material-symbols-outlined text-tertiary">gastroenterology</span>
                  </div>
                  <h3 className="font-[Manrope] font-bold text-lg">Acute Emesis</h3>
                </div>
                <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter">
                  MANUAL REVIEW
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Ontology Link</span>
                  <span className="text-primary font-medium hover:underline cursor-pointer">MeSH:D009325</span>
                </div>
                <div className="text-sm text-on-surface-variant leading-relaxed italic">
                  &quot;Patient reports peak discomfort 4 hours post‑ingestion. Suggests potential T‑max metabolic correlation.&quot;
                </div>
              </div>
            </div>
          </div>

          {/* Insight 3: Dizziness */}
          <div className="relative group -translate-x-2">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 connector-line opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <div className="glass-panel p-6 rounded-xl antigravity-shadow border-l-4 border-l-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/5">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <h3 className="font-[Manrope] font-bold text-lg">Orthostatic Vertigo</h3>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                <p className="text-xs text-on-primary-fixed-variant leading-relaxed">
                  Bytez high‑confidence extraction (94.8%). Correlates with MedDRA term &quot;Dizziness postural&quot;.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAB />
    </div>
  );
}
