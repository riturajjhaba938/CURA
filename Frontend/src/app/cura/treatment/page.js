import FAB from "@/components/FAB";

export default function CuraTreatment() {
  return (
    <div className="px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-10">
      {/* Hero: Plain Language Summary */}
      <section className="glass-card rounded-[2rem] p-10 relative overflow-hidden antigravity-shadow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 text-primary mb-4">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="text-sm font-bold uppercase tracking-widest">Plain Language Summary</span>
          </div>
          <h3 className="font-[Manrope] text-4xl font-light leading-tight mb-6">
            Targeted <span className="text-primary font-bold">Neuro-Modulation</span> therapy uses low-frequency
            pulses to recalibrate synaptic response patterns without the need for systemic medication.
          </h3>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
            This approach prioritizes patient comfort by focusing on specific neural pathways, reducing the likelihood
            of broad systemic side effects while maintaining a high clinical accuracy.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-medium flex items-center gap-2 hover:bg-primary-container transition-all">
              Protocol Details <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className="px-8 py-3 bg-surface-container-high text-primary rounded-xl font-medium hover:bg-surface-container-highest transition-all">
              Clinical Sources
            </button>
          </div>
        </div>
      </section>

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Column 1: Big Metrics */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="glass-card rounded-3xl p-8 transition-transform hover:-translate-y-1 antigravity-shadow">
            <div className="flex items-center justify-between mb-8">
              <span className="p-3 bg-secondary-container text-primary rounded-2xl material-symbols-outlined">verified</span>
              <span className="material-symbols-outlined text-outline-variant cursor-pointer">info</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-on-surface-variant font-semibold">Success Rate</p>
              <h4 className="font-[Manrope] text-6xl font-extrabold text-primary">78<span className="text-3xl opacity-60">%</span></h4>
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/10">
              <p className="text-xs text-on-surface-variant leading-relaxed">Based on 1,240 observed patient outcomes within a 12-month clinical window.</p>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-8 transition-transform hover:-translate-y-1 antigravity-shadow">
            <div className="flex items-center justify-between mb-8">
              <span className="p-3 bg-tertiary-fixed text-tertiary rounded-2xl material-symbols-outlined">speed</span>
              <span className="material-symbols-outlined text-outline-variant cursor-pointer">info</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-on-surface-variant font-semibold">Median Recovery</p>
              <h4 className="font-[Manrope] text-6xl font-extrabold text-on-surface">42<span className="text-3xl opacity-40 font-light ml-2">days</span></h4>
            </div>
            <div className="mt-6 flex gap-2">
              <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Fast-Track</span>
              <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Non-Invasive</span>
            </div>
          </div>
        </div>

        {/* Column 2: Side Effects Heatmap */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="glass-card rounded-3xl p-8 h-full flex flex-col antigravity-shadow">
            <div className="flex items-center justify-between mb-10">
              <h5 className="font-[Manrope] text-xl font-bold">Side Effects Heatmap</h5>
              <span className="text-xs text-primary font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                User Reported
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4 flex-1">
              {[
                { icon: "bedtime", label: "Sleep", opacity: "20" },
                { icon: "psychology", label: "Focus", opacity: "40" },
                { icon: "restaurant", label: "Appetite", opacity: "10" },
                { icon: "mood", label: "Mood", opacity: "5" },
                { icon: "fitness_center", label: "Vigor", opacity: "30" },
                { icon: "visibility", label: "Vision", opacity: "60" },
                { icon: "hearing", label: "Aural", opacity: "10" },
                { icon: "waves", label: "Balance", opacity: "5" },
              ].map((item) => (
                <div key={item.label} className={`bg-primary/${item.opacity} aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 group relative cursor-help`}>
                  <span className="material-symbols-outlined text-primary">{item.icon}</span>
                  <span className="text-[10px] font-bold text-primary">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-2">
              <span>Low Frequency</span>
              <div className="flex-1 h-1 mx-4 bg-gradient-to-r from-primary/5 via-primary/40 to-primary rounded-full"></div>
              <span>High Frequency</span>
            </div>
          </div>
        </div>

        {/* Column 3: Top Adjuncts */}
        <div className="col-span-12 lg:col-span-3">
          <div className="glass-card rounded-3xl p-8 h-full antigravity-shadow">
            <h5 className="font-[Manrope] text-xl font-bold mb-8">Top Adjuncts</h5>
            <div className="space-y-6">
              {[
                { icon: "self_improvement", title: "Deep Breathwork", desc: "Increases efficacy by 12%" },
                { icon: "lightbulb", title: "Blue Light Therapy", desc: "Recommended for evening" },
                { icon: "pill", title: "Vitamin B12 Boost", desc: "Supports neural repair" },
                { icon: "water_drop", title: "Electrolyte Intake", desc: "Critical for pulse transit" },
              ].map((adj) => (
                <div key={adj.title} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined">{adj.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{adj.title}</p>
                    <p className="text-[10px] text-on-surface-variant">{adj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Best For vs Not Recommended */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-primary/5 rounded-[2rem] p-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary material-symbols-outlined">thumb_up</span>
            <h5 className="font-[Manrope] text-2xl font-bold">Best For</h5>
          </div>
          <ul className="space-y-6">
            {[
              { title: "Primary Synaptic Fatigue", desc: "Patients showing low response to standard chemical stimulants." },
              { title: "Post-Operative Recovery", desc: "Ideal for non-invasive acceleration of tissue-nerve bonding." },
              { title: "Long-term Neurological Maintenance", desc: "Suitable for chronic management due to low toxicity levels." },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <div>
                  <p className="font-bold text-on-surface">{item.title}</p>
                  <p className="text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-error/5 rounded-[2rem] p-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 rounded-full bg-error flex items-center justify-center text-on-error material-symbols-outlined">warning</span>
            <h5 className="font-[Manrope] text-2xl font-bold">Not Recommended</h5>
          </div>
          <ul className="space-y-6">
            {[
              { title: "Acute Inflammatory Phase", desc: "Pulse therapy can aggravate active swelling in the first 48 hours." },
              { title: "Active Cardiac Implants", desc: "Electromagnetic interference risks require secondary shielding." },
              { title: "High Sensitivity to EM Fields", desc: "Minor percentage of users report transient dizziness during sessions." },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="material-symbols-outlined text-error mt-1">cancel</span>
                <div>
                  <p className="font-bold text-on-surface">{item.title}</p>
                  <p className="text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Severity Alert + Disease Info */}
      <section className="glass-card rounded-[2rem] p-10 border-l-4 border-error antigravity-shadow">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-3xl text-error">emergency</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="font-[Manrope] text-2xl font-bold text-error">Severity: Critical</h4>
              <span className="px-3 py-1 bg-error/10 text-error text-xs font-bold uppercase tracking-widest rounded-full animate-pulse">
                Requires Specialist
              </span>
            </div>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
              Based on the patient&apos;s voice trace analysis and biomarker correlation, the condition shows signs of
              <strong className="text-on-surface"> progressive neural degeneration</strong> with a severity index of 7.8/10.
              Immediate clinical consultation is recommended.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-low rounded-2xl p-5">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-2">Condition</p>
                <p className="font-[Manrope] text-lg font-bold text-on-surface">Synaptic Fatigue Syndrome</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-5">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-2">Affected System</p>
                <p className="font-[Manrope] text-lg font-bold text-on-surface">Central Nervous System</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-5">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-2">Progression Rate</p>
                <p className="font-[Manrope] text-lg font-bold text-error">Rapid (2-4 weeks)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts About the Disease */}
      <section className="glass-card rounded-[2rem] p-10 antigravity-shadow">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center material-symbols-outlined text-primary">info</span>
          <h4 className="font-[Manrope] text-2xl font-bold">Important Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: "science", title: "About the Condition", desc: "Synaptic Fatigue Syndrome (SFS) affects neural signal transmission efficiency. It can lead to cognitive slowdown, speech hesitation, and motor delays if untreated." },
            { icon: "warning", title: "Risk Factors", desc: "High stress levels, sleep deprivation (< 5hrs/night), prolonged screen exposure, and genetic predisposition (CHRNA4 gene variant) increase susceptibility by 3.2x." },
            { icon: "medication", title: "Treatment Timeline", desc: "Early intervention with neuro-modulation therapy shows 78% success rate. Treatment typically spans 6-8 weeks with bi-weekly sessions. Full response expected within 42 days." },
            { icon: "monitoring", title: "Monitoring Required", desc: "Weekly EEG monitoring, bi-weekly voice trace analysis, and monthly cognitive assessments recommended. Report any sudden changes in speech or motor function immediately." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-5 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-primary mt-0.5">{item.icon}</span>
              <div>
                <p className="font-bold text-on-surface mb-1">{item.title}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Clinics & Hospitals */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center material-symbols-outlined text-on-primary">local_hospital</span>
            <div>
              <h4 className="font-[Manrope] text-2xl font-bold">Recommended Clinics Nearby</h4>
              <p className="text-sm text-on-surface-variant">Specialized centers for Synaptic Fatigue Syndrome treatment</p>
            </div>
          </div>
          <button className="px-5 py-2 bg-surface-container-high text-on-surface rounded-xl text-sm font-medium hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">map</span>
            View on Map
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              name: "NeuroVita Specialty Hospital",
              type: "Tertiary Care Hospital",
              distance: "2.4 km",
              rating: 4.8,
              reviews: 1243,
              specialty: "Neural Modulation & Rehabilitation",
              doctor: "Dr. Vikram Mehra",
              beds: 320,
              cost: "₹₹₹",
              whyRecommend: "Top-ranked for SFS treatment with a 92% patient satisfaction rate. Houses India's first dedicated neuro-modulation wing with FDA-approved pulse therapy equipment. Dr. Mehra has treated 400+ SFS cases.",
              availability: "Next Available: Tomorrow, 10:30 AM",
              tags: ["Gold Standard", "Insurance Accepted", "24/7 Neuro ICU"],
              color: "primary",
            },
            {
              name: "MindBridge Clinical Center",
              type: "Specialty Clinic",
              distance: "5.1 km",
              rating: 4.6,
              reviews: 876,
              specialty: "Cognitive & Neurological Diagnostics",
              doctor: "Dr. Sunita Rao",
              beds: 85,
              cost: "₹₹",
              whyRecommend: "Pioneered voice-trace based diagnostics in 2023. Research collaboration with AIIMS for SFS protocol development. Offers integrated AI-assisted treatment planning with 89% diagnostic accuracy.",
              availability: "Next Available: March 16, 2:00 PM",
              tags: ["Research Hub", "AI-Assisted", "Clinical Trials"],
              color: "secondary",
            },
            {
              name: "Apollo Neuro Sciences",
              type: "Multi-Specialty Hospital",
              distance: "8.7 km",
              rating: 4.5,
              reviews: 2156,
              specialty: "Comprehensive Neurological Care",
              doctor: "Dr. Arvind Sharma",
              beds: 600,
              cost: "₹₹₹₹",
              whyRecommend: "Largest neurology department in the region with 18 specialists. Offers end-to-end care from diagnosis to rehabilitation. 24/7 emergency referrals with dedicated stroke and neuro-ICU units.",
              availability: "Next Available: March 15, 4:15 PM",
              tags: ["Emergency Ready", "Multi-lingual Staff", "Rehab Center"],
              color: "tertiary",
            },
            {
              name: "Fortis Brain & Spine Institute",
              type: "Super-Specialty Hospital",
              distance: "3.8 km",
              rating: 4.7,
              reviews: 1890,
              specialty: "Neurosurgery & Neuro-Rehabilitation",
              doctor: "Dr. Priya Nair",
              beds: 450,
              cost: "₹₹₹₹",
              whyRecommend: "State-of-the-art robotic-assisted neurosurgery suite. Internationally trained team with experience in 2,000+ neuro-procedures. Partnered with Johns Hopkins for SFS clinical research protocol.",
              availability: "Next Available: March 15, 11:00 AM",
              tags: ["Robotic Surgery", "International Team", "NABH Accredited"],
              color: "primary",
            },
            {
              name: "Medanta NeuroCenter",
              type: "Research Hospital",
              distance: "12.3 km",
              rating: 4.9,
              reviews: 3420,
              specialty: "Advanced Neuro-Diagnostics & Gene Therapy",
              doctor: "Dr. Rajesh Kapoor",
              beds: 1200,
              cost: "₹₹₹₹₹",
              whyRecommend: "#1 ranked neurology center nationally. Running India's only Phase-3 clinical trial for SFS gene therapy. Dr. Kapoor published the landmark SFS treatment protocol used globally. 96% patient satisfaction.",
              availability: "Next Available: March 18, 9:00 AM",
              tags: ["#1 National Rank", "Gene Therapy", "Phase-3 Trials", "Published Research"],
              color: "secondary",
            },
            {
              name: "Jaipur Neuro Wellness Clinic",
              type: "Outpatient Clinic",
              distance: "1.2 km",
              rating: 4.3,
              reviews: 542,
              specialty: "Preventive Neurology & Wellness",
              doctor: "Dr. Meera Joshi",
              beds: 0,
              cost: "₹",
              whyRecommend: "Most affordable option for initial screening and ongoing monitoring. Walk-in friendly with no appointment needed for basic neuro-assessments. Ideal for follow-up visits and voice trace monitoring sessions.",
              availability: "Walk-in Available Today",
              tags: ["Budget Friendly", "Walk-in", "Near You", "Basic Screening"],
              color: "tertiary",
            },
          ].map((clinic, i) => (
            <div key={clinic.name} className="glass-card rounded-[2rem] p-8 flex flex-col justify-between antigravity-shadow hover:-translate-y-1 transition-transform group">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${clinic.color === 'primary' ? 'primary' : clinic.color === 'secondary' ? 'secondary-container' : 'tertiary-fixed'} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-${clinic.color === 'primary' ? 'on-primary' : clinic.color === 'secondary' ? 'secondary' : 'tertiary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-amber-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold text-on-surface">{clinic.rating}</span>
                    <span className="text-xs text-on-surface-variant">({clinic.reviews.toLocaleString()})</span>
                  </div>
                </div>
                <h5 className="font-[Manrope] text-xl font-bold text-on-surface mb-1">{clinic.name}</h5>
                <p className="text-sm text-on-surface-variant mb-1">{clinic.type} • {clinic.specialty}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {clinic.distance} away
                  </div>
                  <span className="text-on-surface-variant text-xs">•</span>
                  <span className="text-sm text-on-surface-variant">{clinic.cost}</span>
                  {clinic.beds > 0 && (
                    <>
                      <span className="text-on-surface-variant text-xs">•</span>
                      <span className="text-sm text-on-surface-variant">{clinic.beds} beds</span>
                    </>
                  )}
                </div>

                {/* Lead Doctor */}
                <div className="flex items-center gap-3 mb-5 p-3 bg-surface-container-low rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary text-xs font-bold">
                    {clinic.doctor.split(' ').slice(1).map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{clinic.doctor}</p>
                    <p className="text-[10px] text-on-surface-variant">Lead Specialist • {clinic.specialty.split(' ')[0]}</p>
                  </div>
                </div>

                {/* Why We Recommend */}
                <div className="bg-primary/5 rounded-2xl p-4 mb-5">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Why We Recommend</p>
                  <p className="text-sm text-on-surface leading-relaxed">{clinic.whyRecommend}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {clinic.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-5 border-t border-outline-variant/10">
                <p className="text-xs text-on-surface-variant mb-4 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-primary text-sm">info</span>
                  Contact Information
                </p>
                <div className="flex items-center justify-between gap-2">
                  <button title="Call Clinic" className="flex-1 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 group/btn">
                    <span className="material-symbols-outlined text-base text-primary group-hover/btn:scale-110 transition-transform">call</span>
                    Contact
                  </button>
                  <button title="Get Directions" className="flex-1 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 group/btn">
                    <span className="material-symbols-outlined text-base text-secondary group-hover/btn:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    Location
                  </button>
                  <button title="Email Clinic" className="w-10 h-10 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl flex items-center justify-center transition-colors flex-shrink-0 group/btn">
                    <span className="material-symbols-outlined text-base text-tertiary group-hover/btn:scale-110 transition-transform">mail</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Patient Review Highlights */}
        <div className="glass-card rounded-[2rem] p-8 antigravity-shadow">
          <h5 className="font-[Manrope] text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">rate_review</span>
            Recent Patient Reviews
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Ananya S.", clinic: "NeuroVita", rating: 5, text: "Dr. Mehra explained everything about my SFS diagnosis clearly. The neuro-modulation therapy reduced my symptoms within 3 weeks. Highly recommend.", time: "2 weeks ago" },
              { name: "Rahul P.", clinic: "MindBridge", rating: 5, text: "The AI-assisted diagnostics at MindBridge caught early signs that two other hospitals missed. Their voice trace analysis was incredibly accurate.", time: "1 month ago" },
              { name: "Priya K.", clinic: "Apollo Neuro", rating: 4, text: "Comprehensive treatment plan and excellent rehab facility. The team coordinated between neurology and physiotherapy seamlessly. Recovery took 5 weeks.", time: "3 weeks ago" },
              { name: "Amit V.", clinic: "Fortis Brain", rating: 5, text: "The robotic-assisted procedure was painless. Dr. Nair is exceptional — she walked me through every step. Post-op recovery was smooth and the nursing staff was attentive 24/7.", time: "1 week ago" },
              { name: "Sanya M.", clinic: "Medanta", rating: 5, text: "Traveled from Kolkata specifically for Dr. Kapoor. Worth every rupee. The gene therapy trial gave me hope when nothing else worked. 3 months in and I feel like a new person.", time: "2 months ago" },
              { name: "Karan D.", clinic: "Jaipur Neuro", rating: 4, text: "Perfect for follow-ups. No appointment needed, walked in and was seen within 10 minutes. Dr. Joshi is thorough with consultations. Very affordable compared to bigger hospitals.", time: "5 days ago" },
            ].map((review) => (
              <div key={review.name} className="p-5 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary text-sm font-bold">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{review.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{review.clinic} • {review.time}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={`material-symbols-outlined text-base ${j < review.rating ? 'text-amber-500' : 'text-outline-variant/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-24"></div>
      <FAB />
    </div>
  );
}
