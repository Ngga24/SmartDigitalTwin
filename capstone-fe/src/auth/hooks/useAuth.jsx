import { useState } from "react";
import { apiFetch } from "../../utils/api";
import useAuthStore from "../../store/authStore";

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const setAuth = useAuthStore.getState().login;

  const login = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/auth", {
        // Pastikan endpoint ini sesuai dengan backend kamu (sebelumnya /users/login)
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;

      // 1. Ambil status checkin dan username dari response backend
      const isCheckin = data.data.isCheckin;
      const username = data.data.username;
      const role = data.data.role;

      // 2. Simpan semuanya ke localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("isCheckin", isCheckin);
      localStorage.setItem("role", role);
      if (username) localStorage.setItem("username", username);

      setAuth(accessToken, data.data.user || null);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // 3. Bersihkan data user saat logout
    localStorage.removeItem("isCheckin");
    localStorage.removeItem("username");

    // Kalau kamu masih pakai fungsi ini dari utils, biarin aja.
    // Tapi kalau udah full pakai localStorage "isCheckin", baris di bawah bisa dihapus.
    // clearFaceCheckStatus();

    window.location.reload();
  };

  return { login, register, logout, isLoading, error };
}
