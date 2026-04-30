"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  ShieldAlert, 
  ChevronLeft,
  Activity,
  Send,
  User,
  Zap
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logAudit, theme } = useGlobalState();
  const router = useRouter();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Log the reset request as a high-priority audit event
    await logAudit("PASSWORD_RESET_REQUEST", `User '${username}' has requested a password reset. Manual verification required.`, "HIGH");
    
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "var(--bg-deep)",
      padding: "2rem",
      position: "relative"
    }}>
      
      {/* Technical Grid Background */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        backgroundImage: `linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        opacity: theme === "dark" ? 0.05 : 0.2,
        zIndex: 0
      }} />

      <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 10 }}>
        
        <button 
          onClick={() => router.push("/")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            color: "var(--text-dim)", 
            fontSize: "0.7rem", 
            fontWeight: "900", 
            letterSpacing: "0.1em",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: "2rem"
          }}
        >
          <ChevronLeft size={16} /> RETURN TO GATEWAY
        </button>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ 
            width: "60px", 
            height: "60px", 
            background: "#ef4444", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "white", 
            borderRadius: "4px",
            margin: "0 auto 1.5rem",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)"
          }}>
            <ShieldAlert size={30} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "0.15em", color: "var(--text-main)", marginBottom: "0.5rem" }}>
            CREDENTIAL <span style={{ color: "#ef4444" }}>RECOVERY</span>
          </h1>
          <p style={{ fontSize: "0.65rem", fontWeight: "800", color: "#ef4444", letterSpacing: "0.3em" }}>
            IDENTITY VERIFICATION REQUIRED
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sapphire-card"
          style={{ padding: "3rem" }}
        >
          {!submitted ? (
            <form onSubmit={handleResetRequest} style={{ display: "grid", gap: "2rem" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: "1.6", textAlign: "center" }}>
                Enter your institutional identifier below. Your request will be transmitted to the OSAS Administrative hub for verification.
              </p>
              
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
                  USERNAME / ID NUMBER
                </label>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#ef4444", opacity: 0.5 }} />
                  <input 
                    required
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="ENTER YOUR IDENTIFIER"
                    style={{ 
                      width: "100%", 
                      padding: "1.25rem 1.25rem 1.25rem 3.5rem", 
                      fontSize: "0.85rem", 
                      fontWeight: "700",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border-dim)",
                      color: "var(--text-main)"
                    }} 
                  />
                </div>
              </div>

              <button 
                disabled={isLoading}
                className="btn-cyan" 
                style={{ 
                  width: "100%", 
                  padding: "1.25rem", 
                  background: "#ef4444",
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)"
                }}
              >
                {isLoading ? "TRANSMITTING..." : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                    SUBMIT RECOVERY TICKET <Send size={18} />
                  </div>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: "center" }}
            >
              <Activity size={48} color="#ef4444" style={{ margin: "0 auto 2rem" }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "1rem" }}>
                TICKET TRANSMITTED
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: "1.6", marginBottom: "2rem" }}>
                Your recovery ticket has been logged in the OSAS high-priority queue. Please visit the OSAS office with your Student ID for manual password reset.
              </p>
              <button 
                onClick={() => router.push("/")}
                className="btn-cyan"
                style={{ width: "100%", padding: "1.25rem" }}
              >
                RETURN TO GATEWAY
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
