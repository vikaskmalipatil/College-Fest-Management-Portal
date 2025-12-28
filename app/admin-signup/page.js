"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = async () => {
    // 1. Validation: Email must contain "admin"
    if (!email.includes("admin")) {
      alert("Unauthorized: Only official admin emails are allowed.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // 2. Save role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: "admin",
        createdAt: new Date().toISOString()
      });

      alert("Admin account created successfully!");
      router.push("/admin-login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-10">
          <h2 className="text-3xl font-black text-slate-800 mb-2 text-center">Admin Registration</h2>
          <p className="text-slate-500 text-center mb-8 text-sm">Create a secure administrator profile</p>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Admin Email</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all"
                placeholder="must-contain-admin@college.edu" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all"
                placeholder="••••••••" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            <button 
              onClick={signup}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg transform active:scale-[0.98] transition-all mt-4"
            >
              Create Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}