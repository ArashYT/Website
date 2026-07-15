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

interface MmrHistoryItem {
  matchId: string;
  map: string;
  rankName: string;
  rrChange: number;
  rrAfter: number;
  date: string;
  elo: number;
}

interface HighestRank {
  tier: number;
  patched_tier: string;
  season: string;
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
  highestRank?: HighestRank | null;
  mmrHistory?: MmrHistoryItem[];
}

export default function ValorantPage() {
  const [stats, setStats] = useState<ValStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [skinsImages, setSkinsImages] = useState<Record<string, string>>({});
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);

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
    },
    highestRank: { tier: 15, patched_tier: 'Platinum 1', season: 'e9a3' },
    mmrHistory: []
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

  // Dynamic role playrate calculations
  const roleDistribution = { Duelist: 0, Initiator: 0, Sentinel: 0, Controller: 0 };
  const duelistAgents = ['Jett', 'Reyna', 'Raze', 'Phoenix', 'Neon', 'Yoru', 'Iso'];
  const initiatorAgents = ['Sova', 'Fade', 'Breach', 'Skye', 'Gekko', 'KAY/O'];
  const controllerAgents = ['Omen', 'Brimstone', 'Viper', 'Astra', 'Harbor', 'Clove'];
  const sentinelAgents = ['Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock', 'Vyse'];

  currentStats.matches.forEach(m => {
    if (duelistAgents.includes(m.agent)) roleDistribution.Duelist++;
    else if (initiatorAgents.includes(m.agent)) roleDistribution.Initiator++;
    else if (controllerAgents.includes(m.agent)) roleDistribution.Controller++;
    else if (sentinelAgents.includes(m.agent)) roleDistribution.Sentinel++;
  });

  const displayRegion = currentStats.region.toLowerCase().includes('east') ? 'NA EAST' : currentStats.region.toUpperCase();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      
      {/* 1. Player Card Banner Header */}
      <div 
        className="glass reveal" 
        style={{ 
          borderRadius: '24px', 
          overflow: 'hidden', 
          border: '1px solid var(--card-border)',
          background: currentStats.cardIconWide ? `url(${currentStats.cardIconWide}) center/cover no-repeat` : 'linear-gradient(135deg, #1f1f23, #ff465530)',
          marginBottom: '2.5rem',
          position: 'relative',
          minHeight: '260px',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(10, 10, 12, 0.95) 30%, rgba(10, 10, 12, 0.3) 100%)',
          zIndex: 0
        }} />

        <div style={{ 
          padding: '2.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1,
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <div style={{
            width: '110px',
            height: '110px',
            borderRadius: '16px',
            border: '3px solid var(--accent)',
            boxShadow: '0 0 20px var(--accent-glow), 0 8px 30px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            background: '#111',
            flexShrink: 0
          }}>
            {currentStats.cardIcon ? (
              <img src={currentStats.cardIcon} alt="Riot Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🎯</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.9)', letterSpacing: '-0.5px' }}>
                {currentStats.riotId.split('#')[0]}
                <span style={{ color: 'var(--accent)', fontSize: '1.4rem', fontWeight: 'bold', marginLeft: '4px' }}>
                  #{currentStats.riotId.split('#')[1]}
                </span>
              </h1>
              <span style={{ 
                background: 'rgba(255, 70, 85, 0.15)', 
                border: '1px solid var(--accent)', 
                color: 'var(--accent)', 
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '3px 12px',
                borderRadius: '20px',
                letterSpacing: '0.5px'
              }}>
                {displayRegion}
              </span>
            </div>
            
            <p style={{ opacity: 0.8, margin: '8px 0 0 0', display: 'flex', gap: '16px', fontSize: '0.95rem', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              <span>Level <strong>{currentStats.accountLevel}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentStats.isActive ? '#2ed573' : '#a4b0be', display: 'inline-block' }}></span>
                {currentStats.isActive ? 'Active Session' : 'Offline'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {currentStats.rankIcon ? (
              <img src={currentStats.rankIcon} alt={currentStats.rankName} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '2.5rem' }}>🛡️</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Current Standing
            </span>
            <h2 style={{ margin: '2px 0 8px 0', fontSize: '1.6rem', fontWeight: 800 }}>{currentStats.rankName}</h2>
            
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: `${currentStats.rankRating}%`, height: '100%', background: 'var(--accent)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6 }}>
              <span>{currentStats.rankRating} / 100 RR</span>
              <span>ELO: {currentStats.elo}</span>
            </div>
          </div>
        </div>

        {currentStats.highestRank && (
          <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(255,70,85,0.05)', borderRadius: '16px', border: '1px solid rgba(255,70,85,0.1)' }}>
              <span style={{ fontSize: '2.5rem' }}>🏆</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                All-Time Peak Rank
              </span>
              <h2 style={{ margin: '2px 0 4px 0', fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>
                {currentStats.highestRank.patched_tier}
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.5 }}>
                Achieved in Season: <strong>{currentStats.highestRank.season.toUpperCase()}</strong>
              </p>
            </div>
          </div>
        )}

        <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', background: 'rgba(255,255,255,0.01)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>KD Ratio</span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.6rem', fontWeight: 900, color: parseFloat(kdRatio) >= 1 ? '#2ed573' : '#ff4655' }}>
              {kdRatio}
            </h3>
            <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>Avg: {avgKills}/{avgDeaths}/{avgAssists}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>Headshot %</span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent)' }}>
              {avgHS}%
            </h3>
            <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>Accuracy rate</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>Avg ACS</span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.6rem', fontWeight: 900 }}>
              {avgACS}
            </h3>
            <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>Combat score</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>Win Rate</span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.6rem', fontWeight: 900, color: winRate >= 50 ? '#2ed573' : '#ff4655' }}>
              {winRate}%
            </h3>
            <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>Matches: {totalMatches}</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Playstyle Roles & MMR Progression */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        
        <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
            🎭 Tactical Playstyle Roles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(roleDistribution).map(([role, count]) => {
              const percentage = totalMatches > 0 ? Math.round((count / totalMatches) * 100) : 0;
              return (
                <div key={role}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                    <span>{role}</span>
                    <span style={{ opacity: 0.6 }}>{percentage}% ({count} games)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        background: role === 'Duelist' ? '#ff4655' : role === 'Initiator' ? '#3babff' : role === 'Sentinel' ? '#ffe15f' : '#2ed573',
                        borderRadius: '3px' 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
            📉 Recent Rating (RR) Timeline
          </h3>
          {currentStats.mmrHistory && currentStats.mmrHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
              {currentStats.mmrHistory.slice(0, 5).map((history, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'rgba(0,0,0,0.15)', 
                    padding: '8px 12px', 
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block' }}>{history.map}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{history.date.split('2026')[0] || history.date}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span 
                      style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold', 
                        color: history.rrChange >= 0 ? '#2ed573' : '#ff4655' 
                      }}
                    >
                      {history.rrChange >= 0 ? `+${history.rrChange}` : history.rrChange} RR
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.4, display: 'block' }}>{history.rrAfter} RR</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5, fontSize: '0.85rem' }}>
              No rating logs available.
            </div>
          )}
        </div>
      </div>

      {/* 4. Weapon Loadout Showcase */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>🔫</span> Active Weapon Skins Arsenal
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3.5rem'
      }}>
        {Object.entries(currentStats.skins).map(([weapon, skinName]) => {
          const imgUrl = skinsImages[weapon];
          const isSelected = selectedWeapon === weapon;
          return (
            <div 
              key={weapon} 
              onClick={() => setSelectedWeapon(isSelected ? null : weapon)}
              className={`glass card-hover-effect ${isSelected ? 'glow-active' : ''}`} 
              style={{ 
                borderRadius: '16px', 
                padding: '1.5rem', 
                border: isSelected ? '1px solid var(--accent)' : '1px solid var(--card-border)',
                background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <span style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                {weapon}
              </span>
              
              <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '10px' }}>
                {imgUrl ? (
                  <img 
                    src={imgUrl} 
                    alt={skinName} 
                    style={{ 
                      maxHeight: '90px', 
                      maxWidth: '100%', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
                      transform: isSelected ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
                      transition: 'transform 0.3s'
                    }} 
                  />
                ) : (
                  <div style={{ opacity: 0.3, fontSize: '0.85rem' }}>Loading image...</div>
                )}
              </div>

              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: isSelected ? 'var(--accent)' : '#fff' }}>
                {skinName}
              </h4>
            </div>
          );
        })}
      </div>

      {/* 5. Match History (Collapsible Detail Panels & HitMannequin SVG Analyzer) */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>🎮</span> Recent Match Performance (Click to Expand)
      </h2>

      {totalMatches === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
          <p style={{ opacity: 0.5, margin: 0 }}>No recent match logs available. Launch Valorant to sync logs!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {currentStats.matches.map((m, idx) => {
            const isExpanded = expandedMatch === idx;
            
            // Calculate hit distribution mathematically from hsPercent
            const headPercent = m.hsPercent;
            const bodyPercent = Math.min(100 - headPercent, Math.round((100 - headPercent) * 0.8));
            const legPercent = Math.max(0, 100 - headPercent - bodyPercent);

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div 
                  onClick={() => setExpandedMatch(isExpanded ? null : idx)}
                  className={`glass card-hover-effect ${isExpanded ? 'glow-active' : ''}`}
                  style={{
                    borderRadius: '16px',
                    border: `1px solid ${m.won ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 70, 85, 0.2)'}`,
                    background: 'rgba(255, 255, 255, 0.01)',
                    padding: '1.5rem 2rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1.5rem',
                    alignItems: 'center',
                    cursor: 'pointer'
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

                  {/* Score */}
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

                  {/* KDA & HS */}
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

                  {/* Date & Expand Label */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block' }}>Combat Score</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'monospace', color: '#fff' }}>{m.score} ACS</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.4, display: 'block', marginTop: '4px' }}>
                      {isExpanded ? '▲ Hide Analysis' : '▼ Expand Hitbox Analysis'}
                    </span>
                  </div>
                </div>

                {/* Collapsible Hitmannequin svg breakdown drawer */}
                {isExpanded && (
                  <div 
                    className="glass reveal" 
                    style={{ 
                      padding: '2rem', 
                      borderRadius: '16px', 
                      border: '1px solid var(--card-border)',
                      background: 'rgba(255, 255, 255, 0.01)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '3rem',
                      flexWrap: 'wrap',
                      marginTop: '-4px'
                    }}
                  >
                    {/* 3D-feeling Hitbox Target Mannequin Silhouette */}
                    <div style={{ width: '120px', height: '180px', display: 'flex', justifyContent: 'center' }}>
                      <svg width="100" height="160" viewBox="0 0 100 120" style={{ filter: 'drop-shadow(0 0 10px rgba(255,70,85,0.15))' }}>
                        {/* Target Head circle */}
                        <circle 
                          cx="50" 
                          cy="20" 
                          r="12" 
                          fill={headPercent >= 20 ? 'var(--accent)' : 'rgba(255,255,255,0.05)'} 
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth="1.5"
                          style={{ transition: 'all 0.5s', cursor: 'pointer' }}
                        />
                        {/* Target Chest Body shield */}
                        <path 
                          d="M 36 36 L 64 36 L 60 76 L 40 76 Z" 
                          fill={bodyPercent > 40 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)'} 
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth="1.5"
                          style={{ transition: 'all 0.5s', cursor: 'pointer' }}
                        />
                        {/* Target Legs pillars */}
                        <path 
                          d="M 40 78 L 47 78 L 45 116 L 38 116 Z M 53 78 L 60 78 L 62 116 L 55 116 Z" 
                          fill="rgba(255,255,255,0.05)" 
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth="1.5"
                          style={{ transition: 'all 0.5s', cursor: 'pointer' }}
                        />
                      </svg>
                    </div>

                    {/* Breakdown Stats Panel */}
                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>
                        🧬 Hit Distribution Analysis
                      </h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {/* Head */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                            <span>🎯 Headshots (Critical)</span>
                            <span>{headPercent}%</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${headPercent}%`, height: '100%', background: 'var(--accent)', borderRadius: '4px' }} />
                          </div>
                        </div>

                        {/* Chest */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                            <span>🛡️ Bodyshots (Standard)</span>
                            <span>{bodyPercent}%</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${bodyPercent}%`, height: '100%', background: 'rgba(255,255,255,0.4)', borderRadius: '4px' }} />
                          </div>
                        </div>

                        {/* Legs */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                            <span>🦵 Legshots (Reduced)</span>
                            <span>{legPercent}%</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${legPercent}%`, height: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: '4px' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
