import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArashYT | YouTube & Twitch Creator",
  description: "Welcome to the official website of ArashYT. Watch the newest videos, catch live streams, and connect on all social platforms.",
};

import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            try {
              var saved = localStorage.getItem('theme');
              if (saved === 'light') { document.documentElement.classList.remove('dark'); }
              else { document.documentElement.classList.add('dark'); }
            } catch (e) {}
          })();
        `}} />
        <ThemeToggle />
        <div className="layout-wrapper">
          <header className="glass">
            <h1>ArashYT</h1>
          </header>
          <main>{children}</main>
          <footer className="glass">
            <p>&copy; {new Date().getFullYear()} ArashYT. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
