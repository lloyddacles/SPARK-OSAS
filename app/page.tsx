"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Sparkles, 
  User, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  ChevronLeft,
  Terminal,
  Activity,
  Zap,
  Fingerprint,
  Sun,
  Moon,
  ShieldAlert,
  Eye,
  EyeOff
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useRouter } from "next/navigation";

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop", // Campus
  "https://images.unsplash.com/photo-1523050853064-dbad32c970a2?q=80&w=2038&auto=format&fit=crop", // Graduation
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop", // Studying
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop", // Meeting
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"  // Library
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const { login, theme, toggleTheme } = useGlobalState();
  const router = useRouter();

  // Background Carousel Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await login(username, password);
      if (res && res.success) {
        router.push("/dashboard");
      } else {
        setError(`AUTHENTICATION FAILED: ${res?.message || "INVALID CREDENTIALS"}`);
        setIsLoading(false);
      }
    } catch (err) {
      setError("AUTHENTICATION FAILED: SYSTEM OFFLINE");
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
      overflow: "hidden",
      transition: "background 0.5s ease"
    }}>
      
      {/* Dynamic Background Carousel */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{ 
              position: "absolute", 
              inset: 0, 
              backgroundImage: `url(${BACKGROUNDS[bgIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: theme === "dark" ? "brightness(0.3) saturate(0.8) blur(8px)" : "brightness(0.9) saturate(0.9) contrast(0.9) blur(8px)",
              transition: "filter 1s ease"
            }}
          />
        </AnimatePresence>
        
        {/* Technical Overlays */}
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          background: theme === "dark" 
            ? "linear-gradient(to bottom, rgba(5, 7, 10, 0.4), rgba(5, 7, 10, 0.9))"
            : "linear-gradient(to bottom, rgba(248, 250, 252, 0.3), rgba(248, 250, 252, 0.8))",
          zIndex: 1,
          transition: "background 1s ease"
        }} />
        
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundImage: `linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: theme === "dark" ? 0.15 : 0.4,
          zIndex: 2,
          transition: "opacity 1s ease"
        }} />
      </div>

      {/* Theme Toggle Node */}
      <button 
        onClick={toggleTheme}
        style={{ 
          position: "fixed", 
          top: "2rem", 
          right: "2rem", 
          width: "48px", 
          height: "48px", 
          background: "var(--bg-surface)", 
          border: "1px solid var(--border-dim)",
          color: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)"
        }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 10 }}>
        
        {/* Institutional Identity Node */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ 
              width: "100px", 
              height: "100px", 
              margin: "0 auto 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}
          >
            {/* The Digital Spark Icon (Large Version) */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ 
                position: "absolute", 
                inset: 0, 
                border: "2px dashed var(--primary)", 
                opacity: 0.3, 
                borderRadius: "50%" 
              }} 
            />
            <div style={{ 
              width: "70px", 
              height: "70px", 
              background: "var(--primary)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "var(--bg-deep)", 
              borderRadius: "4px",
              boxShadow: "0 0 50px var(--primary-glow)",
              zIndex: 2
            }}>
              <Zap size={36} fill="currentColor" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "0.25em", color: "var(--text-main)", marginBottom: "0.5rem" }}
          >
            SPARK <span style={{ color: "var(--primary)" }}>OSAS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.5em" }}
          >
            INSTITUTIONAL GATEWAY
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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

          <form onSubmit={handleLogin} style={{ display: "grid", gap: "2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
                USERNAME / ID NUMBER
              </label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--primary)", opacity: 0.5 }} />
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
                    padding: "1.25rem 1.25rem 1.25rem 3.5rem", 
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
              {isLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                   <Activity size={18} className="animate-pulse" /> VERIFYING IDENTITY...
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                   ACCESS SYSTEM <ArrowRight size={18} />
                </div>
              )}
            </button>
          </form>

          <div style={{ marginTop: "2.5rem", textAlign: "center", display: "grid", gap: "1rem" }}>
            <p 
              onClick={() => router.push("/register")}
              style={{ fontSize: "0.55rem", color: "var(--primary)", fontWeight: "900", letterSpacing: "0.1em", cursor: "pointer" }}
            >
              NEW STUDENT? <span style={{ textDecoration: "underline" }}>CREATE ACCOUNT</span>
            </p>
            <p 
              onClick={() => router.push("/forgot-password")}
              style={{ fontSize: "0.55rem", color: "var(--text-dim)", fontWeight: "900", letterSpacing: "0.1em", cursor: "pointer" }}
            >
              FORGOT YOUR CREDENTIALS? <span style={{ color: "var(--primary)" }}>OSAS HELP DESK</span>
            </p>
          </div>
        </motion.div>

        <p style={{ textAlign: "center", marginTop: "3rem", fontSize: "0.55rem", color: "var(--text-dim)", fontWeight: "800", letterSpacing: "0.2em" }}>
          © 2026 UNIVERSITY OF THE PHILIPPINES • SPARK CORE v2.5
        </p>
      </div>
    </div>
  );
}

function ChevronRight({ size, color, style }: { size: number, color: string, style?: any }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={style}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}


