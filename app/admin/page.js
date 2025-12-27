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
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [allEvents, setAllEvents] = useState([]);
  const [branch, setBranch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [editId, setEditId] = useState(null);

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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin-login");
    });
    return () => unsub();
  }, [router]);

  const fetchEvents = async () => {
    const snap = await getDocs(collection(db, "events"));
    setAllEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!branch) {
      setFilteredEvents([]);
      return;
    }
    const b = branch.toUpperCase();
    setFilteredEvents(allEvents.filter(e => (e.branch || "").toUpperCase() === b));
  }, [branch, allEvents]);

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.branch) return alert("Title & branch required");
    await addDoc(collection(db, "events"), { ...newEvent, branch: newEvent.branch.toUpperCase(), createdAt: new Date().toISOString() });
    setNewEvent({ title: "", description: "", date: "", time: "", venue: "", branch: "" });
    fetchEvents();
    alert("Event added");
  };

  const startEdit = (ev) => {
    setEditId(ev.id);
    setNewEvent({ title: ev.title, description: ev.description, date: ev.date, time: ev.time, venue: ev.venue, branch: ev.branch });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateEvent = async () => {
    await updateDoc(doc(db, "events", editId), { ...newEvent, branch: newEvent.branch.toUpperCase() });
    setEditId(null);
    setNewEvent({ title: "", description: "", date: "", time: "", venue: "", branch: "" });
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  const viewRegistrations = async (eventId) => {
    setLoadingRegsFor(eventId);
    try {
      const q = query(collection(db, "registrations"), where("eventId", "==", eventId), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const regs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRegistrationsMap(prev => ({ ...prev, [eventId]: regs }));
    } catch (err) {
      console.error("viewRegs error:", err);
      try {
        const q2 = query(collection(db, "registrations"), where("eventId", "==", eventId));
        const snap2 = await getDocs(q2);
        const regs2 = snap2.docs.map(d => ({ id: d.id, ...d.data() }));
        setRegistrationsMap(prev => ({ ...prev, [eventId]: regs2 }));
      } catch (err2) {
        console.error("fallback viewRegs error:", err2);
      }
    } finally {
      setLoadingRegsFor("");
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black tracking-tight text-indigo-600">
          CAMPUS<span className="text-slate-400 font-light">FEST</span> <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded ml-2 border border-indigo-100">ADMIN</span>
        </h1>
        <button 
          onClick={logout}
          className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
        >
          Sign Out
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-6 lg:py-12 space-y-10">
        
        {/* Form Card */}
        <section className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="bg-indigo-600 px-8 py-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              {editId ? "✨ Update Event Details" : "➕ Create New Event"}
            </h2>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">General Info</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-3 outline-none transition-all"
                  placeholder="Event Title" 
                  value={newEvent.title} 
                  onChange={e=>setNewEvent({...newEvent, title:e.target.value})} 
                />
              </div>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-3 outline-none transition-all min-h-[100px]"
                placeholder="Description" 
                value={newEvent.description} 
                onChange={e=>setNewEvent({...newEvent, description:e.target.value})} 
              />
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-3 outline-none transition-all"
                placeholder="Branch (CSE, ECE, ALL...)" 
                value={newEvent.branch} 
                onChange={e=>setNewEvent({...newEvent, branch:e.target.value})} 
              />
            </div>

            <div className="space-y-4">
               <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Logistics</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none"
                  placeholder="Date" 
                  value={newEvent.date} 
                  onChange={e=>setNewEvent({...newEvent, date:e.target.value})} 
                />
              </div>
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none"
                placeholder="Time" 
                value={newEvent.time} 
                onChange={e=>setNewEvent({...newEvent, time:e.target.value})} 
              />
              <input 
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none"
                placeholder="Venue" 
                value={newEvent.venue} 
                onChange={e=>setNewEvent({...newEvent, venue:e.target.value})} 
              />
              
              <button 
                onClick={editId ? updateEvent : addEvent}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                {editId ? "Save Changes" : "Post Event"}
              </button>
            </div>
          </div>
        </section>

        {/* List Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <h3 className="text-2xl font-bold">Event Directory</h3>
            <div className="relative">
              <input 
                className="bg-white border border-gray-200 rounded-full px-10 py-2.5 outline-none focus:border-indigo-500 w-full md:w-72 shadow-sm"
                placeholder="Search branch (e.g. CSE)" 
                value={branch} 
                onChange={e=>setBranch(e.target.value)} 
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          {branch && filteredEvents.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-400">No events found for <span className="font-bold text-indigo-600">{branch.toUpperCase()}</span></p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {filteredEvents.map(ev => (
              <div key={ev.id} className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded border border-indigo-100">
                      {ev.branch}
                    </span>
                    <h4 className="text-xl font-bold text-slate-800">{ev.title}</h4>
                    <p className="text-slate-500 text-sm max-w-xl">{ev.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400 pt-2">
                      <span className="flex items-center gap-1">📍 {ev.venue}</span>
                      <span className="flex items-center gap-1">📅 {ev.date}</span>
                      <span className="flex items-center gap-1">⏰ {ev.time}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <button 
                      onClick={() => viewRegistrations(ev.id)} 
                      className="px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      {loadingRegsFor === ev.id ? "..." : "View Attendees"}
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(ev)} className="flex-1 py-2 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50">Edit</button>
                      <button onClick={() => deleteEvent(ev.id)} className="flex-1 py-2 text-xs font-bold border border-red-100 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                </div>

                {/* Registration List Dropdown */}
                {registrationsMap[ev.id] && (
                  <div className="bg-gray-50 border-t border-gray-100 p-6 animate-in slide-in-from-top-2 duration-300">
                    <h5 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Registrations</h5>
                    {registrationsMap[ev.id].length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {registrationsMap[ev.id].map(r => (
                          <div key={r.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm font-bold text-slate-700 truncate">{r.userEmail || r.userId}</p>
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-bold">
                              <span>{r.branch || "N/A"}</span>
                              <span>{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No one has registered yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}