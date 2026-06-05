import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated } = useAuthStore();

  // Ambil role & status checkin dari localStorage
  const role = localStorage.getItem("role") || "user";
  const isCheckin = localStorage.getItem("isCheckin") === "true";

  // 1. Belum login? Tendang ke Landing Page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 2. Cek Hak Akses Role
  // Kalau rute ini punya batasan role, dan role user saat ini dilarang masuk
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/user-management" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 3. Cek Face Check (KHUSUS USER)
  // Admin bebas lewat, logika ini cuma nangkep user biasa!
  if (role === "user" && !isCheckin) {
    return <Navigate to="/face-check" replace />;
  }

  // Lolos semua hadangan, silakan masuk
  return children;
}
