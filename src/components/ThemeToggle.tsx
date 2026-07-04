'use client';
import React, { useEffect, useState } from 'react';

const THEMES = [
  { id: 'dark', label: '🌙 Default Dark' },
  { id: 'light', label: '☀️ Default Light' },
  { id: 'valorant', label: '🔴 Valorant' },
  { id: 'minecraft', label: '🟩 Minecraft' }
];

export default function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
  }, []);

  const applyTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('theme', themeId);
    
    // Reset all
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    
    if (themeId === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themeId !== 'light') {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}>
      <select 
        className="glass"
        value={currentTheme}
        onChange={(e) => applyTheme(e.target.value)}
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid var(--card-border)',
          borderRadius: '8px',
          cursor: 'pointer',
          background: 'var(--card-bg)',
          color: 'var(--foreground)',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          outline: 'none'
        }}
      >
        {THEMES.map(t => (
          <option key={t.id} value={t.id} style={{ background: '#000', color: '#fff' }}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
