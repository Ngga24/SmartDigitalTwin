import React from "react";
import DashboardLayout from "../../dashboard/components/DashboardLayout";
import useAnalytics from "../hooks/useAnalytics";
import { ChevronDown, Loader2, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const { chartData, heatmap, summary, loading, error } = useAnalytics();

  if (loading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 p-6">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Memuat data analitik...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Analytics">
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Gagal Memuat Data</h3>
          <p className="text-slate-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Kalkulasi rata-rata produktivitas (jika tidak ada dari backend)
  const calculateAverage = () => {
    if (!chartData || chartData.length === 0) return 0;
    const total = chartData.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(total / chartData.length);
  };
  const averageProductivity = summary?.averageProductivity || calculateAverage();

  return (
    <DashboardLayout title="Analytics">
      <div className="min-h-full bg-white p-2 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Productivity Analytics
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-light">
                Understand your activity patterns and productivity trends
              </p>
            </div>

            <button className="flex items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors border border-slate-200/60">
              Last 7 Days
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6 tracking-tight">
              Daily Productivity Chart
            </h2>
            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  
                  {/* Sumbu X membaca 'date' dari backend kamu */}
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }} 
                    ticks={[0, 30, 60, 80, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                  />
                  
                  {/* Kurva membaca 'score' dari backend */}
                  <Area
                    type="natural"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center min-h-[110px]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                Weekly Productivity Trend
              </h3>
              <p className="text-2xl font-extrabold text-[#D97706] tracking-tight truncate">
                {summary?.weeklyTrend || "N/A"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center min-h-[110px]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                Most Dominant Activity
              </h3>
              <p className="text-2xl font-extrabold text-[#3B82F6] tracking-tight truncate capitalize">
                {summary?.dominantActivity || "N/A"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between min-h-[110px]">
              <div className="min-w-0 pr-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Peak Productive Hours
                </h3>
                <p className="text-xl font-extrabold text-[#06B6D4] tracking-tight truncate">
                  {summary?.peakHours || "N/A"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Your Most Productive Period
                </p>
              </div>
              
              <div className="flex items-end gap-1 h-11 mt-2 flex-shrink-0">
                {[ "40%", "100%", "80%", "30%", "20%" ].map((height, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div 
                      className={`w-2.5 rounded-sm ${i === 1 ? 'bg-[#06B6D4]' : 'bg-[#CFFAFE]'}`} 
                      style={{ height }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between min-h-[110px]">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Average Productivity
                </h3>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-extrabold text-[#A855F7] tracking-tight">
                    {averageProductivity}
                  </span>
                  <span className="text-sm font-semibold text-[#D8B4FE]">/100</span>
                </div>
              </div>

              {/* Mini Thick Bar Chart Visual */}
              <div className="flex items-end gap-1.5 h-12 flex-shrink-0">
                <div className="w-4 bg-slate-100 rounded-md" style={{ height: "100%" }} />
                <div className="w-4 bg-[#8B5CF6] rounded-md" style={{ height: "80%" }} />
                <div className="w-4 bg-[#A855F7] rounded-md" style={{ height: "55%" }} />
              </div>
            </div>

          </div>

          {heatmap && Object.keys(heatmap).length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">
                Activity Distribution
              </h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
                {Object.entries(heatmap).map(([day, value]) => (
                  <div
                    key={day}
                    className="p-3 rounded-xl border border-slate-50 bg-slate-50/50 text-center hover:bg-slate-100 hover:border-slate-200 transition-colors duration-200"
                  >
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {day}
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </DashboardLayout>
  );
}