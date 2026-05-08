import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalStateProvider } from "@/lib/GlobalStateContext";
import { ClientWrapper } from "@/components/ClientWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPARK | OSAS Institutional Hub",
  description: "Elite Institutional Governance & Intelligence Portal",
  manifest: "/manifest.json",
  themeColor: "#0a0f19",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
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
