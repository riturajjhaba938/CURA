import Footer from "@/components/Footer";

export default function PatientDashboard() {
  return (
    <>
      <main className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-[Manrope] font-bold tracking-tight">Good morning, Sarah.</h1>
            <p className="text-lg text-on-surface-variant max-w-xl">
              Your neural resonance is showing steady improvement since last Tuesday&apos;s session.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4 antigravity-float">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Next Checkup</p>
                <p className="text-sm font-semibold">Oct 24, 09:00 AM</p>
              </div>
            </div>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Voice Trace Card */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 antigravity-float space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">record_voice_over</span>
                <h2 className="text-xl font-[Manrope] font-bold">Recent Voice Trace Analysis</h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">Processed 2h ago</span>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl blur-lg transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary">
                <p className="text-lg leading-relaxed text-on-surface italic">
                  &quot;Your vocal clarity has increased by 14% this week. The narrative flows suggest a significant
                  reduction in cognitive load during complex sentence structuring. It sounds like you&apos;re finding
                  your rhythm again.&quot;
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {[
                { label: "Pitch Stability", width: "82%" },
                { label: "Cadence Flow", width: "64%" },
                { label: "Breath Support", width: "91%" },
              ].map((bar) => (
                <div key={bar.label} className="space-y-2">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-tighter">{bar.label}</p>
                  <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: bar.width }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neural Sync */}
          <div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-8 antigravity-float flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="opacity-20" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8"></circle>
                <circle cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset="138.23" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-[Manrope] font-black">75%</span>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Optimal</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-[Manrope] font-bold">Neural Sync</h3>
              <p className="text-on-primary/80 text-sm mt-2 px-4">Your brain-to-body signaling is within the recovery target zone.</p>
            </div>
          </div>

          {/* Recovery Path Timeline */}
          <div className="md:col-span-12 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-[Manrope] font-bold">My Recovery Path</h2>
              <button className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
                View Detailed History <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="relative flex flex-col md:flex-row gap-8 justify-between pt-12">
              <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-surface-container-high z-0"></div>
              {[
                { status: "Completed", title: "Initial Diagnosis", desc: "Comprehensive cognitive and vocal baseline established.", date: "August 12, 2024", active: false, progress: null },
                { status: "In Progress", title: "Vocal Reintegration", desc: "Focusing on pitch control and breath management exercises.", date: null, active: true, progress: 60 },
                { status: "Next Phase", title: "Social Immersion", desc: "Real-world communication testing and public sessions.", date: "Target: Nov 2024", active: false, progress: null },
              ].map((item, i) => (
                <div key={item.title} className={`relative z-10 p-6 rounded-xl flex-1 ${
                  i === 2 ? "bg-surface-container-low border-t-4 border-outline-variant/30 grayscale opacity-60" :
                  "bg-surface-container-lowest antigravity-float border-t-4 " + (item.active ? "border-primary" : "border-primary/20")
                }`}>
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden md:block">
                    <div className={`w-6 h-6 rounded-full border-4 border-surface ${
                      item.active ? "bg-primary animate-pulse" : i === 0 ? "bg-primary ring-4 ring-primary/10" : "bg-outline-variant"
                    }`}></div>
                  </div>
                  <div className="space-y-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${item.active || i === 0 ? "text-primary" : "text-on-surface-variant"}`}>
                      {item.status}
                    </span>
                    <h4 className="font-[Manrope] font-bold text-lg">{item.title}</h4>
                    <p className="text-sm text-on-surface-variant">{item.desc}</p>
                    {item.progress && (
                      <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                      </div>
                    )}
                    {item.date && <p className="text-xs font-medium text-on-surface-variant/60">{item.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report CTA */}
          <div className="md:col-span-12">
            <div className="bg-surface-container-high rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="space-y-2 z-10">
                <h2 className="text-2xl font-[Manrope] font-bold">Comprehensive Analysis Ready</h2>
                <p className="text-on-surface-variant">Download your detailed October health report including all biometric trends and doctor notes.</p>
              </div>
              <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-on-surface text-surface px-8 py-4 rounded-xl font-bold hover:bg-on-surface-variant transition-all antigravity-float z-10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>file_download</span>
                Download Patient Report (PDF)
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer brand="MedIntel" />
    </>
  );
}
