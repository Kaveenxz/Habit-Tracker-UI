import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Netizen – Web Solutions",
  description: "Netizen is a cutting-edge web development agency specializing in modern, high-performance websites and digital experiences. We build sleek, responsive, and conversion-driven websites tailored to your business needs.",
  icons: "/favicon.ico",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        
      >
        
        <div className="">
    
        </div>
      
        {children}
      </body>
    </html>
  );
}
