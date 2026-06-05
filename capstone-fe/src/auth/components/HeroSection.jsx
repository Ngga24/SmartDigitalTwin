import TypewriterText from "./TypewriterText";

export default function HeroSection() {
  return (
    <div className="max-w-xl flex flex-col justify-center p-4 md:p-0">

      <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-3">
        AI Analytics Platform
      </p>

      <h1 className="tracking-tight mb-6 select-none leading-tight">

        <TypewriterText
          text="Smart Digital Twin"
          speed={100}
          delay={0}
          className="text-3xl md:text-4xl font-extrabold text-slate-900 block"
        />

        <TypewriterText
          text="System for Personal Productivity Prediction"
          speed={40}
          delay={2000}
          className="block mt-1 text-slate-500 font-medium text-lg md:text-xl tracking-normal"
        />

      </h1>

      <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed font-normal text-left">
        <p>
          Smart Digital Twin System for Personal Productivity Prediction adalah platform
          berbasis{" "}
          <span className="text-blue-600 font-medium">
            Artificial Intelligence
          </span>{" "}
          yang dirancang untuk membantu pengguna memahami pola aktivitas harian
          secara lebih mendalam.
        </p>

        <p>
          Sistem ini membangun representasi digital personal berdasarkan
          kebiasaan Anda untuk menganalisis tingkat produktivitas, memberikan
          insight, serta memprediksi performa di masa depan secara efektif.
        </p>
      </div>

    </div>
  );
}