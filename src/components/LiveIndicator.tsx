'use client';
import React, { useEffect, useState } from 'react';

export default function LiveIndicator() {
  const [isLive, setIsLive] = useState(false);
  
  useEffect(() => {
    fetch('/api/twitch')
      .then(res => res.json())
      .then(data => {
        setIsLive(data.isLive);
      })
      .catch(err => console.error("Failed to fetch live status:", err));
  }, []);

  if (!isLive) return null;

  return (
    <div className="live-banner glass live-indicator">
      <div className="pulse-dot"></div>
      <span className="live-text">Arash is LIVE right now!</span>
      <a href="https://twitch.tv/ArashLIVE" target="_blank" rel="noreferrer" className="watch-btn">
        Watch Now
      </a>
    </div>
  );
}
