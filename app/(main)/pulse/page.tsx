"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scan, 
  UserCheck, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Activity, 
  ChevronLeft,
  X,
  QrCode,
  Search
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { logGateEntry } from "@/lib/actions/systemActions";

export default function PulseMobileStation() {
  const { currentUser, referrals, addNotification } = useGlobalState();
  const [activeView, setActiveView] = useState<"SCAN" | "PASS" | "LOG">("SCAN");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const isStaff = ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "GUIDANCE_COUNSELOR", "ADVISER"].includes(currentUser?.role || "");

  const handleScan = async (studentId: string) => {
    setIsScanning(true);
    setScanResult(null);
    
    try {
      // Small delay for "High-Velocity Scanning" aesthetic
      await new Promise(r => setTimeout(r, 800));
      
      const res = await logGateEntry(studentId);
      
      if (res.success) {
        setScanResult({
          name: res.studentName,
          id: studentId,
          department: res.program || "General Studentry",
          status: res.isFlagged ? "FLAGGED" : "CLEARED",
          referralReason: res.isFlagged ? "SECURITY ALERT: INSTITUTIONAL FLAG DETECTED" : null
        });
        
        if (res.isFlagged) {
          addNotification("Security Alert", `Flagged student detected at gate: ${res.studentName}`);
        }
      } else {
        addNotification("Error", "Could not resolve institutional identity.");
      }
    } catch (e) {
      addNotification("Error", "Security link interrupted.");
    } finally {
      setIsScanning(false);
    }
  };

  // For testing, we simulate a scan with a real action
  const simulateScan = () => handleScan("2024-8842");

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#030712", 
      color: "white", 
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "2rem"
    }}>
      {/* MOBILE HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#030712" }}>
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "900", letterSpacing: "0.05em" }}>PULSE</h2>
            <p style={{ fontSize: "0.6rem", fontWeight: "800", color: "var(--primary)", letterSpacing: "0.2em" }}>MOBILE_STATION</p>
          </div>
        </div>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Activity size={14} color="var(--primary)" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW: SCANNER (FOR STAFF) */}
        {activeView === "SCAN" && isStaff && (
          <motion.div 
            key="scan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div style={{ 
              flex: 1, 
              background: "rgba(255,255,255,0.02)", 
              border: "1px dashed rgba(255,255,255,0.1)", 
              borderRadius: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              minHeight: "400px"
            }}>
              {isScanning && (
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "var(--primary)", boxShadow: "0 0 15px var(--primary)", zIndex: 2 }}
                />
              )}

              {scanResult ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "2rem" }}>
                  <div style={{ 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "50%", 
                    background: scanResult.status === "CLEARED" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                    border: `2px solid ${scanResult.status === "CLEARED" ? "#10b981" : "#ef4444"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem"
                  }}>
                    {scanResult.status === "CLEARED" ? <ShieldCheck size={40} color="#10b981" /> : <ShieldAlert size={40} color="#ef4444" />}
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "0.5rem" }}>{scanResult.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700", marginBottom: "1.5rem" }}>ID: {scanResult.id} • {scanResult.department}</p>
                  
                  <div style={{ 
                    padding: "1rem", 
                    background: scanResult.status === "CLEARED" ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)", 
                    borderRadius: "16px",
                    border: `1px solid ${scanResult.status === "CLEARED" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                    color: scanResult.status === "CLEARED" ? "#10b981" : "#ef4444",
                    fontWeight: "900",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em"
                  }}>
                    {scanResult.status === "CLEARED" ? "ENTRY PERMITTED" : "ACCESS DENIED / FLAGGED"}
                  </div>
                  
                  {scanResult.referralReason && (
                    <p style={{ marginTop: "1rem", fontSize: "0.7rem", color: "#ef4444", fontWeight: "600" }}>{scanResult.referralReason}</p>
                  )}

                  <button 
                    onClick={() => setScanResult(null)}
                    style={{ marginTop: "2.5rem", background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "1rem 2rem", borderRadius: "12px", fontWeight: "800", fontSize: "0.8rem" }}
                  >
                    DISMISS
                  </button>
                </motion.div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <Scan size={64} color="var(--primary)" style={{ opacity: 0.5, marginBottom: "1.5rem" }} />
                  <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#94a3b8" }}>Ready to Scan Institutional ID</p>
                  <button 
                    onClick={simulateScan}
                    style={{ marginTop: "2rem", background: "var(--primary)", color: "#030712", border: "none", padding: "1rem 2.5rem", borderRadius: "16px", fontWeight: "900", letterSpacing: "0.05em", boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)" }}
                  >
                    ACTIVATE SCANNER
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW: MY PASS (FOR STUDENTS) */}
        {(!isStaff || activeView === "PASS") && (
          <motion.div 
            key="pass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div style={{ 
              padding: "2.5rem", 
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)", 
              borderRadius: "32px",
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center"
            }}>
              <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "2.5rem" }}>DIGITAL_ID_PASS</p>
              
              <div style={{ 
                width: "220px", 
                height: "220px", 
                background: "white", 
                margin: "0 auto 2.5rem", 
                borderRadius: "24px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <QrCode size={180} color="#030712" />
              </div>

              <h3 style={{ fontSize: "1.4rem", fontWeight: "900", marginBottom: "0.5rem" }}>{currentUser?.name?.toUpperCase()}</h3>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700", marginBottom: "2rem" }}>STUDENT // {currentUser?.id}</p>

              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1, padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                   <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "#64748b", marginBottom: "0.25rem" }}>STATUS</p>
                   <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "#10b981" }}>ACTIVE</p>
                </div>
                <div style={{ flex: 1, padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                   <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "#64748b", marginBottom: "0.25rem" }}>VAULT</p>
                   <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--primary)" }}>VERIFIED</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE NAVIGATION BAR */}
      <div style={{ 
        marginTop: "auto", 
        background: "rgba(255,255,255,0.03)", 
        backdropFilter: "blur(10px)", 
        border: "1px solid rgba(255,255,255,0.1)", 
        borderRadius: "24px",
        padding: "0.75rem",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center"
      }}>
        {isStaff && (
          <button 
            onClick={() => setActiveView("SCAN")}
            style={{ background: activeView === "SCAN" ? "var(--primary)" : "transparent", border: "none", color: activeView === "SCAN" ? "#030712" : "#94a3b8", padding: "0.75rem 1.5rem", borderRadius: "16px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "900", fontSize: "0.75rem", transition: "all 0.2s" }}
          >
            <Scan size={18} /> SCAN
          </button>
        )}
        <button 
          onClick={() => setActiveView("PASS")}
          style={{ background: activeView === "PASS" ? "var(--primary)" : "transparent", border: "none", color: activeView === "PASS" ? "#030712" : "#94a3b8", padding: "0.75rem 1.5rem", borderRadius: "16px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "900", fontSize: "0.75rem", transition: "all 0.2s" }}
        >
          <UserCheck size={18} /> PASS
        </button>
      </div>
    </div>
  );
}
