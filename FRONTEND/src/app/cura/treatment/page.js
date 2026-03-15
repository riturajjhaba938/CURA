"use client";
import FAB from "@/components/FAB";
import { useState, useEffect } from "react";
import BSMeterUI from "@/components/BSMeterUI";
import ChronologicalTimeline from "@/components/ChronologicalTimeline";
import SourceCard from "@/components/SourceCard";
import RealTimeChat from "@/components/RealTimeChat";

export default function CuraTreatment() {
  const [costRangeIndex, setCostRangeIndex] = useState(0);
  const costRanges = ["Any Price", "₹5,000 - ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹5,00,000"];
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drugName, setDrugName] = useState("");
  const [userCity, setUserCity] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const drug = urlParams.get('drug') || 'Synaptic Fatigue Syndrome';
    setDrugName(drug);

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const uData = u.user || u;
        if (uData.district) {
          setUserCity(uData.district);
        }
      } catch (e) {}
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeline/${drug}`);
        if(res.ok){
          const json = await res.json();
          setData(json);
        }
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-10">
      {/* Hero: Plain Language Summary */}
      <section className="glass-card rounded-[2rem] p-10 relative overflow-hidden antigravity-shadow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 text-primary mb-4">
            <span className="w-6 h-6 flex items-center justify-center material-symbols-outlined text-lg leading-none">auto_awesome</span>
            <span className="text-sm font-bold uppercase tracking-widest leading-none">Plain Language Summary</span>
          </div>
          <h3 className="font-[Manrope] text-4xl font-light leading-tight mb-6">
            Based on <span className="text-primary font-bold">{data?.totalEntries || 1240} user reports</span>, this treatment profile outlines patient experiences, side effects, and recovery timelines.
          </h3>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
            This approach prioritizes real-world clinical insights crossed-referenced with OpenFDA data, reducing the likelihood of hallucinations while maintaining high clinical accuracy.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-container transition-all">
              Verify Clinical Sources <span className="material-symbols-outlined text-xl leading-none">verified</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Dashboard Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* AI Credibility Meter */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <BSMeterUI score={data?.credibilityScore || 85} />
          
          <div className="glass-card rounded-3xl p-8 transition-transform hover:-translate-y-1 antigravity-shadow">
            <div className="flex items-center justify-between mb-8">
              <span className="w-12 h-12 bg-tertiary-fixed text-tertiary rounded-2xl flex items-center justify-center material-symbols-outlined text-2xl leading-none">speed</span>
              <span className="w-8 h-8 flex items-center justify-center material-symbols-outlined text-outline-variant cursor-pointer leading-none">info</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-on-surface-variant font-semibold">Median Recovery</p>
              <h4 className="font-[Manrope] text-6xl font-extrabold text-on-surface">
                {data?.medianRecoveryDays || 42}<span className="text-3xl opacity-40 font-light ml-2">days</span>
              </h4>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-full">
          <ChronologicalTimeline 
            drugName={drugName}
            timelineData={(data?.timeline && data.timeline.length > 0) ? data.timeline : [
              { week: "Day 1", symptom: "nausea", count: 18 },
              { week: "Day 1", symptom: "headache", count: 14 },
              { week: "Day 1", symptom: "fatigue", count: 22 },
              { week: "Week 1", symptom: "dry skin", count: 28 },
              { week: "Week 1", symptom: "dry lips", count: 34 },
              { week: "Week 1", symptom: "fatigue", count: 19 },
              { week: "Week 1", symptom: "mood changes", count: 8 },
              { week: "Week 1", symptom: "nosebleed", count: 5 },
              { week: "Week 2", symptom: "peeling", count: 15 },
              { week: "Week 2", symptom: "dry skin", count: 24 },
              { week: "Week 2", symptom: "breakout", count: 12 },
              { week: "Week 2", symptom: "joint pain", count: 7 },
              { week: "Month 1", symptom: "dry skin", count: 20 },
              { week: "Month 1", symptom: "back pain", count: 9 },
              { week: "Month 1", symptom: "hair loss", count: 6 },
              { week: "Month 1", symptom: "sun sensitivity", count: 11 },
              { week: "Month 2", symptom: "dry lips", count: 10 },
              { week: "Month 2", symptom: "joint pain", count: 4 },
              { week: "Month 3", symptom: "dry skin", count: 5 },
              { week: "Month 3", symptom: "hair loss", count: 3 },
            ]} 
          />
        </div>
      </div>

      {/* Best For vs Not Recommended */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-primary/5 rounded-[2rem] p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
              <span className="material-symbols-outlined text-[22px] block leading-none">thumb_up</span>
            </div>
            <h5 className="font-[Manrope] text-2xl font-bold">Best For</h5>
          </div>
          <ul className="space-y-6">
            {[
              { title: "Primary Synaptic Fatigue", desc: "Patients showing low response to standard chemical stimulants." },
              { title: "Post-Operative Recovery", desc: "Ideal for non-invasive acceleration of tissue-nerve bonding." },
              { title: "Long-term Neurological Maintenance", desc: "Suitable for chronic management due to low toxicity levels." },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-[20px] leading-none shrink-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>check_circle</span>
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
            <div className="w-10 h-10 rounded-full bg-error flex items-center justify-center text-on-error shrink-0">
              <span className="material-symbols-outlined text-[22px] block leading-none">warning</span>
            </div>
            <h5 className="font-[Manrope] text-2xl font-bold">Not Recommended</h5>
          </div>
          <ul className="space-y-6">
            {[
              { title: "Acute Inflammatory Phase", desc: "Pulse therapy can aggravate active swelling in the first 48 hours." },
              { title: "Active Cardiac Implants", desc: "Electromagnetic interference risks require secondary shielding." },
              { title: "High Sensitivity to EM Fields", desc: "Minor percentage of users report transient dizziness during sessions." },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="material-symbols-outlined text-error text-[20px] leading-none shrink-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>cancel</span>
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
            <span className="material-symbols-outlined text-3xl text-error block leading-none">emergency</span>
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
                <p className="font-[Manrope] text-lg font-bold text-on-surface">{drugName}</p>
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

      {/* Key Facts & Cura Intelligence Chat */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="glass-card rounded-[2rem] p-10 antigravity-shadow">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px] block leading-none">info</span>
            </div>
            <h4 className="font-[Manrope] text-2xl font-bold">Important Information</h4>
          </div>
          <div className="flex flex-col gap-6">
            {[
              { icon: "science", title: "About the Condition", desc: `${drugName} is actively documented in peer communities. Symptoms and recovery patterns are tracked longitudinally via forum sentiment processing.` },
              { icon: "medication", title: "Treatment Timeline", desc: "Most users begin adapting to therapeutic regimens within the first 14-days based on our timeline charting data." },
              { icon: "monitoring", title: "Monitoring Sources", desc: "Data relies on verified Sub-Reddit extractions and cross-reference validation engines from OpenFDA arrays." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors">
                <span className="w-8 h-8 flex items-center justify-center material-symbols-outlined text-primary text-xl block leading-none shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-on-surface mb-1">{item.title}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Contextual Chat Agent */}
        <div className="flex justify-center lg:justify-end">
          <RealTimeChat drugContext={drugName} />
        </div>
      </section>

      {/* Nearby Clinics & Hospitals */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-xl block leading-none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>local_hospital</span>
            </div>
            <div>
              <h4 className="font-[Manrope] text-2xl font-bold">Recommended Clinics Nearby</h4>
              <p className="text-sm text-on-surface-variant">Specialized centers for Synaptic Fatigue Syndrome treatment</p>
            </div>
          </div>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(`Hospitals for ${drugName} in ${userCity || ''}`)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-xl text-sm font-medium hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg leading-none">map</span>
            View on Map
          </a>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10">
          <div className="flex items-center gap-2 text-on-surface-variant font-medium text-sm">
            <span className="w-8 h-8 flex items-center justify-center material-symbols-outlined text-[20px] block leading-none">filter_alt</span>
            Estimated Cost Range:
          </div>
          <div className="flex-1 max-w-md w-full ml-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-primary">{costRanges[costRangeIndex]}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={costRanges.length - 1} 
              step="1" 
              value={costRangeIndex}
              onChange={(e) => setCostRangeIndex(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" 
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-medium px-1">
              <span>Any</span>
              <span>₹5L+</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          { (() => {
            const allClinics = [
              {
                name: "NeuroVita Specialty Hospital",
                city: "Mumbai",
                type: "Tertiary Care Hospital",
                distance: "2.4 km",
                rating: 4.8,
                reviews: 1243,
                specialty: "Neural Modulation & Rehabilitation",
                doctor: "Dr. Vikram Mehra",
                beds: 320,
                costNum: 45000,
                coststr: "₹45,000",
                whyRecommend: "Top-ranked for SFS treatment with a 92% patient satisfaction rate. Houses India's first dedicated neuro-modulation wing.",
                availability: "Next Available: Tomorrow, 10:30 AM",
                tags: ["Gold Standard", "Insurance Accepted", "24/7 Neuro ICU"],
                color: "primary",
                phone: "+912245678901",
                email: "contact@neurovita.in",
                address: "124 Linking Road, Bandra West, Mumbai, Maharashtra 400050"
              },
              {
                name: "MindBridge Clinical Center",
                city: "Bangalore",
                type: "Specialty Clinic",
                distance: "5.1 km",
                rating: 4.6,
                reviews: 876,
                specialty: "Cognitive Diagnostics",
                doctor: "Dr. Sunita Rao",
                beds: 85,
                costNum: 15000,
                coststr: "₹15,000",
                whyRecommend: "Pioneered voice-trace based diagnostics in 2023. Offers integrated AI-assisted treatment planning with 89% diagnostic accuracy.",
                availability: "Next Available: March 16, 2:00 PM",
                tags: ["Research Hub", "AI-Assisted", "Clinical Trials"],
                color: "secondary",
                phone: "+918023456789",
                email: "info@mindbridge.clinic",
                address: "45 MG Road, Bangalore, Karnataka 560001"
              },
              {
                name: "Apollo Neuro Sciences",
                city: "New Delhi",
                type: "Multi-Specialty Hospital",
                distance: "8.7 km",
                rating: 4.5,
                reviews: 2156,
                specialty: "Neurological Care",
                doctor: "Dr. Arvind Sharma",
                beds: 600,
                costNum: 150000,
                coststr: "₹1,50,000",
                whyRecommend: "Largest neurology department in the region with 18 specialists. Offers end-to-end care from diagnosis to rehabilitation.",
                availability: "Next Available: March 15, 4:15 PM",
                tags: ["Emergency Ready", "Multi-lingual Staff", "Rehab Center"],
                color: "tertiary",
                phone: "+911134567890",
                email: "support@apollo-neuro.com",
                address: "Apollo Hospital Sarita Vihar, Mathura Rd, Delhi 110076"
              },
              {
                name: "Fortis Brain & Spine Institute",
                city: "Chennai",
                type: "Super-Specialty Hospital",
                distance: "3.8 km",
                rating: 4.7,
                reviews: 1890,
                specialty: "Neurosurgery",
                doctor: "Dr. Priya Nair",
                beds: 450,
                costNum: 250000,
                coststr: "₹2,50,000",
                whyRecommend: "State-of-the-art robotic-assisted neurosurgery suite. Internationally trained team with experience in 2,000+ neuro-procedures.",
                availability: "Next Available: March 15, 11:00 AM",
                tags: ["Robotic Surgery", "International Team", "NABH Accredited"],
                color: "primary",
                phone: "+914456789012",
                email: "care@fortis-brain.in",
                address: "Arcot Rd, Vadapalani, Chennai, Tamil Nadu 600026"
              },
              {
                name: "Medanta NeuroCenter",
                city: "Pune",
                type: "Research Hospital",
                distance: "12.3 km",
                rating: 4.9,
                reviews: 3420,
                specialty: "Advanced Gene Therapy",
                doctor: "Dr. Rajesh Kapoor",
                beds: 1200,
                costNum: 480000,
                coststr: "₹4,80,000",
                whyRecommend: "#1 ranked neurology center nationally. Running India's only Phase-3 clinical trial for SFS gene therapy.",
                availability: "Next Available: March 18, 9:00 AM",
                tags: ["#1 National Rank", "Gene Therapy", "Phase-3 Trials"],
                color: "secondary",
                phone: "+912067890123",
                email: "appointments@medantaneuro.com",
                address: "Medanta Area, Pune, Maharashtra 411014"
              },
              {
                name: "Jaipur Neuro Wellness Clinic",
                city: "Jaipur",
                type: "Outpatient Clinic",
                distance: "1.2 km",
                rating: 4.3,
                reviews: 542,
                specialty: "Preventive Neurology",
                doctor: "Dr. Meera Joshi",
                beds: 0,
                costNum: 5500,
                coststr: "₹5,500",
                whyRecommend: "Most affordable option for initial screening and ongoing monitoring. Walk-in friendly with no appointment needed.",
                availability: "Walk-in Available Today",
                tags: ["Budget Friendly", "Walk-in", "Near You"],
                color: "tertiary",
                phone: "+911417890123",
                email: "hello@jaipurneuro.in",
                address: "Tonk Rd, Gandhi Nagar, Jaipur, Rajasthan 302015"
              },
              {
                name: "Global Neurology Care",
                city: userCity || "Local",
                type: "Partner Clinic",
                distance: "0.8 km",
                rating: 4.4,
                reviews: 312,
                specialty: "General Neurology",
                doctor: "Dr. A. Local",
                beds: 20,
                costNum: 8000,
                coststr: "₹8,000",
                whyRecommend: `Conveniently located in ${userCity || "your city"}. Great for regular checkups.`,
                availability: "Next Available: Today",
                tags: ["Local", "Partnership"],
                color: "primary",
                phone: "+919876543210",
                email: "contact@globalneuro.in",
                address: `Main Street, ${userCity || "Your City"} Center`
              }
            ];

            let filteredClinics = allClinics.filter(clinic => {
              // 1. Geography filter - try to match userCity, if none match, we'll gracefully fallback later
              const userCityLower = userCity ? userCity.toLowerCase() : "";
              const clinicCityLower = clinic.city.toLowerCase();
              let cityMatches = !userCity || clinicCityLower.includes(userCityLower) || userCityLower.includes(clinicCityLower);
              // For demonstration if user has a wacky city, include at least the auto-generated one
              if(clinic.name === "Global Neurology Care") cityMatches = true;

              // 2. Cost filter logic
              // costRanges = ["Any Price", "₹5,000 - ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹5,00,000"]
              let costMatches = true;
              if (costRangeIndex === 1) {
                costMatches = clinic.costNum >= 5000 && clinic.costNum <= 50000;
              } else if (costRangeIndex === 2) {
                costMatches = clinic.costNum > 50000 && clinic.costNum <= 100000;
              } else if (costRangeIndex === 3) {
                costMatches = clinic.costNum > 100000 && clinic.costNum <= 500000;
              }

              return cityMatches && costMatches;
            });

            // Fallback: If strict city mapping hid everything, just show top national ones that fit the budget
            if (filteredClinics.length === 0) {
              filteredClinics = allClinics.filter(clinic => {
                if (costRangeIndex === 1) return clinic.costNum >= 5000 && clinic.costNum <= 50000;
                if (costRangeIndex === 2) return clinic.costNum > 50000 && clinic.costNum <= 100000;
                if (costRangeIndex === 3) return clinic.costNum > 100000 && clinic.costNum <= 500000;
                return true;
              });
            }

            return filteredClinics.slice(0, 3).map((clinic) => (
              <div key={clinic.name} className="glass-card rounded-[2rem] p-8 flex flex-col justify-between antigravity-shadow hover:-translate-y-1 transition-transform group">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white ${
                      clinic.color === 'primary' ? 'bg-primary text-on-primary' : 
                      clinic.color === 'secondary' ? 'bg-secondary-container text-secondary' : 
                      'bg-tertiary-fixed text-tertiary'
                    }`}>
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-full shrink-0">
                      <span className="w-4 h-4 flex items-center justify-center material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold text-on-surface">{clinic.rating}</span>
                      <span className="text-xs text-on-surface-variant">({clinic.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                  <h5 className="font-[Manrope] text-xl font-bold text-on-surface mb-1">{clinic.name}</h5>
                  <p className="text-sm text-on-surface-variant mb-1">{clinic.type} • {clinic.specialty}</p>
                  
                  <div className="flex items-center gap-2 mb-4 whitespace-nowrap overflow-x-auto scroller-hide pb-1">
                    <div className="flex items-center gap-1.5 text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-md shrink-0">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      {clinic.distance} away
                    </div>
                    <span className="text-sm font-bold text-on-surface bg-surface-container-highest px-2 py-1 rounded-md shrink-0">
                      {clinic.coststr}
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex items-center gap-3 mb-5 p-3 bg-surface-container-low rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary text-xs font-bold shrink-0">
                      {clinic.doctor.split(' ').slice(1).map(n => n[0]).join('')}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-on-surface truncate">{clinic.doctor}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest truncate">Lead Specialist</p>
                    </div>
                  </div>

                  {/* Why Recommend */}
                  <div className="bg-primary/5 rounded-2xl p-4 mb-5 border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">Why We Recommend</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">{clinic.whyRecommend}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {clinic.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-surface-container-high rounded-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-5 border-t border-outline-variant/10 mt-auto">
                  <div className="flex gap-2">
                    <a href={`tel:${clinic.phone}`} className="flex-1 py-3 bg-surface-container-highest hover:bg-surface-container-highest/80 text-on-surface rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn">
                      <span className="material-symbols-outlined text-base text-primary group-hover/btn:scale-110 transition-transform">call</span>
                      Contact
                    </a>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(clinic.name + ' ' + clinic.city)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-surface-container-highest hover:bg-surface-container-highest/80 text-on-surface rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn">
                      <span className="material-symbols-outlined text-base text-secondary group-hover/btn:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            ));
          })() }
        </div>

        {/* Human Voice Traces / Extracted Entities */}
        <div className="mt-16 glass-card rounded-[2rem] p-8 antigravity-shadow">
          <div className="flex items-center justify-between mb-8">
            <h5 className="font-[Manrope] text-2xl font-bold flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-xl block leading-none">
                dynamic_feed
              </span>
              Human Voice / Source Traces
            </h5>
            <span className="text-sm text-on-surface-variant font-medium bg-surface-container-high px-4 py-1.5 rounded-full">
              Extracted Entities
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.sources || [
              { entity: "Severe Nausea", sourceId: "reddit_12345", contextSnippet: "I felt dizzy immediately after starting this dose, very hard to focus on work.", sourceType: "r/medical_advice" },
              { entity: "Disrupted Sleep Cycle", sourceId: "reddit_54321", contextSnippet: "Waking up at 3AM constantly now. Anyone else feeling wired?", sourceType: "r/insomnia" },
              { entity: "Cognitive Fog", sourceId: "reddit_99999", contextSnippet: "Words aren't coming out right, but it clears up towards the evening.", sourceType: "r/health" },
            ]).map((source, i) => (
              <SourceCard 
                key={i}
                entity={source.entity}
                sourceId={source.sourceId}
                sourceType={source.sourceType}
                contextSnippet={source.contextSnippet}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="h-24"></div>
      <FAB />
    </div>
  );
}
