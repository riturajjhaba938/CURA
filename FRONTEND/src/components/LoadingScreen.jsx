"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoadingScreen({ children }) {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1600);
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return children;

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-400 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #e8f4f5 0%, #f0f7f8 30%, #ffffff 50%, #f5f9fa 70%, #e8f4f5 100%)",
        }}
      >
        {/* Animated bg orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/8 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-container/20 rounded-full blur-[100px] animate-pulse [animation-delay:0.5s]"></div>

        {/* Logo */}
        <div className="relative mb-8 animate-scaleIn">
          <div className="w-28 h-28 rounded-3xl bg-white shadow-2xl shadow-primary/15 flex items-center justify-center overflow-hidden p-2">
            <Image
              src="/logo.jpg"
              alt="Cura"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
          <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-xl -z-10 animate-pulse"></div>
        </div>

        {/* Brand text */}
        <h1 className="font-[Manrope] text-5xl font-extrabold tracking-tight text-primary mb-3 animate-fadeInUp [animation-delay:0.3s] opacity-0">
          Cura
        </h1>
        <p className="text-on-surface-variant text-sm font-medium tracking-widest uppercase animate-fadeInUp [animation-delay:0.5s] opacity-0">
          Clinical Intelligence Platform
        </p>

        {/* Loading bar */}
        <div className="mt-10 w-48 h-1 bg-surface-container-high rounded-full overflow-hidden animate-fadeInUp [animation-delay:0.7s] opacity-0">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
            style={{
              animation: "loadingBar 1.6s ease-in-out forwards",
            }}
          ></div>
        </div>

        {/* Pulse dots */}
        <div className="mt-6 flex gap-2 animate-fadeInUp [animation-delay:0.9s] opacity-0">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.3s]"></div>
        </div>
      </div>
      <div className={fadeOut ? "opacity-100" : "opacity-0"}>{children}</div>
    </>
  );
}
