"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

function TypewriterTagline() {
  const tagline = "Cura: Mapping the journey you weren't told about.";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing & deleting logic
  useEffect(() => {
    let timeout;

    if (!isDeleting && charIndex < tagline.length) {
      // Typing forward
      timeout = setTimeout(() => {
        setDisplayText(tagline.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 60 + Math.random() * 40); // slightly randomized for realism
    } else if (!isDeleting && charIndex === tagline.length) {
      // Pause at full text, then start deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayText(tagline.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 30);
    } else if (isDeleting && charIndex === 0) {
      // Pause at empty, then start typing again
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 1200);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, tagline]);

  // Split "Cura:" from the rest for styling
  const curaPrefix = "Cura:";
  let styledCura = null;
  let restText = displayText;

  if (displayText.length > 0) {
    if (displayText.length <= curaPrefix.length) {
      styledCura = displayText;
      restText = "";
    } else {
      styledCura = curaPrefix;
      restText = displayText.slice(curaPrefix.length);
    }
  }

  return (
    <div className="flex items-center gap-0 select-none min-w-0 overflow-hidden py-1">
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        {styledCura && (
          <span className="gradient-text font-[Manrope] font-black text-2xl tracking-tight">{styledCura}</span>
        )}
        <span className="text-on-surface-variant font-[Playfair_Display] font-medium italic text-lg">{restText}</span>
        <span
          className={`inline-block w-[2.5px] h-[22px] bg-primary ml-[1px] align-middle rounded-full transition-opacity duration-100 ${
            showCursor ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}

export default function CuraNavbar() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Close dropdowns on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowProfile(false);
      setShowSettings(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 bg-white/70 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white shadow-md shadow-primary/10 flex items-center justify-center overflow-hidden">
              <Image src="/logo.jpg" alt="Cura Logo" width={48} height={48} className="w-full h-full object-cover" />
            </div>
          </Link>
          {/* Typewriter Tagline */}
          <TypewriterTagline />
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
        <div className="fixed top-[84px] right-28 z-[60] w-80 bg-white rounded-2xl p-6 shadow-2xl shadow-black/10 border border-outline-variant/10">
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
        <div className="fixed top-[84px] right-8 z-[60] w-80 bg-white rounded-2xl p-6 shadow-2xl shadow-black/10 border border-outline-variant/10">
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
