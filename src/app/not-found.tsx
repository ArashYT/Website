'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: any;
    if (playing && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setPlaying(false);
    }
    return () => clearInterval(timer);
  }, [playing, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setPlaying(true);
    moveTarget();
  };

  const moveTarget = () => {
    if (containerRef.current) {
      const maxX = containerRef.current.clientWidth - 50;
      const maxY = containerRef.current.clientHeight - 50;
      setTarget({
        x: Math.random() * maxX,
        y: Math.random() * maxY
      });
    }
  };

  const hitTarget = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) {
      setScore(s => s + 1);
      moveTarget();
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem', opacity: 0.8 }}>Oops! You took a wrong turn. While you are here, let's test your aim.</p>
      
      <div 
        ref={containerRef}
        style={{ width: '100%', maxWidth: '800px', height: '400px', background: 'rgba(0,0,0,0.5)', border: '2px solid var(--accent)', borderRadius: '12px', position: 'relative', overflow: 'hidden', cursor: playing ? 'crosshair' : 'default', marginBottom: '2rem' }}
        onClick={() => { if (playing) setScore(s => Math.max(0, s - 1)) }}
      >
        {!playing && timeLeft === 15 && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Valo Warmup</h2>
            <button onClick={startGame} style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Start Game</button>
          </div>
        )}
        
        {!playing && timeLeft === 0 && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Game Over! Score: {score}</h2>
            <button onClick={startGame} style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Play Again</button>
          </div>
        )}

        {playing && (
          <div 
            onClick={hitTarget}
            style={{ position: 'absolute', left: target.x, top: target.y, width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--accent-glow)', transition: 'all 0.1s' }}
          >
            <div style={{ width: '20px', height: '20px', background: 'var(--background)', borderRadius: '50%' }}></div>
          </div>
        )}

        {playing && (
          <div style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Time: {timeLeft}s
          </div>
        )}
        {playing && (
          <div style={{ position: 'absolute', top: '10px', left: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            Score: {score}
          </div>
        )}
      </div>

      <Link href="/" style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.1)', color: 'var(--foreground)', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', border: '1px solid var(--card-border)' }}>
        Return to Home
      </Link>
    </div>
  );
}
