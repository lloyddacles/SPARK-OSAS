import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalStateProvider } from "@/lib/GlobalStateContext";
import { ClientWrapper } from "@/components/ClientWrapper";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0f19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "SPARK | OSAS Institutional Hub",
  description: "Elite Institutional Governance & Intelligence Portal",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SPARK OSAS",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalStateProvider>
          <ThemeProvider>
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </ThemeProvider>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
