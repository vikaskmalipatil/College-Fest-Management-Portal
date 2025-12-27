"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center justify-center min-h-screen text-center">
        
        {/* Hero Text */}
        <div className="space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest">Fest 2025 is Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            Celebrate <span className="text-indigo-600">Innovation.</span><br />
            Experience <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Culture.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Your all-in-one portal to explore events, register for workshops, and manage your college festival experience seamlessly.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Student Card */}
          <div 
            onClick={() => router.push("/student-login")}
            className="group cursor-pointer bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-indigo-200 hover:border-indigo-400 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] -z-10 group-hover:bg-indigo-600 transition-colors duration-500"></div>
            
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">🚀</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Student Portal</h3>
            <p className="text-slate-500 mb-8 font-medium">Register for events, track your passes, and join the excitement.</p>
            
            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest">
              Join the Fest
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          {/* Admin Card */}
          <div 
            onClick={() => router.push("/admin-login")}
            className="group cursor-pointer bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="text-5xl mb-6">🛡️</div>
            <h3 className="text-2xl font-black text-white mb-2">Admin Control</h3>
            <p className="text-slate-400 mb-8 font-medium">Manage events, track registrations, and organize the festival.</p>
            
            <div className="flex items-center gap-2 text-purple-400 font-black uppercase text-xs tracking-widest">
              Manage Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-20 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
          Empowering College Communities &bull; 2025 Edition
        </div>

      </div>
    </div>
  );
}