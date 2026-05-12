"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Search, 
  Filter, 
  MessageSquare, 
  Bell, 
  ShieldAlert, 
  Clock, 
  User,
  Plus,
  ArrowUpRight
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function AlertCenterPage() {
  const { currentUser, users } = useGlobalState();
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  
  // Mock Messages
  const [messages, setMessages] = useState([
    { id: "1", sender: "Lloyd Dacles", role: "ADVISER", content: "I've reviewed the CS Budget. Looks good for OSAS final sign-off.", time: "10:24 AM", priority: "Medium", isRead: false },
    { id: "2", sender: "Myael Ursolino", role: "GUIDANCE_COUNSELOR", content: "Regarding the recent referral: Student Juan needs a follow-up next week.", time: "09:45 AM", priority: "High", isRead: true },
    { id: "3", sender: "System Sentinel", role: "SYSTEM", content: "New backup generated successfully. Storage at 42% capacity.", time: "Yesterday", priority: "Low", isRead: true },
  ]);

  const filteredMessages = messages.filter(m => 
    m.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ height: "calc(100vh - 12rem)", display: "grid", gridTemplateColumns: "380px 1fr", gap: "2rem" }}>
      
      {/* Sidebar: Message List */}
      <div style={{ background: "white", borderRadius: "32px", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
        <div style={{ padding: "2rem", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b" }}>Alerts</h2>
            <button 
              onClick={() => setIsComposing(true)}
              style={{ width: "36px", height: "36px", background: "#3b82f6", color: "white", border: "none", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Plus size={18} />
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={16} />
            <input 
              placeholder="Search internal alerts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "0.85rem 0.85rem 0.85rem 2.8rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", fontSize: "0.9rem", outline: "none" }} 
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }} className="no-scrollbar">
          {filteredMessages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setActiveThread(msg.id)}
              style={{
                width: "100%",
                padding: "1.5rem",
                background: activeThread === msg.id ? "#eff6ff" : "transparent",
                border: "none",
                borderRadius: "20px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
                marginBottom: "0.5rem"
              }}
            >
              {!msg.isRead && (
                <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", width: "8px", height: "8px", background: "#3b82f6", borderRadius: "50%" }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: "900", color: msg.priority === "High" ? "#ef4444" : "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>{msg.priority} PRIORITY</span>
                <span style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700" }}>{msg.time}</span>
              </div>
              <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.25rem" }}>{msg.sender}</p>
              <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{msg.content}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main View: Thread Content */}
      <div style={{ background: "white", borderRadius: "32px", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.02)" }}>
        {activeThread ? (
          (() => {
            const msg = messages.find(m => m.id === activeThread);
            return (
              <>
                <div style={{ padding: "2.5rem 3rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <User size={24} color="#3b82f6" />
                      </div>
                      <div>
                         <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b" }}>{msg?.sender}</h3>
                         <p style={{ fontSize: "0.85rem", color: "#3b82f6", fontWeight: "800" }}>{msg?.role}</p>
                      </div>
                   </div>
                   <div style={{ display: "flex", gap: "1rem" }}>
                      <button style={{ padding: "0.75rem 1.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer" }}>Archive</button>
                      <button style={{ padding: "0.75rem 1.5rem", background: "#111827", color: "white", border: "none", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer" }}>Reply</button>
                   </div>
                </div>
                <div style={{ flex: 1, padding: "3rem", overflowY: "auto" }}>
                   <div style={{ maxWidth: "700px" }}>
                      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                         <Clock size={16} color="#94a3b8" />
                         <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "700" }}>SENT ON: {new Date().toDateString()} @ {msg?.time}</span>
                      </div>
                      <p style={{ fontSize: "1.1rem", color: "#334155", lineHeight: "1.8", fontWeight: "500", whiteSpace: "pre-wrap" }}>
                         {msg?.content}
                         {"\n\n"}
                         Best regards,{"\n"}
                         {msg?.sender}
                      </p>
                   </div>
                </div>
                <div style={{ padding: "2rem 3rem", background: "white", borderTop: "1px solid #f1f5f9" }}>
                   <div style={{ display: "flex", gap: "1.5rem" }}>
                      <input placeholder="Type your response..." style={{ flex: 1, padding: "1.25rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", fontSize: "1rem", fontWeight: "600" }} />
                      <button style={{ width: "60px", height: "60px", background: "#3b82f6", color: "white", border: "none", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 15px rgba(59, 130, 246, 0.2)" }}>
                         <Send size={24} />
                      </button>
                   </div>
                </div>
              </>
            );
          })()
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem", opacity: 0.4 }}>
             <MessageSquare size={80} color="#94a3b8" strokeWidth={1} />
             <p style={{ fontSize: "1rem", fontWeight: "900", letterSpacing: "0.1em", color: "#64748b" }}>SELECT_THREAD_TO_INITIATE_COMMS</p>
          </div>
        )}
      </div>

      {/* Compose Modal (Simplified) */}
      <AnimatePresence>
        {isComposing && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ width: "100%", maxWidth: "600px", background: "white", borderRadius: "32px", padding: "3rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
               <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "2rem" }}>New Institutional Alert</h2>
               <div style={{ display: "grid", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800" }}>Recipient</label>
                    <select style={{ width: "100%", padding: "1.25rem", borderRadius: "14px", border: "1px solid #f1f5f9", background: "#f8fafc", fontSize: "1rem" }}>
                       <option>OSAS Director (Janneth Calubayan)</option>
                       <option>Guidance Office (Myael Ursolino)</option>
                       <option>All Advisers</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800" }}>Content</label>
                    <textarea rows={5} placeholder="Transmit official message..." style={{ width: "100%", padding: "1.25rem", borderRadius: "14px", border: "1px solid #f1f5f9", background: "#f8fafc", fontSize: "1rem", outline: "none", resize: "none" }}></textarea>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                    <button onClick={() => setIsComposing(false)} style={{ flex: 1, padding: "1.25rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", fontSize: "1rem", fontWeight: "800", cursor: "pointer" }}>Cancel</button>
                    <button onClick={() => setIsComposing(false)} style={{ flex: 2, padding: "1.25rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer" }}>Send Alert</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
