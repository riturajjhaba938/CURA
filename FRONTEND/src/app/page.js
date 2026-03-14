"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("patient");
  const [formTransition, setFormTransition] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setShowPortal(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role) setRole(user.role);
    }
  }, []);

  // Animate transition from auth → portal selector
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin 
        ? { identifier: data.identifier, password: data.password }
        : { 
            name: data.name, 
            email: data.email, 
            password: data.password, 
            mobileNumber: data.mobileNumber,
            gender: data.gender === "male" ? "M" : data.gender === "female" ? "F" : "Other",
            age: data.age,
            state: data.state,
            district: data.district
          };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.errors?.[0] || "Authentication failed");
      }

      // Success
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result));
      
      setFormTransition(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        setTimeout(() => setShowPortal(true), 50);
      }, 500);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Toggle between login and signup with a smooth crossfade
  const toggleForm = (toLogin) => {
    setFormTransition(true);
    setTimeout(() => {
      setIsLogin(toLogin);
      setFormTransition(false);
    }, 300);
  };

  // ───────────── AUTH SCREEN ─────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-tertiary/20 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] animate-pulse [animation-delay:2s]"></div>

        <div
          className={`w-full max-w-md glass-card rounded-[2.5rem] p-8 md:p-10 antigravity-shadow relative z-10 transition-all duration-500 ease-in-out ${
            formTransition ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
          }`}
          style={{ animation: "fadeInUp 0.7s ease forwards" }}
        >
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="mb-6 block hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-primary/10 flex items-center justify-center overflow-hidden">
                <Image src="/logo.jpg" alt="Cura Logo" width={64} height={64} className="w-full h-full object-cover" />
              </div>
            </div>
            <h1 className="font-[Manrope] text-3xl font-bold text-on-surface text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 text-center">
              {isLogin ? "Sign in to continue to Cura" : "Join us to start your health journey"}
            </p>
          </div>

          {/* Form Toggle */}
          <div className="flex p-1 bg-surface-container-high rounded-xl mb-8">
            <button
              type="button"
              onClick={() => toggleForm(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isLogin ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => toggleForm(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                !isLogin ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium flex items-center gap-2 animate-shake">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleAuth} className="space-y-5">
            {isLogin ? (
              /* ─── LOGIN FORM ─── */
              <div className="space-y-5" style={{ animation: "fadeInUp 0.4s ease forwards" }}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Username / Email</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                    <input
                      name="identifier"
                      type="text"
                      placeholder="Enter your username or email"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                    <input
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showLoginPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary" />
                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                  </label>
                  <button type="button" className="text-sm font-bold text-primary hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold tracking-wide hover:bg-primary-container transition-all hover:-translate-y-1 shadow-lg shadow-primary/20 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">login</span>
                      Sign In
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* ─── SIGNUP FORM ─── */
              <div className="space-y-5" style={{ animation: "fadeInUp 0.4s ease forwards" }}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">person_add</span>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Phone Number</label>
                  <div className="relative flex items-stretch">
                    <div className="bg-surface-container-high border border-outline-variant/30 border-r-0 rounded-l-xl px-4 flex items-center justify-center text-on-surface font-semibold text-sm select-none">
                      +91
                    </div>
                    <input
                      name="mobileNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      required
                      pattern="[0-9]{10}"
                      className="w-full bg-surface-container-lowest border border-l-0 border-outline-variant/30 rounded-r-xl py-3 pl-3 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50 relative z-10 focus:border-l"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Gender</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px] pointer-events-none">wc</span>
                      <select
                        name="gender"
                        required
                        defaultValue=""
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled hidden>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Age</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">cake</span>
                      <input
                        name="age"
                        type="number"
                        placeholder="Enter age"
                        required
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">State</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">map</span>
                      <input
                        name="state"
                        type="text"
                        placeholder="State"
                        required
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">District</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">location_on</span>
                      <input
                        name="district"
                        type="text"
                        placeholder="District"
                        required
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                    <input
                      name="password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Create a password"
                      required
                      minLength={6}
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showSignupPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 bg-primary text-on-primary rounded-xl font-bold tracking-wide hover:bg-primary-container transition-all hover:-translate-y-1 shadow-lg shadow-primary/20 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">person_add</span>
                      Create Account
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-outline-variant/20 pt-6">
            <p className="text-xs text-on-surface-variant">
              By continuing, you agree to Cura&apos;s{" "}
              <Link href="#" className="font-semibold text-primary hover:underline">Terms of Service</Link> and{" "}
              <Link href="#" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ───────────── PORTAL SELECTOR (after auth) ─────────────
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-fixed-dim opacity-10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary-container opacity-20 blur-[100px] rounded-full animate-pulse [animation-delay:1s]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] animate-pulse [animation-delay:2s]"></div>

      <div
        className={`relative z-10 text-center space-y-12 max-w-3xl px-6 transition-all duration-700 ease-out ${
          showPortal ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
            Clinical Intelligence Platform
          </span>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center gap-6">
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

        {/* Welcome message */}
        <p className="text-on-surface-variant text-lg font-medium">
          Where would you like to go?
        </p>

        {/* Role Toggle Swapper */}
        <div className="bg-surface-container-high p-1.5 rounded-2xl inline-flex items-center">
          <button
            onClick={() => setRole("patient")}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              role === "patient" ? "bg-white text-primary shadow-md" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg mr-2 align-middle">person</span>
            My Health
          </button>
          <button
            onClick={() => setRole("clinician")}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              role === "clinician" ? "bg-white text-primary shadow-md" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg mr-2 align-middle">stethoscope</span>
            Clinicians
          </button>
        </div>

        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed h-20">
          {role === "patient"
            ? "Your personal healthcare companion. Access your medical history, recovery path, and daily health metrics in one secure place."
            : "AI-powered clinical intelligence aggregating real-world evidence and patient data for precision diagnostics."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={role === "patient" ? "/patient" : "/cura"}
            className="px-10 py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg hover:bg-primary-container transition-all antigravity-shadow flex items-center justify-center gap-3 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-primary/20"
          >
            <span className="material-symbols-outlined text-2xl">
              {role === "patient" ? "favorite" : "query_stats"}
            </span>
            Enter {role === "patient" ? "Patient Portal" : "Clinical Portal"}
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-on-surface-variant font-medium">
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
