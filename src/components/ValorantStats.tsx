'use client';
import React from 'react';

export default function ValorantStats() {
  return (
    <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
        <span>🎮</span> Valorant Status
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
        {/* Rank & Rating Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Custom SVG Rank Icon (Immortal-like Red Triangle Badge) */}
          <svg width="44" height="44" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 70, 85, 0.6))' }}>
            <polygon points="50,10 90,85 10,85" fill="#ff4655" />
            <polygon points="50,22 80,80 20,80" fill="#111" />
            <polygon points="50,35 70,75 30,75" fill="#ff4655" />
            <circle cx="50" cy="58" r="8" fill="white" />
          </svg>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>Immortal II</span>
              <span style={{ fontSize: '0.85rem', color: '#ff4655', fontWeight: 'bold' }}>Active</span>
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>Region: NA East</p>
          </div>
        </div>

        {/* Rank Rating Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <span style={{ opacity: 0.5 }}>Rank Rating</span>
            <span style={{ color: 'var(--accent)' }}>82 / 100 RR</span>
          </div>
          <div style={{ 
            height: '8px', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--card-border)', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '82%', 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--accent) 0%, #ff4655 100%)',
              boxShadow: '0 0 10px rgba(255, 70, 85, 0.5)',
              borderRadius: '4px'
            }}></div>
          </div>
        </div>

        {/* Top Played Agents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '0.25rem' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Top Agents
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Agent Jett */}
            <div style={{ 
              flex: 1, 
              background: 'rgba(255,255,255,0.01)', 
              border: '1px solid var(--card-border)', 
              borderRadius: '8px', 
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>🌪️ Jett</span>
              <span style={{ fontSize: '0.8rem', color: '#2ed573', fontWeight: 'bold' }}>58% WR</span>
            </div>
            {/* Agent Reyna */}
            <div style={{ 
              flex: 1, 
              background: 'rgba(255,255,255,0.01)', 
              border: '1px solid var(--card-border)', 
              borderRadius: '8px', 
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>🔮 Reyna</span>
              <span style={{ fontSize: '0.8rem', color: '#2ed573', fontWeight: 'bold' }}>54% WR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
