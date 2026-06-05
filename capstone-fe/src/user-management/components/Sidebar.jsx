import { Users, LogOut, History } from "lucide-react"; // Tambahkan History di sini
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("analyticsResult");

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
      {/* HEADER SECTION */}
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
              Admin & User Management
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION SECTION - Cukup 1 tag nav untuk semua menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <NavLink to="/user-management" className={menuClass}>
          <Users size={18} />
          User Management
        </NavLink>

        <NavLink to="/login-log" className={menuClass}>
          <History size={18} />
          System Logs
        </NavLink>
      </nav>

      {/* FOOTER SECTION */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white rounded-xl p-3.5 mb-3 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {username}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                Administrator
              </p>
            </div>
          </div>
        </div>

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
