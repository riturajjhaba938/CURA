"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

// Dynamically generate recovery phases based on user registration date
function generateRecoveryPhases(createdAt, drugContext) {
  const regDate = new Date(createdAt || Date.now());
  const now = new Date();
  const daysSinceJoined = Math.floor((now - regDate) / (1000 * 60 * 60 * 24));

  const conditionName = drugContext || "Synaptic Fatigue Syndrome";

  // Define 5 phases with durations in days
  const phases = [
    {
      title: "Initial Assessment",
      desc: `Comprehensive baseline evaluation and ${conditionName} screening.`,
      durationDays: 7,
      icon: "fact_check",
    },
    {
      title: "Diagnostic Deep-Dive",
      desc: "Advanced biomarker analysis, cognitive mapping, and voice trace profiling.",
      durationDays: 21,
      icon: "biotech",
    },
    {
      title: "Active Treatment",
      desc: `Targeted therapy regimen for ${conditionName} with weekly monitoring.`,
      durationDays: 60,
      icon: "medication",
    },
    {
      title: "Recovery & Rehabilitation",
      desc: "Neural reintegration exercises, speech therapy, and lifestyle coaching.",
      durationDays: 90,
      icon: "self_improvement",
    },
    {
      title: "Long-term Wellness",
      desc: "Maintenance monitoring, preventive care, and community support integration.",
      durationDays: 365,
      icon: "favorite",
    },
  ];

  let cumulativeDays = 0;
  return phases.map((phase, index) => {
    const phaseStart = cumulativeDays;
    const phaseEnd = cumulativeDays + phase.durationDays;
    cumulativeDays = phaseEnd;

    let status, progress, dateLabel;
    const startDate = new Date(regDate);
    startDate.setDate(startDate.getDate() + phaseStart);
    const endDate = new Date(regDate);
    endDate.setDate(endDate.getDate() + phaseEnd);

    if (daysSinceJoined >= phaseEnd) {
      status = "Completed";
      progress = 100;
      dateLabel = startDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    } else if (daysSinceJoined >= phaseStart) {
      status = "In Progress";
      const elapsed = daysSinceJoined - phaseStart;
      progress = Math.min(Math.round((elapsed / phase.durationDays) * 100), 99);
      dateLabel = `${progress}% complete`;
    } else {
      status = "Upcoming";
      progress = 0;
      dateLabel = `Target: ${endDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`;
    }

    return { ...phase, status, progress, dateLabel, index };
  });
}

// Get greeting based on time of day
function getGreeting() {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 17) return "Good afternoon";
  return "Good evening";
}

// Get current month name
function getCurrentMonth() {
  return new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      const uData = parsed.user || parsed;
      setUser(uData);

      // Get drug context from last search or default
      const urlParams = new URLSearchParams(window.location.search);
      const drug = urlParams.get("drug") || "Synaptic Fatigue Syndrome";

      setPhases(generateRecoveryPhases(uData.createdAt, drug));
    } else {
      // Fallback for guests
      setPhases(generateRecoveryPhases(null, "Synaptic Fatigue Syndrome"));
    }
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";
  const activePhaseIndex = phases.findIndex(p => p.status === "In Progress");
  const overallProgress = phases.length > 0
    ? Math.round(phases.reduce((acc, p) => acc + (p.status === "Completed" ? 100 : p.progress), 0) / phases.length)
    : 0;

  return (
    <>
      <main className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-[Manrope] font-bold tracking-tight">
              {getGreeting()}, {firstName}.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl">
              {activePhaseIndex >= 0
                ? `You're currently in the "${phases[activePhaseIndex].title}" phase. Keep going!`
                : "Your recovery journey is progressing well."}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4 antigravity-float">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Member Since</p>
                <p className="text-sm font-semibold">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                    : "Today"}
                </p>
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

          {/* Neural Sync — Dynamic Progress Ring */}
          <div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-8 antigravity-float flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="opacity-20" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8"></circle>
                <circle cx="96" cy="96" fill="transparent" r="88" stroke="currentColor"
                  strokeDasharray="552.92"
                  strokeDashoffset={552.92 - (552.92 * overallProgress / 100)}
                  strokeLinecap="round" strokeWidth="8"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-[Manrope] font-black">{overallProgress}%</span>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">
                  {overallProgress >= 80 ? "Excellent" : overallProgress >= 50 ? "On Track" : "Early Stage"}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-[Manrope] font-bold">Overall Progress</h3>
              <p className="text-on-primary/80 text-sm mt-2 px-4">
                {phases.filter(p => p.status === "Completed").length} of {phases.length} phases completed
              </p>
            </div>
          </div>

          {/* Recovery Path Timeline — DYNAMIC */}
          <div className="md:col-span-12 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-[Manrope] font-bold">My Recovery Path</h2>
              <button className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
                View Detailed History <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Overall Progress Bar */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">trending_up</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-on-surface-variant uppercase tracking-widest">Overall Journey</span>
                  <span className="text-primary">{overallProgress}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Phase Cards */}
            <div className="relative flex flex-col md:flex-row gap-6 justify-between pt-12">
              <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-surface-container-high z-0"></div>
              {phases.map((phase) => {
                const isActive = phase.status === "In Progress";
                const isCompleted = phase.status === "Completed";
                const isUpcoming = phase.status === "Upcoming";

                return (
                  <div key={phase.title} className={`relative z-10 p-6 rounded-xl flex-1 transition-all duration-300 ${
                    isUpcoming
                      ? "bg-surface-container-low border-t-4 border-outline-variant/30 opacity-50"
                      : "bg-surface-container-lowest antigravity-float border-t-4 " + (isActive ? "border-primary shadow-lg shadow-primary/5" : "border-primary/20")
                  }`}>
                    {/* Phase Dot */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden md:block">
                      <div className={`w-6 h-6 rounded-full border-4 border-surface ${
                        isActive ? "bg-primary animate-pulse" :
                        isCompleted ? "bg-primary ring-4 ring-primary/10" :
                        "bg-outline-variant"
                      }`}></div>
                    </div>

                    <div className="space-y-3">
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-base ${
                          isCompleted ? "text-emerald-500" : isActive ? "text-primary" : "text-on-surface-variant"
                        }`} style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}>
                          {isCompleted ? "check_circle" : isActive ? phase.icon : "radio_button_unchecked"}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          isCompleted ? "text-emerald-500" : isActive ? "text-primary" : "text-on-surface-variant"
                        }`}>
                          {phase.status}
                        </span>
                      </div>

                      <h4 className="font-[Manrope] font-bold text-lg">{phase.title}</h4>
                      <p className="text-sm text-on-surface-variant">{phase.desc}</p>

                      {/* Progress Bar (only for active and completed phases) */}
                      {(isActive || isCompleted) && (
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                            style={{ width: `${phase.progress}%` }}
                          ></div>
                        </div>
                      )}

                      {/* Date or Progress Label */}
                      <p className={`text-xs font-medium ${isActive ? "text-primary" : "text-on-surface-variant/60"}`}>
                        {phase.dateLabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report CTA — Dynamic Month */}
          <div className="md:col-span-12">
            <div className="bg-surface-container-high rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="space-y-2 z-10">
                <h2 className="text-2xl font-[Manrope] font-bold">Comprehensive Analysis Ready</h2>
                <p className="text-on-surface-variant">
                  Download your detailed {getCurrentMonth()} health report including all biometric trends and doctor notes.
                </p>
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
