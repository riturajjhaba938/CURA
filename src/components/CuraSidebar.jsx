"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/cura", icon: "search", label: "Search" },
  { href: "/cura/trace", icon: "query_stats", label: "Trace" },
  { href: "/cura/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/cura/timeline", icon: "timeline", label: "Timeline" },
  { href: "/cura/treatment", icon: "medical_services", label: "Treatment" },
];

export default function CuraSidebar({ expanded = false }) {
  const pathname = usePathname();

  if (expanded) {
    return (
      <aside className="w-64 bg-surface-container-low flex flex-col py-8 z-20 sticky top-0 h-screen border-r border-outline-variant/5">
        <div className="mb-10 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white shadow-md shadow-primary/10 flex items-center justify-center overflow-hidden p-0.5">
              <Image src="/logo.jpg" alt="Cura Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="font-[Manrope] text-xl font-bold tracking-tight text-primary">Cura</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 px-4 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 mt-auto">
          <div className="p-4 bg-primary/5 rounded-2xl">
            <p className="text-xs text-on-surface-variant font-medium mb-2">Need help?</p>
            <p className="text-[11px] text-on-surface-variant/60 leading-relaxed">Contact our support team for queries about clinical data.</p>
            <button className="mt-3 text-xs font-semibold text-primary hover:underline">Get support →</button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-[72px] hidden lg:flex flex-col items-center pt-6 pb-4 gap-2 bg-surface-container-low/80 backdrop-blur-sm border-r border-outline-variant/5 z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className="group relative flex flex-col items-center w-full py-2.5">
            <div className={`w-12 h-8 rounded-xl flex items-center justify-center transition-all ${
              isActive ? "bg-primary/10" : "group-hover:bg-surface-container-high"
            }`}>
              <span
                className={`material-symbols-outlined text-[22px] transition-all ${
                  isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
            </div>
            <span className={`text-[10px] mt-1 font-medium transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
