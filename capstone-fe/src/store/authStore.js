import { create } from "zustand";
import { apiFetch } from "../utils/api"; // Pastikan path benar

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,

  // Fungsi untuk mengambil data user saat refresh
  hydrate: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await apiFetch("/auth");
      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("isCheckin", userData.isCheckin);

        set({ isAuthenticated: true, user: data.data.user });
      } else {
        // Jika token invalid, logout otomatis
        localStorage.removeItem("accessToken");
        set({ isAuthenticated: false, user: null });
      }
    } catch (err) {
      set({ isAuthenticated: false, user: null });
    }
  },

  login: (accessToken, userData) => {
    set({ isAuthenticated: true, user: userData });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ isAuthenticated: false, user: null });
  },
}));

export default useAuthStore;
