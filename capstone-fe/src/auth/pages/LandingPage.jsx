import HeroSection from "../components/HeroSection";
import AuthForm from "../components/AuthForm";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">

      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 border border-blue-200/30 rounded-full animate-spin-slow" />

        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 border border-cyan-200/20 rounded-full animate-spin-reverse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

        <div className="flex-1 w-full max-w-2xl text-center lg:text-left">
          <HeroSection />
        </div>

        <div className="flex-1 w-full flex justify-center">
          <div className="w-full max-w-md relative">

            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10" />

            <AuthForm />

          </div>
        </div>

      </div>
    </div>
  );
}