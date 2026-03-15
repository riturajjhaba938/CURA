"use client";
import React, { useState, useEffect } from 'react';

/**
 * ChronologicalTimeline — A visually stunning, dynamic recovery timeline.
 * Supports backend flat array format or pre-grouped data format.
 */

const PERIOD_ORDER = [
  "General", "Day 1", "Week 1", "Week 2", "Week 3",
  "Month 1", "Month 2", "Month 3", "Month 4-6", "Month 7-9", "1 Year"
];

// Color/icon configs for each severity tier
const SEVERITY_TIERS = [
  { min: 0,  max: 3,  label: "Rare",        color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",     bar: "bg-emerald-500" },
  { min: 4,  max: 8,  label: "Uncommon",    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",       bar: "bg-amber-500" },
  { min: 9,  max: 20, label: "Common",      color: "bg-orange-500/10 text-orange-500 border-orange-500/20",    bar: "bg-orange-500" },
  { min: 21, max: Infinity, label: "Expected", color: "bg-red-500/10 text-red-500 border-red-500/20",          bar: "bg-red-500" },
];

function getSeverityTier(count) {
  return SEVERITY_TIERS.find(t => count >= t.min && count <= t.max) || SEVERITY_TIERS[0];
}

function getPeriodStyle(period) {
  if (period.includes("Day") || period.includes("Week 1")) return { icon: "emergency", color: "from-red-500/20 to-orange-500/5", dot: "bg-red-500", text: "text-red-500" };
  if (period.includes("Week")) return { icon: "healing", color: "from-amber-500/20 to-orange-500/5", dot: "bg-amber-500", text: "text-amber-500" };
  if (period.includes("Month 1") || period.includes("Month 2")) return { icon: "vital_signs", color: "from-blue-500/20 to-indigo-500/5", dot: "bg-blue-500", text: "text-blue-500" };
  if (period.includes("Month")) return { icon: "energy_savings_leaf", color: "from-emerald-500/20 to-teal-500/5", dot: "bg-emerald-500", text: "text-emerald-500" };
  if (period.includes("Year")) return { icon: "emoji_events", color: "from-purple-500/20 to-fuchsia-500/5", dot: "bg-purple-500", text: "text-purple-500" };
  return { icon: "overview", color: "from-surface-container-high to-transparent", dot: "bg-on-surface-variant", text: "text-on-surface-variant" };
}

function isBackendFormat(data) {
  return data.length > 0 && data[0].week !== undefined && data[0].symptom !== undefined;
}

function groupByPeriod(flatData) {
  const groups = {};
  for (const entry of flatData) {
    const period = entry.week || "General";
    if (!groups[period]) groups[period] = { period, symptoms: [], totalReports: 0 };
    groups[period].symptoms.push({ name: entry.symptom, count: entry.count });
    groups[period].totalReports += entry.count;
  }
  return Object.values(groups).sort((a, b) => {
    const ai = PERIOD_ORDER.indexOf(a.period);
    const bi = PERIOD_ORDER.indexOf(b.period);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

export default function ChronologicalTimeline({ timelineData = [], drugName = "" }) {
  const [expandedPeriod, setExpandedPeriod] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-expand the first period that has symptoms
    if (timelineData && timelineData.length > 0) {
      const isBackend = isBackendFormat(timelineData);
      const groups = isBackend ? groupByPeriod(timelineData) : timelineData;
      if (groups.length > 0) {
        setExpandedPeriod(groups[0].period);
      }
    }
  }, [timelineData]);

  if (!timelineData || timelineData.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-surface-container-lowest rounded-3xl border border-outline-variant/10 gap-4">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant">hourglass_empty</span>
        </div>
        <div className="text-center">
          <p className="text-on-surface font-bold text-lg">No Timeline Data Found</p>
          <p className="text-sm text-on-surface-variant max-w-sm mt-1">We couldn&apos;t generate a recovery timeline for this search yet. Patient reports are still being aggregated.</p>
        </div>
      </div>
    );
  }

  const isBackend = isBackendFormat(timelineData);
  const groupedPeriods = isBackend ? groupByPeriod(timelineData) : timelineData.map(item => ({...item, symptoms: []}));

  const totalReports = groupedPeriods.reduce((sum, p) => sum + p.totalReports, 0);
  const totalSymptoms = isBackend ? new Set(timelineData.map(e => e.symptom)).size : 0;

  return (
    <div className="w-full relative">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-3xl border border-outline-variant/10 p-8 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                AI Aggregated
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Real Patient Data
              </span>
            </div>
            <h2 className="font-[Manrope] text-3xl font-extrabold text-on-surface">
              {drugName ? `Recovery Arc: ${drugName.charAt(0).toUpperCase() + drugName.slice(1)}` : "Clinical Recovery Arc"}
            </h2>
            <p className="text-on-surface-variant mt-2 max-w-xl">
              A chronological map of patient-reported side effects and milestones, synthesized from real-world community discussions.
            </p>
          </div>
          
          {totalReports > 0 && (
            <div className="flex gap-4">
              <div className="bg-surface-container-low px-5 py-3 rounded-2xl border border-outline-variant/5">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Total Reports</p>
                <p className="text-2xl font-bold text-primary">{totalReports.toLocaleString()}</p>
              </div>
              <div className="bg-surface-container-low px-5 py-3 rounded-2xl border border-outline-variant/5">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Unique Symptoms</p>
                <p className="text-2xl font-bold text-on-surface">{totalSymptoms}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Timeline Layout */}
      <div className="relative pl-6 md:pl-10">
        {/* Continuous Track */}
        <div className="absolute left-6 md:left-10 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-outline-variant/20 to-transparent"></div>

        <div className="space-y-6">
          {groupedPeriods.map((period, index) => {
            const isExpanded = expandedPeriod === period.period;
            const style = getPeriodStyle(period.period);
            const hasSymptoms = period.symptoms && period.symptoms.length > 0;
            const maxSymptomCount = hasSymptoms ? Math.max(...period.symptoms.map(s => s.count)) : 0;

            return (
              <div 
                key={period.period} 
                className={`relative pl-8 md:pl-12 transition-all duration-500 ease-out-expo ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Track Node */}
                <div className="absolute -left-2 top-6 w-4 h-4 rounded-full bg-surface-container-lowest border-4 flex items-center justify-center transition-colors duration-300 z-10"
                     style={{ borderColor: `var(--md-sys-color-${style.dot.replace('bg-', '')})` }}>
                  {isExpanded && <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`}></div>}
                </div>

                {/* Period Card */}
                <div className={`
                  group overflow-hidden rounded-3xl border transition-all duration-300
                  ${isExpanded ? 'bg-surface-container-lowest shadow-xl shadow-black/5 border-primary/20' : 'bg-surface-container-lowest/50 border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container-lowest'}
                `}>
                  {/* Card Header (Button) */}
                  <button 
                    onClick={() => hasSymptoms && setExpandedPeriod(isExpanded ? null : period.period)}
                    className="w-full text-left relative overflow-hidden"
                  >
                    {/* Dynamic Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${style.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isExpanded ? '!opacity-100' : ''}`}></div>
                    
                    <div className="relative p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-container-highest shadow-sm ${style.text}`}>
                          <span className="material-symbols-outlined text-2xl">{style.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-[Manrope] text-xl font-bold text-on-surface">{period.period}</h3>
                            {hasSymptoms && (
                              <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                {period.symptoms.length} Symptoms
                              </span>
                            )}
                          </div>
                          {!isExpanded && hasSymptoms && (
                            <p className="text-sm text-on-surface-variant mt-1 max-w-lg truncate">
                              {period.symptoms.slice(0, 4).map(s => s.name).join(' • ')}
                              {period.symptoms.length > 4 ? ` +${period.symptoms.length - 4}` : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {period.totalReports > 0 && (
                          <div className="text-right hidden sm:block">
                            <span className="text-lg font-bold text-on-surface">{period.totalReports}</span>
                            <span className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Mentions</span>
                          </div>
                        )}
                        {hasSymptoms && (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-primary text-on-primary' : 'text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'}`}>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Card Body (Expanded Symptoms) */}
                  <div className={`grid transition-all duration-500 ease-in-out ${isExpanded && hasSymptoms ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="p-6 pt-0 border-t border-outline-variant/10">
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                          {period.symptoms.sort((a,b) => b.count - a.count).map((symptom, idx) => {
                            const tier = getSeverityTier(symptom.count);
                            // Animate bar width on expand
                            const widthPercent = isExpanded ? (symptom.count / maxSymptomCount) * 100 : 0;
                            
                            return (
                              <div key={symptom.name} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-low transition-colors group/item">
                                <div className="flex-1 w-full min-w-0">
                                  <div className="flex justify-between items-end mb-2">
                                    <span className="font-semibold text-on-surface capitalize truncate pr-2">{symptom.name}</span>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span className="text-xs font-bold text-on-surface-variant">{symptom.count}</span>
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${tier.color}`}>
                                        {tier.label}
                                      </span>
                                    </div>
                                  </div>
                                  {/* Progress Bar */}
                                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-1000 ease-out-expo ${tier.bar}`}
                                      style={{ width: `${widthPercent}%`, transitionDelay: `${idx * 50}ms` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend Footer */}
      <div className="mt-8 pt-6 border-t border-outline-variant/10 flex flex-wrap items-center justify-center gap-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Frequency Scale:</span>
        {SEVERITY_TIERS.map(tier => (
          <div key={tier.label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${tier.bar}`}></span>
            <span className="text-xs font-semibold text-on-surface-variant">{tier.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
