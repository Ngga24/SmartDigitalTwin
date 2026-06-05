import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}