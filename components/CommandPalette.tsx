"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { theme, toggleTheme, logout, currentUser } = useGlobalState();

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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  const commands = [
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
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)"
        }}
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            width: "100%",
            maxWidth: "600px",
            background: "var(--card-bg)",
            borderRadius: "12px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
            color: "var(--text-primary)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Bar */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1rem", 
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--border-color)"
          }}>
            <Search size={20} style={{ color: "var(--primary)", opacity: 0.6 }} />
            <input
              autoFocus
              placeholder="Search commands or navigate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                color: "var(--text-primary)"
              }}
            />
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.25rem",
              background: "rgba(255,255,255,0.05)",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.7rem",
              opacity: 0.6
            }}>
              ESC
            </div>
          </div>

          {/* Results Area */}
          <div style={{ maxHeight: "400px", overflowY: "auto", padding: "0.5rem" }}>
            {filteredCommands.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setIsOpen(false);
                      setQuery("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem 1rem",
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.1s",
                      color: "var(--text-primary)"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 229, 255, 0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ color: "var(--primary)" }}>{cmd.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>{cmd.label}</div>
                      <div style={{ fontSize: "0.75rem", opacity: 0.4 }}>{cmd.category}</div>
                    </div>
                    <div style={{ opacity: 0.2 }}>
                      <CommandIcon size={14} />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", opacity: 0.5, fontSize: "0.9rem" }}>
                No commands found matching "{query}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ 
            padding: "0.75rem 1.25rem", 
            background: "rgba(0,0,0,0.1)", 
            fontSize: "0.75rem", 
            opacity: 0.5,
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid var(--border-color)"
          }}>
            <div>Tip: Press <span style={{ fontWeight: "700" }}>Cmd+K</span> from anywhere</div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <span>↑↓ Navigate</span>
              <span>↵ Enter</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
