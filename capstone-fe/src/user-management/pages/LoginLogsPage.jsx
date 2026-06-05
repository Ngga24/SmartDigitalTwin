import React, { useState } from "react";
// Sesuaikan path import Sidebar kamu, misalnya:
import Sidebar from "../components/Sidebar";
import useLoginLogs from "../hooks/useLoginLogs";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  MonitorSmartphone,
  MapPin,
  Clock,
} from "lucide-react";

export default function LoginLogsPage() {
  const { logs, loading, error } = useLoginLogs();
  const [searchTerm, setSearchTerm] = useState("");

  // Fitur search berdasarkan user / email
  const filteredLogs = logs.filter((log) =>
    (log.user_or_email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Login Logs</h1>
            <p className="text-slate-500 mt-1">
              Pantau aktivitas masuk pengguna dan riwayat keamanan sistem.
            </p>
          </div>

          {/* Toolbar (Search) */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search by user or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
            <div className="text-sm text-slate-500">
              Total: {filteredLogs.length} logs
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium w-[20%]">Timestamp</th>
                    <th className="px-6 py-4 font-medium w-[30%]">Email</th>
                    <th className="px-6 py-4 font-medium w-[20%]">
                      IP & Location
                    </th>
                    <th className="px-6 py-4 font-medium w-[15%]">Device</th>
                    <th className="px-6 py-4 font-medium text-center w-[15%]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        Loading system logs...
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No login logs found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      // Membersihkan koma di depan jika lokasinya ", ID"
                      const displayLocation = log.location?.startsWith(", ")
                        ? log.location.substring(2)
                        : log.location;

                      const isSuccess = log.status === "success";

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          {/* WAKTU */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock size={16} className="text-slate-400" />
                              <span className="whitespace-nowrap">
                                {log.time}
                              </span>
                            </div>
                          </td>

                          {/* USERNAME / EMAIL */}
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {log.user_or_email}
                          </td>

                          {/* IP & LOKASI */}
                          <td className="px-6 py-4 text-slate-600">
                            <div className="font-mono text-[13px]">
                              {log.ip_address}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                              <MapPin size={12} />
                              {displayLocation}
                            </div>
                          </td>

                          {/* DEVICE */}
                          <td className="px-6 py-4 text-slate-600">
                            <div className="flex items-center gap-2">
                              <MonitorSmartphone
                                size={16}
                                className="text-slate-400 flex-shrink-0"
                              />
                              <span className="truncate max-w-[150px]">
                                {log.device}
                              </span>
                            </div>
                          </td>

                          {/* STATUS & PESAN */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                                  isSuccess
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    : "bg-red-50 text-red-600 border border-red-100"
                                }`}
                              >
                                {isSuccess ? (
                                  <ShieldCheck size={12} />
                                ) : (
                                  <ShieldAlert size={12} />
                                )}
                                {log.status}
                              </span>
                              {!isSuccess && (
                                <span className="text-[10px] text-red-400 text-center max-w-[120px] leading-tight">
                                  {log.message}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
