'use client';
import React, { useState, useEffect } from 'react';
import MinecraftStatus from "@/components/MinecraftStatus";
import Skin3DViewer from "@/components/Skin3DViewer";

const MINECRAFT_ACCOUNTS = ['Arash_YT', 'TTVArashLIVE', 'Arash132', 'MrWaiterMan'];

interface MojangProfile {
  uuid: string;
  username: string;
  skinUrl: string;
  nameHistory: Array<{ username: string }>;
}

export default function MinecraftPage() {
  const [profiles, setProfiles] = useState<Record<string, MojangProfile>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({
    Arash_YT: true,
    TTVArashLIVE: true,
    Arash132: true,
    MrWaiterMan: true
  });

  useEffect(() => {
    MINECRAFT_ACCOUNTS.forEach(username => {
      fetch(`https://api.ashcon.app/mojang/v2/user/${username}`)
        .then(res => {
          if (!res.ok) throw new Error('Player not found');
          return res.json();
        })
        .then(data => {
          setProfiles(prev => ({
            ...prev,
            [username]: {
              uuid: data.uuid,
              username: data.username,
              skinUrl: data.textures?.skin?.url || '',
              nameHistory: data.username_history || [{ username: data.username }]
            }
          }));
          setLoading(prev => ({ ...prev, [username]: false }));
        })
        .catch(() => {
          // Fallback if API limits or fails
          setLoading(prev => ({ ...prev, [username]: false }));
        });
    });
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      {/* Page Header */}
      <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 900, 
          margin: 0,
          background: 'linear-gradient(90deg, #fff, var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Minecraft Central
        </h1>
        <p style={{ opacity: 0.6, marginTop: '8px', marginBottom: 0, fontSize: '1rem' }}>
          Live server status & streaming account skins database
        </p>
      </div>

      {/* Top Section: Server Status */}
      <div style={{ marginBottom: '2.5rem' }}>
        <MinecraftStatus serverIp="mc.arashyt.ca" />
      </div>

      {/* Title Divider */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>👤</span> Creator Accounts ({MINECRAFT_ACCOUNTS.length})
      </h2>

      {/* Grid of Accounts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {MINECRAFT_ACCOUNTS.map(username => {
          const isLoading = loading[username];
          const profile = profiles[username];

          if (isLoading) {
            return (
              <div 
                key={username}
                className="glass loading-shimmer" 
                style={{ 
                  borderRadius: '16px', 
                  minHeight: '380px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ opacity: 0.5 }}>Loading {username}...</div>
              </div>
            );
          }

          if (!profile) {
            return (
              <div 
                key={username}
                className="glass" 
                style={{ 
                  borderRadius: '16px', 
                  padding: '2rem', 
                  textAlign: 'center',
                  border: '1px solid rgba(255,70,85,0.2)'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--accent)' }}>{username}</h3>
                <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Offline or Profile Unresolved</p>
              </div>
            );
          }

          return (
            <div 
              key={username}
              className="glass card-hover-effect"
              style={{
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* 3D Skin Render Box */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: '1px solid var(--card-border)',
                minHeight: '290px',
                position: 'relative'
              }}>
                <Skin3DViewer skinUrl={`https://crafatar.com/skins/${profile.uuid}`} />
              </div>

              {/* Profile details */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#fff' }}>
                  {profile.username}
                </h3>
                <span 
                  style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.75rem', 
                    opacity: 0.4, 
                    wordBreak: 'break-all',
                    marginBottom: '1rem',
                    display: 'block'
                  }}
                >
                  UUID: {profile.uuid}
                </span>

                {/* Name History Section */}
                <div style={{ flex: 1, marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    📋 Name History
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {profile.nameHistory.map((item, index) => (
                      <span 
                        key={index} 
                        style={{ 
                          fontSize: '0.75rem', 
                          background: 'rgba(255,255,255,0.05)', 
                          padding: '3px 8px', 
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.03)'
                        }}
                      >
                        {item.username}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Account Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.skinUrl && (
                    <a 
                      href={profile.skinUrl}
                      download={`${username}-skin.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="watch-btn"
                      style={{
                        padding: '0.6rem',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: '#000',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        background: 'var(--accent)',
                        display: 'block'
                      }}
                    >
                      💾 Download Skin PNG
                    </a>
                  )}
                  <a 
                    href={`https://namemc.com/profile/${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.6rem',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      textDecoration: 'none',
                      color: '#fff',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--card-border)',
                      display: 'block'
                    }}
                  >
                    🌐 View on NameMC
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
