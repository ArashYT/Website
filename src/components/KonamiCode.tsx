'use client';
import { useEffect, useState } from 'react';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function KonamiCode() {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setInputSequence((prev) => {
        const newSequence = [...prev, e.key];
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift();
        }
        
        // Check if matches
        if (newSequence.join(',') === KONAMI_CODE.join(',')) {
          setActivated(true);
          document.documentElement.setAttribute('data-theme', 'easter-egg');
          // Play sound
          const audio = new Audio('https://www.myinstants.com/media/sounds/epic.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.log('Audio blocked', e));
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!activated) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '4rem',
      fontWeight: 'bold',
      color: 'var(--accent)',
      textShadow: '0 0 20px var(--accent-glow)',
      zIndex: 9999,
      animation: 'zoomFadeOut 3s forwards',
      pointerEvents: 'none'
    }}>
      EASTER EGG UNLOCKED!
      <style>{`
        @keyframes zoomFadeOut {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2); display: none; }
        }
      `}</style>
    </div>
  );
}
