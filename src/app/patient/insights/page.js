import Footer from "@/components/Footer";

export default function PatientInsights() {
  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-semibold mb-4 tracking-wide uppercase">
              Voice Trace Analysis
            </div>
            <h1 className="text-5xl md:text-6xl font-[Manrope] font-extrabold tracking-tight mb-4">How you&apos;re sounding</h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
              Your vocal signature shows healthy progress. Today, your voice carries a more resonant quality compared to last Tuesday.
            </p>
          </div>
          <div className="glass-card p-8 rounded-3xl antigravity-shadow border-none flex flex-col items-center justify-center min-w-[240px]">
            <span className="text-primary-container font-[Manrope] font-extrabold text-5xl mb-1 italic">Improving</span>
            <span className="text-on-surface-variant text-sm uppercase tracking-widest">Overall Trend</span>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          {/* Vocal Consistency */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-[2.5rem] p-10 antigravity-shadow relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10">
              <h3 className="text-2xl font-[Manrope] font-bold mb-2">Vocal Consistency</h3>
              <p className="text-on-surface-variant text-sm mb-8">A snapshot of your voice stability over the last 24 hours.</p>
            </div>
            {/* Waveform */}
            <div className="relative h-48 flex items-center justify-center gap-1">
              {[16, 24, 32, 44, 36, 48, 32, 24, 12, 16, 32, 40, 28, 16].map((h, i) => (
                <div key={i} className={`w-2 rounded-full ${i >= 3 && i <= 6 || i === 11 ? "voice-wave-gradient" : `bg-primary-container/${(i % 3 + 2) * 10}`}`} style={{ height: `${h * 4}px` }}></div>
              ))}
            </div>
            <div className="flex justify-between items-center relative z-10 pt-8 border-t border-surface-container-high">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-sm font-medium">Morning: 84% Stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-fixed-dim"></span>
                  <span className="text-sm font-medium">Evening: 79% Stable</span>
                </div>
              </div>
              <span className="text-xs text-on-surface-variant italic">Last updated: 2 minutes ago</span>
            </div>
          </div>

          {/* Fatigue */}
          <div className="md:col-span-4 bg-surface-container-low rounded-[2.5rem] p-8 flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">battery_horiz_075</span>
            </div>
            <h3 className="text-2xl font-[Manrope] font-bold mb-4">Fatigue</h3>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              We noticed a slight &quot;breathiness&quot; in your voice this afternoon. This usually means your vocal cords are asking for a short break.
            </p>
            <div className="mt-auto p-4 bg-surface-container-lowest rounded-2xl flex items-center justify-between">
              <span className="text-sm font-semibold">Intensity</span>
              <div className="flex gap-1">
                <div className="w-4 h-1.5 rounded-full bg-primary"></div>
                <div className="w-4 h-1.5 rounded-full bg-primary"></div>
                <div className="w-4 h-1.5 rounded-full bg-surface-container-high"></div>
                <div className="w-4 h-1.5 rounded-full bg-surface-container-high"></div>
              </div>
            </div>
          </div>

          {/* Clarity */}
          <div className="md:col-span-4 bg-primary text-on-primary rounded-[2.5rem] p-8 flex flex-col antigravity-shadow">
            <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-primary text-3xl">record_voice_over</span>
            </div>
            <h3 className="text-2xl font-[Manrope] font-bold mb-4">Clarity</h3>
            <p className="opacity-90 leading-relaxed mb-8">
              Your articulation is crisp. The &quot;sharpness&quot; of your consonants is currently 12% higher than your baseline average.
            </p>
            <div className="mt-auto p-4 bg-white/10 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-semibold">Rating</span>
              <span className="text-sm font-bold bg-white text-primary px-3 py-1 rounded-full uppercase tracking-tighter">Excellent</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="md:col-span-8 bg-surface-container-highest rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h3 className="text-2xl font-[Manrope] font-bold mb-4">Recommended Next Steps</h3>
              <p className="text-on-surface-variant mb-6">Based on your current voice trace, these actions will help maintain your progress.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">local_drink</span>
                  </div>
                  <div>
                    <span className="block font-bold">Hydration Window</span>
                    <span className="text-sm text-on-surface-variant">Sip 250ml of water over the next hour to reduce cord friction.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">timer</span>
                  </div>
                  <div>
                    <span className="block font-bold">Vocal Rest</span>
                    <span className="text-sm text-on-surface-variant">Try to limit continuous speaking for the next 45 minutes.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="md:w-64 bg-surface-container-lowest rounded-3xl p-6 flex flex-col items-center justify-center text-center antigravity-shadow">
              <div className="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">calendar_today</span>
              </div>
              <span className="text-sm text-on-surface-variant mb-1 font-medium">Next Formal Trace</span>
              <span className="text-xl font-bold block mb-4">Tomorrow, 9:00 AM</span>
              <button className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary-container transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer brand="MedIntel" />
    </>
  );
}
