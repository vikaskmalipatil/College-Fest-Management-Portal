"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; // Added db for firestore fetch
import { doc, getDoc } from "firebase/firestore"; // To get student branch
import { useRouter } from "next/navigation";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      // 1. Authenticate the user
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // 2. Fetch the student's branch automatically from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Ensure this is a student, not an admin trying to use the student portal
        if (userData.role === "student") {
          localStorage.setItem("branch", userData.branch);
          router.push("/dashboard");
        } else {
          alert("Admin detected. Please use the Admin Login portal.");
        }
      } else {
        alert("User profile not found. Please contact support.");
      }

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 relative overflow-hidden">
      
      {/* --- CUSTOM INTEGRATED NAVBAR --- */}
      <nav className="absolute top-0 w-full px-6 py-6 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            onClick={() => router.push("/")} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center group-hover:border-indigo-500 transition-all">
              <span className="text-xl">🏛️</span>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">
              CAMPUS<span className="text-indigo-600 underline underline-offset-4 decoration-indigo-200">PORTAL</span>
            </span>
          </div>
          
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </button>
        </div>
      </nav>

      {/* Background Blobs for Visual Pop */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 rounded-full blur-[100px] opacity-60"></div>

      <div className="flex flex-col items-center justify-center px-6 py-24 min-h-screen relative z-10">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          
          {/* Main Visual Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] rotate-12 flex items-center justify-center shadow-2xl shadow-indigo-200 relative">
                <span className="text-white text-4xl font-bold -rotate-12">🎫</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Welcome Back!</h2>
            <p className="text-slate-500 mt-3 font-medium text-lg">Access your festival dashboard</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-white p-8 md:p-12 relative">
            <div className="space-y-6">
              
              {/* Email Field */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block">Student Email</label>
                <div className="relative">
                  <input 
                    className="w-full bg-slate-100/50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-[1.5rem] px-6 py-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="name@college.edu" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-20">📧</span>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block">Secret Password</label>
                <div className="relative">
                  <input 
                    className="w-full bg-slate-100/50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-[1.5rem] px-6 py-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="••••••••" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-20">🔑</span>
                </div>
              </div>

              {/* Button */}
              <button 
                onClick={login}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-200 transform active:scale-[0.97] transition-all mt-4 flex items-center justify-center gap-3 text-lg"
              >
                Enter Student Lounge
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Signup Link */}
            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                New to the fest?{" "}
                <a 
                  href="/student-signup" 
                  className="text-indigo-600 font-black hover:underline decoration-2 underline-offset-8 transition-all"
                >
                  Create Student Account
                </a>
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-200/50 rounded-full grayscale opacity-60">
              <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Powered by Maximus Design</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}