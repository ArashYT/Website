'use client';
import React, { useState, useEffect } from 'react';
import MinecraftStatus from "@/components/MinecraftStatus";
import Skin3DViewer from "@/components/Skin3DViewer";
import { audioEffects } from '@/utils/AudioEffects';

const MINECRAFT_ACCOUNTS = ['Arash_YT', 'TTVArashLIVE', 'Arash132', 'MrWaiterMan'];

interface MojangProfile {
  uuid: string;
  username: string;
  skinUrl: string;
  nameHistory: Array<{ username: string }>;
}

interface ServerTradeItem {
  id: string;
  seller: string;
  item: string;
  price: string;
  stock: number;
}

export default function MinecraftPage() {
  const [profiles, setProfiles] = useState<Record<string, MojangProfile>>({});
  const [loading, setLoading] = useState(true);
  const [serverIp, setServerIp] = useState('mc.arashyt.ca');
  
  // 3D Customizer Paint State (Grid representing a Minecraft face 8x8)
  const [pixelGrid, setPixelGrid] = useState<string[]>(Array(64).fill('#4a3c31')); // Default brown Steve hair base
  const [activeColor, setActiveColor] = useState('#ff4655'); // Default active red brush
  const palette = ['#ff4655', '#a372ff', '#1ed760', '#ffc107', '#00bcd4', '#ffffff', '#111111'];

  // Server Shop Trades Catalog
  const [trades, setTrades] = useState<ServerTradeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 1. Fetch Mojang profile histories and skins
    const fetchPromises = MINECRAFT_ACCOUNTS.map(username => 
      fetch(`https://api.ashcon.app/mojang/v2/user/${username}`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          const nameHistory = data.username_history ? data.username_history.map((h: any) => ({ username: h.username })) : [];
          return {
            username,
            profile: {
              uuid: data.uuid,
              username: data.username,
              skinUrl: data.textures?.skin?.url || '',
              nameHistory
            }
          };
        })
        .catch(() => {
          // Fallback static profile if ashcon API rate limits
          return {
            username,
            profile: {
              uuid: username === 'Arash_YT' ? 'd08e826b-67a6-4bc2-b883-9bcda2e9bc2a' : '417a86c8-a681-4202-8610-d02319208034',
              username,
              skinUrl: '',
              nameHistory: [{ username }]
            }
          };
        })
    );

    Promise.all(fetchPromises).then(results => {
      const parsed: Record<string, MojangProfile> = {};
      results.forEach(r => {
        parsed[r.username] = r.profile;
      });
      setProfiles(parsed);
      setLoading(false);
    });

    // 2. Fetch Server economy configurations from settings API
    fetch('/api/settings')
      .then(res => res.json())
      .then(config => {
        if (config.settings) {
          if (config.settings.minecraft?.serverIp) {
            setServerIp(config.settings.minecraft.serverIp);
          }
          if (config.settings.minecraftShopTrades) {
            setTrades(config.settings.minecraftShopTrades);
          } else {
            // Default simulated trade listings
            setTrades([
              { id: '1', seller: 'Arash_YT', item: '⚔️ Enchanted Netherite Sword', price: '32 Diamonds', stock: 2 },
              { id: '2', seller: 'TTVArashLIVE', item: '🪽 Elytra Wings', price: '16 Diamonds', stock: 5 },
              { id: '3', seller: 'MrWaiterMan', item: '🍎 Enchanted Golden Apple', price: '8 Diamonds', stock: 12 },
              { id: '4', seller: 'Arash132', item: '📦 Shulker Box (Black)', price: '4 Diamonds', stock: 15 }
            ]);
          }
        }
      })
      .catch(() => {
        setTrades([
          { id: '1', seller: 'Arash_YT', item: '⚔️ Enchanted Netherite Sword', price: '32 Diamonds', stock: 2 },
          { id: '2', seller: 'TTVArashLIVE', item: '🪽 Elytra Wings', price: '16 Diamonds', stock: 5 },
          { id: '3', seller: 'MrWaiterMan', item: '🍎 Enchanted Golden Apple', price: '8 Diamonds', stock: 12 }
        ]);
        setLoading(false);
      });
  }, []);

  const handlePixelClick = (index: number) => {
    audioEffects.playClickPop();
    const newGrid = [...pixelGrid];
    newGrid[index] = activeColor;
    setPixelGrid(newGrid);
  };

  const downloadCustomSkinTexture = () => {
    audioEffects.playClickPop();
    // Generate a simple 64x64 texture mapping canvas representing custom block
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw basic skin layout
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 64, 64);

    // Map painted face grid on Steve face coordinate sector (x: 8 to 16, y: 8 to 16)
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const color = pixelGrid[y * 8 + x];
        ctx.fillStyle = color;
        ctx.fillRect(8 + x, 8 + y, 1, 1);
      }
    }

    // Trigger texture download
    const link = document.createElement('a');
    link.download = 'custom_minecraft_skin.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleHover = () => {
    audioEffects.playHoverTick();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#fff' }}>
        <div style={{ opacity: 0.6 }}>Loading Mojang profiles database...</div>
      </div>
    );
  }

  const filteredTrades = trades.filter(t => 
    t.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Page Header banner card */}
      <div className="glass reveal" style={{ borderRadius: '24px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.01), rgba(30,215,96,0.02))' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0 }}>Minecraft Central</h1>
          <p style={{ opacity: 0.6, margin: '6px 0 0 0' }}>Explore skin dossiers, server shop trades, and paint custom items.</p>
        </div>
        <MinecraftStatus serverIp={serverIp} />
      </div>

      {/* Profiles Cards Grid */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>👥</span> Creator Accounts dossiers
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {MINECRAFT_ACCOUNTS.map(username => {
          const profile = profiles[username];
          if (!profile) return null;

          return (
            <div 
              key={username} 
              className="glass card-hover-effect" 
              style={{ 
                borderRadius: '20px', 
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Interactive 3D Skin Viewer */}
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

              {/* Profile Details details */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#fff' }}>
                  {profile.username}
                </h3>
                <code style={{ fontSize: '0.75rem', opacity: 0.4, wordBreak: 'break-all', display: 'block', marginBottom: '12px' }}>
                  UUID: {profile.uuid}
                </code>

                {/* Name History Timeline */}
                <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Name History</span>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '6px', 
                  marginBottom: '1.5rem',
                  fontSize: '0.75rem' 
                }}>
                  {profile.nameHistory.length === 0 ? (
                    <span style={{ opacity: 0.4 }}>No history cached</span>
                  ) : (
                    profile.nameHistory.map((h, i) => (
                      <span 
                        key={i} 
                        style={{ 
                          background: 'rgba(255,255,255,0.04)', 
                          padding: '3px 8px', 
                          borderRadius: '12px',
                          border: '1px solid var(--card-border)'
                        }}
                      >
                        {h.username}
                      </span>
                    ))
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a 
                    href={`https://crafatar.com/skins/${profile.uuid}`}
                    download={`${username}_skin.png`}
                    onMouseEnter={handleHover}
                    onClick={() => audioEffects.playClickPop()}
                    className="button"
                    style={{ 
                      flex: 1, 
                      textAlign: 'center', 
                      background: 'rgba(255,255,255,0.05)', 
                      color: '#fff', 
                      border: '1px solid var(--card-border)',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      padding: '8px 10px',
                      borderRadius: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    💾 Skin File
                  </a>
                  <a 
                    href={`https://namemc.com/profile/${profile.uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={handleHover}
                    onClick={() => audioEffects.playClickPop()}
                    className="button"
                    style={{ 
                      flex: 1, 
                      textAlign: 'center', 
                      background: 'var(--accent)', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      padding: '8px 10px',
                      borderRadius: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    NameMC
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Customizer Canvas on Left, Server Shop on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
        
        {/* Interactive 3D Skin Customizer Painter */}
        <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            🎨 3D Skin Canvas Customizer
          </h3>
          <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Click cells on the grid to paint a custom Minecraft character head, then export it as a game-ready texture!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            {/* Color Palette Selector */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {palette.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    audioEffects.playClickPop();
                    setActiveColor(color);
                  }}
                  onMouseEnter={handleHover}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: color,
                    border: activeColor === color ? '3px solid #fff' : '2px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    boxShadow: activeColor === color ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Paint Brush Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 30px)',
              gridTemplateRows: 'repeat(8, 30px)',
              gap: '2px',
              background: 'rgba(0,0,0,0.3)',
              padding: '8px',
              borderRadius: '12px',
              border: '1px solid var(--card-border)'
            }}>
              {pixelGrid.map((color, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePixelClick(idx)}
                  style={{
                    background: color,
                    borderRadius: '3px',
                    cursor: 'crosshair',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background-color 0.1s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={downloadCustomSkinTexture}
              onMouseEnter={handleHover}
              style={{
                width: '100%',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                padding: '10px',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 0 15px var(--accent-glow)'
              }}
            >
              💾 Download Custom Skin PNG
            </button>
          </div>
        </div>

        {/* Server Shop & Economy Catalog */}
        <div className="glass reveal" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            🛒 Server Shop Trade Catalog
          </h3>
          <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Browse active listing offers and trade rates between players on `mc.arashyt.ca`.
          </p>

          <input 
            type="text" 
            placeholder="Search items or sellers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.2)',
              color: '#fff',
              outline: 'none',
              marginBottom: '1.25rem'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredTrades.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.5, fontSize: '0.9rem' }}>
                No active trade listings found.
              </div>
            ) : (
              filteredTrades.map(trade => (
                <div 
                  key={trade.id} 
                  style={{ 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--card-border)', 
                    padding: '12px 16px', 
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#fff', display: 'block' }}>{trade.item}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Sold by: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{trade.seller}</span> • Stock: {trade.stock}</span>
                  </div>
                  <span style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid #1ed760', color: '#1ed760', fontSize: '0.8rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '15px' }}>
                    {trade.price}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
