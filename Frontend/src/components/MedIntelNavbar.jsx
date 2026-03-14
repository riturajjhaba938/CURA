"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MedIntelNavbar() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const links = [
    { href: "/patient", label: "Health Summary" },
    { href: "/patient/dashboard", label: "Recovery Timeline" },
    { href: "/patient/insights", label: "Medical Metrics" },
    { href: "/patient/plan", label: "My Plan" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-white shadow-md shadow-primary/10 flex items-center justify-center overflow-hidden p-0.5">
                <Image src="/logo.jpg" alt="Cura Logo" width={32} height={32} className="object-contain" />
              </div>
              <span className="font-[Manrope] text-xl font-bold tracking-tight text-primary">Cura</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-full transition-all">
              <span className="material-symbols-outlined text-[22px]">shield</span>
            </button>
            <button
              onClick={() => { setShowSettings(!showSettings); setShowProfile(false); }}
              className={`p-2 rounded-full transition-all ${showSettings ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"}`}
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowSettings(false); }}
              className={`p-2 rounded-full transition-all ${showProfile ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"}`}
            >
              <span className="material-symbols-outlined text-[22px]">account_circle</span>
            </button>
            <div className="h-8 w-[1px] bg-outline-variant opacity-20 mx-2"></div>
            <button className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">download</span>
              Export PDF
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="fixed top-[68px] right-44 z-[60] w-80 bg-white rounded-2xl p-6 shadow-2xl shadow-black/10 border border-outline-variant/10">
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
                <div className="w-4 h-4 bg-outline-variant rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <span className="text-sm font-medium">Notifications</span>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">text_fields</span>
                <span className="text-sm font-medium">Font Size</span>
              </div>
              <span className="text-xs text-primary font-bold">Medium</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">download</span>
                <span className="text-sm font-medium">Data Export</span>
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
            <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-primary text-xl font-bold">
              SK
            </div>
            <div>
              <h3 className="font-[Manrope] font-bold">Sarah Kim</h3>
              <p className="text-sm text-on-surface-variant">Patient ID: MED-2024-0892</p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                Active Treatment
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
              <span className="text-sm font-medium">My Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">medical_information</span>
              <span className="text-sm font-medium">Medical Records</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">calendar_month</span>
              <span className="text-sm font-medium">Appointments</span>
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
