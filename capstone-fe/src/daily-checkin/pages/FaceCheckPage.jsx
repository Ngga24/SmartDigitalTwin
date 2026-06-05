import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export default function FaceCheckPage() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  // Berjalan sekali saat halaman dimuat
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // UPDATE: Gunakan isCheckin dari localStorage hasil login
    const isCheckin = localStorage.getItem("isCheckin") === "true";
    if (isCheckin) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      setCameraOn(true);
      setError(null);
    } catch (err) {
      setError("Izin kamera ditolak atau kamera tidak tersedia.");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.8);
  };

  const handleCheckIn = async () => {
    setError(null);

    const image_base64 = captureImage();

    if (!image_base64) {
      setError("Kamera belum siap, silakan mulai kamera terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch("/analytics/face-detection", {
        method: "POST",
        body: JSON.stringify({ image_base64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Face check-in gagal");
      }

      // UPDATE: Simpan status true ke localStorage
      localStorage.setItem("isCheckin", "true");

      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
      <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Face Check-In</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-light">
            Verifikasi wajah untuk mengamankan akses dashboard Anda
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm transition-all">
            {error}
          </div>
        )}

        <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
          {!cameraOn && (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <p className="text-sm font-medium">Kamera belum aktif</p>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${cameraOn ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-6 flex gap-3">
          <button
            onClick={startCamera}
            className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-50 transition-colors border border-slate-200 text-sm font-medium text-slate-700 shadow-sm active:scale-[0.98]"
          >
            Start Camera
          </button>

          <button
            onClick={handleCheckIn}
            disabled={loading || !cameraOn}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all text-sm font-medium text-white shadow-sm shadow-blue-600/10 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none active:scale-[0.98]"
          >
            {loading ? "Checking..." : "Check In"}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5 font-light">
          Pastikan wajah terlihat jelas di tengah kamera dengan pencahayaan yang
          cukup.
        </p>
      </div>
    </div>
  );
}
