"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  // ================== STATES ==================
  const [allEvents, setAllEvents] = useState([]);
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    branch: ""
  });

  const [registrationsMap, setRegistrationsMap] = useState({});
  const [loadingRegsFor, setLoadingRegsFor] = useState("");

  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // ================== AUTH PROTECT ==================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin-login");
    });
    return () => unsub();
  }, [router]);

  // ================== DATA FETCHING ==================
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "events"));
      setAllEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "student")
      );
      const snap = await getDocs(q);
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Fetch students error:", err);
    } finally {
      setStudentsLoading(false);
    }
  };

  // ================== EVENT HANDLERS ==================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const addEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.branch) return alert("Title & Branch required");

    await addDoc(collection(db, "events"), {
      ...newEvent,
      branch: newEvent.branch.toUpperCase(),
      createdAt: serverTimestamp()
    });

    resetForm();
    fetchEvents();
    alert("Event created successfully");
  };

  const startEdit = (ev) => {
    setEditId(ev.id);
    setNewEvent(ev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateEvent = async () => {
    await updateDoc(doc(db, "events", editId), {
      ...newEvent,
      branch: newEvent.branch.toUpperCase()
    });
    resetForm();
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  const resetForm = () => {
    setEditId(null);
    setNewEvent({ title: "", description: "", date: "", time: "", venue: "", branch: "" });
  };

  const viewRegistrations = async (eventId) => {
    if (registrationsMap[eventId]) {
        setRegistrationsMap(prev => {
            const newMap = {...prev};
            delete newMap[eventId];
            return newMap;
        });
        return;
    }
    
    setLoadingRegsFor(eventId);
    try {
      const q = query(collection(db, "registrations"), where("eventId", "==", eventId));
      const snap = await getDocs(q);
      setRegistrationsMap(prev => ({
        ...prev,
        [eventId]: snap.docs.map(d => ({ id: d.id, ...d.data() }))
      }));
    } finally {
      setLoadingRegsFor("");
    }
  };

  const filteredEvents = branchFilter === "ALL" 
    ? allEvents 
    : allEvents.filter(e => (e.branch || "").toUpperCase() === branchFilter.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">ADMIN DASHBOARD</h1>
            <p className="text-slate-500 text-sm font-medium">Manage College Fest 2025</p>
          </div>
          <button 
            onClick={async () => { await signOut(auth); router.replace("/admin-login"); }}
            className="px-5 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-1">
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                {editId ? "📝 Update Event" : "✨ Create Event"}
              </h2>
              <form onSubmit={editId ? (e) => { e.preventDefault(); updateEvent(); } : addEvent} className="space-y-4">
                <input name="title" placeholder="Event Title" value={newEvent.title} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border rounded-2xl outline-indigo-600" />
                <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border rounded-2xl outline-indigo-600 h-32" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="branch" placeholder="Branch (CSE/ALL)" value={newEvent.branch} onChange={handleInputChange} className="p-4 bg-slate-50 border rounded-2xl outline-indigo-600" />
                  <input name="date" type="date" value={newEvent.date} onChange={handleInputChange} className="p-4 bg-slate-50 border rounded-2xl outline-indigo-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="time" type="time" value={newEvent.time} onChange={handleInputChange} className="p-4 bg-slate-50 border rounded-2xl outline-indigo-600" />
                  <input name="venue" placeholder="Venue" value={newEvent.venue} onChange={handleInputChange} className="p-4 bg-slate-50 border rounded-2xl outline-indigo-600" />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  {editId ? "Save Changes" : "Create Event"}
                </button>
                {editId && <button onClick={resetForm} type="button" className="w-full py-2 text-slate-500 font-bold">Cancel Edit</button>}
              </form>
            </section>
          </div>

          {/* RIGHT COLUMN: LISTS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* STUDENTS LIST SECTION */}
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">Verified Students</h2>
                  {/* REQUESTED COMPONENT ADDED HERE */}
                  <p className="text-sm text-slate-500 font-bold mt-2">
                    Total Students: {students.length}
                  </p>
                </div>
                <button
                  onClick={() => { setShowStudents(!showStudents); if (!showStudents) fetchStudents(); }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform"
                >
                  {showStudents ? "Close List" : "View All Students"}
                </button>
              </div>
              
              {showStudents && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                  {studentsLoading ? (
                    <p className="p-10 text-center animate-pulse font-medium text-slate-400">Loading database...</p>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase tracking-widest font-black text-slate-400">
                        <tr>
                          <th className="p-4 border-b border-slate-100">Student Email</th>
                          <th className="p-4 border-b border-slate-100 text-right">Branch</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {students.map(s => (
                          <tr key={s.id} className="text-sm hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-slate-700">{s.email}</td>
                            <td className="p-4 font-black text-indigo-500 text-right uppercase">{s.branch}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </section>

            {/* LIVE EVENTS LIST */}
            <section className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h2 className="text-2xl font-black tracking-tight">Live Events</h2>
                <select 
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="bg-transparent font-bold text-indigo-600 outline-none cursor-pointer"
                >
                  <option value="ALL">All Branches</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                </select>
              </div>

              {loading ? (
                <div className="h-40 bg-white rounded-[2rem] animate-pulse"></div>
              ) : filteredEvents.map(ev => (
                <div key={ev.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 group hover:border-indigo-300 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-tighter border border-indigo-100">
                        {ev.branch}
                      </span>
                      <h3 className="text-xl font-bold mt-2 text-slate-800">{ev.title}</h3>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(ev)} className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => deleteEvent(ev.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5 underline decoration-indigo-200 decoration-2">📅 {ev.date}</div>
                    <div className="flex items-center gap-1.5 underline decoration-indigo-200 decoration-2">📍 {ev.venue}</div>
                  </div>

                  <button 
                    onClick={() => viewRegistrations(ev.id)}
                    className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        registrationsMap[ev.id] 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {loadingRegsFor === ev.id ? "Syncing..." : registrationsMap[ev.id] ? "Hide Registrations" : "View Registrations"}
                  </button>

                  {registrationsMap[ev.id] && (
                    <div className="mt-4 space-y-2 border-t border-slate-50 pt-4 animate-in fade-in duration-300">
                      <div className="flex justify-between items-center mb-2 px-1">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">Registration Log</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{registrationsMap[ev.id].length} Total</p>
                      </div>
                      {registrationsMap[ev.id].length === 0 ? <p className="text-xs text-slate-400 text-center py-4 italic font-medium">No registrations yet for this event.</p> : 
                        registrationsMap[ev.id].map(r => (
                          <div key={r.id} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl text-[13px] font-bold border border-slate-100 hover:bg-white hover:border-indigo-100 transition-colors">
                            <span className="text-slate-700">{r.userEmail}</span>
                            <span className="bg-white px-2 py-0.5 rounded-md text-indigo-600 border border-slate-100 shadow-sm text-[11px] uppercase tracking-tighter">{r.branch}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              ))}
              
              {!loading && filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-300 text-slate-400 font-bold italic">
                  No events found for the {branchFilter} filter.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}