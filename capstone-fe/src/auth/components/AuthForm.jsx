import useAuth from "../hooks/useAuth";
import useOtp from "../hooks/useOtp";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [mode, setMode] = useState("auth");
  const [step, setStep] = useState("form");

  const [emailVerify, setEmailVerify] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const { login, register, isLoading } = useAuth();
  const { verifyOtp, isLoading: otpLoading } = useOtp();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isLogin) {
        const result = await login({
          identifier: formData.email,
          password: formData.password,
        });

        if (result.data.role === "admin") {
          navigate("/user-management");
        } else {
          if (result.data.isCheckin) {
            navigate("/dashboard");
          } else {
            navigate("/face-check");
          }
        }
      } else {
        await register(formData);
        setEmailVerify(formData.email);
        setStep("otp");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(emailVerify, otpCode);
      navigate("/face-check");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (mode === "forgot") {
    return <ForgotPasswordPage onBack={() => setMode("auth")} />;
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm outline-none transition-all duration-200 " +
    "focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 transition-all duration-300">
        <div className="mb-6 text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold tracking-wider">
            AI
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {step === "otp"
              ? "Verify OTP"
              : isLogin
                ? "Welcome Back"
                : "Create Account"}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            {step === "otp"
              ? "Enter the code sent to your email"
              : "Smart productivity dashboard"}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
            {errorMessage}
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="fullname"
                  type="text"
                  placeholder="Full name"
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            )}
            <input
              name="email"
              type="email"
              placeholder="Email address"
              onChange={handleChange}
              className={inputClass}
            />
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              disabled={isLoading}
              className="w-full py-2.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm shadow-blue-600/10 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading
                ? "Processing..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtp} className="space-y-4">
            <p className="text-center text-xs text-slate-500">
              Sent to{" "}
              <span className="text-slate-800 font-medium">{emailVerify}</span>
            </p>
            <input
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              placeholder="000000"
              className="w-full text-center tracking-[0.6em] text-xl py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono font-semibold"
            />
            <button
              disabled={otpLoading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all"
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === "form" && (
          <div className="mt-5 flex flex-col items-center space-y-2.5 text-xs border-t border-slate-100 pt-4">
            <div className="text-slate-500">
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors ml-0.5"
              >
                {isLogin ? "Daftar di sini" : "Back to login"}
              </button>
            </div>
            {isLogin && (
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
