import { useMemo } from "react";

export default function useHistory() {
  const historyData = useMemo(() => {
    const result = JSON.parse(
      localStorage.getItem("analyticsResult")
    );

    return (
      result?.data?.[
        "4_similar_productivity_history"
      ] || null
    );
  }, []);

  return {
    historyData,
  };
}