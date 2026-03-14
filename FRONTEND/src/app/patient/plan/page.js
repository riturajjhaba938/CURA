import Footer from "@/components/Footer";

export default function PatientPlan() {
  return (
    <>
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 space-y-12">
        {/* Hero Header */}
        <header className="grid lg:grid-cols-3 gap-8 items-end">
          <div className="lg:col-span-2 space-y-4">
            <span className="text-primary font-bold tracking-widest text-xs uppercase">Your Recovery Status</span>
            <h1 className="font-[Manrope] text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
              You&apos;re doing <span className="text-primary">excellent</span>, Sarah.
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
              You&apos;ve completed 65% of your treatment plan. Your energy levels are trending upward compared to last week.
            </p>
          </div>
          <div className="glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-2 ghost-border">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-high" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="87.9" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-[Manrope] text-xl font-bold text-on-surface">65%</div>
            </div>
            <p className="font-bold text-on-surface pt-2">Phase 2: Consolidation</p>
            <p className="text-xs text-on-surface-variant">4 days until next review</p>
          </div>
        </header>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* What to Expect Timeline */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 ghost-border space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-[Manrope] text-2xl font-bold text-on-surface">What to expect</h2>
              <span className="text-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                June - August 2024
              </span>
            </div>

            <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-surface-container-high before:h-full">
              {/* Past Milestone */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <div>
                  <h3 className="font-[Manrope] font-bold text-on-surface opacity-50">Starting Out</h3>
                  <p className="text-on-surface-variant text-sm mt-1 opacity-50">Focused on stabilization and baseline measurements. Completed June 12.</p>
                </div>
              </div>

              {/* Current Milestone */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>fiber_manual_record</span>
                </div>
                <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
                  <h3 className="font-[Manrope] font-bold text-on-surface">Building Strength</h3>
                  <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
                    This week we focus on &quot;Active Rest.&quot; You might feel slight fatigue in the afternoons,
                    but your morning vitals are looking much stronger.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-semibold text-primary">Daily Walks</span>
                    <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-semibold text-primary">Hydration+</span>
                  </div>
                </div>
              </div>

              {/* Future Milestone */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
                </div>
                <div>
                  <h3 className="font-[Manrope] font-bold text-on-surface">The Final Stretch</h3>
                  <p className="text-on-surface-variant text-sm mt-1">Starting July 15. We&apos;ll gradually reintroduce high-intensity activity and finalize your maintenance plan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="md:col-span-4 space-y-6">
            {/* Side Effects */}
            <div className="bg-surface-container-lowest rounded-xl p-6 ghost-border">
              <h2 className="font-[Manrope] font-bold text-on-surface mb-6">Side Effects</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-error-container/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-error">bolt</span>
                    </div>
                    <span className="text-sm font-medium">Fatigue</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-1 rounded-full bg-primary"></div>
                    <div className="w-4 h-1 rounded-full bg-primary"></div>
                    <div className="w-4 h-1 rounded-full bg-surface-container-high"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">waves</span>
                    </div>
                    <span className="text-sm font-medium">Mild Nausea</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-1 rounded-full bg-primary"></div>
                    <div className="w-4 h-1 rounded-full bg-surface-container-high"></div>
                    <div className="w-4 h-1 rounded-full bg-surface-container-high"></div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2 rounded-lg text-xs font-bold text-primary hover:bg-surface-container-low transition-colors uppercase tracking-wider">
                Log New Feeling
              </button>
            </div>

            {/* Daily Routine */}
            <div className="bg-surface-container-low rounded-xl p-6 ghost-border">
              <h2 className="font-[Manrope] font-bold text-on-surface mb-4">Daily Routine</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <button className="mt-1 w-5 h-5 rounded border-2 border-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                  </button>
                  <span className="text-sm text-on-surface-variant line-through opacity-60">Morning meds (8:00 AM)</span>
                </li>
                <li className="flex items-start gap-3">
                  <button className="mt-1 w-5 h-5 rounded border-2 border-outline-variant hover:border-primary transition-colors flex items-center justify-center"></button>
                  <span className="text-sm text-on-surface font-medium">15 min stretching session</span>
                </li>
                <li className="flex items-start gap-3">
                  <button className="mt-1 w-5 h-5 rounded border-2 border-outline-variant hover:border-primary transition-colors flex items-center justify-center"></button>
                  <span className="text-sm text-on-surface font-medium">Evening meditation</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Questions + Health Pulse */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Questions for Doctor */}
          <div className="bg-primary text-on-primary rounded-xl p-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="font-[Manrope] text-2xl font-bold mb-2">Questions for my Doctor</h2>
              <p className="text-on-primary/80 text-sm mb-6">We&apos;ll bring these up at your next appointment on Tuesday.</p>
              <div className="space-y-3">
                <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                  <span className="text-sm font-medium italic">&quot;Is the increased heart rate normal after the walk?&quot;</span>
                  <span className="material-symbols-outlined text-sm opacity-60 group-hover:opacity-100">close</span>
                </div>
                <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                  <span className="text-sm font-medium italic">&quot;Can I increase the dosage of Vitamin D?&quot;</span>
                  <span className="material-symbols-outlined text-sm opacity-60 group-hover:opacity-100">close</span>
                </div>
                <div className="mt-4 pt-2">
                  <div className="flex gap-2">
                    <input className="flex-grow bg-white/5 border-none rounded-lg text-sm placeholder:text-white/40 focus:ring-2 focus:ring-white/30 text-white px-4 py-2" placeholder="Type a new question..." type="text" />
                    <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest">Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Pulse */}
          <div className="bg-surface-container-lowest rounded-xl p-8 ghost-border flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-[Manrope] text-2xl font-bold text-on-surface">Health Pulse</h2>
              <div className="flex gap-2">
                <span className="text-xs bg-surface-container-high px-2 py-1 rounded">7 Days</span>
                <span className="text-xs bg-primary-container text-on-primary-container px-2 py-1 rounded">30 Days</span>
              </div>
            </div>
            <div className="flex-grow flex items-end justify-between gap-4 h-48 px-2">
              {[40, 65, 50, 85, 70, 95, 80].map((h, i) => (
                <div key={i} className="w-full bg-surface-container-high rounded-full relative" style={{ height: `${h}%` }}>
                  <div className={`absolute inset-0 rounded-full ${
                    h >= 85 ? "bg-primary shadow-lg shadow-primary/30" : `bg-primary opacity-${Math.round(h / 100 * 60 + 20)}`
                  }`}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <span key={day} className={`text-[10px] uppercase font-bold ${i === 3 || i === 5 ? "text-primary" : "text-on-surface-variant"}`}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer brand="MedIntel" />
    </>
  );
}
