import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

export default function useLoginLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Pastikan endpoint ini sesuai dengan route backend kamu
        const response = await apiFetch("/login-log", {
          method: "GET",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data log");
        }

        setLogs(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, loading, error };
}
