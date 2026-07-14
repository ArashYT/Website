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
}

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

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
    socials: { ...defaultConfig.socials, ...config.socials }
  } : defaultConfig;

  // Determine if columns contain any active components using safe accessors
  const showColumn1 = activeConfig.schedule?.enabled || activeConfig.twitter?.enabled || activeConfig.minecraft?.enabled;
  const showColumn2 = activeConfig.valorant?.enabled || activeConfig.soundboard?.enabled || activeConfig.randomClip?.enabled || true;

  return (
    <div className="home-container">
      {/* Inject custom accent colors dynamically to override CSS roots */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --accent: ${activeConfig.theme?.accentColor || '#ff4655'} !important;
          --accent-glow: ${(activeConfig.theme?.accentColor || '#ff4655')}40 !important;
        }
      `}} />

      {/* 1. Twitch Stream Player / Latest Video Section */}
      <LatestVideo channel={activeConfig.twitch?.channel || 'ArashLIVE'} showChat={!!activeConfig.twitch?.showChat} />

      {/* 2. Responsive Dashboard Grid */}
      <div className="home-dashboard-grid" style={{
        // If one of the columns is hidden, span the other full-width
        gridTemplateColumns: (!showColumn1 || !showColumn2) ? '1fr' : undefined
      }}>
        {/* Column 1: Schedule, Twitter Timeline, Minecraft Server Status */}
        {showColumn1 && (
          <div className="dashboard-column">
            {activeConfig.schedule?.enabled && <StreamSchedule />}
            {activeConfig.twitter?.enabled && <TweetEmbed username={activeConfig.twitter?.username} />}
            {activeConfig.minecraft?.enabled && <MinecraftStatus serverIp={activeConfig.minecraft?.serverIp} />}
          </div>
        )}

        {/* Column 2: Valorant Career Stats, Livestream Soundboard, Random Clip, Social Profiles */}
        {showColumn2 && (
          <div className="dashboard-column">
            {activeConfig.valorant?.enabled && <ValorantStats />}
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
    </div>
  );
}
