"use client";

import { useGlobalState } from "@/lib/GlobalStateContext";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useEffect, useState } from "react";
import LoginPage from "@/app/page";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingTour from "@/components/OnboardingTour";
import CommandPalette from "@/components/CommandPalette";
import LivePulse from "@/components/LivePulse";
import { ShieldCheck, Zap, Bell, Signal } from "lucide-react";

/**
 * CLIENT WRAPPER - THE SESSION-AWARE ARCHITECT
 * Uses both Pathname and Authentication State to determine layout.
 */
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { theme, currentUser, isLoading } = useGlobalState();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showSentinel, setShowSentinel] = useState(false);
  
  // SESSION GUARD: Dual-Direction Routing
  useEffect(() => {
    if (!isLoading) {
      if (!currentUser && pathname !== "/" && pathname !== "/login") {
        router.push("/");
      } else if (currentUser && (pathname === "/" || pathname === "/login")) {
        router.push("/dashboard");
        // Simulate Native Push Notification on Entry
        setTimeout(() => {
          new Notification("SENTINEL_NODE_ACTIVE", {
            body: "BIOMETRIC_IDENTITY_SCAN: SUCCESSFUL. ACCESS_GRANTED.",
            icon: "/favicon.ico"
          });
        }, 1500);
      }
    }
  }, [currentUser, isLoading, pathname, router]);

  // PWA & MOBILE DETECTION
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('SW_NODE: SECURE_SYNC_ACTIVE', registration.scope);
        }).catch((err) => {
          console.error('SW_NODE: SYNC_FAIL', err);
        });
      });
    }

    // Request Notification Permissions
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isLoginPage = pathname === "/" || pathname === "/login";
  const showLoginGate = !isLoading && !currentUser;

  return (
    <div data-theme={theme} style={{ 
      minHeight: "100vh", 
      display: "flex",
      flexDirection: (isLoginPage || showLoginGate) ? "column" : "row",
      background: (isLoginPage || showLoginGate) ? "#030712" : "var(--bg-deep)",
      color: "var(--text-main)",
      overflow: "hidden"
    }}>
      <OnboardingTour />
      
      {/* MOBILE SENTINEL OVERLAY */}
      {isMobile && !isLoginPage && !showLoginGate && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            height: "4px", 
            background: "var(--primary)", 
            zIndex: 9999,
            boxShadow: "0 0 15px var(--primary)"
          }}
        />
      )}

      {/* SESSION-BASED GUARD: If no user is logged in, no navigation is rendered. */}
      {!isLoginPage && !showLoginGate && !isMobile && <Sidebar />}
      <CommandPalette />
      <LivePulse />
      
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        minWidth: 0,
        height: "100vh",
        position: "relative"
      }}>
        {!isLoginPage && !showLoginGate && <TopNav />}
        
        {/* MOBILE STATUS BAR (PHASE 14) */}
        {isMobile && !isLoginPage && !showLoginGate && (
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-dim)", background: "rgba(0, 229, 255, 0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Zap size={14} color="var(--primary)" />
                <span style={{ fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.2em" }}>SENTINEL_ACTIVE</span>
             </div>
             <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <Signal size={12} color="#10b981" />
                <ShieldCheck size={12} color="var(--primary)" />
             </div>
          </div>
        )}

        <main style={{ 
          flex: 1,
          overflowY: "auto",
          background: (isLoginPage || showLoginGate) ? "transparent" : "radial-gradient(at 0% 0%, var(--bg-surface) 0%, transparent 60%)",
          position: "relative",
          zIndex: 10
        }}>
          <div style={{ 
            padding: (isLoginPage || showLoginGate) ? 0 : (isMobile ? "1.5rem" : "3rem"),
            maxWidth: (isLoginPage || showLoginGate) ? "none" : "1600px",
            margin: "0",
            minHeight: "100vh"
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname + (showLoginGate ? "-gate" : "")}
                initial={{ opacity: 0, x: 15, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -15, filter: "blur(10px)" }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1] /* The Liquid 'Quint' Ease */
                }}
                style={{ height: (isLoginPage || showLoginGate) ? "100%" : "auto" }}
              >
                {showLoginGate ? <LoginPage /> : children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
