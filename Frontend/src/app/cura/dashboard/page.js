import FAB from "@/components/FAB";

export default function CuraDashboard() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left: Patient Voice Feed (40%) */}
      <section className="w-[40%] bg-surface-bright flex flex-col overflow-hidden">
        <div className="px-8 pt-10 pb-6">
          <h2 className="font-[Manrope] text-3xl font-bold text-on-surface tracking-tight">Patient Voice Feed</h2>
          <p className="text-on-surface-variant text-sm mt-1">Real-time community discussions and lived experience.</p>
        </div>
        <div className="flex-1 overflow-y-auto px-8 space-y-8 pb-32 custom-scrollbar">
          {/* Post 1 */}
          <div className="space-y-4">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-primary">person</span>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant">r/WellnessJourney • 2h ago</span>
              </div>
              <h3 className="font-[Manrope] text-lg font-semibold leading-snug mb-2">
                Anyone else feeling extreme fatigue after the new titration?
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                I&apos;ve been on the 50mg dose for three days now. Yesterday I could barely get out of bed. My doctor
                said it&apos;s normal but I&apos;m worried...
              </p>
            </div>
            <div className="bg-primary-container/10 border-l-4 border-primary p-4 rounded-r-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Plain Language Summary</span>
              </div>
              <p className="text-sm text-on-primary-container font-medium">
                Patients frequently report &quot;heavy fatigue&quot; during the first week of dose increases. Most users suggest
                taking the dose before bed to manage daytime sleepiness.
              </p>
            </div>
          </div>

          {/* Post 2 */}
          <div className="space-y-4">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-primary">person</span>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant">r/BioHackers • 5h ago</span>
              </div>
              <h3 className="font-[Manrope] text-lg font-semibold leading-snug mb-2">
                Magnesium Threonate and Brain Fog: My 30-day trial
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Tracking my metrics using Oura. Seeing a significant uptick in REM sleep but the daytime clarity is
                still hit or miss. Has anyone paired this with B-complex?
              </p>
            </div>
            <div className="bg-primary-container/10 border-l-4 border-primary p-4 rounded-r-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Plain Language Summary</span>
              </div>
              <p className="text-sm text-on-primary-container font-medium">
                The user is testing a supplement for mental clarity. Community feedback suggests B-complex might improve
                the results, but evidence is purely anecdotal.
              </p>
            </div>
          </div>

          {/* Post 3 */}
          <div className="space-y-4">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-primary">person</span>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant">r/PatientAdvocacy • 8h ago</span>
              </div>
              <h3 className="font-[Manrope] text-lg font-semibold leading-snug mb-2">
                Insurance denied the &apos;Brand A&apos; authorization again.
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Third time this month. They are pushing me towards a generic that I know gave me hives last year. How do
                I fight this?
              </p>
            </div>
            <div className="bg-primary-container/10 border-l-4 border-primary p-4 rounded-r-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Plain Language Summary</span>
              </div>
              <p className="text-sm text-on-primary-container font-medium">
                Common issue with &quot;Step Therapy&quot; policies. Recommended action: Submit a &quot;Letter of Medical Necessity&quot;
                specifically citing the allergic reaction to the generic alternative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Intelligence Modules (60%) */}
      <section className="w-[60%] bg-surface-container-low p-10 overflow-y-auto custom-scrollbar">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="font-[Manrope] text-4xl font-bold text-on-surface tracking-tight">Intelligence Modules</h2>
            <p className="text-on-surface-variant mt-2">High-fidelity clinical synthesis and predictive modeling.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-widest uppercase rounded-full">Live Monitor</span>
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-widest uppercase rounded-full">Secure Node</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Module 1: Biomarker Correlation */}
          <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">insights</span>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-container/20 px-2 py-1 rounded">Optimal</span>
              </div>
              <h4 className="font-[Manrope] text-xl font-bold mb-2 text-on-surface">Biomarker Correlation</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Analyzing serum levels against reported cognitive fluctuations.</p>
            </div>
            <div className="mt-8">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-[Manrope] font-extrabold text-on-surface">0.84</span>
                <span className="text-xs text-primary font-bold">+12% vs Baseline</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[84%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Module 2: Efficacy Projection */}
          <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-tertiary text-3xl">target</span>
                <span className="text-[10px] font-bold tracking-widest text-tertiary uppercase bg-tertiary-fixed/30 px-2 py-1 rounded">Stable</span>
              </div>
              <h4 className="font-[Manrope] text-xl font-bold mb-2 text-on-surface">Efficacy Projection</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Predicting therapeutic outcome based on current adherence.</p>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-12 bg-surface-container-high rounded-lg"></div>
              <div className="text-right">
                <span className="block text-2xl font-[Manrope] font-extrabold text-on-surface">94%</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Confidence</span>
              </div>
            </div>
          </div>

          {/* Module 3: Protocol Integrity */}
          <div className="col-span-2 glass-card p-8 rounded-[2rem] relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
              <div className="max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">System Verified</span>
                </div>
                <h4 className="font-[Manrope] text-3xl font-bold mb-4 text-on-surface leading-tight">Protocol Integrity Check</h4>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                  Cross-referencing 4,200 clinical nodes against the user&apos;s specific metabolic profile for safety clearance.
                </p>
                <button className="px-8 py-4 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-all shadow-xl shadow-primary/20">
                  Review Analysis
                </button>
              </div>
              <div className="hidden md:block w-48 h-48 bg-primary/10 rounded-[2rem] shadow-2xl rotate-3"></div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </section>

      {/* Floating BS Meter */}
      <div className="fixed bottom-12 right-12 z-50">
        <div className="glass-card p-6 rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="relative w-40 h-24 mb-2 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 60">
              <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e0e3e5" strokeLinecap="round" strokeWidth="8"></path>
              <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#007b83" strokeLinecap="round" strokeWidth="8" strokeDasharray="126" strokeDashoffset="10" className="animate-pulse"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <span className="text-3xl font-[Manrope] font-black text-primary leading-none">92%</span>
              <span className="text-[8px] font-bold tracking-tighter text-on-surface-variant uppercase">FDA Alignment</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">BS Meter Active</span>
          </div>
        </div>
      </div>

      {/* View All Sources FAB */}
      <button className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-8 h-14 bg-on-surface text-surface rounded-full shadow-2xl hover:scale-105 transition-transform active:scale-95 group">
        <span className="material-symbols-outlined text-primary-fixed">list</span>
        <span className="text-sm font-bold tracking-wide">View All Sources</span>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2"></div>
      </button>
    </div>
  );
}
