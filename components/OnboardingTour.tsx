"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Info, Search, Bell, User, LayoutDashboard } from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

const steps = [
  {
    id: "welcome",
    title: "WELCOME TO SPARK",
    desc: "Welcome to your new institutional command center. Let's take a quick 30-second tour of the new AI-powered features.",
    icon: <LayoutDashboard size={24} />,
    target: "body",
    position: "center"
  },
  {
    id: "search",
    title: "SEARCH SYSTEM",
    desc: "Need to find a student, club, or scholarship? Use the Search System (or press CMD+K) to find anything instantly.",
    icon: <Search size={24} />,
    target: "[data-tour='search-trigger']",
    position: "bottom"
  },
  {
    id: "notifs",
    title: "NOTIFICATIONS",
    desc: "Stay updated! This is where you'll see alerts for scholarship matches, status updates, and school announcements.",
    icon: <Bell size={24} />,
    target: "[data-tour='notif-trigger']",
    position: "bottom"
  },
  {
    id: "profile",
    title: "MY PROFILE",
    desc: "Don't forget to update your contact details and address in the Profile settings to ensure smooth school coordination.",
    icon: <User size={24} />,
    target: "[data-tour='profile-link']",
    position: "right"
  }
];

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(-1);
  const { currentUser } = useGlobalState();

  useEffect(() => {
    const hasSeen = localStorage.getItem("spark_tour_seen");
    if (!hasSeen && currentUser) {
      setTimeout(() => setCurrentStep(0), 1000);
    }
  }, [currentUser]);

  const handleComplete = () => {
    localStorage.setItem("spark_tour_seen", "true");
    setCurrentStep(-1);
  };

  if (currentStep === -1) return null;

  const step = steps[currentStep];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
      {/* Dim Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ 
          position: "absolute", 
          inset: 0, 
          background: "rgba(0,0,0,0.7)", 
          backdropFilter: "blur(4px)",
          pointerEvents: "auto" 
        }} 
        onClick={handleComplete}
      />

      {/* Tour Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            position: "absolute",
            top: step.position === "center" ? "50%" : "auto",
            left: step.position === "center" ? "50%" : "auto",
            transform: step.position === "center" ? "translate(-50%, -50%)" : "none",
            width: "320px",
            background: "var(--bg-surface)",
            border: "1px solid var(--primary)",
            padding: "2rem",
            pointerEvents: "auto",
            boxShadow: "0 20px 50px rgba(0, 229, 255, 0.2)",
            zIndex: 10000
          }}
        >
          <button 
            onClick={handleComplete}
            style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}
          >
            <X size={16} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ color: "var(--primary)" }}>{step.icon}</div>
            <h3 style={{ fontSize: "0.8rem", fontWeight: "900", letterSpacing: "0.1em", color: "var(--text-main)" }}>{step.title}</h3>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.6", marginBottom: "2rem" }}>
            {step.desc}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {steps.map((_, i) => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === currentStep ? "var(--primary)" : "var(--border-dim)" }} />
              ))}
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              {currentStep > 0 && (
                <button 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "0.6rem", fontWeight: "900" }}
                >
                  BACK
                </button>
              )}
              <button 
                onClick={() => currentStep === steps.length - 1 ? handleComplete() : setCurrentStep(prev => prev + 1)}
                style={{ 
                  background: "var(--primary)", 
                  color: "var(--bg-deep)", 
                  border: "none", 
                  padding: "0.5rem 1rem", 
                  fontSize: "0.6rem", 
                  fontWeight: "900", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                {currentStep === steps.length - 1 ? "FINISH" : "NEXT"} <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
