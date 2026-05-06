"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  Bell, 
  Trash2, 
  User, 
  ArrowRight, 
  Filter,
  CheckCircle2,
  Info,
  AlertTriangle,
  Radio,
  Activity,
  GraduationCap,
  Clock,
  X
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import ProcessGuide from "@/components/ProcessGuide";

export default function EventsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement, currentUser } = useGlobalState();
  const [activeTab, setActiveTab] = useState<"Feed" | "Admin">("Feed");
  
  // Admin Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"News" | "Event" | "Alert" | "Academic" | "System" | "Urgent">("News");

  const isOSAS = currentUser?.role === "OSAS_DIRECTOR" || currentUser?.role === "SYSTEM_ADMIN";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    addAnnouncement(title, content, category);
    setTitle("");
    setContent("");
    setCategory("News");
    setActiveTab("Feed");
  };

  const getCategoryColor = (cat: string) => {
     switch(cat) {
        case "Urgent": return "#ef4444";
        case "Alert": return "#f59e0b";
        case "System": return "var(--primary)";
        case "Academic": return "#3b82f6";
        case "Event": return "#a855f7";
        default: return "var(--text-dim)";
     }
  };

  return (
    <div style={{ width: "100%" }}>
      
      {/* Institutional Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>NETWORK: INSTITUTIONAL FEED</p>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            BROADCAST <span style={{ color: "var(--primary)" }}>COMMAND</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1px", background: "var(--border-dim)", padding: "1px" }}>
          {["Feed", "Admin"].map((tab, i) => (
            (tab === "Admin" && !isOSAS) ? null : (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)} 
                style={{ 
                  padding: "1rem 2rem", 
                  fontSize: "0.65rem", 
                  fontWeight: "900", 
                  background: activeTab === tab ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", 
                  color: activeTab === tab ? "var(--primary)" : "var(--text-dim)", 
                  border: "none", 
                  borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent", 
                  cursor: "pointer",
                  letterSpacing: "0.1em"
                }}
              >
                0{i+1}_ {tab === "Feed" ? "CENTRAL STREAM" : "COMMAND CONSOLE"}
              </button>
            )
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Feed" ? (
          <motion.div key="feed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{ display: "grid", gap: "2rem" }}>
              {announcements.length === 0 ? (
                <div className="sapphire-card" style={{ padding: "8rem", textAlign: "center" }}>
                   <Radio size={48} color="var(--primary)" style={{ opacity: 0.1, margin: "0 auto 2rem" }} />
                   <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em" }}>NO_ACTIVE_BROADCASTS</p>
                </div>
              ) : announcements.map((ann, i) => (
                <motion.div 
                  key={ann.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="sapphire-card"
                  style={{ 
                    padding: "3.5rem", 
                    borderLeft: `8px solid ${getCategoryColor(ann.category)}`,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Category Glow Backdrop */}
                  <div style={{ position: "absolute", top: 0, left: 0, width: "300px", height: "300px", background: `radial-gradient(circle at 0 0, ${getCategoryColor(ann.category)}15, transparent 70%)`, pointerEvents: "none" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                      <span style={{ 
                        padding: "0.5rem 1.25rem", 
                        fontSize: "0.6rem", 
                        fontWeight: "900", 
                        background: `${getCategoryColor(ann.category)}10`, 
                        color: getCategoryColor(ann.category),
                        border: `1px solid ${getCategoryColor(ann.category)}40`,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        letterSpacing: "0.2em"
                      }}>
                        {ann.category === "Urgent" && <Radio size={14} className="animate-pulse" />}
                        {ann.category === "Alert" && <AlertTriangle size={14} />}
                        {ann.category === "Academic" && <GraduationCap size={14} />}
                        {ann.category === "System" && <Activity size={14} />}
                        {ann.category === "Event" && <Calendar size={14} />}
                        {ann.category.toUpperCase()}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-dim)" }}>
                         <Clock size={12} />
                         <span style={{ fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.1em" }}>STAMPED: {ann.date}</span>
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "2rem", color: "var(--text-main)", letterSpacing: "-0.02em" }}>{ann.title.toUpperCase()}</h3>
                  <p style={{ color: "var(--text-main)", lineHeight: "2", marginBottom: "3rem", fontSize: "1rem", fontWeight: "500", maxWidth: "900px", opacity: 0.9 }}>{ann.content}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2rem", borderTop: "1px solid var(--border-dim)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-dim)", fontSize: "0.65rem", fontWeight: "900" }}>
                      <User size={14} color="var(--primary)" /> ORIGIN: <span style={{ color: "var(--text-main)" }}>{ann.author.toUpperCase()}</span>
                    </div>
                    {isOSAS && (
                      <button 
                        onClick={() => deleteAnnouncement(ann.id)}
                        style={{ padding: "0.5rem 1rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", fontSize: "0.6rem", fontWeight: "900", cursor: "pointer", letterSpacing: "0.1em" }}
                      >
                        TERMINATE BROADCAST
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="admin" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <ProcessGuide 
                title="Institutional Broadcasting Protocol"
                steps={[
                   { title: "Select Category", desc: "Define the broadcast type (Urgent, News, Academic) to set the priority level and visual signature.", icon: <Filter size={14} /> },
                   { title: "Draft Headline", desc: "Create a high-clarity title that immediately informs the campus community.", icon: <Megaphone size={14} /> },
                   { title: "Compose Payload", desc: "Provide detailed information, links, or instructions within the transmission body.", icon: <Info size={14} /> },
                   { title: "Execute Broadcast", desc: "Transmit the announcement to the central stream for immediate institutional visibility.", icon: <Radio size={14} /> }
                ]}
             />
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem", alignItems: "start" }}>
              {/* COMPOSER */}
              <div className="sapphire-card" style={{ padding: "4rem" }}>
                <div style={{ marginBottom: "3.5rem" }}>
                   <p style={{ color: "var(--primary)", fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>PROTOCOL: BROADCAST_INIT</p>
                   <h2 style={{ fontSize: "1.25rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                      INITIALIZE TRANSMISSION
                   </h2>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "2.5rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "1.25rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>SELECT TRANSMISSION CATEGORY</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)" }}>
                      {["News", "Event", "Academic", "System", "Alert", "Urgent"].map((cat) => (
                        <button 
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat as any)}
                          style={{ 
                            padding: "1rem", 
                            fontSize: "0.6rem", 
                            fontWeight: "900",
                            background: category === cat ? "var(--primary)" : "var(--bg-surface)",
                            color: category === cat ? "var(--text-dark)" : "var(--text-dim)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            letterSpacing: "0.1em"
                          }}
                        >
                          {cat.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>TRANSMISSION HEADLINE</label>
                    <input 
                      required value={title} onChange={e => setTitle(e.target.value)} 
                      placeholder="ENTER BROADCAST TITLE..."
                      style={{ width: "100%", padding: "1.25rem", fontSize: "0.9rem", fontWeight: "700", background: "var(--bg-accent)" }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>TRANSMISSION PAYLOAD</label>
                    <textarea 
                      required value={content} onChange={e => setContent(e.target.value)} 
                      placeholder="ENTER BROADCAST DETAILS..." rows={8}
                      style={{ width: "100%", padding: "1.25rem", fontSize: "0.9rem", fontWeight: "700", background: "var(--bg-accent)", lineHeight: "1.8" }} 
                    />
                  </div>

                  <button type="submit" className="btn-cyan" style={{ padding: "1.5rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
                    EXECUTE BROADCAST TRANSMISSION <ArrowRight size={20} />
                  </button>
                </form>
              </div>

              {/* ACTIVE TRANSMISSIONS MONITOR */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                   <h3 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>ACTIVE BROADCAST NODES</h3>
                   <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "#10b981", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Activity size={10} /> LIVE_STREAM_ACTIVE
                   </span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)" }}>
                  {announcements.length === 0 ? (
                    <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-surface)" }}>
                       <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em" }}>NO_NODES_DETECTED</p>
                    </div>
                  ) : announcements.map(ann => (
                    <div key={ann.id} style={{ background: "var(--bg-surface)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                         <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: getCategoryColor(ann.category), boxShadow: `0 0 10px ${getCategoryColor(ann.category)}` }} />
                         <div>
                            <h4 style={{ fontWeight: "900", fontSize: "0.85rem", color: "var(--text-main)" }}>{ann.title.toUpperCase()}</h4>
                            <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.25rem", letterSpacing: "0.05em" }}>{ann.date} • TYPE: {ann.category.toUpperCase()}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => deleteAnnouncement(ann.id)}
                        style={{ padding: "0.6rem", background: "none", border: "1px solid var(--border-dim)", color: "var(--text-dim)", cursor: "pointer", borderRadius: "4px" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sapphire-card" style={{ marginTop: "3rem", background: "rgba(255, 255, 255, 0.02)" }}>
                   <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "1rem" }}>TRANSMISSION_PROTOCOL</p>
                   <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.8" }}>
                      All broadcasts are cryptographically signed by the originating administrator. Urgent alerts bypass normal notification filters.
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
