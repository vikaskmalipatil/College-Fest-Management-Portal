"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function StudentSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !branch) {
      alert("Please fill in all fields.");
      return;
    }

    // Validation to prevent students from using "admin" in their email 
    // to bypass your admin filters if they try to be clever.
    if (email.toLowerCase().includes("admin")) {
      alert("Invalid email. 'Admin' keyword is reserved for faculty.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // SAVE STUDENT DATA WITH ROLE
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        branch: branch.toUpperCase(),
        role: "student", // <--- CRITICAL: Defines the user type
        createdAt: new Date().toISOString()
      });

      alert("Account created! Welcome to the Fest.");
      router.push("/student-login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        
        {/* Decorative Header */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-100 mb-4 rotate-3">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Join the Fest</h1>
          <p className="text-slate-500 font-medium mt-2">Create your student account</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12">
          <div className="space-y-6">
            
            {/* Email */}
            <div className="group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block">College Email</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                placeholder="name@college.edu" 
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            {/* Branch */}
            <div className="group">
              <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.15em] ml-1 mb-2 block">Academic Branch</label>
              <input 
                className="w-full bg-indigo-50/30 border border-indigo-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 rounded-2xl px-6 py-4 outline-none transition-all font-black text-indigo-700 placeholder:text-indigo-300 uppercase"
                placeholder="e.g. CSE, ECE, ME" 
                value={branch} 
                onChange={e => setBranch(e.target.value)} 
              />
            </div>

            {/* Password */}
            <div className="group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block">Create Password</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                placeholder="••••••••" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            <button 
              onClick={handleSignup}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transform active:scale-[0.97] transition-all mt-4 text-lg"
            >
              Get Started
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <a href="/student-login" className="text-indigo-600 font-black hover:underline underline-offset-8">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}