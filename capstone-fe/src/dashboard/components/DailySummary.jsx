import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function DailySummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await apiFetch("/analytics/dailySummary"); // Sesuaikan endpoint
        const result = await response.json();
        if (result.status === "success") {
          setData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil summary:", error);
      }
    };
    fetchSummary();
  }, []);

  if (!data) return <div className="p-8 text-center text-slate-400">Loading summary...</div>;

  const { dailySummary: s } = data;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-5">Daily Summary</h2>
      
      {/* Jika data masih kurang untuk AI */}
      {data.ai_status === "waiting_for_data" && (
        <div className="mb-4 text-xs bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-100">
          AI prediction needs {6 - data.current_logs_count} more day(s) of data.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryItem label="SLEEP" value={`${s.sleep_duration} hrs`} />
        <SummaryItem label="STUDY / WORK" value={`${s.study_work_duration} hrs`} />
        <SummaryItem label="DOWNTIME" value={`${s.downtime_duration} hrs`} />
        <SummaryItem label="EXERCISE" value={`${s.exercise_duration} min`} />
        <SummaryItem label="STRESS" value={`${data.dailySummary.stress_level || 0} / 10`} />
      </div>
      
      <p className="text-[10px] text-slate-400 mt-4 text-right">
        Last updated: {s.last_updated}
      </p>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}