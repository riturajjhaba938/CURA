"use client";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function CuraTimeline() {
  const [foodInput, setFoodInput] = useState("");
  const [qtyInput, setQtyInput] = useState("");
  const [simItems, setSimItems] = useState([]);

  const handleAddFood = () => {
    if (foodInput.trim() && qtyInput) {
      const val = parseInt(qtyInput) || 0;
      const boost = Math.min(Math.round((foodInput.length * 0.2) + (val * 0.05)), 15);
      
      setSimItems(prev => [...prev, {
        id: Date.now().toString(),
        name: foodInput.trim(),
        qty: val,
        boost: boost
      }]);
      
      setFoodInput("");
      setQtyInput("");
    }
  };

  const handleRemoveFood = (id) => {
    setSimItems(prev => prev.filter(item => item.id !== id));
  };

  const totalBoost = Math.min(simItems.reduce((acc, item) => acc + item.boost, 0), 100);

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 flex flex-col gap-12">
        {/* Hero Header */}
        <div className="max-w-4xl">
          <h2 className="font-[Manrope] text-4xl font-light text-on-surface tracking-tight mb-2">
            Chronological Recovery Timeline
          </h2>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed">
            Predictive recovery mapping based on current clinical biomarkers and historical patient data. Your progress
            is anchored to key physiological shifts.
          </p>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative w-full glass-panel p-12 rounded-[2rem] antigravity-shadow overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative flex flex-col gap-16">
            {/* Timeline Track */}
            <div className="relative flex items-center w-full px-12 pt-12">
              <div className="absolute left-12 right-12 h-0.5 timeline-track opacity-30"></div>
              <div className="absolute left-12 h-1 bg-primary rounded-full" style={{ width: "35%" }}></div>
              <div className="flex justify-between w-full relative">
                {/* Week 1 */}
                <div className="flex flex-col items-center gap-6 cursor-pointer">
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-primary dot-glow z-10 relative border-4 border-surface-container-lowest"></div>
                    <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-widest text-primary font-bold mb-1">Week 1</span>
                    <p className="font-[Manrope] text-on-surface text-sm font-medium">Nausea &amp; Fatigue</p>
                  </div>
                </div>
                {/* Week 4 */}
                <div className="flex flex-col items-center gap-6 cursor-pointer group/node">
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-primary-container z-10 relative border-4 border-surface-container-lowest group-hover/node:scale-125 transition-transform"></div>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Week 4</span>
                    <p className="font-[Manrope] text-on-surface text-sm font-medium">Energy returning</p>
                  </div>
                </div>
                {/* Month 3 */}
                <div className="flex flex-col items-center gap-6 cursor-pointer group/node">
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-surface-container-highest z-10 relative border-4 border-surface-container-lowest group-hover/node:scale-125 transition-transform"></div>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Month 3</span>
                    <p className="font-[Manrope] text-on-surface text-sm font-medium">Full Recovery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-outline-variant/10">
              <div className="col-span-2">
                <h3 className="font-[Manrope] text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  Where you are now
                </h3>
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 leading-relaxed text-on-surface-variant">
                  Based on your latest <strong>Trace</strong> data, you are currently entering the transition from acute
                  phase to regenerative recovery. Expect appetite stability to improve by <strong>Tuesday</strong>. The
                  mild nausea reported in your morning logs is typical for post-treatment Day 14. Your systemic markers
                  show a 12% improvement in oxygenation.
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4 bg-primary-container p-6 rounded-2xl text-on-primary-container shadow-lg shadow-primary/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <span className="text-sm uppercase tracking-widest font-bold">Next Milestone</span>
                </div>
                <p className="font-[Manrope] text-2xl">Phase 2: Metabolic Alignment</p>
                <p className="text-sm opacity-90">In approximately 11 days, cellular regeneration will peak. Keep hydration levels at &gt;2.5L.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Recovery Coefficient */}
          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 flex flex-col gap-6 antigravity-shadow">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Recovery Coefficient</span>
                <h4 className="font-[Manrope] text-3xl font-light">0.84 <span className="text-sm font-normal text-primary">/ 1.0</span></h4>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">OPTIMAL</span>
            </div>
            <div className="h-24 flex items-end gap-1 px-2">
              {[50, 66, 75, 50, 80, 100, 33].map((h, i) => (
                <div key={i} className={`flex-1 bg-primary/${i === 5 ? "100" : (20 + i * 10)} rounded-t-sm`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant">Real-time sync from BioCore API: 14:02 UTC</p>
          </div>

          {/* Neural Drift */}
          <div className="bg-surface-container-low p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 border border-outline-variant/5">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">psychiatry</span>
            </div>
            <h5 className="font-[Manrope] text-lg font-medium">Neural Drift</h5>
            <p className="text-3xl font-light text-primary">LOW</p>
          </div>

          {/* Simulation Mode (Dynamic Calculator) */}
          <div className="md:col-span-2 bg-on-surface p-8 rounded-[2rem] flex flex-col gap-6 text-white relative antigravity-shadow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <h5 className="font-[Manrope] text-2xl font-bold mb-1">Nutrition Simulator</h5>
                <p className="text-sm text-surface-variant leading-relaxed">
                  Input food sources and quantities to project recovery acceleration.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">science</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              {/* Input Area */}
              <div className="flex gap-3 items-start">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 flex items-center focus-within:border-primary/50 transition-colors">
                  <span className="material-symbols-outlined text-white/50 px-2 text-lg">restaurant</span>
                  <input 
                    type="text" 
                    value={foodInput}
                    onChange={(e) => setFoodInput(e.target.value)}
                    placeholder="e.g. Salmon, Spinach, Almonds..." 
                    className="bg-transparent border-none text-white text-sm w-full outline-none placeholder:text-white/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFood();
                    }}
                  />
                </div>
                <div className="w-32 bg-white/5 border border-white/10 rounded-xl p-2 flex items-center focus-within:border-primary/50 transition-colors">
                  <span className="material-symbols-outlined text-white/50 px-2 text-lg">scale</span>
                  <input 
                    type="number" 
                    value={qtyInput}
                    onChange={(e) => setQtyInput(e.target.value)}
                    placeholder="Qty (g)" 
                    min="1"
                    className="bg-transparent border-none text-white text-sm w-full outline-none placeholder:text-white/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFood();
                    }}
                  />
                </div>
                <button 
                  className="h-[46px] px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-colors flex items-center justify-center disabled:opacity-50"
                  onClick={handleAddFood}
                  disabled={!foodInput.trim() || !qtyInput}
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
              </div>

              {/* Added Items List */}
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto scroller-hide">
                {simItems.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => handleRemoveFood(item.id)}
                    className="group flex items-center justify-between bg-white/5 hover:bg-error/20 border border-white/10 hover:border-error/30 p-3 rounded-xl transition-all text-left"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-surface-variant font-medium uppercase uppercase tracking-wider">{item.qty}g</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-sm">+{item.boost}%</span>
                      <span className="material-symbols-outlined text-white/20 group-hover:text-error text-lg transition-colors">delete</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Results */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-surface-variant uppercase tracking-widest font-bold">Projected Acceleration</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-[Manrope] font-bold text-primary">{totalBoost.toFixed(1)}</span>
                    <span className="text-primary font-bold">%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-700 ease-out" style={{ width: `${totalBoost}%` }}></div>
                </div>
                
                {totalBoost > 0 && (
                  <p className="text-xs text-surface-variant mt-3">
                    {totalBoost > 20 ? (
                      <span className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[14px]">insights</span> 
                        Highly optimal combination. Significant cellular regeneration expected.
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <span className="material-symbols-outlined text-[14px]">insights</span> 
                        Marginal improvement. Consider adding potent neuro-protectors.
                      </span>
                    )}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>



    </div>
  );
}
