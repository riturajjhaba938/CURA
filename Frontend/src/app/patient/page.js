"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { useVapi } from "@/hooks/useVapi";


export default function PatientHome() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const { isListening, transcript, toggle, setTranscript } = useVapi();

  useEffect(() => {
    if (transcript) {
      setSearchQuery(prev => prev + " " + transcript);
      setTranscript("");
    }
  }, [transcript, setTranscript]);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const executeSearch = async (queryToSearch) => {
    if (!queryToSearch.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({ drug: queryToSearch, mode: "quick" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      setSearchResult(result);
      window.location.href = `/cura/treatment?drug=${encodeURIComponent(queryToSearch)}`;
    } catch (err) {
      setSearchError(err.message);
      setIsSearching(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    await executeSearch(searchQuery);
  };

  const startListening = async () => {
    toggle();
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="pt-24 pb-40 px-6 relative" style={{ background: "radial-gradient(circle at 50% 50%, #ffffff 0%, #f7f9fb 100%)" }}>
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[120px] -z-10"></div>

          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <span className="inline-block py-1 px-4 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase">
                Patient Intelligence
              </span>
              <h1 className="font-[Manrope] text-6xl md:text-7xl font-light tracking-tight text-on-surface">
                {user?.name ? (
                  <>Welcome back, <span className="text-primary font-semibold">{user.name.split(" ")[0]}</span></>
                ) : (
                  <>Understand your <span className="text-primary font-semibold italic">health story</span></>
                )}
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary-container/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <form onSubmit={handleAnalyze} className="relative glass-card rounded-full p-2 flex items-center antigravity-shadow">
                <div className="pl-6 pr-3 text-primary">
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined">search</span>
                  )}
                </div>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-lg placeholder:text-on-surface-variant/50 py-4"
                  placeholder="Ask anything about your clinical data..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearching}
                />
                <button
                  type="button"
                  onClick={startListening}
                  className={`p-3 rounded-full transition-all ${isListening ? 'text-error animate-pulse bg-error/10' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                  title="Search by Voice"
                >
                  <span className="material-symbols-outlined">
                    {isListening ? 'mic_active' : 'mic'}
                  </span>
                </button>
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="bg-primary text-on-primary h-12 px-8 rounded-full font-medium hover:bg-primary-container transition-all disabled:opacity-70 ml-2"
                >
                  {isSearching ? "Analyzing..." : "Analyze"}
                </button>
              </form>
              {searchError && (
                <p className="mt-4 text-error text-sm font-medium">{searchError}</p>
              )}
            </div>

            {/* Floating Chips */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {["Energy levels after recovery", "Managing side effects", "Medication interactions", "Sleep quality trends"].map((chip) => (
                <button 
                  key={chip} 
                  onClick={() => {
                    setSearchQuery(chip);
                    executeSearch(chip);
                  }}
                  disabled={isSearching}
                  className={`glass-card hover:bg-surface-container-lowest px-5 py-2.5 rounded-full text-sm font-medium text-on-surface-variant transition-all hover:-translate-y-1 antigravity-shadow ${isSearching ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="max-w-7xl mx-auto px-6 -mt-20 mb-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Primary Insight */}
            <div className="md:col-span-8 glass-card rounded-[2rem] p-10 antigravity-shadow relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                  </div>
                  <h3 className="font-[Manrope] text-3xl font-semibold">Weekly Recovery Phase</h3>
                  <p className="text-on-surface-variant text-lg max-w-md">
                    Your biomarkers indicate you&apos;ve entered the &apos;Stabilization&apos; phase. Inflammation markers are down by 14% this week.
                  </p>
                </div>
                <div className="mt-12 flex items-end justify-between">
                  <div className="flex gap-4">
                    <div className="bg-surface-container-low p-4 rounded-2xl">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">CRP Levels</p>
                      <p className="text-2xl font-bold text-primary">1.2 <span className="text-xs font-normal">mg/L</span></p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-2xl">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Heart Rate (Avg)</p>
                      <p className="text-2xl font-bold text-primary">64 <span className="text-xs font-normal">bpm</span></p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary-container text-4xl opacity-20 group-hover:opacity-100 transition-opacity">trending_down</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">healing</span>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="md:col-span-4 flex flex-col gap-8 h-full">
              <div className="glass-card rounded-[2rem] p-8 antigravity-shadow flex items-center gap-6 shrink-0">
                <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-3xl">water_drop</span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Hydration Score</p>
                  <p className="text-3xl font-bold">Optimal</p>
                </div>
              </div>

              <div className="glass-card rounded-[2rem] p-8 antigravity-shadow flex-1 flex flex-col justify-center">
                <p className="text-sm font-medium text-on-surface-variant mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">schedule</span> Recent Lab Results
                </p>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Hemoglobin A1c</span>
                      <span className="text-sm font-bold">5.4%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[54%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Vitamin D</span>
                      <span className="text-sm font-bold">42 ng/mL</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[70%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Narrative */}
            <div className="md:col-span-12 glass-card rounded-[2rem] p-10 antigravity-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <h3 className="font-[Manrope] text-2xl font-semibold italic">Your Health Narrative</h3>
                <div className="flex gap-2">
                  <button onClick={startListening} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">mic</span>
                    {isListening ? "Listening..." : "Tell your story"}
                  </button>
                  <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-lg text-sm">Clinical View</button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                <div className="flex-1 p-6 bg-surface-container-low rounded-2xl border-l-4 border-primary">
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase">March 12</span>
                  <p className="mt-2 text-on-surface font-medium italic">
                    &quot;I noticed slight fatigue after lunch, but my oxygen levels remained steady at 98%.&quot;
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">
                      Source: Reddit #abc123
                    </span>
                    <span className="text-[10px] text-on-surface-variant opacity-60">Verified Trace</span>
                  </div>
                </div>
                <div className="flex-1 p-6 bg-surface-container-lowest rounded-2xl border-l-4 border-outline-variant">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">March 14</span>
                  <p className="mt-2 text-on-surface-variant">
                    System note: Medication dosage adjusted. Patient reported improved sleep latency.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-secondary-container/30 text-secondary text-[10px] font-bold rounded uppercase">
                      Source: FDA Report #7890
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-6 bg-surface-container-lowest rounded-2xl border-l-4 border-outline-variant opacity-50">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Upcoming</span>
                  <p className="mt-2 text-on-surface-variant">
                    Follow-up consultation: Recovery phase review and metabolic screening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer brand="MedIntel" />
    </>
  );
}
