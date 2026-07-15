'use client';
import React, { useState, useEffect } from 'react';

interface ChannelPointItem {
  name: string;
  cost: number;
  count: number;
}

interface SiteConfig {
  theme: {
    defaultTheme: string;
    accentColor: string;
  };
  twitch: {
    channel: string;
    showChat: boolean;
  };
  twitter: {
    username: string;
    enabled: boolean;
  };
  valorant: {
    riotId: string;
    apiKey: string;
    enabled: boolean;
    skins?: {
      vandal: string;
      phantom: string;
      operator: string;
      melee: string;
      sheriff: string;
    };
  };
  minecraft: {
    serverIp: string;
    enabled: boolean;
  };
  adsense: {
    enabled: boolean;
    publisherId: string;
    adSlotId: string;
  };
  randomClip: {
    enabled: boolean;
  };
  contactForm: {
    enabled: boolean;
  };
  schedule: {
    enabled: boolean;
    days: Array<{ day: string; time: string; game: string }>;
  };
  soundboard: {
    enabled: boolean;
  };
  socials: {
    youtube: string;
    twitch: string;
    discord: string;
    tiktok: string;
    instagram: string;
    x: string;
  };
  discordWidgetId?: string;
  spotify?: {
    enabled: boolean;
    songName: string;
    artist: string;
  };
  milestones?: {
    enabled: boolean;
    title: string;
    current: number;
    goal: number;
  };
  channelPoints?: {
    enabled: boolean;
    items: ChannelPointItem[];
  };
}

export default function WebsiteManager() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'widgets' | 'integrations' | 'branding' | 'socials' | 'security' | 'monetization'>('widgets');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load configuration from API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // Initialize default skins if missing
          if (data.valorant && !data.valorant.skins) {
            data.valorant.skins = {
              vandal: "Kuronami Vandal",
              phantom: "Reaver Phantom",
              operator: "Elderflame Operator",
              melee: "Reaver Karambit",
              sheriff: "Neo Frontier Sheriff"
            };
          }
          // Initialize default adsense if missing
          if (!data.adsense) {
            data.adsense = {
              enabled: false,
              publisherId: '',
              adSlotId: ''
            };
          }
          if (!data.discordWidgetId) {
            data.discordWidgetId = '1083431693836173423';
          }
          if (!data.spotify) {
            data.spotify = {
              enabled: true,
              songName: 'K/DA - POP/STARS',
              artist: 'Madison Beer, (G)I-DLE, Jaira Burns'
            };
          }
          if (!data.milestones) {
            data.milestones = {
              enabled: true,
              title: 'Charity Sub Goal',
              current: 68,
              goal: 100
            };
          }
          if (!data.channelPoints) {
            data.channelPoints = {
              enabled: true,
              items: [
                { name: '💦 Hydrate', cost: 250, count: 184 },
                { name: '🎙️ Voice Changer', cost: 1000, count: 57 },
                { name: '🥊 1v1 Me in Custom', cost: 5000, count: 12 }
              ]
            };
          }
          setConfig(data);
        }
      })
      .catch(err => console.error("Error loading config:", err));

    // Check stored password
    const stored = localStorage.getItem('manager_password');
    if (stored) {
      setPassword(stored);
      // Auto-validate stored password
      validatePassword(stored);
    }
  }, []);

  const validatePassword = async (pass: string) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });
      // 401 is unauthorized, 400 is payload missing (which means auth succeeded because payload was checked after auth!)
      if (res.status === 400 || res.status === 200 || res.status === 404) {
        setIsAuthenticated(true);
        localStorage.setItem('manager_password', pass);
        setAuthError('');
      } else {
        setAuthError('Invalid administrator access code.');
        setIsAuthenticated(false);
      }
    } catch (err) {
      setAuthError('Connection failed.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validatePassword(password);
  };

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: config, password })
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: "Settings saved successfully! Updating homepage...", type: 'success' });
        setTimeout(() => setToast(null), 4000);
      } else {
        setToast({ message: data.error || "Save failed.", type: 'error' });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err) {
      setToast({ message: "Network connection error.", type: 'error' });
      setTimeout(() => setToast(null), 4000);
    }
    setIsSaving(false);
  };

  const handleToggle = (path: string) => {
    if (!config) return;
    const keys = path.split('.');
    const updated = { ...config } as any;
    
    if (keys.length === 3) {
      updated[keys[0]][keys[1]][keys[2]] = !updated[keys[0]][keys[1]][keys[2]];
    } else if (keys.length === 2) {
      updated[keys[0]][keys[1]] = !updated[keys[0]][keys[1]];
    } else if (keys.length === 1) {
      updated[keys[0]] = !updated[keys[0]];
    }
    setConfig(updated);
  };

  const handleChange = (path: string, val: any) => {
    if (!config) return;
    const keys = path.split('.');
    const updated = { ...config } as any;
    
    if (keys.length === 3) {
      if (!updated[keys[0]][keys[1]]) {
        updated[keys[0]][keys[1]] = {};
      }
      updated[keys[0]][keys[1]][keys[2]] = val;
    } else if (keys.length === 2) {
      updated[keys[0]][keys[1]] = val;
    } else if (keys.length === 1) {
      updated[keys[0]] = val;
    }
    setConfig(updated);
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        fontFamily: 'system-ui, sans-serif',
        color: '#fff',
        padding: '2rem'
      }}>
        <div className="glass" style={{
          padding: '2.5rem',
          borderRadius: '16px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: '#ff4655' }}>Arash Admin</h1>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>Enter administrator access code to customize layout settings.</p>
          
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="password"
              placeholder="Access Code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                textAlign: 'center'
              }}
            />
            {authError && <p style={{ color: '#ff4655', fontSize: '0.85rem', margin: 0 }}>{authError}</p>}
            <button 
              type="submit"
              className="watch-btn"
              style={{
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                padding: '0.8rem',
                borderRadius: '8px',
                marginTop: '0.5rem'
              }}
            >
              Authorize 🔑
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>
        <h2>Loading website manager configuration...</h2>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'success' ? 'rgba(46, 213, 115, 0.95)' : 'rgba(255, 70, 85, 0.95)',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toast.message}
        </div>
      )}

      {/* Admin Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: config.theme.accentColor }}>
            Website Manager
          </h1>
          <span style={{ fontSize: '0.85rem', opacity: 0.5 }}>
            Connected to 🟢 KV Live Production Database • dev.arashyt.ca
          </span>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="watch-btn"
          style={{
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '0.8rem 2rem',
            borderRadius: '8px',
            fontSize: '1rem',
            background: config.theme.accentColor,
            boxShadow: `0 4px 15px ${config.theme.accentColor}30`,
            opacity: isSaving ? 0.7 : 1
          }}
        >
          {isSaving ? "Saving..." : "Save Config 💾"}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('widgets')}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'widgets' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === 'widgets' ? config.theme.accentColor : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              outline: 'none'
            }}
          >
            🧩 Widget Controls
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'integrations' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === 'integrations' ? config.theme.accentColor : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              outline: 'none'
            }}
          >
            🔌 APIs & Credentials
          </button>
          <button 
            onClick={() => setActiveTab('branding')}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'branding' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === 'branding' ? config.theme.accentColor : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              outline: 'none'
            }}
          >
            🎨 Branding & Accent
          </button>
          <button 
            onClick={() => setActiveTab('socials')}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'socials' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === 'socials' ? config.theme.accentColor : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              outline: 'none'
            }}
          >
            🔗 Social Links
          </button>
          <button 
            onClick={() => setActiveTab('monetization')}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'monetization' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === 'monetization' ? config.theme.accentColor : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              outline: 'none'
            }}
          >
            💵 Monetization & Ads
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'security' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === 'security' ? config.theme.accentColor : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left',
              outline: 'none'
            }}
          >
            🔑 Security Options
          </button>

          {/* Visual Grid Preview Mock */}
          <div className="glass" style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
              Layout Columns Mock:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '6px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ opacity: 0.5 }}>Left Col</span>
                {config.twitter.enabled && <div style={{ fontSize: '0.7rem', background: '#1d9bf0', borderRadius: '3px', margin: '2px 0' }}>Twitter</div>}
                {config.minecraft.enabled && <div style={{ fontSize: '0.7rem', background: '#2ed573', borderRadius: '3px', margin: '2px 0' }}>Minecraft</div>}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ opacity: 0.5 }}>Right Col</span>
                {config.valorant.enabled && <div style={{ fontSize: '0.7rem', background: '#ff4655', borderRadius: '3px', margin: '2px 0' }}>Valorant</div>}
                {config.randomClip.enabled && <div style={{ fontSize: '0.7rem', background: 'var(--accent)', borderRadius: '3px', margin: '2px 0' }}>Clip Dice</div>}
                <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', margin: '2px 0' }}>Socials</div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Panel Content */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          
          {/* Tab 1: Widget Controls */}
          {activeTab === 'widgets' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: config.theme.accentColor }}>🧩 Layout Widget Toggles</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>📺 Twitch Stream Chat</strong>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Enables showing Twitch chat iframe beside your livestream player.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.twitch.showChat} 
                    onChange={() => handleToggle('twitch.showChat')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: config.theme.accentColor }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>🐦 Twitter (X) Feed</strong>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Display your recent tweets with custom mock backup fallback if adblocked.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.twitter.enabled} 
                    onChange={() => handleToggle('twitter.enabled')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: config.theme.accentColor }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>🎮 Valorant Status & Match History</strong>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Live tracker card parsing rank, account level, player card banner, and last 3 games.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.valorant.enabled} 
                    onChange={() => handleToggle('valorant.enabled')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: config.theme.accentColor }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>🟩 Minecraft Community Server Status</strong>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Shows whether server is online, active player count, and copy address button.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.minecraft.enabled} 
                    onChange={() => handleToggle('minecraft.enabled')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: config.theme.accentColor }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>🎲 Random Clip Generator</strong>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Funny highlights dice roll component that triggers video overlay.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.randomClip.enabled} 
                    onChange={() => handleToggle('randomClip.enabled')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: config.theme.accentColor }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>📅 Stream Schedule Countdown</strong>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Countdown ticking widget displaying days/hours to next livestream event.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.schedule.enabled} 
                    onChange={() => handleToggle('schedule.enabled')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: config.theme.accentColor }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>🔊 Interactive soundboard widget</strong>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Sound button panel allowing users to play livestream meme audio bytes.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.soundboard.enabled} 
                    onChange={() => handleToggle('soundboard.enabled')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: config.theme.accentColor }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>💼 Business Inquiries Form</strong>
                    <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.5 }}>Contact portal at bottom of page sending email forms directly.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={config.contactForm.enabled} 
                    onChange={() => handleToggle('contactForm.enabled')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: config.theme.accentColor }}
                  />
                </div>

              </div>
            </div>
          )}

          {/* Tab 2: APIs & Credentials */}
          {activeTab === 'integrations' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: config.theme.accentColor }}>🔌 Integrations & Handles</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Riot ID (GameName#Tagline)
                  </label>
                  <input 
                    type="text" 
                    value={config.valorant.riotId} 
                    onChange={(e) => handleChange('valorant.riotId', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    HenrikDev Valorant Developer API Key
                  </label>
                  <input 
                    type="text" 
                    value={config.valorant.apiKey} 
                    onChange={(e) => handleChange('valorant.apiKey', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Twitch Channel Name
                  </label>
                  <input 
                    type="text" 
                    value={config.twitch.channel} 
                    onChange={(e) => handleChange('twitch.channel', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Twitter Handle (without @ symbol)
                  </label>
                  <input 
                    type="text" 
                    value={config.twitter.username} 
                    onChange={(e) => handleChange('twitter.username', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Minecraft Java Server IP / Address
                  </label>
                  <input 
                    type="text" 
                    value={config.minecraft.serverIp} 
                    onChange={(e) => handleChange('minecraft.serverIp', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Valorant Skins Loadout Collection Config */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: config.theme.accentColor }}>🛡️ Valorant Weapon Loadout Collection</h3>
                  <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1.5rem' }}>Customize the weapon skins displayed in your live Valorant stats card expansion loadout section.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Vandal Skin</label>
                      <input 
                        type="text" 
                        value={config.valorant.skins?.vandal || ''} 
                        onChange={(e) => handleChange('valorant.skins.vandal', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Phantom Skin</label>
                      <input 
                        type="text" 
                        value={config.valorant.skins?.phantom || ''} 
                        onChange={(e) => handleChange('valorant.skins.phantom', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Operator Skin</label>
                      <input 
                        type="text" 
                        value={config.valorant.skins?.operator || ''} 
                        onChange={(e) => handleChange('valorant.skins.operator', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Melee Skin (Knife)</label>
                      <input 
                        type="text" 
                        value={config.valorant.skins?.melee || ''} 
                        onChange={(e) => handleChange('valorant.skins.melee', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Sheriff Skin</label>
                      <input 
                        type="text" 
                        value={config.valorant.skins?.sheriff || ''} 
                        onChange={(e) => handleChange('valorant.skins.sheriff', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Discord Widget Config */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: config.theme.accentColor }}>💬 Discord Server Widget</h3>
                  <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem' }}>Configure the Discord Server ID to display online members and active voice channels.</p>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Discord Server/Guild ID</label>
                    <input 
                      type="text" 
                      value={config.discordWidgetId || ''} 
                      onChange={(e) => handleChange('discordWidgetId', e.target.value)} 
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.2)',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none'
                      }} 
                    />
                  </div>
                </div>

                {/* Spotify Config */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: config.theme.accentColor }}>🎵 Spotify Live Now Playing</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={config.spotify?.enabled || false} 
                        onChange={(e) => handleChange('spotify.enabled', e.target.checked)}
                      />
                      <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Enable Widget</span>
                    </label>
                  </div>
                  <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem' }}>Manually override or sync the track currently playing in your stream header ticker.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Song Name</label>
                      <input 
                        type="text" 
                        value={config.spotify?.songName || ''} 
                        onChange={(e) => handleChange('spotify.songName', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Artist(s)</label>
                      <input 
                        type="text" 
                        value={config.spotify?.artist || ''} 
                        onChange={(e) => handleChange('spotify.artist', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Milestones Config */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: config.theme.accentColor }}>🏆 Stream Milestones Goal Tracker</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={config.milestones?.enabled || false} 
                        onChange={(e) => handleChange('milestones.enabled', e.target.checked)}
                      />
                      <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Enable Tracker</span>
                    </label>
                  </div>
                  <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem' }}>Display a stream subscriber or charity progress goal bar on the index page.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Goal Title / Description</label>
                      <input 
                        type="text" 
                        value={config.milestones?.title || ''} 
                        onChange={(e) => handleChange('milestones.title', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Current Value</label>
                      <input 
                        type="number" 
                        value={config.milestones?.current ?? 0} 
                        onChange={(e) => handleChange('milestones.current', parseInt(e.target.value) || 0)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.4rem', fontWeight: 'bold' }}>Target Goal</label>
                      <input 
                        type="number" 
                        value={config.milestones?.goal ?? 100} 
                        onChange={(e) => handleChange('milestones.goal', parseInt(e.target.value) || 0)} 
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Twitch Channel Points Config */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: config.theme.accentColor }}>💎 Twitch Channel Point Rewards</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={config.channelPoints?.enabled || false} 
                        onChange={(e) => handleChange('channelPoints.enabled', e.target.checked)}
                      />
                      <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Enable Rewards Catalog</span>
                    </label>
                  </div>
                  <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem' }}>Display a curated list of custom channel point rewards and total redemptions on the homepage.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {config.channelPoints?.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 'bold' }}>Reward Title</label>
                          <input 
                            type="text" 
                            value={item.name} 
                            onChange={(e) => {
                              const newItems = [...config.channelPoints!.items];
                              newItems[idx].name = e.target.value;
                              handleChange('channelPoints.items', newItems);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.6rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'rgba(0,0,0,0.2)',
                              color: '#fff',
                              fontSize: '0.95rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 'bold' }}>Point Cost</label>
                          <input 
                            type="number" 
                            value={item.cost} 
                            onChange={(e) => {
                              const newItems = [...config.channelPoints!.items];
                              newItems[idx].cost = parseInt(e.target.value) || 0;
                              handleChange('channelPoints.items', newItems);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.6rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'rgba(0,0,0,0.2)',
                              color: '#fff',
                              fontSize: '0.95rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 'bold' }}>Redeemed Count</label>
                          <input 
                            type="number" 
                            value={item.count} 
                            onChange={(e) => {
                              const newItems = [...config.channelPoints!.items];
                              newItems[idx].count = parseInt(e.target.value) || 0;
                              handleChange('channelPoints.items', newItems);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.6rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'rgba(0,0,0,0.2)',
                              color: '#fff',
                              fontSize: '0.95rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 3: Branding & Theme customization */}
          {activeTab === 'branding' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: config.theme.accentColor }}>🎨 Visual Branding customization</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Theme Accent Color (HEX Code)
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="color" 
                      value={config.theme.accentColor} 
                      onChange={(e) => handleChange('theme.accentColor', e.target.value)}
                      style={{
                        width: '50px',
                        height: '42px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: 'transparent'
                      }}
                    />
                    <input 
                      type="text" 
                      value={config.theme.accentColor} 
                      onChange={(e) => handleChange('theme.accentColor', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.2)',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '4px', display: 'block' }}>
                    This color updates your site's buttons, progress bars, hover states, glows, and headers globally!
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Default Active Theme Option
                  </label>
                  <select 
                    value={config.theme.defaultTheme} 
                    onChange={(e) => handleChange('theme.defaultTheme', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: '#111',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  >
                    <option value="dark">🌙 Dark Mode (Default)</option>
                    <option value="light">☀️ Light Mode</option>
                    <option value="valorant">🔴 Valorant Theme</option>
                    <option value="minecraft">🟩 Minecraft Theme</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Social Links */}
          {activeTab === 'socials' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: config.theme.accentColor }}>🔗 Social Media Cards Links</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    YouTube Link
                  </label>
                  <input 
                    type="text" 
                    value={config.socials.youtube} 
                    onChange={(e) => handleChange('socials.youtube', e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Twitch Link
                  </label>
                  <input 
                    type="text" 
                    value={config.socials.twitch} 
                    onChange={(e) => handleChange('socials.twitch', e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Discord Invite Link
                  </label>
                  <input 
                    type="text" 
                    value={config.socials.discord} 
                    onChange={(e) => handleChange('socials.discord', e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    TikTok Link
                  </label>
                  <input 
                    type="text" 
                    value={config.socials.tiktok} 
                    onChange={(e) => handleChange('socials.tiktok', e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Instagram Link
                  </label>
                  <input 
                    type="text" 
                    value={config.socials.instagram} 
                    onChange={(e) => handleChange('socials.instagram', e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    X (Twitter) Link
                  </label>
                  <input 
                    type="text" 
                    value={config.socials.x} 
                    onChange={(e) => handleChange('socials.x', e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Security Config */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: config.theme.accentColor }}>🔑 Manager Security Options</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255, 70, 85, 0.05)', border: '1px solid rgba(255, 70, 85, 0.2)', borderRadius: '8px', padding: '1rem', fontSize: '0.85rem', lineHeight: '1.4' }}>
                  ⚠️ <strong>Changing the Access Code:</strong> Once updated, you must use the new access code to authorize this manager session. Your browser's stored credentials will be updated automatically.
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    New Administrator Access Code
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter new administrator password"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onBlur={async (e) => {
                      const newPass = e.target.value.trim();
                      if (newPass.length < 3) return;
                      if (confirm(`Are you sure you want to change the manager access code?`)) {
                        try {
                          const res = await fetch('/api/settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            // Custom API handles updating password separately in POST route if it matches body format
                            // Wait, the settings API currently checks/updates settings payload. Let's add password changing in settings!
                            body: JSON.stringify({ 
                              settings: config, 
                              password,
                              // If we send newPassword in post body, the functions backend can update KV 'admin_password'!
                              newPassword: newPass
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setPassword(newPass);
                            localStorage.setItem('manager_password', newPass);
                            setToast({ message: "Access code successfully changed!", type: 'success' });
                            e.target.value = '';
                          } else {
                            setToast({ message: data.error || "Failed to update code.", type: 'error' });
                          }
                        } catch (err) {
                          setToast({ message: "Network connection failure.", type: 'error' });
                        }
                      }
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '4px', display: 'block' }}>
                    Type the new code and click outside the input (blur) to trigger the change.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Monetization Config */}
          {activeTab === 'monetization' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: config.theme.accentColor }}>💵 Monetization & Display Ads</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#fff' }}>Enable Google AdSense</h3>
                    <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>Inject dynamic Google AdSense ads on your main portfolio index page.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('adsense.enabled')}
                    style={{
                      background: config.adsense?.enabled ? config.theme.accentColor : 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '24px',
                      padding: '0.5rem 1.5rem',
                      fontWeight: 'bold',
                      color: config.adsense?.enabled ? '#000' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {config.adsense?.enabled ? 'ACTIVE 🟢' : 'DISABLED 🔴'}
                  </button>
                </div>

                {config.adsense?.enabled && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Google AdSense Publisher ID (client ID)
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. ca-pub-xxxxxxxxxxxxxxxx"
                        value={config.adsense?.publisherId || ''} 
                        onChange={(e) => handleChange('adsense.publisherId', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '4px', display: 'block' }}>
                        Matches format: `ca-pub-[16 digit number]`
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Google AdSense Ad Slot ID
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. xxxxxxxxxx"
                        value={config.adsense?.adSlotId || ''} 
                        onChange={(e) => handleChange('adsense.adSlotId', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.2)',
                          color: '#fff',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '4px', display: 'block' }}>
                        The 10-digit ID of your display ad unit (e.g. `1234567890`)
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: config.theme.accentColor }}>💡 How to monetize your website with Google AdSense:</h4>
                  <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>Go to the <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" style={{ color: config.theme.accentColor, fontWeight: 'bold', textDecoration: 'none' }}>Google AdSense Portal</a> and sign up using your Google account.</li>
                    <li>Add your website URL: <strong>arashyt.ca</strong>.</li>
                    <li>Retrieve your AdSense **Publisher ID** (client) and paste it above, turn the toggle to **Active**, and click **Save Config** at the top right.</li>
                    <li>In AdSense, click **Verify / Let Google check your site**. Google will detect the verification tag instantly because it is loaded dynamically on your live pages.</li>
                    <li>Once approved, create a **Display Ad Unit** in AdSense, get the **Slot ID**, paste it here, and your ads will start rendering!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
