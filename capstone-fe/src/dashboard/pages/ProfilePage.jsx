import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import useProfile from "../hooks/useProfile";
import { User, Upload, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, setProfile, profileImage, loading, error, updateProfile } = useProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Cleanup preview URL untuk performance
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('error', "Ukuran file terlalu besar (Max 2MB)");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("full_name", profile.full_name || "");
      formData.append("phone", profile.phone || "");
      formData.append("birth_date", profile.birth_date || "");
      formData.append("gender", profile.gender || "");
      
      if (selectedFile) {
        formData.append("profile_image", selectedFile);
      }

      const result = await updateProfile(formData);

      if (result?.data?.profile_image) {
        const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://dtwin.projectbase.my.id";
        const path = result.data.profile_image.replace(/^\//, "");
        const imageUrl = `${baseUrl}/${path}`;

        localStorage.setItem("profileImage", imageUrl);
        window.dispatchEvent(new Event("profileUpdated"));
      }

      showToast('success', result.message || "Profil berhasil diperbarui!");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      console.error(err);
      showToast('error', err.message || "Gagal memperbarui profil");
    }
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Account Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal information and profile picture.</p>
        </div>

        {toast.show && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-white transition-all transform animate-in slide-in-from-right-10 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 hover:opacity-70"><X size={16} /></button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Foto Profil */}
            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-100">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md">
                <img 
                  src={previewUrl || profileImage || "/default-avatar.png"} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Profile Picture</h3>
                <p className="text-xs text-slate-400 mb-3">PNG, JPG up to 2MB</p>
                <input type="file" accept="image/png, image/jpeg" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition">
                  <Upload size={14} /> Change Photo
                </button>
              </div>
            </div>

            {/* Form Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <input name="full_name" value={profile.full_name || ""} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                <input name="phone" value={profile.phone || ""} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Birth Date</label>
                <input type="date" name="birth_date" value={profile.birth_date || ""} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
                <select name="gender" value={profile.gender || ""} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition bg-white">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button 
                type="submit" 
                disabled={loading} 
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}