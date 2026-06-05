import { useMemo } from "react";
import useDashboard from "../../dashboard/hooks/useDashboard";

export default function useAnalytics() {
  const { dashboardData, loading, error } = useDashboard();

  // PERBAIKAN: Tambahkan sisipan '.data' di sini
  const analytics = dashboardData?.data?.["2_productivity_analytics_dashboard"] || {};

  const chartData = useMemo(() => {
    return analytics.daily_productivity_chart || [];
  }, [analytics]);

  const heatmap = useMemo(() => {
    return analytics.activity_heatmap || {};
  }, [analytics]);

  const summary = useMemo(() => {
    return {
      weeklyTrend: analytics.weekly_productivity_trend || "-",
      dominantActivity: analytics.most_dominant_activity || "-",
      peakHours: analytics.peak_productive_hours || "-",
    };
  }, [analytics]);

  return {
    loading,
    error,
    analytics,
    chartData,
    heatmap,
    summary,
  };
}