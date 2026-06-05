import DashboardLayout from "../../dashboard/components/DashboardLayout";
import { 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  Compass, 
  AlertTriangle 
} from "lucide-react";

export default function AIInsightPage() {
  const rawData = localStorage.getItem("analyticsResult");
  let result = null;
  
  try {
    result = rawData ? JSON.parse(rawData) : null;
  } catch (err) {
    console.error("Gagal membaca analyticsResult:", err);
  }

  const insight = result?.data?.["3_ai_insight_and_recommendation"] || result?.["3_ai_insight_and_recommendation"];

  // Jika data belum tersedia
  if (!insight) {
    return (
      <DashboardLayout title="AI Insights">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 mx-auto sm:mx-0">
            <Sparkles size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
            Belum ada wawasan AI
          </h2>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Silakan masukkan aktivitas harian Anda terlebih dahulu agar AI dapat menyusun analisis mendalam di halaman ini.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Mapping data ke dalam array 
  const sections = [
    {
      title: "Condition Insight",
      content: insight.condition_insight,
      icon: <Sparkles size={18} />,
      iconBg: "bg-blue-50 text-blue-600",
      cardBorder: "border-slate-100",
    },
    {
      title: "Performance Cause",
      content: insight.performance_cause,
      icon: <TrendingUp size={18} />,
      iconBg: "bg-indigo-50 text-indigo-600",
      cardBorder: "border-slate-100",
    },
    {
      title: "Recommendation",
      content: insight.activity_recommendation,
      icon: <Lightbulb size={18} />,
      iconBg: "bg-emerald-50 text-emerald-600",
      cardBorder: "border-slate-100",
    },
    {
      title: "Tomorrow Prediction",
      content: insight.tomorrow_prediction,
      icon: <Compass size={18} />,
      iconBg: "bg-purple-50 text-purple-600",
      cardBorder: "border-slate-100",
    },
    {
      title: "Burnout Warning",
      content: insight.burnout_warning,
      icon: <AlertTriangle size={18} />,
      iconBg: "bg-rose-50 text-rose-600",
      cardBorder: "border-rose-100 bg-rose-50/10", 
    },
  ];

  return (
    <DashboardLayout title="AI Insights">
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Insights & Recommendations 🧠
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Analisis personal twin berbasis kecerdasan buatan dari data aktivitas Anda
        </p>
      </div>

      <div className="grid gap-5">
        {sections.map((section, index) => (
          <div key={index} className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-200 ${section.cardBorder}`}>
            <div className="flex items-center gap-3 mb-3.5">
              <div className={`w-9 h-9 rounded-xl ${section.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                {section.icon}
              </div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                {section.title}
              </h2>
            </div>

            <div className="pl-0 sm:pl-12">
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {section.content || "Tidak ada data untuk bagian ini."}
              </p>
            </div>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}