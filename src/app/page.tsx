'use client';
import React, { useState, useEffect } from 'react';
import LatestVideo from "@/components/LatestVideo";
import SocialLinks from "@/components/SocialLinks";
import TopClips from "@/components/TopClips";
import TweetEmbed from "@/components/TweetEmbed";
import ValorantStats from "@/components/ValorantStats";
import MinecraftStatus from "@/components/MinecraftStatus";
import RandomClip from "@/components/RandomClip";
import StreamSchedule from "@/components/StreamSchedule";
import Soundboard from "@/components/Soundboard";
import ContactForm from "@/components/ContactForm";
import AdUnit from "@/components/AdUnit";
import DiscordWidget from "@/components/DiscordWidget";
import { audioEffects } from '@/utils/AudioEffects';

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
  };
  minecraft: {
    serverIp: string;
    enabled: boolean;
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
  adsense: {
    enabled: boolean;
    publisherId: string;
    adSlotId: string;
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

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setConfig(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Check desktop notification status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const isGranted = Notification.permission === 'granted';
      const promptDismissed = localStorage.getItem('dismiss_notification_prompt') === 'true';
      if (!isGranted && !promptDismissed) {
        // Show prompt after 5 seconds
        const timer = setTimeout(() => setShowNotificationPrompt(true), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Dynamically inject Google AdSense script when enabled
  useEffect(() => {
    if (config?.adsense?.enabled && config?.adsense?.publisherId) {
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsense.publisherId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, [config]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#fff' }}>
        <div style={{ opacity: 0.6 }}>Loading website configuration...</div>
      </div>
    );
  }

  // Default fallback values
  const defaultConfig: SiteConfig = {
    theme: { defaultTheme: 'dark', accentColor: '#ff4655' },
    twitch: { channel: 'ArashLIVE', showChat: true },
    twitter: { username: 'arashyt', enabled: true },
    valorant: { riotId: 'TTV ArashLIVE#LWPxD', apiKey: '', enabled: true },
    minecraft: { serverIp: 'mc.arashyt.ca', enabled: false },
    adsense: { enabled: false, publisherId: '', adSlotId: '' },
    randomClip: { enabled: false },
    contactForm: { enabled: false },
    schedule: { enabled: false, days: [] },
    soundboard: { enabled: false },
    socials: {
      youtube: '',
      twitch: '',
      discord: '',
      tiktok: '',
      instagram: '',
      x: ''
    },
    discordWidgetId: '1083431693836173423',
    spotify: {
      enabled: true,
      songName: 'K/DA - POP/STARS',
      artist: 'Madison Beer, (G)I-DLE, Jaira Burns'
    },
    milestones: {
      enabled: true,
      title: 'Charity Sub Goal',
      current: 68,
      goal: 100
    },
    channelPoints: {
      enabled: true,
      items: [
        { name: '💦 Hydrate', cost: 250, count: 184 },
        { name: '🎙️ Voice Changer', cost: 1000, count: 57 },
        { name: '🥊 1v1 Me in Custom', cost: 5000, count: 12 }
      ]
    }
  };

  // Safe merge to prevent crashes on partial objects loaded from the database
  const activeConfig: SiteConfig = config ? {
    theme: { ...defaultConfig.theme, ...config.theme },
    twitch: { ...defaultConfig.twitch, ...config.twitch },
    twitter: { ...defaultConfig.twitter, ...config.twitter },
    valorant: { ...defaultConfig.valorant, ...config.valorant },
    minecraft: { ...defaultConfig.minecraft, ...config.minecraft },
    adsense: {
      enabled: config.adsense?.enabled ?? defaultConfig.adsense.enabled,
      publisherId: config.adsense?.publisherId ?? defaultConfig.adsense.publisherId,
      adSlotId: config.adsense?.adSlotId ?? defaultConfig.adsense.adSlotId
    },
    randomClip: { ...defaultConfig.randomClip, ...config.randomClip },
    contactForm: { ...defaultConfig.contactForm, ...config.contactForm },
    schedule: { ...defaultConfig.schedule, ...config.schedule },
    soundboard: { ...defaultConfig.soundboard, ...config.soundboard },
    socials: { ...defaultConfig.socials, ...config.socials },
    discordWidgetId: config.discordWidgetId ?? defaultConfig.discordWidgetId,
    spotify: config.spotify ? { ...defaultConfig.spotify, ...config.spotify } : defaultConfig.spotify,
    milestones: config.milestones ? { ...defaultConfig.milestones, ...config.milestones } : defaultConfig.milestones,
    channelPoints: config.channelPoints ? { ...defaultConfig.channelPoints, ...config.channelPoints } : defaultConfig.channelPoints
  } : defaultConfig;

  const showColumn1 = activeConfig.schedule?.enabled || activeConfig.twitter?.enabled || activeConfig.minecraft?.enabled || true;
  const showColumn2 = activeConfig.valorant?.enabled || activeConfig.soundboard?.enabled || activeConfig.randomClip?.enabled || true;

  const requestNotification = () => {
    audioEffects.playClickPop();
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Trigger browser notification immediately
          new Notification('ArashLIVE Notifications', {
            body: 'You will now be notified when Arash goes live!',
            icon: '/favicon.ico'
          });
        }
        setShowNotificationPrompt(false);
      });
    }
  };

  const dismissNotification = () => {
    audioEffects.playClickPop();
    localStorage.setItem('dismiss_notification_prompt', 'true');
    setShowNotificationPrompt(false);
  };

  const handleHover = () => {
    audioEffects.playHoverTick();
  };

  return (
    <div className="home-container">
      {/* Inject custom accent colors dynamically to override CSS roots */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --accent: ${activeConfig.theme?.accentColor || '#ff4655'} !important;
          --accent-glow: ${(activeConfig.theme?.accentColor || '#ff4655')}40 !important;
        }
      `}} />

      {/* Spotify Live Ribbon Ticker */}
      {activeConfig.spotify?.enabled && activeConfig.spotify?.songName && (
        <div 
          className="reveal"
          style={{
            background: 'rgba(30, 215, 96, 0.08)',
            border: '1px solid rgba(30, 215, 96, 0.2)',
            borderRadius: '12px',
            padding: '10px 20px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: 'center',
            fontSize: '0.9rem',
            boxShadow: '0 0 15px rgba(30, 215, 96, 0.05)'
          }}
        >
          <span style={{ fontSize: '1.2rem', animation: 'pulse 1.5s infinite' }}>🟢</span>
          <span style={{ fontWeight: 'bold', color: '#1ed760' }}>Spotify Now Playing:</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{activeConfig.spotify.songName}</span>
          <span style={{ opacity: 0.5 }}>by</span>
          <span style={{ color: '#fff', opacity: 0.8 }}>{activeConfig.spotify.artist}</span>
        </div>
      )}

      {/* Twitch Stream Player */}
      <LatestVideo channel={activeConfig.twitch?.channel || 'ArashLIVE'} showChat={!!activeConfig.twitch?.showChat} />

      {/* Stream Milestone Progress Bar */}
      {activeConfig.milestones?.enabled && activeConfig.milestones?.title && (
        <div 
          className="glass reveal" 
          style={{ 
            padding: '1.5rem 2rem', 
            borderRadius: '20px', 
            margin: '2rem 0',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.01), rgba(255,70,85,0.02))',
            border: '1px solid var(--card-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>{activeConfig.milestones.title}</span>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
              {activeConfig.milestones.current} / {activeConfig.milestones.goal} ({Math.round((activeConfig.milestones.current / activeConfig.milestones.goal) * 100)}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '7px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${Math.min(100, Math.round((activeConfig.milestones.current / activeConfig.milestones.goal) * 100))}%`, 
                height: '100%', 
                background: 'var(--accent)', 
                borderRadius: '7px',
                boxShadow: '0 0 10px var(--accent-glow)',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
              }} 
            />
          </div>
        </div>
      )}

      {/* 2. Responsive Dashboard Grid */}
      <div className="home-dashboard-grid" style={{
        gridTemplateColumns: (!showColumn1 || !showColumn2) ? '1fr' : undefined
      }}>
        {/* Column 1: Schedule, Twitter Timeline, Minecraft Server Status, Discord Server */}
        {showColumn1 && (
          <div className="dashboard-column">
            {activeConfig.schedule?.enabled && <StreamSchedule />}
            <DiscordWidget />
            {activeConfig.twitter?.enabled && <TweetEmbed username={activeConfig.twitter?.username} />}
            {activeConfig.minecraft?.enabled && <MinecraftStatus serverIp={activeConfig.minecraft?.serverIp} />}
          </div>
        )}

        {/* Column 2: Valorant Career Stats, Livestream Soundboard, Random Clip, Channel Points */}
        {showColumn2 && (
          <div className="dashboard-column">
            {activeConfig.valorant?.enabled && <ValorantStats />}
            
            {/* Twitch Channel Points Rewards Catalog */}
            {activeConfig.channelPoints?.enabled && activeConfig.channelPoints?.items && (
              <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>💎 Channel Points Rewards</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeConfig.channelPoints.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        background: 'rgba(255,255,255,0.01)', 
                        padding: '10px 14px', 
                        borderRadius: '10px',
                        border: '1px solid var(--card-border)'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', display: 'block' }}>{item.name}</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Redeemed {item.count} times</span>
                      </div>
                      <span style={{ background: 'rgba(163, 114, 255, 0.1)', border: '1px solid #a372ff', color: '#a372ff', fontSize: '0.8rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '15px' }}>
                        {item.cost} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeConfig.soundboard?.enabled && <Soundboard />}
            {activeConfig.randomClip?.enabled && <RandomClip />}
            <SocialLinks links={activeConfig.socials || {}} />
          </div>
        )}
      </div>

      {/* AdSense Unit Placement */}
      {activeConfig.adsense?.enabled && activeConfig.adsense?.publisherId && activeConfig.adsense?.adSlotId && (
        <AdUnit publisherId={activeConfig.adsense.publisherId} adSlotId={activeConfig.adsense.adSlotId} />
      )}

      {/* 3. Stream Highlights Clips */}
      <TopClips />

      {/* 4. Business Inquiries Email form */}
      {activeConfig.contactForm?.enabled && <ContactForm />}

      {/* Desktop Notification Alert Float Prompt */}
      {showNotificationPrompt && (
        <div 
          className="glass reveal"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 999,
            padding: '1.25rem',
            borderRadius: '16px',
            maxWidth: '300px',
            border: '1px solid var(--accent)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            background: 'rgba(10, 10, 12, 0.95)'
          }}
        >
          <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>🔔 Live Stream Alerts</h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', opacity: 0.7, lineHeight: 1.4 }}>
            Get push notifications on your desktop directly when Arash goes live!
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={requestNotification}
              onMouseEnter={handleHover}
              style={{
                flex: 1,
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Notify Me
            </button>
            <button 
              onClick={dismissNotification}
              onMouseEnter={handleHover}
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: '1px solid var(--card-border)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              No Thanks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
