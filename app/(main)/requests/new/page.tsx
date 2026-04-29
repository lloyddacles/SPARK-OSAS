"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { addRequest } = useGlobalState();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    
    try {
      // Simulate network delay
      await new Promise(res => setTimeout(res, 500));
      
      addRequest(type, "Michael Chang", {});
      router.push("/requests");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/requests" style={{ 
          padding: "0.5rem", 
          background: "var(--secondary)", 
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800" }}>New Service Request</h1>
          <p style={{ color: "var(--muted-foreground)" }}>Submit a new application or request to OSAS.</p>
        </div>
      </header>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "600", fontSize: "0.875rem" }}>Request Type</label>
          <select 
            name="type" 
            required
            style={{ 
              width: "100%", 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid var(--border)", 
              padding: "0.875rem 1rem", 
              borderRadius: "8px",
              color: "white",
              outline: "none"
            }}
          >
            <option value="" disabled selected>Select a service type</option>
            <option value="Good Moral Certificate">Good Moral Certificate</option>
            <option value="ID Replacement">ID Replacement</option>
            <option value="Counseling Referral">Counseling Referral</option>
            <option value="Clearance">Clearance</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "600", fontSize: "0.875rem" }}>Description & Reason</label>
          <textarea 
            name="description"
            rows={5}
            required
            placeholder="Please provide any necessary details or reason for this request..."
            style={{ 
              width: "100%", 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid var(--border)", 
              padding: "0.875rem 1rem", 
              borderRadius: "8px",
              color: "white",
              outline: "none",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: "var(--primary)", 
              color: "var(--primary-foreground)", 
              padding: "0.875rem 2rem", 
              borderRadius: "8px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Submitting..." : <><Save size={18} /> Submit Request</>}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
