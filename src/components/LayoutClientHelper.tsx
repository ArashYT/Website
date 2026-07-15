'use client';
import React, { useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';
import { audioEffects } from '@/utils/AudioEffects';

export default function LayoutClientHelper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // 2. Set mounted after a slight delay to allow the loader animation to play
    const timer = setTimeout(() => setMounted(true), 800);

    // 3. Attach global haptic synthesized sound effects to user actions
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.classList.contains('button') ||
        target.closest('a') ||
        target.closest('button')
      ) {
        audioEffects.playHoverTick();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.classList.contains('button') ||
        target.closest('a') ||
        target.closest('button')
      ) {
        audioEffects.playClickPop();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* Dynamic Particle Web Background */}
      <ParticleBackground />

      {/* 3D Glassmorphic rotating block loader */}
      {!mounted && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#0a0a0c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            transition: 'opacity 0.4s ease-out'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            {/* 3D Rotating Cube Spinner */}
            <div className="cube-container">
              <div className="cube">
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face right"></div>
                <div className="face left"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', opacity: 0.5, fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Syncing Frequencies...
            </span>
          </div>

          <style>{`
            .cube-container {
              width: 50px;
              height: 50px;
              perspective: 400px;
            }
            .cube {
              width: 100%;
              height: 100%;
              position: relative;
              transform-style: preserve-3d;
              animation: spin3D 2.5s infinite linear;
            }
            .face {
              position: absolute;
              width: 50px;
              height: 50px;
              background: rgba(255, 70, 85, 0.05);
              border: 2px solid var(--accent, #ff4655);
              box-shadow: 0 0 10px rgba(255, 70, 85, 0.2);
            }
            .front  { transform: rotateY(  0deg) translateZ(25px); }
            .back   { transform: rotateY(180deg) translateZ(25px); }
            .right  { transform: rotateY( 90deg) translateZ(25px); }
            .left   { transform: rotateY(-90deg) translateZ(25px); }
            .top    { transform: rotateX( 90deg) translateZ(25px); }
            .bottom { transform: rotateX(-90deg) translateZ(25px); }

            @keyframes spin3D {
              0% { transform: rotateX(0deg) rotateY(0deg); }
              100% { transform: rotateX(360deg) rotateY(360deg); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
