'use client';
import React, { useState, useEffect } from 'react';
import { audioEffects } from '@/utils/AudioEffects';

interface VoiceMember {
  id: string;
  username: string;
  avatar_url: string;
  deaf?: boolean;
  mute?: boolean;
}

interface DiscordVoiceChannel {
  id: string;
  name: string;
  members: VoiceMember[];
}

interface DiscordWidgetData {
  name: string;
  instant_invite: string;
  presence_count: number;
  channels: DiscordVoiceChannel[];
}

export default function DiscordWidget() {
  const [data, setData] = useState<DiscordWidgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgetId, setWidgetId] = useState('1083431693836173423'); // Fallback Guild ID

  useEffect(() => {
    // Attempt to load settings to get configured Discord ID
    fetch('/api/settings')
      .then(res => res.json())
      .then(config => {
        if (config.settings && config.settings.discordWidgetId) {
          setWidgetId(config.settings.discordWidgetId);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!widgetId) return;

    const fetchWidget = () => {
      fetch(`https://discord.com/api/guilds/${widgetId}/widget.json`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(resData => {
          setData(resData);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    };

    fetchWidget();
    const interval = setInterval(fetchWidget, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, [widgetId]);

  const handlePlayClick = () => {
    audioEffects.playClickPop();
  };

  const handleHover = () => {
    audioEffects.playHoverTick();
  };

  if (loading) {
    return (
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'center', minHeight: '180px', alignItems: 'center' }}>
        <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>Listening on Discord channel frequencies...</span>
      </div>
    );
  }

  // Fallback UI if Discord widget is disabled or failed
  const finalData: DiscordWidgetData = data || {
    name: "Arash community discord",
    instant_invite: "https://discord.gg/arashyt",
    presence_count: 342,
    channels: [
      {
        id: "1",
        name: "🔊 Lounge Duo",
        members: [
          { id: "a1", username: "Arash_YT", avatar_url: "https://crafatar.com/avatars/d08e826b-67a6-4bc2-b883-9bcda2e9bc2a" },
          { id: "a2", username: "TTVArashLIVE", avatar_url: "https://crafatar.com/avatars/417a86c8-a681-4202-8610-d02319208034" }
        ]
      },
      {
        id: "2",
        name: "🔊 Valorant 5-Stack",
        members: [
          { id: "b1", username: "MrWaiterMan", avatar_url: "https://crafatar.com/avatars/718bf7d0-c3d5-455b-8012-07ccff5c738e" }
        ]
      }
    ]
  };

  const totalVoicePlayers = finalData.channels.reduce((acc, c) => acc + (c.members?.length || 0), 0);

  return (
    <div 
      className="glass reveal" 
      style={{ 
        padding: '1.5rem', 
        borderRadius: '16px', 
        border: '1px solid var(--card-border)',
        background: 'rgba(88, 101, 242, 0.03)' // subtle discord brand tint
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>{finalData.name}</h4>
          <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ed573' }}></span>
            {finalData.presence_count} online members
          </span>
        </div>
        <a 
          href={finalData.instant_invite} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handlePlayClick}
          onMouseEnter={handleHover}
          className="button"
          style={{ 
            background: '#5865F2', 
            color: '#fff', 
            border: 'none', 
            fontSize: '0.8rem', 
            fontWeight: 'bold', 
            padding: '6px 14px', 
            borderRadius: '20px',
            textDecoration: 'none'
          }}
        >
          Join Server
        </a>
      </div>

      {/* Voice Channels List */}
      <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Active Voice Channels ({totalVoicePlayers} talking)
      </h5>

      {finalData.channels && finalData.channels.filter(c => c.members?.length > 0).length === 0 ? (
        <div style={{ padding: '1rem 0', textTransform: 'uppercase', fontSize: '0.7rem', opacity: 0.4, textAlign: 'center', letterSpacing: '0.5px' }}>
          🔊 Voice lobby channels are quiet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
          {finalData.channels.filter(c => c.members?.length > 0).map(c => (
            <div key={c.id} style={{ background: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                {c.name}
              </span>
              
              {/* Member Avatars */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {c.members.map(m => (
                  <div 
                    key={m.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '2px 8px 2px 4px',
                      borderRadius: '12px',
                      border: '1px solid var(--card-border)'
                    }}
                  >
                    <img 
                      src={m.avatar_url} 
                      alt={m.username} 
                      style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#fff', opacity: 0.8 }}>
                      {m.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
