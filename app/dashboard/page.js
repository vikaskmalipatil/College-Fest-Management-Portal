"use client";
import { useEffect, useState } from "react";
import { getDocs, collection, addDoc, query, where, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [branch, setBranch] = useState("");
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [regLoadingIds, setRegLoadingIds] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const b = typeof window !== "undefined" ? localStorage.getItem("branch") : null;
    if (b) setBranch(b.toUpperCase());
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "events"));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        const filtered = all.filter(e => {
          const eBranch = (e.branch || "").toString().toUpperCase();
          return eBranch === branch || eBranch === "ALL";
        });
        setEvents(filtered);

        if (user) {
          const regQ = query(collection(db, "registrations"), where("userId", "==", user.uid));
          const regSnap = await getDocs(regQ);
          const ids = new Set(regSnap.docs.map(d => d.data().eventId));
          setRegisteredEventIds(ids);
        } else {
          setRegisteredEventIds(new Set());
        }
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authChecked && branch) fetchAll();
    else setLoading(false);
  }, [authChecked, user, branch]);

  const registerForEvent = async (eventId) => {
    if (!user) return router.push("/student-login");
    if (registeredEventIds.has(eventId)) return alert("Already registered");
    setRegLoadingIds(prev => ({ ...prev, [eventId]: true }));
    try {
      const existingQ = query(collection(db, "registrations"), where("eventId", "==", eventId), where("userId", "==", user.uid));
      const existingSnap = await getDocs(existingQ);
      if (!existingSnap.empty) {
        setRegisteredEventIds(prev => new Set(prev).add(eventId));
        alert("Already registered");
        return;
      }
      const localBranch = (localStorage.getItem("branch") || "").toString().toUpperCase();
      await addDoc(collection(db, "registrations"), {
        eventId,
        userId: user.uid,
        userEmail: user.email || "",
        branch: localBranch,
        createdAt: serverTimestamp()
      });
      setRegisteredEventIds(prev => new Set(prev).add(eventId));
    } catch (err) {
      alert("Failed to register");
    } finally {
      setRegLoadingIds(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const unregisterFromEvent = async (eventId) => {
    if (!user) return router.push("/student-login");
    setRegLoadingIds(prev => ({ ...prev, [eventId]: true }));
    try {
      const q = query(collection(db, "registrations"), where("eventId", "==", eventId), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      if (snap.empty) {
        setRegisteredEventIds(prev => {
          const s = new Set(prev);
          s.delete(eventId);
          return s;
        });
        return;
      }
      const deletes = snap.docs.map(d => deleteDoc(doc(db, "registrations", d.id)));
      await Promise.all(deletes);
      setRegisteredEventIds(prev => {
        const s = new Set(prev);
        s.delete(eventId);
        return s;
      });
    } catch (err) {
      alert("Failed to unregister");
    } finally {
      setRegLoadingIds(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/student-login");
  };

  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-indigo-600 tracking-tight">FEST_PASS</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Student Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-slate-700 leading-none">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase mt-1">{branch} Branch</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Live Events</h2>
          <p className="text-slate-500 mt-1">Exclusive events curated for <span className="text-indigo-600 font-bold">{branch}</span></p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(ev => {
              const isReg = registeredEventIds.has(ev.id);
              const btnLoading = !!regLoadingIds[ev.id];
              return (
                <div key={ev.id} className={`group relative bg-white border ${isReg ? 'border-indigo-200 ring-4 ring-indigo-50' : 'border-slate-200'} rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 overflow-hidden`}>
                  
                  {/* Status Badge */}
                  <div className="mb-6 flex justify-between items-start">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full tracking-wider border border-slate-200">
                      {ev.branch || "ALL"}
                    </span>
                    {isReg && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-200">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Registered
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
                    {ev.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 min-h-[60px]">
                    {ev.description || "No description provided for this event."}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-500">📅</div>
                      <span className="text-sm font-bold text-slate-600">{ev.date || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-500">📍</div>
                      <span className="text-sm font-bold text-slate-600">{ev.venue || "Campus"}</span>
                    </div>
                  </div>

                  <button 
                    disabled={btnLoading} 
                    onClick={() => isReg ? unregisterFromEvent(ev.id) : registerForEvent(ev.id)}
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                      isReg 
                      ? 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100' 
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95'
                    }`}
                  >
                    {btnLoading ? (
                      <span className="flex items-center gap-2 italic">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                      </span>
                    ) : (
                      isReg ? "Cancel Registration" : "Claim My Spot"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-300">
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-xl font-bold text-slate-800">No events found</h3>
            <p className="text-slate-400">Check back later for updates to the {branch} branch.</p>
          </div>
        )}
      </main>
    </div>
  );
}