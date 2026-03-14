"use client";
import { useState } from "react";
import Link from "next/link";
import CuraNavbar from "@/components/CuraNavbar";

export default function UserProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "Dr. Rachel Kim",
    phone: "9876543210",
    email: "rachel.kim@cura.health",
    postalCode: "110001",
    city: "New Delhi",
    state: "Delhi",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface font-[Inter] selection:bg-primary/20 selection:text-primary pb-20">
      <CuraNavbar />
      
      <main className="pt-32 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cura" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary hover:bg-primary/10 transition-all">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-[Manrope] font-extrabold text-on-surface">My Profile</h1>
            <p className="text-on-surface-variant text-sm mt-1">Manage your account information and preferences</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white/80 backdrop-blur-3xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl shadow-primary/5 flex items-center gap-6">
            <label className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-on-primary text-3xl font-bold shadow-lg shadow-primary/20 relative group cursor-pointer overflow-hidden">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="relative z-10 group-hover:opacity-0 transition-opacity">
                  {profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <span className="material-symbols-outlined text-white">photo_camera</span>
              </div>
            </label>
            <div>
              <h2 className="text-xl font-bold font-[Manrope]">{profileData.name}</h2>
              <p className="text-primary font-medium text-sm">Neural Oncology Specialist</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Details */}
            <div className="bg-white/80 backdrop-blur-3xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl shadow-primary/5 space-y-6">
              <div className="flex items-center gap-2 text-primary mb-2">
                <span className="material-symbols-outlined">person</span>
                <h3 className="font-bold font-[Manrope] text-lg">Personal Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Phone Number</label>
                  <div className="relative flex items-stretch">
                    <div className="bg-surface-container-high border border-outline-variant/30 border-r-0 rounded-l-xl px-4 flex items-center justify-center text-on-surface font-semibold text-sm select-none">
                      +91
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="w-full bg-surface-container-lowest border border-l-0 border-outline-variant/30 rounded-r-xl py-3 pl-3 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all relative z-10 focus:border-l"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white/80 backdrop-blur-3xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl shadow-primary/5 space-y-6">
              <div className="flex items-center gap-2 text-primary mb-2">
                <span className="material-symbols-outlined">location_on</span>
                <h3 className="font-bold font-[Manrope] text-lg">Location Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={profileData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 group ${
                saveSuccess 
                  ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                  : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container hover:scale-105 active:scale-95 shadow-primary/20"
              } disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed`}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <span className="material-symbols-outlined text-white">check_circle</span>
                  Changes Saved!
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined transition-transform group-hover:-translate-y-0.5">save</span>
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
