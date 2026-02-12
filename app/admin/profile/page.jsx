"use client";
import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function AdminProfilePage() {
  const { user, rehydrated } = useAuthStore();

  // Form state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "admin",
    image: "",
    joinedDate: "",
  });
  
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Populate form state from Zustand user
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "admin",
        image: user.image || "",
        joinedDate: user.createdAt || new Date().toISOString(),
      });
      setPreview(user.image || "");
    }
  }, [user]);

  if (!rehydrated) return (
    <div className="h-96 flex items-center justify-center font-black text-gray-300 animate-pulse tracking-widest">
      SYNCHRONIZING...
    </div>
  );

  if (!user) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <AlertCircle className="text-rose-500" size={48} />
      <p className="font-black text-gray-900 uppercase tracking-widest">Session Invalid</p>
    </div>
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setProfile({ ...profile, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // In a real app, you would add an await apiCall here.
      // For now, we update the Zustand store locally.
      useAuthStore.setState({ user: { ...user, ...profile } });
      
      setMessage({ type: "success", text: "Global profile settings synchronized." });
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* 1. IDENTITY BANNER */}
      <div className="relative bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-40 bg-gray-900 relative">
            <div className="absolute inset-0 bg-indigo-600/20 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent"></div>
        </div>
        <div className="px-10 pb-8">
          <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-16">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-36 h-36 rounded-[2.5rem] border-8 border-white bg-gray-100 overflow-hidden shadow-2xl">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-200 bg-white">
                    <User size={60} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-1 right-1 p-2.5 bg-indigo-600 text-white rounded-2xl cursor-pointer hover:bg-gray-900 shadow-xl transition-all group-hover:scale-110 border-4 border-white">
                <Camera size={18} />
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            {/* Basic Info Header */}
            <div className="flex-1 mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{profile.name || "Anonymous User"}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                  <ShieldCheck size={14} /> {profile.role}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-widest">
                  <Calendar size={14} className="text-gray-300" /> Since {new Date(profile.joinedDate).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. MAIN SETTINGS FORM */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Console Identity Details</p>
                {loading && <Loader2 className="animate-spin text-indigo-600" size={16} />}
            </div>
            
            <div className="p-10 space-y-8">
              {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest animate-in slide-in-from-top-2 ${
                  message.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}>
                  {message.type === "success" ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center lg:text-left block">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-[1.2rem] focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center lg:text-left block">Email Workspace</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-[1.2rem] focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-bold transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                 <p className="text-[10px] text-gray-400 font-bold italic">Last synchronized: {new Date().toLocaleTimeString()}</p>
                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all disabled:bg-gray-200 text-xs tracking-widest uppercase"
                  >
                    <Save size={18} /> Sync Account
                  </button>
              </div>
            </div>
          </form>
        </div>

        {/* 3. SIDEBAR INFO */}
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Security Context</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Two-Factor</span>
                        <span className="text-[9px] font-black bg-gray-900 text-white px-2 py-1 rounded">DISABLED</span>
                    </div>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-2xl border border-gray-100 transition-all group">
                        <span className="text-[10px] font-black uppercase tracking-widest">Rotate API Key</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/30 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Support Note</h3>
                <p className="text-xs font-medium text-gray-300 leading-relaxed italic">
                    To modify your Console Privilege (Role), please contact the system proprietor or the lead engineering team.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}