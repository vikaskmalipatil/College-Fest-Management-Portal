"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-indigo-600">
            CAMPUS<span className="text-slate-400 font-light">FEST</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Administrator Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100 border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Login</h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Email Address</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-gray-400"
                placeholder="admin@college.edu" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Password</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-gray-400"
                placeholder="••••••••" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            <button 
              onClick={login}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transform active:scale-[0.98] transition-all mt-4"
            >
              Sign In to Dashboard
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-slate-500 text-sm">
              New admin?{" "}
              <a 
                href="/admin-signup" 
                className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4"
              >
                Create account
              </a>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-slate-400 text-xs mt-8 tracking-wide">
          &copy; 2025 College Festival Management System
        </p>
      </div>
    </div>
  );
}