"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Info, AlertTriangle, CheckCircle, X, Activity } from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function LivePulse() {
  const { notifications, isSyncing } = useGlobalState();
  const [activeToasts, setActiveToasts] = useState<any[]>([]);
  const lastNotifId = useRef<string | null>(null);

  // Sync Detector: Watch for new notifications in the telemetry stream
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      
      // If this is a new notification we haven't pulsed yet
      if (latest.id !== lastNotifId.current) {
        lastNotifId.current = latest.id;
        
        // Only pulse if it's "unread" (fresh from the server)
        if (latest.unread) {
          const toast = {
            id: latest.id,
            title: latest.title,
            desc: latest.desc,
            type: latest.title.toUpperCase().includes("URGENT") ? "URGENT" : "INFO"
          };
          
          setActiveToasts(prev => [toast, ...prev].slice(0, 3));
          
          // Auto-expire
          setTimeout(() => {
            setActiveToasts(prev => prev.filter(t => t.id !== toast.id));
          }, 6000);
        }
      }
    }
  }, [notifications]);

  return (
    <>
      {/* SYSTEM PULSE INDICATOR (Bottom Left) */}
      <div style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "1.5rem",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5rem 1rem",
        background: "rgba(10, 15, 25, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid var(--border-dim)",
        borderRadius: "20px",
        pointerEvents: "none"
      }}>
        <motion.div
          animate={{ 
            scale: isSyncing ? [1, 1.2, 1] : 1,
            opacity: isSyncing ? 1 : 0.4
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ 
            width: "8px", 
            height: "8px", 
            borderRadius: "50%", 
            background: isSyncing ? "var(--primary)" : "var(--text-dim)",
            boxShadow: isSyncing ? "0 0 10px var(--primary)" : "none"
          }}
        />
        <span style={{ 
          fontSize: "0.6rem", 
          fontWeight: "900", 
          color: "var(--text-dim)", 
          letterSpacing: "0.1em" 
        }}>
          {isSyncing ? "TELEMETRY_SYNCING..." : "SYSTEM_ONLINE"}
        </span>
      </div>

      {/* PULSE TOAST STACK (Bottom Right) */}
      <div style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        maxWidth: "350px",
        pointerEvents: "none"
      }}>
        <AnimatePresence>
          {activeToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                pointerEvents: "auto",
                background: "var(--card-bg)",
                border: `1px solid ${toast.type === "URGENT" ? "#ef4444" : "var(--border-active)"}`,
                borderLeft: `4px solid ${toast.type === "URGENT" ? "#ef4444" : "var(--primary)"}`,
                padding: "1.25rem",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                display: "flex",
                gap: "1rem",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Background Activity Glow */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background: `radial-gradient(circle at top right, ${toast.type === "URGENT" ? "rgba(239, 68, 68, 0.1)" : "rgba(0, 229, 255, 0.1)"}, transparent)`,
                pointerEvents: "none"
              }} />

              <div style={{ color: toast.type === "URGENT" ? "#ef4444" : "var(--primary)", flexShrink: 0 }}>
                {toast.type === "URGENT" ? <AlertTriangle size={20} /> : <Activity size={20} />}
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  fontSize: "0.85rem", 
                  fontWeight: "900", 
                  color: "var(--text-main)", 
                  marginBottom: "0.25rem",
                  letterSpacing: "0.02em"
                }}>
                  {toast.title.toUpperCase()}
                </h4>
                <p style={{ 
                  fontSize: "0.75rem", 
                  color: "var(--text-dim)", 
                  fontWeight: "600",
                  lineHeight: "1.4"
                }}>
                  {toast.desc}
                </p>
              </div>

              <button 
                onClick={() => setActiveToasts(prev => prev.filter(t => t.id !== toast.id))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-dim)",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <X size={14} />
              </button>

              {/* Progress Bar (Auto-expire visual) */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 6, ease: "linear" }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "2px",
                  background: toast.type === "URGENT" ? "#ef4444" : "var(--primary)",
                  opacity: 0.3
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
