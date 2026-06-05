import DashboardLayout from "../components/DashboardLayout";
import useDashboard from "../hooks/useDashboard";
import DailySummary from "../components/DailySummary"; 

import {
  Target,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const username = localStorage.getItem("username") || "User";
  const { dashboardData } = useDashboard();

  if (!dashboardData) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
            Belum ada data analisis
          </h2>
          <p className="text-xs text-slate-400 font-light">
            Silakan isi aktivitas harian terlebih dahulu melalui menu input aktivitas.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const main = dashboardData?.data?.["1_main_dashboard"] || {};
  const summary = dashboardData?.dailySummary || {};

  return (
    <DashboardLayout title="Dashboard">

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {username} 👋
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-light">
          AI Productivity & Personal Twin Overview
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-5">
        <Card
          title="Productivity Status"
          value={main.productivity_status || "-"}
          icon={<Target size={16} />}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />

        <Card
          title="Productivity Score"
          value={`${main.productivity_score ?? 0}%`}
          icon={<Activity size={16} />}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />

        <Card
          title="Prediction Confidence"
          value={`${main.prediction_confidence ?? 0}%`}
          icon={<Brain size={16} />}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        <Card
          title="Fatigue Level"
          value={`${main.fatigue_level ?? 0}%`}
          icon={<AlertTriangle size={16} />}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />

        <Card
          title="Task Completion Rate"
          value={`${main.completion_rate ?? 0}%`}
          icon={<CheckCircle2 size={16} />}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />

        <Card
          title="Risk Signal"
          value={main.risk_signal || "-"}
          icon={<Shield size={16} />}
          iconColor={main.risk_signal === "NORMAL" ? "text-emerald-600" : "text-rose-600"}
          iconBg={main.risk_signal === "NORMAL" ? "bg-emerald-50" : "bg-rose-50"}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Daily Summary
          </h3>

          <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100/50">
            Updated: {summary.last_updated ? summary.last_updated : "Belum ada aktivitas"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
          <SummaryItem label="Sleep" value={`${summary.sleep_duration ?? 0} hrs`} />
          <SummaryItem label="Study / Work" value={`${summary.study_work_duration ?? 0} hrs`} />
          <SummaryItem label="Downtime" value={`${summary.downtime_duration ?? 0} hrs`} />
          <SummaryItem label="Exercise" value={`${summary.exercise_duration ?? 0} min`} />
          <SummaryItem label="Stress" value={`${summary.stress_level ?? 0} / 10`} />
        </div>
      </div>

    </DashboardLayout>
  );
}

function Card({ title, value, icon, iconColor, iconBg }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
          {title}
        </p>
        <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/70">
      <p className="text-slate-400 text-[11px] font-medium tracking-wide uppercase">{label}</p>
      <p className="font-bold text-slate-800 text-sm mt-1">{value}</p>
    </div>
  );
}