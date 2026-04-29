"use client";

import { useGlobalState } from "@/lib/GlobalStateContext";
import { 
  Bell, 
  Search, 
  Settings,
  Circle,
  Hash,
  Command,
  Sun,
  Moon,
  User,
  Building2,
  FileText,
  X,
  Activity,
  LayoutDashboard,
  FileUp,
  HeartHandshake,
  GraduationCap,
  ShieldCheck,
  Workflow,
  Menu
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNav() {
  const { theme, toggleTheme, scholarshipApps, organizations, requests: serviceRequests, notifications, markNotificationsRead, announcements, toggleMobileSidebar } = useGlobalState();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const unreadCount = notifications.filter(n => n.unread).length;
  const activeAnnouncements = (announcements || []).slice(0, 5);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Unified Global Search Logic
  const results = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1) return [];
    
    const menuItems = [
      { id: "nav-dash", label: "DASHBOARD OVERVIEW", type: "NAVIGATION", href: "/dashboard", icon: <LayoutDashboard size={14} /> },
      { id: "nav-sub", label: "REVIEW SUBMISSIONS", type: "NAVIGATION", href: "/submissions", icon: <FileUp size={14} /> },
      { id: "nav-req", label: "SERVICE REQUESTS", type: "NAVIGATION", href: "/requests", icon: <FileText size={14} /> },
      { id: "nav-sch", label: "SCHOLARSHIP ASSETS", type: "NAVIGATION", href: "/scholarships", icon: <GraduationCap size={14} /> },
      { id: "nav-appt", label: "CONSULTATION NETWORK", type: "NAVIGATION", href: "/appointments", icon: <Hash size={14} /> },
      { id: "nav-guid", label: "GUIDANCE VAULT", type: "NAVIGATION", href: "/guidance", icon: <Workflow size={14} /> },
    ];

    const s = (scholarshipApps || []).filter(app => app.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(app => ({ id: app.id, label: app.studentName.toUpperCase(), type: "SCHOLARSHIP_NODE", href: "/scholarships", icon: <User size={14} /> }));
      
    const o = (organizations || []).filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()) || org.acronym.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(org => ({ id: org.id, label: `${org.name.toUpperCase()} (${org.acronym})`, type: "GUILD_NODE", href: "/organizations", icon: <Building2 size={14} /> }));
      
    const r = (serviceRequests || []).filter(req => req.type.toLowerCase().includes(searchQuery.toLowerCase()) || req.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(req => ({ id: req.id, label: `${req.studentName.toUpperCase()} - ${req.type.toUpperCase()}`, type: "SERVICE_NODE", href: "/requests", icon: <FileText size={14} /> }));

    const nav = menuItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

    return [...nav, ...s, ...o, ...r].slice(0, 10);
  }, [searchQuery, scholarshipApps, organizations, serviceRequests]);

  return (
    <>
      <header style={{
        height: activeAnnouncements.length > 0 ? "110px" : "80px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        borderBottom: "1px solid var(--border-dim)",
        position: "relative",
        zIndex: 100,
        transition: "height 0.3s"
      }}>
        {/* INSTITUTIONAL BROADCAST TICKER */}
        <AnimatePresence>
          {activeAnnouncements.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 30, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ 
                width: "100%", 
                background: "var(--bg-deep)", 
                borderBottom: "1px solid var(--border-dim)", 
                overflow: "hidden", 
                display: "flex", 
                alignItems: "center",
                position: "relative"
              }}
            >
               <div style={{ padding: "0 1rem", background: "var(--primary)", height: "100%", display: "flex", alignItems: "center", gap: "0.5rem", zIndex: 2, position: "relative", boxShadow: "10px 0 20px rgba(0,0,0,0.5)" }}>
                  <Activity size={12} color="var(--bg-deep)" />
                  <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--bg-deep)", letterSpacing: "0.1em" }}>LIVE_BROADCAST</span>
               </div>
               <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                 <motion.div 
                   animate={{ x: ["100%", "-100%"] }}
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "4rem" }}
                 >
                   {activeAnnouncements.map((ann, i) => (
                     <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ 
                          fontSize: "0.55rem", 
                          fontWeight: "900", 
                          padding: "0.1rem 0.5rem", 
                          background: ann.category === "Urgent" ? "#ef4444" : ann.category === "System" ? "var(--text-dim)" : "var(--primary)",
                          color: ann.category === "Urgent" || ann.category === "System" ? "white" : "var(--bg-deep)",
                          borderRadius: "1px"
                        }}>
                          {ann.category.toUpperCase()}
                        </span>
                        <span style={{ fontSize: "0.65rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "0.05em" }}>{ann.title.toUpperCase()}: {ann.content}</span>
                     </div>
                   ))}
                   {/* Duplicate for seamless scroll */}
                   {activeAnnouncements.map((ann, i) => (
                     <div key={`dup-${i}`} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ 
                          fontSize: "0.55rem", 
                          fontWeight: "900", 
                          padding: "0.1rem 0.5rem", 
                          background: ann.category === "Urgent" ? "#ef4444" : ann.category === "System" ? "var(--text-dim)" : "var(--primary)",
                          color: ann.category === "Urgent" || ann.category === "System" ? "white" : "var(--bg-deep)",
                          borderRadius: "1px"
                        }}>
                          {ann.category.toUpperCase()}
                        </span>
                        <span style={{ fontSize: "0.65rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "0.05em" }}>{ann.title.toUpperCase()}: {ann.content}</span>
                     </div>
                   ))}
                 </motion.div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {/* Mobile Menu Trigger */}
            <button 
              className="mobile-only"
              onClick={toggleMobileSidebar}
              style={{ 
                color: "var(--primary)", 
                padding: "0.5rem", 
                background: "var(--bg-accent)", 
                border: "1px solid var(--border-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Menu size={20} />
            </button>

            {/* Command Trigger */}
            <button 
              data-tour="search-trigger"
              onClick={() => setIsSearchOpen(true)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1rem", 
                background: "var(--bg-accent)", 
                padding: "0.6rem 1.25rem", 
                border: "1px solid var(--border-dim)",
                color: "var(--text-dim)",
                fontSize: "0.65rem",
                fontWeight: "900",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <Command size={14} color="var(--primary)" />
              <span>SEARCH SYSTEM</span>
              <span style={{ opacity: 0.3, marginLeft: "1rem", fontSize: "0.6rem" }}>CMD+K</span>
            </button>

            {/* System Telemetry */}
            <div style={{ display: "flex", gap: "2rem" }}>
              {[
                { label: "SYSTEM STATUS", value: "OPERATIONAL", color: "#10b981" },
                { label: "TERMINAL", value: "OSAS_ALPHA_01", color: "var(--primary)" }
              ].map(node => (
                <div key={node.label} style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.15em" }}>{node.label}</p>
                    <p style={{ fontSize: "0.65rem", fontWeight: "900", color: node.color }}>{node.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Theme Toggle Node */}
            <motion.button 
              whileHover={{ scale: 1.05, borderColor: "var(--primary)" }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              style={{ 
                color: "var(--text-dim)", 
                padding: "0.75rem", 
                background: "var(--bg-accent)", 
                border: "1px solid var(--border-dim)", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "2px", background: "var(--primary)", opacity: 0.1 }} />
            </motion.button>

            {/* Notification Node */}
            <div style={{ position: "relative" }}>
              <motion.button 
                data-tour="notif-trigger"
                whileHover={{ scale: 1.05, borderColor: "var(--primary)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                style={{ 
                  position: "relative", 
                  padding: "0.75rem", 
                  background: isNotifOpen ? "rgba(0, 229, 255, 0.05)" : "var(--bg-accent)", 
                  border: isNotifOpen ? "1px solid var(--primary)" : "1px solid var(--border-dim)",
                  color: isNotifOpen ? "var(--primary)" : "var(--text-dim)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ 
                      position: "absolute", 
                      top: "-6px", 
                      right: "-6px", 
                      width: "20px", 
                      height: "20px", 
                      background: "var(--primary)", 
                      border: "2px solid var(--bg-deep)", 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "0.65rem", 
                      fontWeight: "900", 
                      color: "var(--bg-deep)",
                      boxShadow: "0 0 15px var(--primary-glow)"
                    }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    style={{ 
                      position: "absolute", 
                      right: 0, 
                      top: "130%", 
                      width: "380px", 
                      background: "var(--bg-surface)",
                      border: "1px solid var(--primary)",
                      zIndex: 100,
                      boxShadow: "0 20px 50px rgba(0,0,0,0.8)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", background: "var(--bg-accent)", borderBottom: "1px solid var(--border-dim)" }}>
                      <h3 style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.15em", color: "var(--text-main)" }}>NOTIFICATIONS</h3>
                      <button onClick={markNotificationsRead} style={{ fontSize: "0.6rem", color: "var(--primary)", fontWeight: "900", background: "none", border: "none", cursor: "pointer" }}>MARK ALL READ</button>
                    </div>
                    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {notifications.map(n => (
                        <div key={n.id} style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-dim)", background: n.unread ? "rgba(0, 229, 255, 0.02)" : "transparent" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                            <p style={{ fontSize: "0.75rem", fontWeight: "900", color: n.unread ? "var(--primary)" : "var(--text-main)" }}>{n.title.toUpperCase()}</p>
                            <span style={{ fontSize: "0.55rem", color: "var(--text-dim)", fontWeight: "900" }}>{n.time}</span>
                          </div>
                          <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.5" }}>{n.desc}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div style={{ padding: "3rem", textAlign: "center" }}>
                          <ShieldCheck size={32} color="var(--text-dim)" style={{ opacity: 0.1, marginBottom: "1rem" }} />
                          <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>NO NEW ALERTS</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh" }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(8px)" }} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              style={{ 
                position: "relative", 
                width: "90%", 
                maxWidth: "640px", 
                background: "var(--bg-deep)", 
                border: "1px solid var(--primary)", 
                boxShadow: "0 30px 100px rgba(0, 229, 255, 0.15)",
                overflow: "hidden"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-dim)", background: "var(--bg-surface)" }}>
                <Search size={20} color="var(--primary)" />
                <input 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH FOR STUDENTS, CLUBS, OR SCHOLARSHIPS..."
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "0 1.5rem", fontSize: "1rem", color: "var(--text-main)", fontWeight: "800", textTransform: "uppercase" }}
                />
                <button onClick={() => setIsSearchOpen(false)} style={{ color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
              </div>

              <div style={{ padding: "1.5rem", maxHeight: "450px", overflowY: "auto" }} className="no-scrollbar">
                <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "1.5rem", paddingLeft: "1rem" }}>SEARCH RESULTS</p>
                {results.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {results.map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(item.href);
                        }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 229, 255, 0.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                           <div style={{ color: "var(--primary)" }}>{item.icon}</div>
                           <span style={{ fontWeight: "900", fontSize: "0.85rem", color: "var(--text-main)", letterSpacing: "0.05em" }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "900" }}>{item.type}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <Activity size={40} color="var(--primary)" style={{ opacity: 0.1, marginBottom: "1.5rem" }} />
                    <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-dim)" }}>NO RESULTS FOUND FOR: "{searchQuery.toUpperCase()}"</p>
                  </div>
                )}
              </div>
              <div style={{ padding: "1rem 2rem", background: "var(--bg-accent)", borderTop: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>OSAS SPARK V2.2</p>
                 <div style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}><kbd style={{ background: "var(--bg-surface)", padding: "0.2rem 0.4rem", border: "1px solid var(--border-dim)" }}>ESC</kbd> CLOSE</span>
                    <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}><kbd style={{ background: "var(--bg-surface)", padding: "0.2rem 0.4rem", border: "1px solid var(--border-dim)" }}>ENTER</kbd> EXECUTE</span>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
