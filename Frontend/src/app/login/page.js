"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const indiaStatesAndCities = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"]
  };
  const [selectedState, setSelectedState] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);

    try {
      if (isLogin) {
        // LOGIN
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: formData.get("identifier"),
            password: formData.get("password"),
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Login failed");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("role", "clinician");
        router.push("/cura");
      } else {
        // SIGNUP
        const genderMap = { male: "M", female: "F", other: "Other" };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password") || "defaultPass123",
            mobileNumber: formData.get("phone"),
            gender: genderMap[formData.get("gender")] || "Other",
            age: parseInt(formData.get("age")) || undefined,
            state: formData.get("state") || "",
            district: formData.get("district") || "",
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Registration failed");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("role", "clinician");
        router.push("/cura");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-tertiary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-[2.5rem] p-8 md:p-10 antigravity-shadow relative z-10 transition-all duration-500 ease-in-out">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-6 block hover:scale-105 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-primary/10 flex items-center justify-center overflow-hidden">
              <Image src="/logo.jpg" alt="Cura Logo" width={64} height={64} className="w-full h-full object-cover" />
            </div>
          </Link>
          <h1 className="font-[Manrope] text-3xl font-bold text-on-surface text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-on-surface-variant text-sm mt-2 text-center">
            {isLogin ? "Please enter your details to sign in" : "Join us to manage your health journey"}
          </p>
        </div>

        {/* Form Toggle */}
        <div className="flex p-1 bg-surface-container-high rounded-xl mb-8">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isLogin ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isLogin ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isLogin ? (
            // --- LOGIN FORM ---
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Username / Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Enter your username"
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
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                  />
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
                className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold tracking-wide hover:bg-primary-container transition-all hover:-translate-y-1 shadow-lg shadow-primary/20 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Signing In...</>
                ) : "Sign In"}
              </button>
            </div>
          ) : (
            // --- SIGNUP FORM ---
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">person_add</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
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
                    type="email"
                    name="email"
                    placeholder="john@example.com"
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
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    required
                    minLength={6}
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
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    required
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
                      defaultValue=""
                      required
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
                      type="number"
                      name="age"
                      placeholder="e.g. 25"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">State</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px] pointer-events-none">map</span>
                    <select
                      name="state"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Select State</option>
                      {Object.keys(indiaStatesAndCities).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">District / City</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px] pointer-events-none">location_city</span>
                    <select
                      name="district"
                      defaultValue=""
                      required
                      disabled={!selectedState}
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled hidden>Select City</option>
                      {selectedState && indiaStatesAndCities[selectedState].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 bg-primary text-on-primary rounded-xl font-bold tracking-wide hover:bg-primary-container transition-all hover:-translate-y-1 shadow-lg shadow-primary/20 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Creating Account...</>
                ) : "Create Account"}
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-outline-variant/20 pt-6">
          <p className="text-xs text-on-surface-variant">
            By continuing, you agree to Cura&apos;s <Link href="#" className="font-semibold text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
