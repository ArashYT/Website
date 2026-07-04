'use client';
import React, { useEffect, useState } from 'react';

const socials = [
  { name: 'YouTube', url: 'https://youtube.com/@arashyt', appUrl: 'vnd.youtube://www.youtube.com/@arashyt', icon: '📺', color: '#FF0000' },
  { name: 'Twitch', url: 'https://twitch.tv/ArashLIVE', appUrl: 'twitch://stream/ArashLIVE', icon: '👾', color: '#9146FF' },
  { name: 'Discord', url: 'https://discord.com/invite/GXAbp4y', appUrl: 'https://discord.com/invite/GXAbp4y', icon: '💬', color: '#5865F2' },
  { name: 'TikTok', url: 'https://tiktok.com/@arashyt', appUrl: 'snssdk1233://user/profile/arashyt', icon: '📱', color: '#00F2FE' },
  { name: 'Instagram', url: 'https://instagram.com/arashyt', appUrl: 'instagram://user?username=arashyt', icon: '📸', color: '#E1306C' },
  { name: 'X', url: 'https://x.com/arashyt', appUrl: 'twitter://user?screen_name=arashyt', icon: '🐦', color: '#1DA1F2' },
];

export default function SocialLinks() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="social-links-container">
      <h2>Connect With Me</h2>
      <div className="social-grid">
        {socials.map((s) => (
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
