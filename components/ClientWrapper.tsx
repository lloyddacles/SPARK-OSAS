"use client";

import { useGlobalState } from "@/lib/GlobalStateContext";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useEffect } from "react";
import LoginPage from "@/app/page";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingTour from "@/components/OnboardingTour";
import CommandPalette from "@/components/CommandPalette";
import LivePulse from "@/components/LivePulse";

/**
 * CLIENT WRAPPER - THE SESSION-AWARE ARCHITECT
 * Uses both Pathname and Authentication State to determine layout.
 */
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { theme, currentUser, isLoading } = useGlobalState();
  const pathname = usePathname();
  const router = useRouter();
  
  // SESSION GUARD: Dual-Direction Routing
  useEffect(() => {
    if (!isLoading) {
      if (!currentUser && pathname !== "/" && pathname !== "/login") {
        router.push("/");
      } else if (currentUser && (pathname === "/" || pathname === "/login")) {
        router.push("/dashboard");
      }
    }
  }, [currentUser, isLoading, pathname, router]);

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
      {/* SESSION-BASED GUARD: If no user is logged in, no navigation is rendered. */}
      {!isLoginPage && !showLoginGate && <Sidebar />}
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
        
        <main style={{ 
          flex: 1,
          overflowY: "auto",
          background: (isLoginPage || showLoginGate) ? "transparent" : "radial-gradient(at 0% 0%, var(--bg-surface) 0%, transparent 60%)",
          position: "relative",
          zIndex: 10
        }}>
          <div style={{ 
            padding: (isLoginPage || showLoginGate) ? 0 : "3rem",
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
