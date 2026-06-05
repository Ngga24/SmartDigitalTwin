import DashboardLayout from "../../dashboard/components/DashboardLayout";
import useHistory from "../hooks/useHistory";

export default function HistoryPage() {
  const { historyData } = useHistory();

  if (!historyData) {
    return (
      <DashboardLayout title="History">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">No historical data</h2>
          <p className="text-sm text-slate-400">Analisis produktivitas belum tersedia untuk ditampilkan.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="History">
      {/* Summary */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">
          Average Productivity (Similar Days)
        </h2>
        <div className="flex items-end gap-2">
          <span className="text-6xl font-extrabold text-blue-600">
            {historyData.average_productivity_from_similar_days}
          </span>
          <span className="text-xl font-bold text-slate-400 mb-2">%</span>
        </div>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Dihitung berdasarkan hari-hari dengan pola produktivitas yang serupa.
        </p>
      </div>

      {/* Similar Days List */}
      <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Top Similar Days</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {historyData.top_3_similar_days.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-slate-800">{item.date}</h3>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                {item.historical_category}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Similarity</p>
                <p className="text-2xl font-extrabold text-slate-800">{item.similarity_score}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Productivity Score</p>
                <p className="text-lg font-semibold text-slate-700">{item.historical_productivity_score}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}