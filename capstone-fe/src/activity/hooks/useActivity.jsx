import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export default function useActivity() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitActivity = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/analytics/predict", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Backend Error:", data);

        throw new Error(
          data?.message ||
          data?.error ||
          "Prediction failed"
        );
      }

      // Menyimpan berkas hasil prediksi AI ke storage lokal
      localStorage.setItem(
        "analyticsResult",
        JSON.stringify(data)
      );

      // Memicu trigger event global agar layar dashboard sinkron secara realtime
      window.dispatchEvent(new Event("analytics-updated"));

      // Redirect kembali ke gerbang utama dashboard
      navigate("/dashboard");

      return data;
    } catch (err) {
      setError(err.message);
      console.error("submitActivity error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitActivity,
    loading,
    error,
  };
}