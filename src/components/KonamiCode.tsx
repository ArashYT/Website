'use client';
import React, { useEffect, useState, useRef } from 'react';
import { audioEffects } from '@/utils/AudioEffects';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function KonamiCode() {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game state refs to prevent react state updates during animation loop
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const isGameOverRef = useRef(false);
  const playerRef = useRef({ y: 150, vy: 0, height: 20, width: 20, isJumping: false });
  const obstaclesRef = useRef<Array<{ x: number; width: number; height: number; speed: number }>>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Check local storage for high score
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('konami_jumper_highscore');
      if (saved) {
        highScoreRef.current = parseInt(saved);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Process Konami Sequence
      setInputSequence((prev) => {
        const newSequence = [...prev, e.key];
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift();
        }
        
        if (newSequence.join(',') === KONAMI_CODE.join(',')) {
          setActivated(true);
          setGameActive(true);
          // Play unlock sound
          audioEffects.playClickPop();
          setTimeout(() => audioEffects.playHoverTick(), 150);
        }
        
        return newSequence;
      });

      // 2. Process Jumper controls when game is active
      if (gameActive) {
        if (e.key === ' ' || e.key === 'ArrowUp') {
          e.preventDefault(); // prevent page scroll
          triggerJump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameActive]);

  // Jump Action & Audio Synthesis
  const triggerJump = () => {
    if (isGameOverRef.current) {
      resetGame();
      return;
    }
    const p = playerRef.current;
    if (!p.isJumping) {
      p.vy = -7.5;
      p.isJumping = true;
      playSynthesizedBeep(440, 660, 0.1); // jump sound sweep
    }
  };

  const playSynthesizedBeep = (freqStart: number, freqEnd: number, duration: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const resetGame = () => {
    scoreRef.current = 0;
    isGameOverRef.current = false;
    playerRef.current = { y: 150, vy: 0, height: 20, width: 20, isJumping: false };
    obstaclesRef.current = [{ x: 420, width: 15, height: 25, speed: 4 }];
    playSynthesizedBeep(520, 780, 0.15);
  };

  // Main Jumper Game Loop
  useEffect(() => {
    if (!gameActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    resetGame();

    const gameLoop = () => {
      if (!canvas || !ctx) return;

      // Clear Frame
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Floor line
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 170);
      ctx.lineTo(canvas.width, 170);
      ctx.stroke();

      // Get player, obstacles
      const p = playerRef.current;
      const obstacles = obstaclesRef.current;

      if (!isGameOverRef.current) {
        // Physics update
        p.vy += 0.35; // gravity
        p.y += p.vy;

        // Ground collision
        if (p.y >= 150) {
          p.y = 150;
          p.vy = 0;
          p.isJumping = false;
        }

        // Spawn obstacles
        if (obstacles.length === 0 || (canvas.width - obstacles[obstacles.length - 1].x) > 180 + Math.random() * 100) {
          obstacles.push({
            x: canvas.width + 10,
            width: Math.random() * 8 + 12,
            height: Math.random() * 15 + 15,
            speed: 3.5 + Math.min(scoreRef.current * 0.15, 2.5) // get faster
          });
        }

        // Update obstacles
        obstacles.forEach((obs, idx) => {
          obs.x -= obs.speed;

          // Check score point pass
          if (obs.x + obs.width < 15 && (obs as any).scored === undefined) {
            (obs as any).scored = true;
            scoreRef.current += 1;
            playSynthesizedBeep(880, 1200, 0.05); // score points chime
            
            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = scoreRef.current;
              localStorage.setItem('konami_jumper_highscore', String(scoreRef.current));
            }
          }
        });

        // Remove offscreen obstacles
        if (obstacles.length > 0 && obstacles[0].x < -30) {
          obstacles.shift();
        }

        // Collision detection (AABB)
        const hit = obstacles.some(obs => {
          return (
            15 < obs.x + obs.width &&
            15 + p.width > obs.x &&
            p.y < 170 &&
            p.y + p.height > 170 - obs.height
          );
        });

        if (hit) {
          isGameOverRef.current = true;
          playSynthesizedBeep(180, 80, 0.4); // crash landing low tone sound
        }
      }

      // Draw Player box (glowing pixel style)
      ctx.fillStyle = 'var(--accent, #ff4655)';
      ctx.fillRect(15, p.y, p.width, p.height);
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'var(--accent, #ff4655)';

      // Draw Obstacles (red pixel spiky triangles)
      ctx.shadowBlur = 0; // reset shadow
      ctx.fillStyle = '#ff4655';
      obstacles.forEach(obs => {
        ctx.beginPath();
        ctx.moveTo(obs.x, 170);
        ctx.lineTo(obs.x + obs.width / 2, 170 - obs.height);
        ctx.lineTo(obs.x + obs.width, 170);
        ctx.closePath();
        ctx.fill();
      });

      // Draw Score text
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.font = "bold 14px 'Outfit', sans-serif";
      ctx.fillText(`SCORE: ${scoreRef.current}`, 15, 25);
      ctx.fillText(`HI: ${highScoreRef.current}`, canvas.width - 70, 25);

      // Draw Game Over Overlay
      if (isGameOverRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff4655';
        ctx.font = "bold 20px 'Outfit', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);

        ctx.fillStyle = '#fff';
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText('Press SPACEBAR / Tap to Try Again', canvas.width / 2, canvas.height / 2 + 15);
        ctx.textAlign = 'start'; // reset text align
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameActive]);

  const closeGame = () => {
    audioEffects.playClickPop();
    setGameActive(false);
    setActivated(false);
  };

  if (!activated || !gameActive) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(10, 10, 12, 0.96)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        color: '#fff'
      }}
    >
      <div 
        className="glass" 
        style={{ 
          padding: '2rem', 
          borderRadius: '24px', 
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '450px',
          width: '90%',
          textAlign: 'center'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent)' }}>
          🎮 Retro Sword Jumper
        </h2>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>
          Press **Spacebar** or click/tap the screen to jump over incoming spiky hazards!
        </p>

        {/* Game Canvas frame */}
        <canvas 
          ref={canvasRef} 
          width="400" 
          height="180" 
          onClick={triggerJump}
          style={{ 
            borderRadius: '12px', 
            border: '2px solid var(--card-border)',
            background: '#0a0a0c',
            maxWidth: '100%',
            cursor: 'pointer'
          }} 
        />

        <button
          onClick={closeGame}
          onMouseEnter={() => audioEffects.playHoverTick()}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Exit Mini-Game
        </button>
      </div>
    </div>
  );
}
