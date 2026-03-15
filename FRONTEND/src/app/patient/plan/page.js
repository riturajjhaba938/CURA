"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

// ─── Helpers ───────────────────────────────────────────────

function fmtDate(d, opts) {
  return new Date(d).toLocaleDateString("en-IN", opts || { month: "short", day: "numeric", year: "numeric" });
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
}

// ─── Dynamic phase generator ──────────────────────────────

function buildPhases(createdAt) {
  const regDate = new Date(createdAt || Date.now());
  const now = new Date();
  const daysSinceJoined = daysBetween(regDate, now);

  const phases = [
    {
      title: "Starting Out",
      desc: "Focused on stabilization and baseline measurements.",
      advice: "Rest well, stay hydrated, and attend all initial screenings.",
      tags: ["Baseline Tests", "Rest"],
      durationDays: 14,
      icon: "flag",
    },
    {
      title: "Building Strength",
      desc: 'This phase focuses on "Active Rest." You might feel slight fatigue in the afternoons, but your morning vitals should be looking stronger.',
      advice: "Gentle daily walks and consistent hydration are key.",
      tags: ["Daily Walks", "Hydration+"],
      durationDays: 30,
      icon: "fitness_center",
    },
    {
      title: "Active Treatment",
      desc: "Targeted therapy regimen with weekly monitoring and dosage optimization based on your biomarkers.",
      advice: "Follow prescribed medication schedule strictly. Report any unusual side effects.",
      tags: ["Medication", "Weekly Labs"],
      durationDays: 45,
      icon: "medication",
    },
    {
      title: "Consolidation",
      desc: "Reinforcing gains with adjusted treatment. Cognitive and physical load is being gradually increased.",
      advice: "Incorporate light exercises and maintain consistent sleep schedule.",
      tags: ["Light Exercise", "Sleep Hygiene"],
      durationDays: 30,
      icon: "psychology",
    },
    {
      title: "The Final Stretch",
      desc: "Gradually reintroduce high-intensity activity and finalize your maintenance plan.",
      advice: "You're almost there! Stay consistent with your routines.",
      tags: ["Full Activity", "Maintenance Plan"],
      durationDays: 60,
      icon: "emoji_events",
    },
  ];

  let cumDays = 0;
  return phases.map((phase) => {
    const phaseStart = cumDays;
    const phaseEnd = cumDays + phase.durationDays;
    cumDays = phaseEnd;

    const startDate = addDays(regDate, phaseStart);
    const endDate = addDays(regDate, phaseEnd);

    let status, progress, dateLabel;
    if (daysSinceJoined >= phaseEnd) {
      status = "completed";
      progress = 100;
      dateLabel = `Completed ${fmtDate(endDate, { month: "short", day: "numeric" })}`;
    } else if (daysSinceJoined >= phaseStart) {
      status = "active";
      const elapsed = daysSinceJoined - phaseStart;
      progress = Math.min(Math.round((elapsed / phase.durationDays) * 100), 99);
      dateLabel = `${progress}% — ${phase.durationDays - (daysSinceJoined - phaseStart)} days remaining`;
    } else {
      status = "upcoming";
      progress = 0;
      dateLabel = `Starting ${fmtDate(startDate, { month: "short", day: "numeric" })}`;
    }

    return { ...phase, status, progress, dateLabel, startDate, endDate };
  });
}

// ─── Dynamic side effects based on active phase ───────────

function getSideEffects(phases) {
  const activeIdx = phases.findIndex(p => p.status === "active");
  const idx = activeIdx >= 0 ? activeIdx : 0;

  const sideEffectSets = [
    [ { name: "Mild Fatigue", icon: "bolt", severity: 2 }, { name: "Dizziness", icon: "sync_problem", severity: 1 } ],
    [ { name: "Fatigue", icon: "bolt", severity: 2 }, { name: "Mild Nausea", icon: "waves", severity: 1 } ],
    [ { name: "Dry Mouth", icon: "water_drop", severity: 2 }, { name: "Headache", icon: "neurology", severity: 1 }, { name: "Appetite Change", icon: "restaurant", severity: 1 } ],
    [ { name: "Joint Stiffness", icon: "accessibility_new", severity: 1 }, { name: "Mild Fatigue", icon: "bolt", severity: 1 } ],
    [ { name: "Mild Soreness", icon: "fitness_center", severity: 1 } ],
  ];

  return sideEffectSets[Math.min(idx, sideEffectSets.length - 1)];
}

// ─── Dynamic daily routine based on active phase ──────────

function getDailyRoutine(phases) {
  const activeIdx = phases.findIndex(p => p.status === "active");
  const idx = activeIdx >= 0 ? activeIdx : 0;

  const routineSets = [
    [ { task: "Morning vitals check", time: "7:00 AM" }, { task: "10 min breathing exercise", time: "8:00 AM" }, { task: "Log meals & water intake", time: "Throughout day" } ],
    [ { task: "Morning meds", time: "8:00 AM" }, { task: "15 min stretching session", time: "10:00 AM" }, { task: "Evening meditation", time: "8:00 PM" } ],
    [ { task: "Take prescribed medication", time: "8:00 AM" }, { task: "20 min light walk", time: "11:00 AM" }, { task: "Hydration check (2L goal)", time: "Throughout day" }, { task: "Log side effects", time: "9:00 PM" } ],
    [ { task: "Morning stretches", time: "7:30 AM" }, { task: "30 min exercise", time: "10:00 AM" }, { task: "Mindfulness session", time: "6:00 PM" }, { task: "Sleep by 10:30 PM", time: "10:30 PM" } ],
    [ { task: "Full workout routine", time: "7:00 AM" }, { task: "Review maintenance plan", time: "12:00 PM" }, { task: "Gratitude journaling", time: "9:00 PM" } ],
  ];

  return routineSets[Math.min(idx, routineSets.length - 1)];
}

// ─── Component ────────────────────────────────────────────

export default function PatientPlan() {
  const [user, setUser] = useState(null);
  const [phases, setPhases] = useState([]);
  const [checkedRoutines, setCheckedRoutines] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      const uData = parsed.user || parsed;
      setUser(uData);
      setPhases(buildPhases(uData.createdAt));
    } else {
      setPhases(buildPhases(null));
    }

    // Load checked routines from localStorage
    const savedChecks = localStorage.getItem("dailyRoutineChecks");
    if (savedChecks) {
      const parsed = JSON.parse(savedChecks);
      // Reset if it's a new day
      if (parsed.date !== new Date().toDateString()) {
        localStorage.removeItem("dailyRoutineChecks");
      } else {
        setCheckedRoutines(parsed.checks || {});
      }
    }
  }, []);

  const toggleRoutine = (idx) => {
    const updated = { ...checkedRoutines, [idx]: !checkedRoutines[idx] };
    setCheckedRoutines(updated);
    localStorage.setItem("dailyRoutineChecks", JSON.stringify({
      date: new Date().toDateString(),
      checks: updated,
    }));
  };

  const firstName = user?.name?.split(" ")[0] || "there";
  const activePhase = phases.find(p => p.status === "active");
  const activeIndex = phases.findIndex(p => p.status === "active");
  const completedCount = phases.filter(p => p.status === "completed").length;
  const overallProgress = phases.length > 0
    ? Math.round(phases.reduce((acc, p) => acc + (p.status === "completed" ? 100 : p.progress), 0) / phases.length)
    : 0;

  const sideEffects = getSideEffects(phases);
  const dailyRoutine = getDailyRoutine(phases);

  // Dynamic date range for the header
  const dateRangeLabel = phases.length > 0
    ? `${fmtDate(phases[0].startDate, { month: "short" })} – ${fmtDate(phases[phases.length - 1].endDate, { month: "short", year: "numeric" })}`
    : "";

  // Days until next phase transition
  const daysUntilNext = activePhase
    ? daysBetween(new Date(), activePhase.endDate)
    : 0;

  return (
    <>
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 space-y-12">
        {/* Hero Header */}
        <header className="grid lg:grid-cols-3 gap-8 items-end">
          <div className="lg:col-span-2 space-y-4">
            <span className="text-primary font-bold tracking-widest text-xs uppercase">Your Recovery Status</span>
            <h1 className="font-[Manrope] text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
              You&apos;re doing <span className="text-primary">{overallProgress >= 70 ? "excellent" : overallProgress >= 40 ? "great" : "well"}</span>, {firstName}.
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
              You&apos;ve completed {overallProgress}% of your treatment plan.
              {activePhase && ` Currently in the "${activePhase.title}" phase with ${daysUntilNext} days remaining.`}
            </p>
          </div>
          <div className="glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-2 ghost-border">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-high" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * overallProgress / 100)}
                  strokeWidth="8"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-[Manrope] text-xl font-bold text-on-surface">{overallProgress}%</div>
            </div>
            <p className="font-bold text-on-surface pt-2">
              Phase {activeIndex >= 0 ? activeIndex + 1 : completedCount}: {activePhase?.title || "Complete"}
            </p>
            <p className="text-xs text-on-surface-variant">
              {activePhase ? `${daysUntilNext} days until next review` : "All phases completed!"}
            </p>
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
                {dateRangeLabel}
              </span>
            </div>

            <div className="space-y-10 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-surface-container-high before:h-full">
              {phases.map((phase) => {
                const isCompleted = phase.status === "completed";
                const isActive = phase.status === "active";
                const isUpcoming = phase.status === "upcoming";

                return (
                  <div key={phase.title} className="relative pl-12">
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-secondary-container" :
                      isActive ? "bg-primary shadow-lg shadow-primary/20" :
                      "bg-surface-container-high"
                    }`}>
                      <span
                        className={`material-symbols-outlined text-sm ${
                          isCompleted ? "text-primary" : isActive ? "text-on-primary" : "text-on-surface-variant"
                        }`}
                        style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        {isCompleted ? "check" : isActive ? "fiber_manual_record" : "schedule"}
                      </span>
                    </div>

                    {/* Content */}
                    {isActive ? (
                      <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
                        <h3 className="font-[Manrope] font-bold text-on-surface">{phase.title}</h3>
                        <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">{phase.desc}</p>
                        {phase.tags && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {phase.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-semibold text-primary">{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4">
                          <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                            <span>Progress</span>
                            <span className="text-primary">{phase.dateLabel}</span>
                          </div>
                          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${phase.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={isCompleted ? "opacity-50" : ""}>
                        <h3 className="font-[Manrope] font-bold text-on-surface">{phase.title}</h3>
                        <p className="text-on-surface-variant text-sm mt-1">{phase.dateLabel}. {phase.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Column */}
          <div className="md:col-span-4 space-y-6">
            {/* Today's Date Banner */}
            <div className="bg-primary/5 rounded-xl p-4 flex items-center gap-3 border border-primary/10">
              <span className="material-symbols-outlined text-primary">today</span>
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Today</p>
                <p className="text-sm font-semibold text-on-surface">
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Side Effects — Dynamic */}
            <div className="bg-surface-container-lowest rounded-xl p-6 ghost-border">
              <h2 className="font-[Manrope] font-bold text-on-surface mb-1">Side Effects</h2>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-5">
                Expected for {activePhase?.title || "current phase"}
              </p>
              <div className="space-y-5">
                {sideEffects.map((effect) => (
                  <div key={effect.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        effect.severity >= 2 ? "bg-error-container/30" : "bg-primary-container/10"
                      }`}>
                        <span className={`material-symbols-outlined ${effect.severity >= 2 ? "text-error" : "text-primary"}`}>{effect.icon}</span>
                      </div>
                      <span className="text-sm font-medium">{effect.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-4 h-1 rounded-full ${i <= effect.severity ? "bg-primary" : "bg-surface-container-high"}`}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 rounded-lg text-xs font-bold text-primary hover:bg-surface-container-low transition-colors uppercase tracking-wider">
                Log New Feeling
              </button>
            </div>

            {/* Daily Routine — Interactive + Dynamic */}
            <div className="bg-surface-container-low rounded-xl p-6 ghost-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[Manrope] font-bold text-on-surface">Daily Routine</h2>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {Object.values(checkedRoutines).filter(Boolean).length}/{dailyRoutine.length} done
                </span>
              </div>
              <ul className="space-y-4">
                {dailyRoutine.map((item, idx) => {
                  const checked = checkedRoutines[idx];
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <button
                        onClick={() => toggleRoutine(idx)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          checked
                            ? "bg-primary border-primary"
                            : "border-outline-variant hover:border-primary"
                        }`}
                      >
                        {checked && (
                          <span className="material-symbols-outlined text-[14px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                        )}
                      </button>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${checked ? "text-on-surface-variant line-through opacity-60" : "text-on-surface"}`}>
                          {item.task}
                        </span>
                        <p className="text-[10px] text-on-surface-variant">{item.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* Progress indicator */}
              <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${dailyRoutine.length > 0 ? (Object.values(checkedRoutines).filter(Boolean).length / dailyRoutine.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
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
              <p className="text-on-primary/80 text-sm mb-6">
                We&apos;ll bring these up at your next appointment.
              </p>
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
              {/* Generate bars from the last 7 days dynamically */}
              {Array.from({ length: 7 }, (_, i) => {
                // Create a pseudo-random but consistent bar height based on the day
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const seed = d.getDate() * 13 + d.getMonth() * 7 + (overallProgress || 50);
                const h = 30 + (seed % 60); // 30-89% range
                return (
                  <div key={i} className="w-full bg-surface-container-high rounded-full relative" style={{ height: `${h}%` }}>
                    <div className={`absolute inset-0 rounded-full ${
                      h >= 75 ? "bg-primary shadow-lg shadow-primary/30" : "bg-primary/60"
                    }`}></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 px-2">
              {/* Show actual last 7 day names */}
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
                const isToday = i === 6;
                return (
                  <span key={i} className={`text-[10px] uppercase font-bold ${isToday ? "text-primary" : "text-on-surface-variant"}`}>
                    {dayName}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer brand="MedIntel" />
    </>
  );
}
