import { useState } from "react";
import DashboardLayout from "../../dashboard/components/DashboardLayout";
import useActivity from "../../activity/hooks/useActivity";

export default function InputActivityPage() {
  const { submitActivity, loading, error } = useActivity();

  const [form, setForm] = useState({
    sleep_duration: "",
    study_work_duration: "",
    exercise_duration: "",
    downtime_duration: "",
    task_planned: "",
    task_completed: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Menjaga input hanya boleh angka dan titik desimal
    const cleanValue = value.replace(/[^0-9.]/g, "");

    setForm({
      ...form,
      [name]: cleanValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      sleep_duration: Number(form.sleep_duration),
      study_work_duration: Number(form.study_work_duration),
      exercise_duration: Number(form.exercise_duration),
      downtime_duration: Number(form.downtime_duration),
      task_planned: Number(form.task_planned),
      task_completed: Number(form.task_completed),
    };

    if (payload.task_completed > payload.task_planned) {
      alert("Task completed tidak boleh lebih besar dari task planned");
      return;
    }

    await submitActivity(payload);
  };

  // Styling input minimalis dengan fokus ring biru transparan yang halus
  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 " +
    "outline-none transition-all duration-200 text-sm font-medium " +
    "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white placeholder:text-slate-400";

  // Pembagian field ke dalam kategori agar form lebih scannable
  const fields = [
    {
      name: "sleep_duration",
      label: "Sleep Duration (hours)",
      placeholder: "e.g. 7",
    },
    {
      name: "study_work_duration",
      label: "Study / Work Duration (hours)",
      placeholder: "e.g. 6.5",
    },
    {
      name: "exercise_duration",
      label: "Exercise Duration (minutes)",
      placeholder: "e.g. 1",
    },
    {
      name: "downtime_duration",
      label: "Downtime Duration (hours)",
      placeholder: "e.g. 2",
    },
    {
      name: "task_planned",
      label: "Task Planned (total)",
      placeholder: "e.g. 10",
    },
    {
      name: "task_completed",
      label: "Task Completed (total)",
      placeholder: "e.g. 8",
    },
  ];

  return (
    <DashboardLayout title="Input Activity">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Daily Activity Input 📝
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-light">
              Masukkan metrik aktivitas harian Anda untuk memperbarui
              visualisasi dashboard dan analisis AI Twin.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-medium transition-all">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {field.label}
                  </label>

                  <input
                    name={field.name}
                    type="text"
                    inputMode="decimal"
                    value={form[field.name]}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-600/10 transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading
                  ? "Processing AI Analysis..."
                  : "Save & Analyze Activity"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
