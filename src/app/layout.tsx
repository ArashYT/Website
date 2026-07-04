import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arash | YouTube & Twitch Creator",
  description: "Welcome to the official website of Arash. Watch the newest videos, catch live streams, and connect on all social platforms.",
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
        <div className="layout-wrapper">
          <header className="glass" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--accent)', fontWeight: '900', letterSpacing: '-0.5px' }}>Arash</h1>
            <nav style={{ display: 'flex', gap: '1.5rem', fontWeight: 600 }}>
              <a href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Home</a>
              <a href="/gear" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Gear</a>
              <a href="/clips" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Submit Clip</a>
              <a href="/links" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Links</a>
            </nav>
            <ThemeToggle />
          </header>
          <main>{children}</main>
          <footer className="glass" style={{ textAlign: 'center', padding: '2rem', marginTop: '4rem', opacity: 0.8 }}>
            <p>&copy; {new Date().getFullYear()} Arash. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
