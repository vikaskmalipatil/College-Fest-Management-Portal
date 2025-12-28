"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // 1. Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && userDoc.data().role === "admin") {
        router.push("/admin"); // Success
      } else {
        // 2. Not an admin? Kick them out
        await signOut(auth);
        alert("Access Denied: You do not have administrator privileges.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-indigo-600 uppercase">
            Admin<span className="text-slate-400 font-light">Portal</span>
          </h1>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100 border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Secure Login</h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Admin Email</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all"
                placeholder="admin@college.edu" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Password</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all"
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
            <p className="text-slate-500 text-sm font-medium">
              Student looking for tickets?{" "}
              <a href="/student-login" className="text-indigo-600 font-bold hover:underline">Student Portal</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}