'use client';
import React, { useEffect, useState, useRef } from 'react';
import { audioEffects } from '@/utils/AudioEffects';

const THEMES = [
  { id: 'dark', label: '🌙 Default Dark' },
  { id: 'light', label: '☀️ Default Light' },
  { id: 'valorant', label: '🔴 Valorant' },
  { id: 'minecraft', label: '🟩 Minecraft' }
];

const FONTS = [
  { id: 'inter', label: 'Outfit / Inter (Modern)' },
  { id: 'vt323', label: 'VT323 (Retro Monospace)' },
  { id: 'system', label: 'System Monospace' }
];

export default function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);
  const [font, setFont] = useState('inter');
  const [blurValue, setBlurValue] = useState(12);
  const [borderOpacity, setBorderOpacity] = useState(0.08);
  const [glowOpacity, setGlowOpacity] = useState(0.25);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    const savedFont = localStorage.getItem('custom_font') || 'inter';
    applyFont(savedFont);

    const savedBlur = localStorage.getItem('custom_blur');
    if (savedBlur) {
      const val = parseInt(savedBlur);
      setBlurValue(val);
      document.documentElement.style.setProperty('--glass-blur', `${val}px`);
    }

    const savedBorder = localStorage.getItem('custom_border');
    if (savedBorder) {
      const val = parseFloat(savedBorder);
      setBorderOpacity(val);
      document.documentElement.style.setProperty('--border-opacity', String(val));
    }

    // Close panel when clicking outside
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const applyTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('theme', themeId);
    
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    
    if (themeId === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  const applyFont = (fontId: string) => {
    setFont(fontId);
    localStorage.setItem('custom_font', fontId);

    if (fontId === 'vt323') {
      // Inject google font if not present
      if (!document.getElementById('font-vt323')) {
        const link = document.createElement('link');
        link.id = 'font-vt323';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
        document.head.appendChild(link);
      }
      document.documentElement.style.setProperty('--font-override', "'VT323', monospace");
    } else if (fontId === 'system') {
      document.documentElement.style.setProperty('--font-override', 'monospace');
    } else {
      document.documentElement.style.removeProperty('--font-override');
    }
  };

  const handleBlurChange = (val: number) => {
    setBlurValue(val);
    localStorage.setItem('custom_blur', String(val));
    document.documentElement.style.setProperty('--glass-blur', `${val}px`);
    audioEffects.playHoverTick();
  };

  const handleBorderChange = (val: number) => {
    setBorderOpacity(val);
    localStorage.setItem('custom_border', String(val));
    document.documentElement.style.setProperty('--border-opacity', String(val));
    audioEffects.playHoverTick();
  };

  const togglePanel = () => {
    audioEffects.playClickPop();
    setIsOpen(!isOpen);
  };

  const handleHover = () => {
    audioEffects.playHoverTick();
  };

  return (
    <div ref={panelRef} style={{ zIndex: 100, display: 'inline-block', position: 'relative' }}>
      
      {/* settings Cog Icon Trigger button */}
      <button 
        onClick={togglePanel}
        onMouseEnter={handleHover}
        className="glass"
        style={{
          padding: '0.6rem 1rem',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          cursor: 'pointer',
          background: 'var(--card-bg)',
          color: 'var(--foreground)',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ⚙️ Customize Theme
      </button>

      {/* Popover Customizer Menu */}
      {isOpen && (
        <div 
          className="glass reveal"
          style={{
            position: 'absolute',
            right: 0,
            top: '48px',
            width: '270px',
            padding: '1.25rem',
            border: '1px solid var(--card-border)',
            background: 'rgba(10, 10, 12, 0.96)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Header */}
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.4rem' }}>
            🎨 Interface Settings
          </h4>

          {/* Theme Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px', fontWeight: 'bold' }}>THEME COLOR PRESET</label>
            <select
              value={currentTheme}
              onChange={(e) => {
                audioEffects.playClickPop();
                applyTheme(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#000',
                color: '#fff',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            >
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Font Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px', fontWeight: 'bold' }}>TYPOGRAPHY FONT</label>
            <select
              value={font}
              onChange={(e) => {
                audioEffects.playClickPop();
                applyFont(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#000',
                color: '#fff',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            >
              {FONTS.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Glass Blur Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px', fontWeight: 'bold' }}>
              <span>GLASS BACKDROP BLUR</span>
              <span>{blurValue}px</span>
            </div>
            <input 
              type="range"
              min="0"
              max="24"
              value={blurValue}
              onChange={(e) => handleBlurChange(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'ew-resize' }}
            />
          </div>

          {/* Border Opacity Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px', fontWeight: 'bold' }}>
              <span>GLASS BORDER OPACITY</span>
              <span>{Math.round(borderOpacity * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="30"
              step="2"
              value={borderOpacity * 100}
              onChange={(e) => handleBorderChange(parseFloat(e.target.value) / 100)}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'ew-resize' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
