import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalStateProvider } from "@/lib/GlobalStateContext";
import { ClientWrapper } from "@/components/ClientWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPARK | OSAS Management System",
  description: "Student Platform for Assistance, Resources, and Knowledge - OSAS Integrated System",
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
