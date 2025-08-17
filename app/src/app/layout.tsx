import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PrivyProviderWrapper from "../components/PrivyProviderWrapper";
import { ToastProvider } from "../components/ToastContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Commit Club 🗽",
  description: "Turn your goals into reality with social stakes. Create challenges, put money on the line, and reward those who show up!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrivyProviderWrapper>
          <ToastProvider>
            {children}
          </ToastProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
