"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Info, ChevronDown, CheckCircle2, ChevronRight, BookOpen, Send, Check } from "lucide-react";

interface GuideStep {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface ProcessGuideProps {
  title: string;
  steps: GuideStep[];
  themeColor?: string;
}

export default function ProcessGuide({ title, steps, themeColor = "var(--primary)" }: ProcessGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: "2rem", border: `1px solid var(--border-dim)`, background: "var(--bg-accent)" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: "100%", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "var(--text-main)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Info size={18} color={themeColor} />
          <span style={{ fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.1em" }}>{title.toUpperCase()}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} color="var(--text-dim)" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 1.25rem 1.25rem 1.25rem", borderTop: "1px solid var(--border-dim)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.5rem" }}>
                {steps.map((step, index) => (
                  <div key={index} style={{ display: "flex", gap: "1.5rem", position: "relative" }}>
                    {index !== steps.length - 1 && (
                      <div style={{ position: "absolute", left: "15px", top: "40px", bottom: "-1.5rem", width: "2px", background: "var(--border-dim)" }} />
                    )}
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-surface)", border: `2px solid ${themeColor}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                      {step.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "0.25rem" }}>{step.title}</h4>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", lineHeight: "1.6", fontWeight: "600" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
