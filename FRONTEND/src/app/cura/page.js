"use client";
import { useState } from "react";
import Footer from "@/components/Footer";
import FAB from "@/components/FAB";

export default function CuraSearchDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ medication: searchQuery })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze treatment");
      }

      // Proactively navigate to treatment or show result
      console.log("Analysis Result:", result);
      window.location.href = `/cura/treatment?drug=${encodeURIComponent(searchQuery)}`;

    } catch (err) {
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <main className="pb-24 px-6 relative flex flex-col items-center">
        {/* Background blurs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-fixed-dim opacity-10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary-container opacity-20 blur-[100px] rounded-full pointer-events-none animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-float"></div>

        {/* Hero Section */}
        <section className="w-full max-w-6xl flex flex-col items-center text-center relative z-10 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full mb-8 animate-fadeInDown">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
              Intelligence Engine v2.4
            </span>
          </div>

          <h1 className="font-[Manrope] text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-6 leading-[1.1] animate-fadeInUp stagger-1">
            Find truth in every <br />
            <span className="gradient-text">patient story.</span>
          </h1>

          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed animate-fadeInUp stagger-2">
            Aggregating real-world evidence and clinical data to illuminate health trajectories with surgical precision.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl relative group animate-fadeInUp stagger-3">
            <form onSubmit={handleAnalyze} className="glass-morphism rounded-full p-2 flex items-center gap-3 transition-all duration-500 hover:shadow-xl hover:scale-[1.01]">
              <div className="pl-4 text-primary">
                {isAnalyzing ? (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-2xl">search</span>
                )}
              </div>
              <input
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-base disabled:opacity-50 placeholder:text-outline-variant text-on-surface py-3"
                placeholder="Search any treatment or symptom..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isAnalyzing}
              />
              {/* Mic Icon */}
              <button type="button" title="Voice Search" className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              </button>
              {/* Analyze Button */}
              <button 
                type="submit"
                disabled={isAnalyzing}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-bold text-sm hover:bg-primary-container transition-all hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-primary/20 mr-1 disabled:opacity-70"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze"}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            {error && (
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-error text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            {/* Live Logic */}
            <div className="absolute -bottom-14 left-10 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-4 py-2 rounded-xl shadow-sm">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">Live Logic</span>
                <div className="h-4 w-[1px] bg-outline-variant"></div>
                <span className="text-sm font-medium text-on-surface-variant italic">
                  &apos;Advil&apos; → <span className="text-primary font-semibold">Ibuprofen</span>
                </span>
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="mt-28 w-full flex flex-wrap justify-center gap-4 max-w-4xl animate-fadeInUp stagger-4">
            {[
              { icon: "trending_up", label: "Long-COVID Recovery" },
              { icon: "medication", label: "Ozempic Side Effects" },
              { icon: "biotech", label: "mRNA Therapeutics" },
              { icon: "psychiatry", label: "Neuro-Regeneration" },
              { icon: "monitoring", label: "Sleep Biomarkers" },
            ].map((tag) => (
              <div
                key={tag.label}
                className="px-5 py-2.5 bg-surface-container-low border border-outline-variant/10 text-on-surface-variant rounded-full text-sm font-medium flex items-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/20 cursor-pointer transition-all hover:scale-105 hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-lg">{tag.icon}</span>
                {tag.label}
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid */}
        <section className="mt-40 w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
          {/* Patient Trajectory Mapping */}
          <div className="md:col-span-8 glass-morphism rounded-[2rem] p-10 flex flex-col justify-between min-h-[420px] hover:shadow-2xl transition-shadow duration-500 group">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block">
                Precision Diagnostics
              </span>
              <h3 className="font-[Manrope] text-3xl font-bold text-on-surface mb-6">
                Patient Trajectory Mapping
              </h3>
              <p className="text-on-surface-variant leading-relaxed text-lg max-w-xl">
                View clinical outcomes through a multi-dimensional timeline. Our proprietary AI analyzes symptom
                clusters to predict therapeutic efficacy before the first dose.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { value: "94.2%", label: "Correlation" },
                { value: "1.2s", label: "Analysis Speed" },
                { value: "8M+", label: "Data Points" },
              ].map((stat) => (
                <div key={stat.label} className="p-6 bg-surface-container-low rounded-2xl">
                  <div className="text-2xl font-[Manrope] font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Vault */}
          <div className="md:col-span-4 bg-primary rounded-[2rem] p-10 text-on-primary flex flex-col justify-between overflow-hidden relative hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <span
                className="material-symbols-outlined text-5xl mb-8"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                menu_book
              </span>
              <h3 className="font-[Manrope] text-3xl font-bold mb-4">Evidence Vault</h3>
              <p className="text-on-primary/80 leading-relaxed">
                Access the world&apos;s largest library of verified patient-led longitudinal studies and peer-reviewed
                clinical summaries.
              </p>
            </div>
            <button className="mt-8 flex items-center justify-between group relative z-10">
              <span className="font-bold text-lg">Browse Vault</span>
              <span className="material-symbols-outlined bg-white/20 p-3 rounded-full group-hover:bg-white/40 transition-colors">
                arrow_outward
              </span>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {[
              {
                icon: "dataset",
                title: "Structured Extraction",
                desc: "Converting unstructured narrative notes into high-fidelity tabular data for computational analysis.",
                bg: "bg-secondary-container",
                textColor: "text-secondary",
              },
              {
                icon: "auto_awesome",
                title: "Symptom Synthesis",
                desc: "AI-driven identification of rare symptom connections across global patient demographics.",
                bg: "bg-primary-fixed-dim",
                textColor: "text-on-primary-fixed-variant",
              },
              {
                icon: "verified",
                title: "Protocol Verification",
                desc: "Automated cross-referencing against FDA, EMA, and NIH clinical trial guidelines.",
                bg: "bg-tertiary-fixed-dim",
                textColor: "text-on-tertiary-fixed-variant",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="glass-morphism rounded-3xl p-8 hover:translate-y-[-4px] transition-all duration-300 hover:shadow-xl"
              >
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.textColor} mb-6`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <h4 className="font-[Manrope] text-xl font-bold text-on-surface mb-3">{card.title}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <FAB />
      <Footer brand="CURA" showSidePadding />
    </>
  );
}
