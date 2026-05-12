"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  LayoutDashboard, 
  ShieldCheck, 
  Fingerprint, 
  Lock, 
  GraduationCap, 
  Users, 
  Moon, 
  Sun, 
  LogOut,
  Command as CommandIcon,
  X,
  Zap,
  Activity,
  Cpu,
  BrainCircuit,
  Terminal,
  ChevronRight,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { processNeuralCommand } from "@/lib/actions/aiActions";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"standard" | "neural">("standard");
  const [neuralResponse, setNeuralResponse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme, logout, currentUser, users, organizations, scholarshipPrograms } = useGlobalState();
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (e.key === "Tab" && isOpen) {
        e.preventDefault();
        setMode(prev => prev === "standard" ? "neural" : "standard");
        setQuery("");
        setNeuralResponse(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, isOpen]);

  useEffect(() => {
    if (mode === "neural" && query.length > 3) {
      const handler = setTimeout(async () => {
        setIsProcessing(true);
        const res = await processNeuralCommand(query);
        setNeuralResponse(res);
        setIsProcessing(false);
      }, 500);
      return () => clearTimeout(handler);
    } else {
      setNeuralResponse(null);
    }
  }, [query, mode]);

  const handleAction = (cmd: any) => {
    cmd.action();
    setIsOpen(false);
    setQuery("");
    setMode("standard");
  };

  const handleNeuralExecute = () => {
    if (!neuralResponse) return;
    
    if (neuralResponse.intent === "NAVIGATE") {
      router.push(neuralResponse.path);
    } else if (neuralResponse.intent === "TOGGLE_THEME") {
      toggleTheme();
    } else if (neuralResponse.intent === "LOGOUT") {
      logout();
    }

    if (neuralResponse.intent !== "UNKNOWN") {
      setIsOpen(false);
      setQuery("");
      setMode("standard");
    }
  };

  // ── COMMAND RECOGNITION ENGINE ──
  const getDynamicCommands = () => {
    const base = [
      { 
        id: "dashboard", 
        label: "Go to Dashboard", 
        icon: <LayoutDashboard size={18} />, 
        action: () => router.push("/dashboard"),
        category: "Navigation"
      },
      { 
        id: "admin", 
        label: "System Admin Terminal", 
        icon: <ShieldCheck size={18} />, 
        action: () => router.push("/admin"),
        category: "Navigation",
        adminOnly: true
      },
      { 
        id: "passport", 
        label: "Digital Passport Verification", 
        icon: <Fingerprint size={18} />, 
        action: () => router.push("/admin/passport"),
        category: "Navigation",
        adminOnly: true
      },
      { 
        id: "vault", 
        label: "Document Vault", 
        icon: <Lock size={18} />, 
        action: () => router.push("/vault"),
        category: "Navigation"
      },
      { 
        id: "scholarships", 
        label: "Scholarship Hub", 
        icon: <GraduationCap size={18} />, 
        action: () => router.push("/scholarships"),
        category: "Navigation"
      },
      { 
        id: "organizations", 
        label: "Student Organizations", 
        icon: <Users size={18} />, 
        action: () => router.push("/organizations"),
        category: "Navigation"
      },
      { 
        id: "theme", 
        label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`, 
        icon: theme === "dark" ? <Sun size={18} /> : <Moon size={18} />, 
        action: toggleTheme,
        category: "System"
      },
      { 
        id: "logout", 
        label: "Logout of Session", 
        icon: <LogOut size={18} />, 
        action: logout,
        category: "System"
      },
    ];

    // Search for Students
    if (query.length > 1) {
      users.filter(u => u.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).forEach(u => {
        base.push({
          id: `student-${u.id}`,
          label: `Inspect Student: ${u.name}`,
          icon: <Fingerprint size={18} />,
          action: () => router.push(`/admin/passport?search=${u.name}`),
          category: "Direct Search",
          adminOnly: true
        });
      });

      // Search for Organizations
      organizations.filter(o => o.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).forEach(o => {
        base.push({
          id: `org-${o.id}`,
          label: `Manage Organization: ${o.name}`,
          icon: <Activity size={18} />,
          action: () => router.push(`/organizations?search=${o.name}`),
          category: "Direct Search"
        });
      });
    }

    return base;
  };

  const commands = getDynamicCommands();

  const filteredCommands = commands.filter((cmd) => {
    if (cmd.adminOnly && currentUser?.role !== "SYSTEM_ADMIN") return false;
    return cmd.label.toLowerCase().includes(query.toLowerCase());
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "15vh",
          background: "rgba(5, 7, 10, 0.6)",
          backdropFilter: "blur(20px)"
        }}
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            boxShadow: mode === "neural" 
              ? "0 25px 80px -12px rgba(0, 229, 255, 0.2), 0 0 0 1px var(--primary)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            maxWidth: "650px",
            background: mode === "neural" ? "rgba(10, 15, 25, 0.95)" : "var(--bg-surface)",
            borderRadius: "16px",
            overflow: "hidden",
            color: "var(--text-main)",
            border: mode === "neural" ? "1px solid var(--primary)" : "1px solid var(--border-dim)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Neural Header / Mode Indicator */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            padding: "0.75rem 1.5rem", 
            background: mode === "neural" ? "rgba(0, 229, 255, 0.05)" : "rgba(255,255,255,0.02)",
            borderBottom: "1px solid var(--border-dim)"
          }}>
             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: mode === "neural" ? "var(--primary)" : "var(--text-dim)", boxShadow: mode === "neural" ? "0 0 10px var(--primary)" : "none" }} />
                <span style={{ fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.2em", color: mode === "neural" ? "var(--primary)" : "var(--text-dim)" }}>
                  {mode.toUpperCase()}_INTERFACE_ACTIVE
                </span>
             </div>
             <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
                PRESS_TAB_TO_SWITCH_POLARITY
             </div>
          </div>

          {/* Search Bar */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1.25rem", 
            padding: "1.5rem 1.5rem",
            position: "relative"
          }}>
            {mode === "neural" ? (
              <BrainCircuit size={24} className="animate-pulse" color="var(--primary)" />
            ) : (
              <Terminal size={22} color="var(--primary)" style={{ opacity: 0.6 }} />
            )}
            
            <input
              ref={inputRef}
              autoFocus
              placeholder={mode === "neural" ? "Ask the Sentinel... (e.g. 'Go to passport')" : "Search commands..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (mode === "neural") {
                    handleNeuralExecute();
                  } else if (filteredCommands.length > 0) {
                    handleAction(filteredCommands[0]);
                  }
                }
              }}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "var(--text-main)",
                letterSpacing: mode === "neural" ? "0.05em" : "0"
              }}
            />

            {mode === "neural" && (
              <motion.div 
                animate={{ width: isProcessing ? [0, 40, 0] : 0 }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ height: "2px", background: "var(--primary)", borderRadius: "1px" }}
              />
            )}

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              background: "rgba(255,255,255,0.05)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: "900",
              opacity: 0.5
            }}>
              ESC
            </div>
          </div>

          {/* Neural Waveform Area */}
          <AnimatePresence>
            {mode === "neural" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ 
                  padding: "0 1.5rem 1.5rem", 
                  overflow: "hidden" 
                }}
              >
                <div style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", background: "rgba(0, 229, 255, 0.02)", borderRadius: "8px", border: "1px dashed rgba(0, 229, 255, 0.1)" }}>
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isProcessing ? [4, 20, 4] : [4, 8, 4],
                        opacity: isProcessing ? [0.2, 1, 0.2] : 0.2
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5 + Math.random(),
                        delay: i * 0.05
                      }}
                      style={{ 
                        width: "3px", 
                        background: neuralResponse?.sentiment === "danger" ? "#ef4444" : "var(--primary)",
                        borderRadius: "2px"
                      }}
                    />
                  ))}
                </div>
                
                <AnimatePresence mode="wait">
                  {neuralResponse ? (
                    <motion.div 
                      key={neuralResponse.message}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        marginTop: "1.5rem", 
                        padding: "1rem", 
                        background: "rgba(0, 229, 255, 0.05)", 
                        border: "1px solid var(--primary)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem"
                      }}
                    >
                       <Zap size={16} color="var(--primary)" />
                       <span style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>{neuralResponse.message}</span>
                       <div style={{ flex: 1 }} />
                       <span style={{ fontSize: "0.6rem", fontWeight: "900", opacity: 0.5 }}>PRESS_ENTER_TO_EXECUTE</span>
                    </motion.div>
                  ) : query.length > 0 && (
                    <motion.div style={{ marginTop: "1.5rem", textAlign: "center", opacity: 0.3, fontSize: "0.7rem", fontWeight: "900" }}>
                       TRANSCRIBING_INTENT...
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Area (Standard Mode) */}
          {mode === "standard" && (
            <div style={{ maxHeight: "400px", overflowY: "auto", padding: "0.5rem" }}>
              {filteredCommands.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleAction(cmd)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.25rem",
                        padding: "1rem 1.5rem",
                        width: "100%",
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        color: "var(--text-main)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(0, 229, 255, 0.08)";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <span style={{ color: "var(--primary)" }}>{cmd.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>{cmd.label}</div>
                        <div style={{ fontSize: "0.7rem", fontWeight: "900", opacity: 0.3, letterSpacing: "0.1em" }}>{cmd.category.toUpperCase()}</div>
                      </div>
                      <div style={{ opacity: 0.1 }}>
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "4rem 2rem", textAlign: "center", opacity: 0.2 }}>
                   <Globe size={48} style={{ marginBottom: "1.5rem" }} />
                   <p style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "0.1em" }}>NO_COMMAND_NODES_MATCH_QUERY</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{ 
            padding: "1.25rem 1.5rem", 
            background: "rgba(0,0,0,0.2)", 
            fontSize: "0.7rem", 
            fontWeight: "900",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid var(--border-dim)"
          }}>
            <div style={{ color: "var(--text-dim)" }}>
               SYSTEM_TIP: PRESS <span style={{ color: "var(--primary)" }}>TAB</span> TO ACTIVATE NEURAL_MODE
            </div>
            <div style={{ display: "flex", gap: "1.5rem", color: "var(--text-dim)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Activity size={12} /> TELEMETRY_ACTIVE</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Cpu size={12} /> CORE_STABLE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
