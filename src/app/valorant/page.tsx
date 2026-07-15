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
  cardIconWide: string | null;
  rankName: string;
  rankRating: number;
  elo: number;
  rankIcon: string | null;
  region: string;
  isActive: boolean;
  matches: MatchDetail[];
  skins: Record<string, string>;
}

export default function ValorantPage() {
  const [stats, setStats] = useState<ValStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [skinsImages, setSkinsImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/valorant')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
        if (data.skins) {
          fetchSkinsImages(data.skins);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const fetchSkinsImages = (skinsObj: Record<string, string>) => {
    fetch('https://valorant-api.com/v1/weapons/skins')
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.data) {
          const matched: Record<string, string> = {};
          Object.entries(skinsObj).forEach(([weaponKey, skinName]) => {
            const found = resData.data.find((skin: any) => 
              skin.displayName.toLowerCase().includes(skinName.toLowerCase())
            );
            if (found) {
              matched[weaponKey] = found.displayIcon;
            }
          });
          setSkinsImages(matched);
        }
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#fff' }}>
        <div style={{ opacity: 0.6 }}>Loading complete Valorant dossier...</div>
      </div>
    );
  }

  // Fallback defaults if API fails
  const currentStats: ValStats = stats || {
    success: false,
    riotId: 'TTV ArashLIVE#LWPxD',
    accountLevel: 751,
    cardIcon: null,
    cardIconWide: null,
    rankName: 'Silver 2',
    rankRating: 45,
    elo: 745,
    rankIcon: null,
    region: 'NA East',
    isActive: false,
    matches: [],
    skins: {
      vandal: "Kuronami Vandal",
      phantom: "Reaver Phantom",
      operator: "Elderflame Operator",
      melee: "Reaver Karambit",
      sheriff: "Neo Frontier Sheriff"
    }
  };

  // Performance calculations
  const totalMatches = currentStats.matches.length;
  const wins = currentStats.matches.filter(m => m.won).length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  
  const avgKills = totalMatches > 0 ? (currentStats.matches.reduce((acc, m) => acc + m.kills, 0) / totalMatches).toFixed(1) : '0.0';
  const avgDeaths = totalMatches > 0 ? (currentStats.matches.reduce((acc, m) => acc + m.deaths, 0) / totalMatches).toFixed(1) : '0.0';
  const avgAssists = totalMatches > 0 ? (currentStats.matches.reduce((acc, m) => acc + m.assists, 0) / totalMatches).toFixed(1) : '0.0';
  
  const totalKills = currentStats.matches.reduce((acc, m) => acc + m.kills, 0);
  const totalDeaths = currentStats.matches.reduce((acc, m) => acc + m.deaths, 0);
  const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : '0.00';
  
  const avgACS = totalMatches > 0 ? Math.round(currentStats.matches.reduce((acc, m) => acc + m.score, 0) / totalMatches) : 0;
  const avgHS = totalMatches > 0 ? Math.round(currentStats.matches.reduce((acc, m) => acc + m.hsPercent, 0) / totalMatches) : 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      
      {/* 1. Player Card Banner Header */}
      <div 
        className="glass reveal" 
        style={{ 
          borderRadius: '24px', 
          overflow: 'hidden', 
          border: '1px solid var(--card-border)',
          background: 'rgba(255, 255, 255, 0.02)',
          marginBottom: '2.5rem',
          position: 'relative'
        }}
      >
        {/* Banner Wallpaper */}
        <div style={{ 
          height: '180px', 
          background: currentStats.cardIconWide ? `url(${currentStats.cardIconWide}) center/cover no-repeat` : 'linear-gradient(135deg, #1f1f23, #ff465530)',
          borderBottom: '1px solid var(--card-border)',
          opacity: 0.8
        }} />

        {/* Profile Details Container */}
        <div style={{ 
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '-80px',
          position: 'relative',
          zIndex: 1,
          flexWrap: 'wrap'
        }}>
          {/* Avatar Card */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '16px',
            border: '3px solid var(--accent)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            background: '#111'
          }}>
            {currentStats.cardIcon ? (
              <img src={currentStats.cardIcon} alt="Riot Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🎯</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {currentStats.riotId.split('#')[0]}
                <span style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 'bold', marginLeft: '4px' }}>
                  #{currentStats.riotId.split('#')[1]}
                </span>
              </h1>
              <span style={{ 
                background: 'rgba(255, 70, 85, 0.1)', 
                border: '1px solid var(--accent)', 
                color: 'var(--accent)', 
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '3px 10px',
                borderRadius: '20px'
              }}>
                {currentStats.region.toUpperCase()} EAST
              </span>
            </div>
            
            <p style={{ opacity: 0.6, margin: '8px 0 0 0', display: 'flex', gap: '16px', fontSize: '0.95rem' }}>
              <span>Level <strong>{currentStats.accountLevel}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentStats.isActive ? '#2ed573' : '#a4b0be' }}></span>
                {currentStats.isActive ? 'Active Session' : 'Offline'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Grid Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Competitive Rank Card */}
        <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {currentStats.rankIcon ? (
              <img src={currentStats.rankIcon} alt={currentStats.rankName} style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '3rem' }}>🛡️</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Current Rank Rating
            </span>
            <h2 style={{ margin: '4px 0 8px 0', fontSize: '1.6rem', fontWeight: 800 }}>{currentStats.rankName}</h2>
            
            {/* RR Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: `${currentStats.rankRating}%`, height: '100%', background: 'var(--accent)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6 }}>
              <span>{currentStats.rankRating} / 100 RR</span>
              <span>ELO: {currentStats.elo}</span>
            </div>
          </div>
        </div>

        {/* Combat Metrics Stats Box */}
        <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>KD Ratio</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 900, color: parseFloat(kdRatio) >= 1 ? '#2ed573' : '#ff4655' }}>
              {kdRatio}
            </h3>
            <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>Avg KDA: {avgKills}/{avgDeaths}/{avgAssists}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>Headshot %</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)' }}>
              {avgHS}%
            </h3>
            <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>Average Accuracy</span>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>Avg ACS</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 900 }}>
              {avgACS}
            </h3>
            <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>Combat Score</span>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>Win Rate</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 900, color: winRate >= 50 ? '#2ed573' : '#ff4655' }}>
              {winRate}%
            </h3>
            <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>Matches: {totalMatches}</span>
          </div>
        </div>
      </div>

      {/* 3. Weapon Loadout Gallery */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>🔫</span> Active Weapon Skins Loadout
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3.5rem'
      }}>
        {Object.entries(currentStats.skins).map(([weapon, skinName]) => {
          const imgUrl = skinsImages[weapon];
          return (
            <div 
              key={weapon} 
              className="glass card-hover-effect" 
              style={{ 
                borderRadius: '16px', 
                padding: '1.25rem', 
                border: '1px solid var(--card-border)',
                background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                {weapon}
              </span>
              
              {/* Skin Icon Frame */}
              <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '10px' }}>
                {imgUrl ? (
                  <img 
                    src={imgUrl} 
                    alt={skinName} 
                    style={{ 
                      maxHeight: '80px', 
                      maxWidth: '100%', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))'
                    }} 
                  />
                ) : (
                  <div style={{ opacity: 0.3, fontSize: '0.85rem' }}>Loading image...</div>
                )}
              </div>

              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>
                {skinName}
              </h4>
            </div>
          );
        })}
      </div>

      {/* 4. Match History Log */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>🎮</span> Recent Match Performance
      </h2>

      {totalMatches === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
          <p style={{ opacity: 0.5, margin: 0 }}>No recent match logs available. Launch Valorant to sync logs!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {currentStats.matches.map((m, idx) => {
            const mapClass = m.map ? m.map.toLowerCase().replace(/[^a-z0-9]/g, '') : 'default';
            return (
              <div 
                key={idx}
                className="glass card-hover-effect"
                style={{
                  borderRadius: '16px',
                  border: `1px solid ${m.won ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 70, 85, 0.2)'}`,
                  background: 'rgba(255, 255, 255, 0.01)',
                  padding: '1.25rem 2rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                {/* Map & Agent */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '2.5rem', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    {m.agentEmoji}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{m.map}</h3>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{m.mode} • Played {m.agent}</span>
                  </div>
                </div>

                {/* Match Outcome Score */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ 
                    background: m.won ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 70, 85, 0.1)', 
                    color: m.won ? '#2ed573' : '#ff4655', 
                    fontWeight: 'bold', 
                    fontSize: '0.85rem',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    border: m.won ? '1px solid rgba(46, 213, 115, 0.3)' : '1px solid rgba(255, 70, 85, 0.3)'
                  }}>
                    {m.won ? 'VICTORY' : 'DEFEAT'}
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '8px', fontFamily: 'monospace' }}>
                    {m.teamScore}
                  </div>
                </div>

                {/* Score stats */}
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px', textAlign: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block', textTransform: 'uppercase' }}>KDA Ratio</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {m.kills} <span style={{ opacity: 0.3 }}>/</span> {m.deaths} <span style={{ opacity: 0.3 }}>/</span> {m.assists}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block', textTransform: 'uppercase' }}>Accuracy</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent)', fontFamily: 'monospace' }}>{m.hsPercent}% HS</span>
                  </div>
                </div>

                {/* ACS score and Date */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block' }}>Combat Score</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'monospace', color: '#fff' }}>{m.score} ACS</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.4, display: 'block', marginTop: '4px' }}>{m.date}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
