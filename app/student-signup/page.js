"use client";
import StudentNavbar from "@/components/StudentNavbar";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function StudentSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const router = useRouter();

  const signup = async () => {
    if (!branch) return alert("Enter branch");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      const normalized = branch.toUpperCase();
      await setDoc(doc(db, "users", uid), { email, branch: normalized, role: "student" });
      alert("Registered successfully! Please login.");
      router.push("/student-login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <StudentNavbar />
      
      <div className="flex flex-col items-center justify-center px-6 py-12 lg:py-16">
        <div className="w-full max-w-md">
          {/* Header Branding */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Join the fest and start registering!</p>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
            <div className="space-y-5">
              
              {/* Email Field */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">College Email</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-slate-400"
                  placeholder="student@college.edu" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                />
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Choose Password</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Min. 6 characters" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>

              {/* Branch Field */}
              <div className="group">
                <label className="text-[11px] font-black text-indigo-500 uppercase tracking-widest ml-1 mb-2 block">Your Branch</label>
                <input 
                  className="w-full bg-indigo-50/30 border border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-indigo-300 font-bold text-indigo-700 uppercase"
                  placeholder="e.g. CSE / ME / ECE" 
                  value={branch} 
                  onChange={e=>setBranch(e.target.value)} 
                />
                <p className="text-[10px] text-slate-400 mt-2 ml-1 font-medium italic">Make sure this is correct to see relevant events.</p>
              </div>

              <button 
                onClick={signup}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transform active:scale-[0.98] transition-all mt-6"
              >
                Create Student Account
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-slate-500 text-sm font-medium">
                Already have an account?{" "}
                <a 
                  href="/student-login" 
                  className="text-indigo-600 font-black hover:underline decoration-2 underline-offset-4"
                >
                  Log In
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-slate-400 text-[10px] mt-8 uppercase tracking-widest font-bold">
            Secure Student Authentication
          </p>
        </div>
      </div>
    </div>
  );
}