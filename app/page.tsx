"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  User, 
  ArrowRight, 
  Zap,
  Fingerprint,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Activity,
  ShieldCheck,
  Globe
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authPhase, setAuthPhase] = useState<"credentials" | "biometric" | "success">("credentials");
  const [biometricProgress, setBiometricProgress] = useState(0);
  const { login, theme, toggleTheme } = useGlobalState();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Step 1: Credential Validation
    try {
      const res = await login(username, password);
      if (res && res.success) {
        setAuthPhase("biometric");
        startBiometricSequence();
      } else {
        setError(`AUTHENTICATION_FAILURE: ${res?.message || "INVALID_CREDENTIALS"}`);
        setIsLoading(false);
      }
    } catch (err) {
      setError("SYSTEM_OFFLINE: UNABLE_TO_REACH_AUTH_NODE");
      setIsLoading(false);
    }
  };

  const startBiometricSequence = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setBiometricProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setAuthPhase("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    }, 150);
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
      
      {/* LIQUID MESH BACKDROP */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: theme === "dark" 
              ? "radial-gradient(circle at center, rgba(0, 229, 255, 0.05) 0%, transparent 50%)"
              : "radial-gradient(circle at center, rgba(0, 229, 255, 0.1) 0%, transparent 50%)",
            filter: "blur(100px)",
            opacity: 0.5
          }}
        />
        
        {/* Technical Data Stream Overlay */}
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundImage: `linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: theme === "dark" ? 0.05 : 0.1,
          zIndex: 1
        }} />

        {/* Dynamic Scan Line */}
        <motion.div 
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
            opacity: 0.1,
            zIndex: 2
          }}
        />
      </div>

      {/* INSTITUTIONAL HEADER NODES */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "2rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "32px", height: "32px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
            <Zap size={18} fill="var(--bg-deep)" />
          </div>
          <span style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.4em", color: "var(--text-main)" }}>SPARK // GOVERNANCE_HUB</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: 0.4 }}>
            <Globe size={14} />
            <span style={{ fontSize: "0.6rem", fontWeight: "800", letterSpacing: "0.1em" }}>SERVER_STATUS: 🟢_ONLINE</span>
          </div>
          <button 
            onClick={toggleTheme}
            style={{ 
              width: "40px", 
              height: "40px", 
              background: "rgba(255,255,255,0.05)", 
              border: "1px solid var(--border-dim)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* CENTRAL PORTAL UNIT */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "grid", gridTemplateColumns: "1fr 440px", gap: "6rem", alignItems: "center", position: "relative", zIndex: 10 }}>
        
        {/* Left Aspect: Institutional Motto & Visuals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p style={{ color: "var(--primary)", fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.5em", marginBottom: "1.5rem" }}>EST. 2026</p>
            <h1 style={{ fontSize: "4.5rem", fontWeight: "900", lineHeight: "1", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
              GOVERNANCE <br /> 
              <span style={{ color: "var(--primary)" }}>REDEFINED.</span>
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--text-dim)", fontWeight: "600", marginTop: "2rem", maxWidth: "400px", lineHeight: "1.6" }}>
              Experience the next evolution of institutional management. Hyper-efficient, secure, and hyper-responsive.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: "3rem", marginTop: "2rem" }}
          >
            <div>
              <p style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)" }}>100%</p>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>UPTIME_SLA</p>
            </div>
            <div style={{ width: "1px", height: "40px", background: "var(--border-dim)" }} />
            <div>
              <p style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)" }}>{`< 50ms`}</p>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>LATENCY_NODE</p>
            </div>
            <div style={{ width: "1px", height: "40px", background: "var(--border-dim)" }} />
            <div>
              <p style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)" }}>AES-256</p>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>ENCRYPTION</p>
            </div>
          </motion.div>
        </div>

        {/* Right Aspect: The Login Module */}
        <AnimatePresence mode="wait">
          {authPhase === "credentials" ? (
            <motion.div 
              key="login-credentials"
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.1, x: -20 }}
              transition={{ duration: 0.4 }}
              className="sapphire-card"
              style={{ padding: "3.5rem", position: "relative", overflow: "hidden" }}
            >
              <div style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>SECURE_ENTRY</h2>
                <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>AUTHENTICATION_REQUIRED</p>
              </div>

              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  style={{ 
                    background: "rgba(239, 68, 68, 0.1)", 
                    border: "1px solid rgba(239, 68, 68, 0.2)", 
                    color: "#ef4444", 
                    padding: "1rem", 
                    marginBottom: "2rem", 
                    fontSize: "0.65rem", 
                    fontWeight: "900", 
                    textAlign: "center"
                  }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleLogin} style={{ display: "grid", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "1rem" }}>
                    IDENTIFIER_TOKEN
                  </label>
                  <div style={{ position: "relative" }}>
                    <User size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--primary)", opacity: 0.5 }} />
                    <input 
                      required
                      type="text" 
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="USERNAME / ID NUMBER"
                      style={{ 
                        width: "100%", 
                        padding: "1.25rem 1.25rem 1.25rem 3.5rem", 
                        fontSize: "0.85rem", 
                        fontWeight: "700",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-dim)",
                        color: "var(--text-main)",
                        outline: "none"
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "1rem" }}>
                    ACCESS_PHRASE
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
                        color: "var(--text-main)",
                        outline: "none"
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
                  style={{ width: "100%", padding: "1.5rem", marginTop: "1rem" }}
                >
                  {isLoading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
                       <Activity size={18} className="animate-pulse" /> VERIFYING_CLEARANCE...
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
                       INITIALIZE_SESSION <ArrowRight size={18} />
                    </div>
                  )}
                </button>
              </form>

              <div style={{ marginTop: "2.5rem", textAlign: "center", display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "0.55rem", color: "var(--primary)", fontWeight: "900", letterSpacing: "0.1em", cursor: "pointer", textDecoration: "underline" }}>NEW_REGISTRATION</p>
                <p style={{ fontSize: "0.55rem", color: "var(--text-dim)", fontWeight: "900", letterSpacing: "0.1em", cursor: "pointer" }}>FORGOT_ACCESS?</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="login-biometric"
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.1, x: -20 }}
              transition={{ duration: 0.4 }}
              className="sapphire-card"
              style={{ padding: "4rem", textAlign: "center", position: "relative", overflow: "hidden" }}
            >
              <div style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>BIOMETRIC_FORTRESS</h2>
                <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>STAGE_2_IDENTITY_VERIFICATION</p>
              </div>

              <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto 3rem" }}>
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   style={{ position: "absolute", inset: -10, border: "2px dashed var(--primary)", borderRadius: "50%", opacity: 0.3 }}
                 />
                 <div style={{ width: "100%", height: "100%", background: "rgba(0, 229, 255, 0.05)", border: "2px solid var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    <Fingerprint size={64} color="var(--primary)" />
                    {/* Scan Line */}
                    <motion.div 
                      animate={{ y: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40px", background: "linear-gradient(to bottom, transparent, rgba(0, 229, 255, 0.3), transparent)" }}
                    />
                 </div>
              </div>

              <div style={{ width: "100%", background: "rgba(255,255,255,0.02)", height: "4px", borderRadius: "2px", overflow: "hidden", marginBottom: "1rem" }}>
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${biometricProgress}%` }}
                   style={{ height: "100%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }}
                 />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
                 <span>CALIBRATING_BIOMETRIC_NODES...</span>
                 <span>{biometricProgress}%</span>
              </div>

              <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
                 <ShieldCheck size={16} color="var(--primary)" />
                 <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>MULTI_FACTOR_ENFORCEMENT_ACTIVE</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER METRICS */}
      <div style={{ position: "fixed", bottom: "2rem", left: "4rem", right: "4rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100 }}>
        <p style={{ fontSize: "0.55rem", color: "var(--text-dim)", fontWeight: "800", letterSpacing: "0.2em" }}>
          © 2026 UNIVERSITY OF THE PHILIPPINES • SPARK CORE v2.5
        </p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={12} color="var(--primary)" />
            <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>ENCRYPTION: AES-256_ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}


