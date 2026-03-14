import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-fixed-dim opacity-10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary-container opacity-20 blur-[100px] rounded-full animate-pulse [animation-delay:1s]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] animate-pulse [animation-delay:2s]"></div>

      <div className="relative z-10 text-center space-y-12 max-w-3xl px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full animate-[fadeInDown_0.6s_ease]">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
            Clinical Intelligence Platform
          </span>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center gap-6 animate-[fadeInUp_0.8s_ease]">
          <Image
            src="/logo.jpg"
            alt="Cura Logo"
            width={120}
            height={120}
            className="rounded-3xl shadow-2xl shadow-primary/20 hover:scale-105 transition-transform duration-500"
          />
          <h1 className="font-[Manrope] text-6xl md:text-8xl font-extrabold tracking-tight text-on-surface leading-[1.05]">
            <span className="gradient-text">Cura</span>
          </h1>
        </div>

        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed animate-[fadeInUp_1s_ease]">
          AI-powered clinical intelligence aggregating real-world evidence and patient data for precision diagnostics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_1.2s_ease]">
          <Link
            href="/cura"
            className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold text-base hover:bg-primary-container transition-all antigravity-shadow flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-primary/20"
          >
            <span className="material-symbols-outlined text-xl">query_stats</span>
            For Clinicians
          </Link>
          <Link
            href="/patient"
            className="px-8 py-3 bg-surface-container-lowest text-primary rounded-xl font-bold text-base border border-outline-variant/20 hover:bg-surface-container-low transition-all antigravity-shadow flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">person</span>
            My Health
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-on-surface-variant font-medium animate-[fadeInUp_1.4s_ease]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">verified</span>
            FDA Aligned
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">lock</span>
            HIPAA Compliant
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">speed</span>
            Real-time Analysis
          </div>
        </div>
      </div>
    </div>
  );
}
