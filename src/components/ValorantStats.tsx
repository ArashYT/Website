'use client';
import React, { useState, useEffect } from 'react';

interface MatchDetail {
  map: string;
  mode: string;
  agent: string;
  agentEmoji: string;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  won: boolean;
  teamScore: string;
  hsPercent: number;
  date: string;
}

interface ValStats {
  success: boolean;
  riotId: string;
  accountLevel: number;
  cardIcon: string | null;
  rankName: string;
  rankRating: number;
  elo: number;
  rankIcon: string | null;
  region: string;
  isActive: boolean;
  matches: MatchDetail[];
}

export default function ValorantStats() {
  const [stats, setStats] = useState<ValStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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
    riotId: 'TTV ArashLIVE#LWPxD',
    accountLevel: 751,
    cardIcon: null,
    rankName: 'Silver 2',
    rankRating: 0,
    elo: 700,
    rankIcon: null,
    region: 'NA East',
    isActive: false,
    matches: [] as MatchDetail[]
  };

  const percentage = currentStats.rankRating;

  return (
    <div 
      className="glass reveal" 
      style={{ 
        padding: '1.5rem', 
        borderRadius: '16px', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Card Header with Toggle Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🎮</span> Valorant Status
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--card-border)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          title={isExpanded ? "Show Less" : "Show More Stats"}
        >
          ▼
        </button>
      </div>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                ID: {currentStats.riotId} • {currentStats.region}
              </span>
              <span style={{ 
                background: 'rgba(255, 70, 85, 0.1)', 
                color: '#ff4655', 
                fontSize: '0.7rem', 
                padding: '1px 6px', 
                borderRadius: '10px', 
                fontWeight: 'bold' 
              }}>
                Lvl {currentStats.accountLevel}
              </span>
            </div>
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

        {/* Expanded Matches / Career Info */}
        {isExpanded && (
          <div style={{ 
            marginTop: '0.5rem', 
            borderTop: '1px solid var(--card-border)', 
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Match History
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>
                🕒 Live updates (recent games)
              </span>
            </div>

            {currentStats.matches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {currentStats.matches.map((match, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    {/* Top Row: Map & Outcome */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                        🗺️ {match.map} <span style={{ opacity: 0.5, fontWeight: 'normal', fontSize: '0.8rem' }}>({match.mode})</span>
                      </span>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold', 
                        color: match.won ? '#2ed573' : '#ff4655',
                        background: match.won ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 70, 85, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {match.won ? 'WIN' : 'LOSS'} {match.teamScore}
                      </span>
                    </div>

                    {/* Middle Row: Agent & KDA */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                      <span>Agent: <strong>{match.agentEmoji} {match.agent}</strong></span>
                      <span>KDA: <strong style={{ color: 'white' }}>{match.kills}/{match.deaths}/{match.assists}</strong></span>
                    </div>

                    {/* Bottom Row: Headshots & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.5 }}>
                      <span>🎯 {match.hsPercent}% Headshot Accuracy</span>
                      <span>{match.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', opacity: 0.5, textAlign: 'center', margin: '1rem 0' }}>No recent matches found. Play a game to cache stats!</p>
            )}

            <div style={{ 
              fontSize: '0.7rem', 
              opacity: 0.5, 
              background: 'rgba(255, 255, 255, 0.01)', 
              border: '1px solid var(--card-border)', 
              borderRadius: '8px', 
              padding: '8px',
              lineHeight: '1.4'
            }}>
              🔒 <em>Riot's API constraints prevent real-time in-game live scoreboard spectating. The card automatically fetches stats after every match concludes!</em>
            </div>
          </div>
        )}

        {/* Top Played Agents (Shown only when collapsed to save space) */}
        {!isExpanded && (
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
        )}
      </div>
    </div>
  );
}
