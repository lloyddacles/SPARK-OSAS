"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Grid, 
  Cpu, 
  Terminal, 
  Database, 
  Activity, 
  ShieldAlert, 
  LogOut,
  Zap,
  Globe,
  Settings,
  ChevronRight,
  User,
  Search,
  Building2,
  Hash,
  FileUp,
  ShieldCheck,
  LayoutDashboard,
  Box,
  Monitor,
  Workflow,
  TrendingUp,
  GraduationCap,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, isMobileSidebarOpen, toggleMobileSidebar } = useGlobalState();

  const navGroups = [
    {
      group: "MAIN MENU",
      items: [
        { icon: <LayoutDashboard size={16} />, label: "DASHBOARD", href: "/dashboard", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "GUIDANCE_COUNSELOR"] },
        { icon: <ShieldCheck size={16} />, label: "ADVISORY COMMAND", href: "/adviser", roles: ["ADVISER", "SYSTEM_ADMIN"] },
        { icon: <TrendingUp size={16} />, label: "INSTITUTIONAL PULSE", href: "/analytics", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR"] },
        { icon: <Settings size={16} />, label: "ACCOUNT SETTINGS", href: "/settings", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR"] },
      ]
    },
    {
      group: "SERVICES",
      items: [
        { icon: <Cpu size={16} />, label: "SCHOLARSHIPS", href: "/scholarships", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "STUDENT_APPLICANT", "STUDENT_LEADER"] },
        { icon: <Building2 size={16} />, label: "ORGANIZATIONS", href: "/organizations", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "STUDENT_APPLICANT", "STUDENT_LEADER", "ADVISER"] },
        { icon: <Globe size={16} />, label: "ANNOUNCEMENTS", href: "/events", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "GUIDANCE_COUNSELOR", "STUDENT_APPLICANT", "STUDENT_LEADER", "ADVISER"] },
      ]
    },
    {
      group: "ACTIVITIES",
      items: [
        { icon: <Activity size={16} />, label: "HELP REQUESTS", href: "/requests", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "GUIDANCE_COUNSELOR", "STUDENT_APPLICANT", "STUDENT_LEADER"] },
        { icon: <Hash size={16} />, label: "APPOINTMENTS", href: "/appointments", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "GUIDANCE_COUNSELOR", "STUDENT_APPLICANT", "STUDENT_LEADER"] },
        { icon: <FileUp size={16} />, label: "SUBMISSIONS", href: "/submissions", roles: ["STUDENT_APPLICANT", "STUDENT_LEADER"] },
      ]
    },
    {
      group: "ADMINISTRATION",
      items: [
         {icon: <Database size={16} />, label: "DOCUMENT CHECK", href: "/guidance/vault-audit", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR"] },
        { icon: <Activity size={16} />, label: "AUDIT COMMAND", href: "/admin/audit", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR"] },
        { icon: <GraduationCap size={16} />, label: "SCHOLAR INVENTORY", href: "/admin/scholars", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR"] },
        { icon: <Workflow size={16} />, label: "GUIDANCE CENTER", href: "/guidance", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "GUIDANCE_COUNSELOR"] },
        { icon: <User size={16} />, label: "STUDENT REFERRALS", href: "/referrals", roles: ["SYSTEM_ADMIN", "OSAS_DIRECTOR", "GUIDANCE_COUNSELOR", "ADVISER"] },
        { icon: <ShieldAlert size={16} />, label: "SYSTEM ADMIN", href: "/admin", roles: ["SYSTEM_ADMIN"] },
      ]
    }
  ];

  return (
    <div 
      className={`sidebar-root ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
      style={{ 
        width: "var(--sidebar-width)", 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column",
        padding: "2.5rem 1.25rem",
        borderRight: "1px solid var(--border-dim)",
        background: "var(--bg-surface)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Mobile Close Button */}
      <button 
        className="mobile-only"
        onClick={toggleMobileSidebar}
        style={{ position: "absolute", top: "1rem", right: "1rem", color: "var(--text-dim)", zIndex: 10 }}
      >
        <X size={20} />
      </button>
      {/* Background Aesthetic Grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: "radial-gradient(var(--primary) 0.5px, transparent 0.5px)", backgroundSize: "16px 16px" }} />

      {/* Header Logo */}
      <div style={{ marginBottom: "4rem", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* The Digital Spark Icon */}
          <div style={{ position: "relative", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ 
                position: "absolute", 
                inset: 0, 
                border: "2px solid var(--primary)", 
                opacity: 0.2, 
                borderRadius: "2px" 
              }} 
            />
            <div style={{ 
              width: "32px", 
              height: "32px", 
              background: "var(--primary)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "var(--bg-deep)", 
              borderRadius: "2px",
              boxShadow: "0 0 15px var(--primary-glow)",
              zIndex: 2
            }}>
              <Zap size={18} fill="currentColor" />
            </div>
          </div>

          <div>
            <h2 style={{ 
              fontSize: "1.4rem", 
              fontWeight: "900", 
              letterSpacing: "0.2em", 
              color: "var(--text-main)", 
              lineHeight: 1,
              margin: 0
            }}>SPARK</h2>
            <p style={{ 
              fontSize: "0.55rem", 
              fontWeight: "900", 
              color: "var(--primary)", 
              letterSpacing: "0.25em", 
              marginTop: "0.3rem",
              opacity: 0.8
            }}>INSTITUTIONAL AI</p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.5rem", overflowY: "auto", position: "relative" }} className="no-scrollbar">
        {navGroups.map((group) => {
          const filteredItems = group.items.filter(item => !currentUser || item.roles.includes(currentUser.role));
          if (filteredItems.length === 0) return null;

          return (
            <div key={group.group}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "1rem", paddingLeft: "1rem" }}>{group.group}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      style={{ textDecoration: "none" }}
                      {...(item.href === "/settings" ? { "data-tour": "profile-link" } : {})}
                    >
                      <motion.div 
                        whileHover={{ x: 4 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          color: isActive ? "var(--primary)" : "var(--text-dim)",
                          background: isActive ? "rgba(0, 229, 255, 0.05)" : "transparent",
                          borderRadius: "4px",
                          transition: "all 0.2s",
                          position: "relative"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                           <span style={{ color: isActive ? "var(--primary)" : "var(--text-dim)", opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                           <span style={{ fontWeight: "800", fontSize: "0.75rem", letterSpacing: "0.05em" }}>{item.label}</span>
                        </div>
                        {isActive && (
                          <motion.div 
                            layoutId="active-pill"
                            style={{ position: "absolute", right: "-1px", width: "3px", height: "60%", background: "var(--primary)", borderRadius: "2px 0 0 2px" }} 
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer / User Identity Node */}
      <div style={{ marginTop: "auto", paddingTop: "2.5rem", borderTop: "1px solid var(--border-dim)", position: "relative" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", padding: "0 0.5rem" }}>
            <div style={{ width: "40px", height: "40px", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <User size={20} color="var(--primary)" />
            </div>
            <div style={{ overflow: "hidden" }}>
               <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--text-main)", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{currentUser?.name?.toUpperCase()}</p>
               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                  <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.05em" }}>{currentUser?.role?.split('_').join(' ')}</p>
               </div>
            </div>
         </div>
         <button 
           onClick={() => { logout(); router.push("/"); }}
           style={{ 
             width: "100%", 
             padding: "0.85rem", 
             background: "rgba(239, 68, 68, 0.05)", 
             border: "1px solid rgba(239, 68, 68, 0.2)",
             color: "#ef4444",
             fontSize: "0.7rem",
             fontWeight: "900",
             letterSpacing: "0.1em",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             gap: "0.75rem",
             cursor: "pointer",
             transition: "all 0.2s"
           }}
           onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
           onMouseOut={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)"}
         >
           <LogOut size={14} /> LOG OUT
         </button>
         <p style={{ fontSize: "0.5rem", textAlign: "center", color: "var(--text-dim)", marginTop: "1rem", fontWeight: "700" }}>OSAS SYSTEM</p>
      </div>
    </div>
  );
}

