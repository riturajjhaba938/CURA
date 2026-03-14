"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CuraNavbar from "@/components/CuraNavbar";

export default function UserProfile() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    state: "",
    gender: "",
    age: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  // Fetch real profile data from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // No token, fallback to cached user data or redirect
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          const user = JSON.parse(cachedUser);
          setProfileData({
            name: user.name || "",
            phone: user.mobileNumber || "",
            email: user.email || "",
            district: user.district || "",
            state: user.state || "",
            gender: user.gender || "",
            age: user.age || "",
          });
          setIsLoading(false);
        } else {
          router.push("/");
        }
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        setProfileData({
          name: data.name || "",
          phone: data.mobileNumber || "",
          email: data.email || "",
          district: data.district || "",
          state: data.state || "",
          gender: data.gender || "",
          age: data.age || "",
        });

        // Update localStorage cache too
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        setError(err.message);
        // Fallback to cached data
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          const user = JSON.parse(cachedUser);
          setProfileData({
            name: user.name || "",
            phone: user.mobileNumber || "",
            email: user.email || "",
            district: user.district || "",
            state: user.state || "",
            gender: user.gender || "",
            age: user.age || "",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          mobileNumber: profileData.phone,
          gender: profileData.gender,
          age: profileData.age ? parseInt(profileData.age) : undefined,
          state: profileData.state,
          district: profileData.district,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update localStorage with fresh data from backend
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...data }));

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getGenderLabel = (g) => {
    if (g === "M") return "Male";
    if (g === "F") return "Female";
    return g || "Not set";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant text-sm font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

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

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">warning</span>
            {error}
          </div>
        )}

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
                  {getInitials(profileData.name)}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <span className="material-symbols-outlined text-white">photo_camera</span>
              </div>
            </label>
            <div>
              <h2 className="text-xl font-bold font-[Manrope]">{profileData.name || "Guest User"}</h2>
              <p className="text-primary font-medium text-sm">{profileData.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                  {getGenderLabel(profileData.gender)}
                </span>
                {profileData.age && (
                  <span className="text-xs px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full font-semibold">
                    Age: {profileData.age}
                  </span>
                )}
              </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Gender</label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleChange}
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleChange}
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider pl-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={profileData.district}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                  />
                </div>
              </div>

              {/* Account Info Card */}
              <div className="mt-6 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-base">info</span>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Account Info</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Account ID</span>
                    <span className="font-mono text-xs text-primary">{JSON.parse(localStorage.getItem("user") || "{}")?._id?.slice(-8) || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Member Since</span>
                    <span className="font-medium">{
                      (() => {
                        const user = JSON.parse(localStorage.getItem("user") || "{}");
                        if (user.createdAt) {
                          return new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
                        }
                        return "Recently";
                      })()
                    }</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Status</span>
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="px-6 py-3 rounded-xl font-bold text-error bg-error/5 border border-error/20 hover:bg-error/10 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Log Out
            </button>

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
