"use client";
import StudentNavbar from "@/components/StudentNavbar";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const router = useRouter();

  const login = async () => {
    if (!branch) { alert("Please enter branch"); return; }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const normalized = branch.toUpperCase();
      localStorage.setItem("branch", normalized);
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <StudentNavbar />
      
      <div className="flex flex-col items-center justify-center px-6 py-12 lg:py-20">
        <div className="w-full max-w-md">
          {/* Decorative element */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl rotate-12 flex items-center justify-center shadow-xl shadow-indigo-200">
              <span className="text-white text-3xl font-bold -rotate-12">🎫</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back!</h2>
            <p className="text-slate-500 mt-2 font-medium">Log in to grab your event passes</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10">
            <div className="space-y-5">
              {/* Email Field */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Student Email</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-slate-400"
                  placeholder="yourname@college.edu" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                />
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Secure Password</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>

              {/* Branch Field - Highlighted as it's crucial for your logic */}
              <div className="group">
                <label className="text-[11px] font-black text-indigo-500 uppercase tracking-widest ml-1 mb-2 block">Academic Branch</label>
                <input 
                  className="w-full bg-indigo-50/50 border border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-indigo-300 uppercase font-bold text-indigo-700"
                  placeholder="e.g. CSE / ECE" 
                  value={branch} 
                  onChange={e=>setBranch(e.target.value)} 
                />
                <p className="text-[10px] text-slate-400 mt-2 ml-1 italic font-medium">This helps us show you events for your department.</p>
              </div>

              <button 
                onClick={login}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transform active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
              >
                Enter Student Lounge
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-slate-500 text-sm font-medium">
                New Student?{" "}
                <a 
                  href="/student-signup" 
                  className="text-indigo-600 font-black hover:underline decoration-2 underline-offset-4"
                >
                  Create Account
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center gap-6 grayscale opacity-50">
             {/* Simple branding for Footer */}
             <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
               <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
               CAMPUS EVENTS 2025
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}