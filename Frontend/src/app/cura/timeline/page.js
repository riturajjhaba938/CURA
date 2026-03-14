import FAB from "@/components/FAB";

export default function CuraTimeline() {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 flex flex-col gap-12">
        {/* Hero Header */}
        <div className="max-w-4xl">
          <h2 className="font-[Manrope] text-4xl font-light text-on-surface tracking-tight mb-2">
            Chronological Recovery Timeline
          </h2>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed">
            Predictive recovery mapping based on current clinical biomarkers and historical patient data. Your progress
            is anchored to key physiological shifts.
          </p>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative w-full glass-panel p-12 rounded-[2rem] antigravity-shadow overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative flex flex-col gap-16">
            {/* Timeline Track */}
            <div className="relative flex items-center w-full px-12 pt-12">
              <div className="absolute left-12 right-12 h-0.5 timeline-track opacity-30"></div>
              <div className="absolute left-12 h-1 bg-primary rounded-full" style={{ width: "35%" }}></div>
              <div className="flex justify-between w-full relative">
                {/* Week 1 */}
                <div className="flex flex-col items-center gap-6 cursor-pointer">
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-primary dot-glow z-10 relative border-4 border-surface-container-lowest"></div>
                    <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-widest text-primary font-bold mb-1">Week 1</span>
                    <p className="font-[Manrope] text-on-surface text-sm font-medium">Nausea &amp; Fatigue</p>
                  </div>
                </div>
                {/* Week 4 */}
                <div className="flex flex-col items-center gap-6 cursor-pointer group/node">
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-primary-container z-10 relative border-4 border-surface-container-lowest group-hover/node:scale-125 transition-transform"></div>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Week 4</span>
                    <p className="font-[Manrope] text-on-surface text-sm font-medium">Energy returning</p>
                  </div>
                </div>
                {/* Month 3 */}
                <div className="flex flex-col items-center gap-6 cursor-pointer group/node">
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-surface-container-highest z-10 relative border-4 border-surface-container-lowest group-hover/node:scale-125 transition-transform"></div>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Month 3</span>
                    <p className="font-[Manrope] text-on-surface text-sm font-medium">Full Recovery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-outline-variant/10">
              <div className="col-span-2">
                <h3 className="font-[Manrope] text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  Where you are now
                </h3>
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 leading-relaxed text-on-surface-variant">
                  Based on your latest <strong>Trace</strong> data, you are currently entering the transition from acute
                  phase to regenerative recovery. Expect appetite stability to improve by <strong>Tuesday</strong>. The
                  mild nausea reported in your morning logs is typical for post-treatment Day 14. Your systemic markers
                  show a 12% improvement in oxygenation.
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4 bg-primary-container p-6 rounded-2xl text-on-primary-container shadow-lg shadow-primary/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <span className="text-sm uppercase tracking-widest font-bold">Next Milestone</span>
                </div>
                <p className="font-[Manrope] text-2xl">Phase 2: Metabolic Alignment</p>
                <p className="text-sm opacity-90">In approximately 11 days, cellular regeneration will peak. Keep hydration levels at &gt;2.5L.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Recovery Coefficient */}
          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 flex flex-col gap-6 antigravity-shadow">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Recovery Coefficient</span>
                <h4 className="font-[Manrope] text-3xl font-light">0.84 <span className="text-sm font-normal text-primary">/ 1.0</span></h4>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">OPTIMAL</span>
            </div>
            <div className="h-24 flex items-end gap-1 px-2">
              {[50, 66, 75, 50, 80, 100, 33].map((h, i) => (
                <div key={i} className={`flex-1 bg-primary/${i === 5 ? "100" : (20 + i * 10)} rounded-t-sm`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant">Real-time sync from BioCore API: 14:02 UTC</p>
          </div>

          {/* Neural Drift */}
          <div className="bg-surface-container-low p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 border border-outline-variant/5">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">psychiatry</span>
            </div>
            <h5 className="font-[Manrope] text-lg font-medium">Neural Drift</h5>
            <p className="text-3xl font-light text-primary">LOW</p>
          </div>

          {/* Simulation Mode */}
          <div className="bg-on-surface p-8 rounded-[2rem] flex flex-col gap-6 text-white overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">analytics</span>
            </div>
            <h5 className="font-[Manrope] text-xl font-light">Simulation Mode</h5>
            <p className="text-sm text-surface-variant leading-relaxed">
              Adjust your caloric intake to see projected recovery acceleration.
            </p>
            <button className="mt-auto w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-colors">
              Start Simulator
            </button>
          </div>
        </div>
      </main>

      <FAB />
    </div>
  );
}
