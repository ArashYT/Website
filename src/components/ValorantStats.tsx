'use client';
import React, { useState, useEffect } from 'react';

interface ValStats {
  success: boolean;
  riotId: string;
  rankName: string;
  rankRating: number;
  elo: number;
  rankIcon: string | null;
  region: string;
  isActive: boolean;
  topAgents: Array<{ name: string; emoji: string; winRate: string }>;
}

export default function ValorantStats() {
  const [stats, setStats] = useState<ValStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/valorant')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', minHeight: '230px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ opacity: 0.6 }}>Loading Valorant Stats...</p>
      </div>
    );
  }

  const currentStats = stats || {
    success: false,
    riotId: 'Arash#NA1',
    rankName: 'Immortal II',
    rankRating: 82,
    elo: 2082,
    rankIcon: null,
    region: 'NA East',
    isActive: false,
    topAgents: [
      { name: "Jett", emoji: "🌪️", winRate: "58%" },
      { name: "Reyna", emoji: "🔮", winRate: "54%" }
    ]
  };

  const percentage = currentStats.rankRating;

  return (
    <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
        <span>🎮</span> Valorant Status
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
        {/* Rank & Rating Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentStats.rankIcon ? (
            <img 
              src={currentStats.rankIcon} 
              alt={currentStats.rankName} 
              width="44" 
              height="44" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(255, 70, 85, 0.6))', objectFit: 'contain' }}
            />
          ) : (
            /* Custom SVG Rank Icon (Immortal-like Red Triangle Badge) */
            <svg width="44" height="44" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 70, 85, 0.6))' }}>
              <polygon points="50,10 90,85 10,85" fill="#ff4655" />
              <polygon points="50,22 80,80 20,80" fill="#111" />
              <polygon points="50,35 70,75 30,75" fill="#ff4655" />
              <circle cx="50" cy="58" r="8" fill="white" />
            </svg>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>{currentStats.rankName}</span>
              <span style={{ fontSize: '0.85rem', color: currentStats.isActive ? '#2ed573' : '#ff4655', fontWeight: 'bold' }}>
                {currentStats.isActive ? 'Active' : 'Offline'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>
              ID: {currentStats.riotId} • {currentStats.region}
            </p>
          </div>
        </div>

        {/* Rank Rating Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <span style={{ opacity: 0.5 }}>Rank Rating</span>
            <span style={{ color: 'var(--accent)' }}>{percentage} / 100 RR</span>
          </div>
          <div style={{ 
            height: '8px', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--card-border)', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${percentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--accent) 0%, #ff4655 100%)',
              boxShadow: '0 0 10px rgba(255, 70, 85, 0.5)',
              borderRadius: '4px',
              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
            }}></div>
          </div>
        </div>

        {/* Top Played Agents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '0.25rem' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Top Agents
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStats.topAgents.map((agent, i) => (
              <div key={i} style={{ 
                flex: 1, 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--card-border)', 
                borderRadius: '8px', 
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{agent.emoji} {agent.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#2ed573', fontWeight: 'bold' }}>{agent.winRate} WR</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
