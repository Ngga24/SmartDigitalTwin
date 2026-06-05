export const isFaceCheckedToday = () => {
  const lastChecked = localStorage.getItem("face_checked_date");
  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  return lastChecked === today;
};

export const setFaceCheckedToday = () => {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("face_checked_date", today);
};

export const clearFaceCheckStatus = () => {
  localStorage.removeItem("face_checked_date");
};