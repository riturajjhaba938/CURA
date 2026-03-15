"use client";
import { useEffect, useState } from "react";

export default function BSMeterUI({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the score up on mount
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score]);

  // Determine styling and labels based on the "BS Meter" criteria
  const isHighCred = score >= 90;
  const isLowCred = score < 50;
  
  const arcColor = isHighCred ? "#10b981" : isLowCred ? "#f43f5e" : "#f59e0b";
  const label = isHighCred ? "Clinically Verified" : isLowCred ? "Caution: Anecdotal Evidence Only" : "Moderate Credibility";
  const icon = isHighCred ? "verified" : isLowCred ? "warning" : "info";

  // Calculate SVG arc path (Gauge logic)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Use half the circle for the gauge (180 degrees)
  const strokeDashoffset = circumference - ((animatedScore / 100) * (circumference / 2));

  return (
    <div className="p-6 glass-card rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute w-24 h-24 blur-2xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700"
        style={{ backgroundColor: arcColor }}
      ></div>
      
      <h4 className="font-[Manrope] font-bold text-on-surface mb-6 z-10">Credibility Meter</h4>
      
      {/* Gauge SVG */}
      <div className="relative w-40 h-24 flex justify-center z-10">
        <svg className="w-40 h-40 transform rotate-[135deg]">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-surface-container-highest"
            strokeDasharray={circumference}
            strokeDashoffset={circumference / 2}
            strokeLinecap="round"
          />
          {/* Animated Fill */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={arcColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Text */}
        <div className="absolute top-10 flex flex-col items-center justify-center">
          <span className="text-3xl font-[Manrope] font-extrabold" style={{ color: arcColor }}>
            {Math.round(animatedScore)}<span className="text-xl opacity-50">%</span>
          </span>
        </div>
      </div>

      {/* Badge / Label below */}
      <div 
        className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full border border-opacity-20 z-10 transition-all font-semibold text-sm"
        style={{ backgroundColor: `${arcColor}15`, color: arcColor, borderColor: arcColor }}
      >
        <span className="material-symbols-outlined text-lg leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
        {label}
      </div>
    </div>
  );
}
