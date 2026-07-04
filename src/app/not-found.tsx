'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [nameSubmitted, setNameSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data));
  }, []);

  const submitScore = async (name: string) => {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score })
    });
    const data = await res.json();
    if (data.success) {
      setLeaderboard(data.scores);
      setNameSubmitted(true);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (playing && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (playing && timeLeft === 0) {
      setPlaying(false);
      setGameOver(true);
      setNameSubmitted(false);
    }
    return () => clearTimeout(timer);
  }, [playing, timeLeft]);

  const moveTarget = () => {
    const newTop = Math.random() * 80 + 10; 
    const newLeft = Math.random() * 80 + 10;
    setTargetPos({ top: `${newTop}%`, left: `${newLeft}%` });
  };

  const handleHit = () => {
    if (!playing) return;
    setScore(s => s + 1);
    moveTarget();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setPlaying(true);
    setGameOver(false);
    moveTarget();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center', overflow: 'hidden' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--accent)' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Page not found. Warm up your aim instead.</p>

      {!playing && !gameOver && (
        <button onClick={startGame} className="glass" style={{ padding: '1rem 3rem', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--accent)' }}>
          Start Aim Trainer
        </button>
      )}

      {playing && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.5rem' }}>
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
          <div style={{ 
            width: '100%', height: '400px', background: '#0a0a0a', position: 'relative', 
            borderRadius: '16px', overflow: 'hidden', cursor: 'crosshair', border: '2px solid var(--accent)'
          }}>
            <div 
              onClick={handleHit}
              style={{
                position: 'absolute',
                top: targetPos.top,
                left: targetPos.left,
                width: '40px', height: '40px',
                background: 'var(--accent)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 15px var(--accent-glow)'
              }}
            />
          </div>
        </>
      )}

      {gameOver && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Game Over! Score: {score}</h2>
          
          {!nameSubmitted ? (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <input type="text" id="playerName" placeholder="Enter your name" className="glass" style={{ padding: '0.5rem', background: 'var(--background)', color: 'white', border: '1px solid var(--accent)' }} />
              <button onClick={() => submitScore((document.getElementById('playerName') as HTMLInputElement).value || 'Anonymous')} className="glass" style={{ padding: '0.5rem 2rem', cursor: 'pointer', color: 'white', background: 'var(--accent)' }}>Submit Score</button>
            </div>
          ) : (
            <p style={{ marginTop: '1rem', color: 'var(--accent)' }}>Score submitted to global leaderboard!</p>
          )}

          <button onClick={startGame} className="glass" style={{ padding: '0.5rem 2rem', marginTop: '1rem', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--accent)' }}>Play Again</button>
        </div>
      )}

      <div className="glass" style={{ marginTop: '4rem', padding: '2rem', borderRadius: '16px', maxWidth: '600px', margin: '4rem auto 0 auto' }}>
        <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          🏆 Global Leaderboard
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {leaderboard.map((l, i) => (
            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontWeight: i < 3 ? 'bold' : 'normal' }}>{i + 1}. {l.name}</span>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{l.score}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link href="/" style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.1)', color: 'var(--foreground)', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', border: '1px solid var(--card-border)' }}>
        Return to Home
      </Link>
    </div>
  );
}
