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
  const [user, setUser] = useState(null);
  
  // Notification State
  const [suggestions, setSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch('/health_suggestions.json')
      .then(res => res.json())
      .then(data => setSuggestions(data))
      .catch(err => console.error("Error loading suggestions:", err));
  }, []);

  useEffect(() => {
    if (suggestions.length === 0) return;
    
    let index = 0;
    let timeout1, timeout2, timeout3;
    
    // Function to run the popup cycle
    const runCycle = () => {
      setCurrentSuggestion(suggestions[index]);
      setShowPopup(true);
      
      // Keep it on screen for 4 seconds, then hide it for 3 seconds (Totalling 7 seconds cycle)
      timeout2 = setTimeout(() => {
        setShowPopup(false);
      }, 4000);
    };

    // Initial popup delay so it doesn't fire instantly on page load
    timeout1 = setTimeout(() => {
      runCycle();
      
      // Start the repeating 7-second interval after the first popup cycle begins
      timeout3 = setInterval(() => {
        index = (index + 1) % suggestions.length;
        runCycle();
      }, 7000);
    }, 1000);

    // Cleanup all timers when the component unmounts (crucial for React Strict Mode)
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearInterval(timeout3);
    };
  }, [suggestions]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
          <div className="relative">
            <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-all relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ${showPopup ? 'animate-ping opacity-75' : ''}`}></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
            </button>
            
            {/* Notification Popup */}
            <div className={`absolute top-full right-0 mt-4 w-80 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] p-4 transition-all duration-500 transform origin-top-right ${showPopup ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"}`}>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    {currentSuggestion?.category === 'hydration' ? 'water_drop' : 
                     currentSuggestion?.category === 'activity' ? 'directions_run' : 
                     currentSuggestion?.category === 'sleep' ? 'bedtime' : 
                     currentSuggestion?.category === 'mental_health' ? 'self_improvement' : 'health_and_safety'}
                  </span>
                </div>
                <div>
                  <h6 className="text-sm font-bold text-on-surface mb-1 flex items-center justify-between">
                    Health Suggestion
                    {currentSuggestion?.priority === 'high' && <span className="bg-error/10 text-error text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-2">High</span>}
                  </h6>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                    {currentSuggestion?.suggestion}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
            className={`flex items-center gap-2 p-1.5 rounded-full transition-all ${showProfile ? "bg-primary/10" : "hover:bg-primary/5"}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${showProfile ? "bg-primary text-on-primary" : "bg-primary/10 text-primary"}`}>
              {getInitials(user?.name)}
            </div>
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
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <h3 className="font-[Manrope] font-bold truncate">{user?.name || "Guest User"}</h3>
              <p className="text-sm text-on-surface-variant truncate">{user?.email}</p>
              <span className="text-xs text-primary font-medium flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Active Session
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <Link href="/profile" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">badge</span>
              <span className="text-sm font-medium">My Profile</span>
            </Link>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">history</span>
              <span className="text-sm font-medium">Activity Log</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-left">
              <span className="material-symbols-outlined text-on-surface-variant">help</span>
              <span className="text-sm font-medium">Help & Support</span>
            </button>
            <div className="pt-2 mt-2 border-t border-outline-variant/10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-error/5 transition-colors text-left text-error"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm font-medium">Log Out</span>
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
