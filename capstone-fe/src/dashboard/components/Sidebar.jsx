import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Brain,
  ClipboardList,
  LogOut,
  BarChart3,
  History
} from "lucide-react";
import { NavLink, useNavigate, Link } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  // State untuk menyimpan data user agar reaktif
  const [username, setUsername] = useState(localStorage.getItem("username") || "User");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || null);

  useEffect(() => {
    // Fungsi untuk memperbarui state dari localStorage
    const updateSidebarData = () => {
      setUsername(localStorage.getItem("username") || "User");
      setProfileImage(localStorage.getItem("profileImage"));
    };

    // Dengarkan event "profileUpdated" dari halaman lain
    window.addEventListener("profileUpdated", updateSidebarData);

    // Bersihkan listener saat komponen di-unmount
    return () => window.removeEventListener("profileUpdated", updateSidebarData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("profileImage");
    navigate("/");
  };

  const menuClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
    transition-all duration-200
    ${
      isActive
        ? "bg-blue-50 text-blue-600 border border-blue-100/50 shadow-sm shadow-blue-500/5"
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
    }
  `;

  return (
    <aside className="w-72 min-h-screen bg-white text-slate-800 flex flex-col border-r border-slate-200/60 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            Twin
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              Digital Twin
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              AI Productivity System
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <NavLink to="/dashboard" className={menuClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/ai-insights" className={menuClass}>
          <Brain size={18} />
          AI Insights
        </NavLink>
        <NavLink to="/input-activity" className={menuClass}>
          <ClipboardList size={18} />
          Input Activity
        </NavLink>
        <NavLink to="/analytics" className={menuClass}>
          <BarChart3 size={18} />
          Analytics
        </NavLink>
        <NavLink to="/history" className={menuClass}>
          <History size={18} />
          Similar History
        </NavLink>
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Link 
          to="/profile"
          className="block bg-white rounded-xl p-3.5 mb-3 border border-slate-100 shadow-sm hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden border border-slate-200">
              {/* Ubah ini */}
{profileImage ? <img src={`${profileImage}?t=${new Date().getTime()}`} alt="User" className="w-full h-full object-cover" /> : null}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {username}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                Active AI User
              </p>
            </div>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/70 border border-red-100 transition-colors duration-200"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}