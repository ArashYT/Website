'use client';
import React from 'react';

const CLIPS = [
  "AwkwardEncouragingPeanutOpieOP",
  "TenderAgileGrasshopperSSSsss",
  "GloriousToughCaterpillarRaccAttack" // Fake clips for now
];

export default function RandomClip() {
  const handleRandom = () => {
    const random = CLIPS[Math.floor(Math.random() * CLIPS.length)];
    // In a real app, this would redirect or open a modal
    alert(`Playing clip: ${random} (Backend needed to embed real clips)`);
  };

  return (
    <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
      <h2>🎲 Random Clip Generator</h2>
      <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>Bored? Click below to watch a random hilarious moment from the stream!</p>
      <button 
        onClick={handleRandom}
        style={{
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 15px var(--accent-glow)'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Roll the Dice 🎲
      </button>
    </div>
  );
}
