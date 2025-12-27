"use client";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentNavbar() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Using an auth listener is more reliable for real-time updates
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail("");
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("branch");
    router.push("/student-login");
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left Side: Brand & Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                <span className="text-lg">🎓</span>
              </div>
              <span className="text-xl font-black text-slate-800 tracking-tighter">
                FEST<span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-4">PASS</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              >
                Dashboard
              </Link>
              <Link 
                href="/my-registrations" 
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              >
                My Tickets
              </Link>
            </div>
          </div>

          {/* Right Side: User Info & Logout */}
          <div className="flex items-center gap-4">
            {email && (
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Logged In</span>
                <span className="text-sm font-bold text-slate-700">{email.split('@')[0]}</span>
              </div>
            )}
            
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-sm rounded-xl border border-transparent hover:border-red-100 transition-all active:scale-95"
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}