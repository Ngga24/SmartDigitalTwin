export default function SimilarHistory({ historyData }) {
  if (!historyData || !historyData.top_3_similar_days) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Similar Productivity Days</h2>
      <div className="space-y-3">
        {historyData.top_3_similar_days.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.date}</p>
              <p className="text-xs text-slate-500">Category: {item.historical_category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-600">{item.similarity_score}</p>
              <p className="text-[10px] text-slate-400">Score: {item.historical_productivity_score}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 text-right">
        Avg. Similarity Score: <strong>{historyData.average_productivity_from_similar_days}</strong>
      </div>
    </div>
  );
}