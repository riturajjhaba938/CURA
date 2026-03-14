"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function CuraNavbar() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const links = [
    { href: "/cura", label: "Search", icon: "search" },
    { href: "/cura/trace", label: "Trace", icon: "query_stats" },
    { href: "/cura/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/cura/timeline", label: "Timeline", icon: "timeline" },
    { href: "/cura/treatment", label: "Treatment", icon: "medical_services" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 bg-white/70 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-white shadow-md shadow-primary/10 flex items-center justify-center overflow-hidden p-0.5">
              <Image src="/logo.jpg" alt="Cura Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="font-[Manrope] font-extrabold text-xl tracking-tight text-primary hidden sm:block">Cura</span>
          </Link>
          <div className="hidden md:flex gap-1 text-sm font-medium">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-all relative">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {/* Settings */}
          <button
            onClick={() => { setShowSettings(!showSettings); setShowProfile(false); }}
            className={`p-2 rounded-full transition-all ${showSettings ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-primary hover:bg-primary/5"}`}
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => { setShowProfile(!showProfile); setShowSettings(false); }}
            className={`p-2 rounded-full transition-all ${showProfile ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-primary hover:bg-primary/5"}`}
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
          </button>

          <div className="h-8 w-[1px] bg-outline-variant opacity-20 mx-2"></div>

          <Link
            href="/patient"
            className="px-5 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold tracking-wide hover:bg-primary-container transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">swap_horiz</span>
            My Health
          </Link>
        </div>
      </nav>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="fixed top-[68px] right-28 z-[60] w-80 bg-white rounded-2xl p-6 shadow-2xl shadow-black/10 border border-outline-variant/10">
          <h3 className="font-[Manrope] font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">settings</span>
            Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <div className="w-10 h-6 bg-surface-container-highest rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-outline-variant rounded-full absolute top-1 left-1 transition-transform"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <span className="text-sm font-medium">Notifications</span>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">language</span>
                <span className="text-sm font-medium">Language</span>
              </div>
              <span className="text-xs text-primary font-bold">English</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">security</span>
                <span className="text-sm font-medium">Privacy & Security</span>
              </div>
              <span className="material-symbols-outlined text-xs text-on-surface-variant">chevron_right</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="fixed top-[68px] right-8 z-[60] w-80 bg-white rounded-2xl p-6 shadow-2xl shadow-black/10 border border-outline-variant/10">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant/10">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary text-xl font-bold">
              DR
            </div>
            <div>
              <h3 className="font-[Manrope] font-bold">Dr. Rachel Kim</h3>
              <p className="text-sm text-on-surface-variant">Neural Oncology Specialist</p>
              <span className="text-xs text-primary font-medium flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">badge</span>
              <span className="text-sm font-medium">My Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">history</span>
              <span className="text-sm font-medium">Activity Log</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">help</span>
              <span className="text-sm font-medium">Help & Support</span>
            </button>
            <div className="pt-2 mt-2 border-t border-outline-variant/10">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-error/5 transition-colors text-left text-error">
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showSettings || showProfile) && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => { setShowSettings(false); setShowProfile(false); }}
        />
      )}
    </>
  );
}
