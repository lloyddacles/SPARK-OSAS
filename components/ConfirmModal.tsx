"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "warning" | "success" | "info";
  confirmText?: string;
};

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = "warning",
  confirmText = "CONFIRM ACTION"
}: ConfirmModalProps) {
  
  const colors = {
    danger: "#ef4444",
    warning: "var(--primary)",
    success: "#10b981",
    info: "#3b82f6"
  };

  const icons = {
    danger: <ShieldAlert size={32} />,
    warning: <AlertTriangle size={32} />,
    success: <CheckCircle2 size={32} />,
    info: <ShieldAlert size={32} />
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 9999, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          padding: "2rem"
        }}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ 
              position: "absolute", 
              inset: 0, 
              background: "rgba(5, 7, 10, 0.8)", 
              backdropFilter: "blur(8px)" 
            }} 
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{ 
              width: "100%", 
              maxWidth: "480px", 
              background: "var(--bg-surface)", 
              border: `1px solid ${colors[type]}`, 
              position: "relative", 
              zIndex: 1,
              boxShadow: `0 0 50px rgba(0,0,0,0.5), 0 0 20px ${colors[type]}20`
            }}
          >
            {/* Corner Tech Markers */}
            <div style={{ position: "absolute", top: "1rem", left: "1rem", fontSize: "0.5rem", color: colors[type], fontWeight: "900", letterSpacing: "0.2em" }}>SYSTEM_ALERT</div>
            <div style={{ position: "absolute", bottom: "1rem", right: "1rem", fontSize: "0.5rem", color: colors[type], fontWeight: "900", letterSpacing: "0.2em" }}>ACTION_REQUIRED</div>

            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                background: `${colors[type]}10`, 
                border: `1px solid ${colors[type]}`, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                color: colors[type],
                margin: "0 auto 2.5rem"
              }}>
                {icons[type]}
              </div>

              <h2 style={{ fontSize: "1.25rem", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "1rem", color: "var(--text-main)" }}>
                {title.toUpperCase()}
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: "1.6", fontWeight: "700", marginBottom: "3rem" }}>
                {message.toUpperCase()}
              </p>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button 
                  onClick={onClose}
                  style={{ 
                    flex: 1, 
                    padding: "1rem", 
                    background: "var(--bg-accent)", 
                    border: "1px solid var(--border-dim)", 
                    color: "var(--text-dim)", 
                    fontSize: "0.7rem", 
                    fontWeight: "900", 
                    cursor: "pointer",
                    letterSpacing: "0.1em"
                  }}
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => { onConfirm(); onClose(); }}
                  style={{ 
                    flex: 1, 
                    padding: "1rem", 
                    background: colors[type], 
                    border: "none", 
                    color: type === "warning" ? "var(--text-dark)" : "white", 
                    fontSize: "0.7rem", 
                    fontWeight: "900", 
                    cursor: "pointer",
                    letterSpacing: "0.1em"
                  }}
                >
                  {confirmText}
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              style={{ 
                position: "absolute", 
                top: "1rem", 
                right: "1rem", 
                background: "none", 
                border: "none", 
                color: "var(--text-dim)", 
                cursor: "pointer" 
              }}
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
