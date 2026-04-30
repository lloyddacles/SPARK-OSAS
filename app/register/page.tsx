"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft,
  Activity,
  Zap,
  Fingerprint,
  Mail,
  Eye,
  EyeOff
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, theme } = useGlobalState();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await register({ name, username, password });
      if (res && res.success) {
        router.push("/dashboard");
      } else {
        setError(res?.message || "REGISTRATION FAILED");
        setIsLoading(false);
      }
    } catch (err) {
      setError("SYSTEM OFFLINE: TRY AGAIN LATER");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "var(--bg-deep)",
      padding: "2rem",
      position: "relative",
      overflow: "hidden"
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
        
        {/* Back to Login */}
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
            background: "var(--primary)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "var(--bg-deep)", 
            borderRadius: "4px",
            margin: "0 auto 1.5rem",
            boxShadow: "0 0 30px var(--primary-glow)"
          }}>
            <ShieldCheck size={30} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "0.15em", color: "var(--text-main)", marginBottom: "0.5rem" }}>
            STUDENT <span style={{ color: "var(--primary)" }}>ENROLLMENT</span>
          </h1>
          <p style={{ fontSize: "0.65rem", fontWeight: "800", color: "var(--primary)", letterSpacing: "0.3em" }}>
            INITIALIZE DIGITAL IDENTITY
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sapphire-card"
          style={{ padding: "3rem" }}
        >
          {error && (
            <div style={{ 
              background: "rgba(239, 68, 68, 0.1)", 
              border: "1px solid rgba(239, 68, 68, 0.2)", 
              color: "#ef4444", 
              padding: "1rem", 
              marginBottom: "2rem", 
              fontSize: "0.65rem", 
              fontWeight: "900", 
              textAlign: "center",
              letterSpacing: "0.1em"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
                FULL LEGAL NAME
              </label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--primary)", opacity: 0.5 }} />
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="AS PER UNIVERSITY RECORDS"
                  style={{ 
                    width: "100%", 
                    padding: "1rem 1rem 1rem 3.5rem", 
                    fontSize: "0.85rem", 
                    fontWeight: "700",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-dim)",
                    color: "var(--text-main)"
                  }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
                STUDENT ID / USERNAME
              </label>
              <div style={{ position: "relative" }}>
                <Activity size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--primary)", opacity: 0.5 }} />
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="INSTITUTIONAL IDENTIFIER"
                  style={{ 
                    width: "100%", 
                    padding: "1rem 1rem 1rem 3.5rem", 
                    fontSize: "0.85rem", 
                    fontWeight: "700",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-dim)",
                    color: "var(--text-main)"
                  }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
                SECURE PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <Fingerprint size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--primary)", opacity: 0.5 }} />
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ 
                    width: "100%", 
                    padding: "1rem 3.5rem 1rem 3.5rem", 
                    fontSize: "0.85rem", 
                    fontWeight: "700",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-dim)",
                    color: "var(--text-main)"
                  }} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "1.25rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    cursor: "pointer",
                    opacity: 0.7
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="btn-cyan" 
              style={{ width: "100%", padding: "1.25rem", marginTop: "1rem" }}
            >
              {isLoading ? "INITIALIZING ACCOUNT..." : "AUTHORIZE ENROLLMENT"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
