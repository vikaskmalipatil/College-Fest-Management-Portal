"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";


export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Admin created. Now login.");
      router.push("/admin-login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Signup</h2>
      <input placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} /><br/><br/>
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/><br/>
      <button onClick={signup}>Create Admin</button>
    </div>
  );
}
