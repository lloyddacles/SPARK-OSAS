"use client";

import dynamic from "next/dynamic";
import { Activity } from "lucide-react";

// Use dynamic with SSR disabled to prevent initialization collisions
const GovernanceTerminal = dynamic(() => import("./AdminCenterClient"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
      <div style={{ textAlign: "center" }}>
        <Activity size={48} className="status-pulse" color="var(--primary)" />
        <p style={{ marginTop: "2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.3em" }}>Loading Admin Panel...</p>
      </div>
    </div>
  )
});

export default function AdminPage() {
  return <GovernanceTerminal />;
}
