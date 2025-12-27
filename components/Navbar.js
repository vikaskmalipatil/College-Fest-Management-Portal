"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <div style={{ background: "#222", padding: 10 }}>
      <Link href="/" style={{ color: "white" }}>Home</Link>
      <Link href="/login" style={{ color: "white" }}>Login</Link>
      <Link href="/dashboard" style={{ color: "white" }}>Dashboard</Link>
      <Link href="/admin" style={{ color: "white" }}>Admin</Link>
    </div>
  );
}
