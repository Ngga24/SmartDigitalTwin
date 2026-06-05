import { useEffect, useState } from "react";

export default function useDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    try {
      setLoading(true);

      const raw = localStorage.getItem("analyticsResult");
      console.log("RAW analyticsResult:", raw);

      if (!raw) {
        setDashboardData(null);
        return;
      }

      const parsed = JSON.parse(raw);
      console.log("PARSED:", parsed);

      // PERBAIKAN: Simpan root object (parsed) agar dailySummary tidak hilang
      setDashboardData(parsed);

    } catch (err) {
      console.error("useDashboard parse error:", err);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    window.addEventListener("analytics-updated", load);
    window.addEventListener("storage", load);

    return () => {
      window.removeEventListener("analytics-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return { dashboardData, loading };
}