import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useForgotPassword from "../hooks/useForgotPassword";

export default function ForgotPasswordPage({ onBack }) {
  const [step, setStep] = useState("email"); // email, otp, reset
  const [email, setEmail] = useState("");
  const [code, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // State untuk Timer & Toast
  const [timer, setTimer] = useState(0);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, resetPassword, isLoading } = useForgotPassword();

  // Load timer dari localStorage saat komponen dimuat untuk menjaga persistensi
  useEffect(() => {
    const savedExpiry = localStorage.getItem("otp_expires_at");
    if (savedExpiry) {
      const remaining = Math.round((parseInt(savedExpiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        setStep("otp");
      } else {
        localStorage.removeItem("otp_expires_at");
      }
    }
  }, []);

  // Interval untuk hitung mundur
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            localStorage.removeItem("otp_expires_at");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) return setErrorMessage("Email tidak boleh kosong");
    setErrorMessage("");

    try {
      await sendOtp(email);
      const duration = 300; // 5 menit
      const expiryTime = Date.now() + duration * 1000;
      
      localStorage.setItem("otp_expires_at", expiryTime);
      setTimer(duration);
      setStep("otp");
      showToast('success', "OTP berhasil dikirim ke email Anda");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!code) return setErrorMessage("Kode OTP wajib diisi");
    setErrorMessage("");

    try {
      const data = await verifyOtp(email, code);
      const token = data?.data?.token || data?.token || "";
      setResetToken(token);
      setStep("reset");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (newPassword !== confirmPassword) return setErrorMessage("Konfirmasi password tidak cocok");

    try {
      await resetPassword(resetToken, newPassword);
      localStorage.removeItem("otp_expires_at");
      showToast('success', "Password berhasil diubah!");
      setTimeout(() => (onBack ? onBack() : navigate("/")), 1500);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";
  const buttonClass = "w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm shadow-blue-600/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-6 font-sans">
      
      {/* Toast Notification (Top Center) */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-white transition-all transform animate-in slide-in-from-top-10 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-medium">{toast.message}</p>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 hover:opacity-70"><X size={16} /></button>
        </div>
      )}

      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 relative">
        {step !== "reset" && (
          <button 
            onClick={() => step === "otp" ? setStep("email") : (onBack ? onBack() : navigate("/"))} 
            className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold tracking-wider">AI</div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {step === "email" ? "Forgot Password" : step === "otp" ? "Verify OTP" : "Reset Password"}
          </h2>
        </div>

        {errorMessage && <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">{errorMessage}</div>}

        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
            <button type="submit" disabled={isLoading} className={buttonClass}>{isLoading ? "Processing..." : "Kirim Kode OTP"}</button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-slate-500 text-xs">Sent to <span className="text-slate-800 font-medium">{email}</span></p>
            <input type="text" value={code} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="000000" className="w-full text-center tracking-[0.6em] text-xl py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono font-semibold" required />
            
            <button type="submit" disabled={isLoading} className={buttonClass}>{isLoading ? "Verifying..." : "Verify OTP"}</button>
            
            <button 
              type="button" 
              onClick={handleSendOtp} 
              disabled={timer > 0 || isLoading} 
              className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400"
            >
              {timer > 0 ? `Kirim ulang dalam ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : "Tidak menerima kode? Kirim ulang"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div className="relative">
              <input type={showPass ? "text" : "password"} placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputClass} pr-11`} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Eye size={16} /></button>
            </div>
            <div className="relative">
              <input type={showConfirmPass ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClass} pr-11`} required />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Eye size={16} /></button>
            </div>
            <button type="submit" disabled={isLoading} className={buttonClass}>{isLoading ? "Processing..." : "Simpan & Reset Password"}</button>
          </form>
        )}
      </div>
    </div>
  );
}