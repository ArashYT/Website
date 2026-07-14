'use client';
import React, { useEffect, useState } from 'react';

interface SocialLinksProps {
  links?: {
    youtube?: string;
    twitch?: string;
    discord?: string;
    tiktok?: string;
    instagram?: string;
    x?: string;
  };
}

export default function SocialLinks({ links }: SocialLinksProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const youtubeUrl = links?.youtube || 'https://youtube.com/@arashyt';
  const twitchUrl = links?.twitch || 'https://twitch.tv/ArashLIVE';
  const discordUrl = links?.discord || 'https://discord.com/invite/GXAbp4y';
  const tiktokUrl = links?.tiktok || 'https://tiktok.com/@arashyt';
  const instagramUrl = links?.instagram || 'https://instagram.com/arashyt';
  const xUrl = links?.x || 'https://x.com/arashyt';

  // Helper to extract username for app deep-linking
  const getUsername = (url: string, defaultValue: string) => {
    try {
      const parts = url.replace(/\/$/, '').split('/');
      return parts[parts.length - 1]?.replace('@', '') || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const ytUser = getUsername(youtubeUrl, 'arashyt');
  const twitchChan = getUsername(twitchUrl, 'ArashLIVE');
  const tiktokUser = getUsername(tiktokUrl, 'arashyt');
  const instaUser = getUsername(instagramUrl, 'arashyt');
  const xUser = getUsername(xUrl, 'arashyt');

  const socialsList = [
    { name: 'YouTube', url: youtubeUrl, appUrl: `vnd.youtube://www.youtube.com/@${ytUser}`, icon: '📺', color: '#FF0000' },
    { name: 'Twitch', url: twitchUrl, appUrl: `twitch://stream/${twitchChan}`, icon: '👾', color: '#9146FF' },
    { name: 'Discord', url: discordUrl, appUrl: discordUrl, icon: '💬', color: '#5865F2' },
    { name: 'TikTok', url: tiktokUrl, appUrl: `snssdk1233://user/profile/${tiktokUser}`, icon: '📱', color: '#00F2FE' },
    { name: 'Instagram', url: instagramUrl, appUrl: `instagram://user?username=${instaUser}`, icon: '📸', color: '#E1306C' },
    { name: 'X', url: xUrl, appUrl: `twitter://user?screen_name=${xUser}`, icon: '🐦', color: '#1DA1F2' },
  ];

  return (
    <div className="social-links-container">
      <h2>Connect With Me</h2>
      <div className="social-grid">
        {socialsList.map((s) => (
          <a 
            key={s.name} 
            href={isMobile && s.appUrl ? s.appUrl : s.url} 
            target={isMobile ? "_self" : "_blank"} 
            rel="noreferrer" 
            className="social-card glass" 
            style={{'--hover-color': s.color} as React.CSSProperties}
          >
            <span className="icon">{s.icon}</span>
            <span className="name">{s.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
