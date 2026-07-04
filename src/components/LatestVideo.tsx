'use client';
import React, { useEffect, useState } from 'react';

export default function LatestVideo() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if live on Twitch first
    fetch('/api/twitch')
      .then(res => res.json())
      .then(data => {
        if (data.isLive) {
          setIsLive(true);
          setLoading(false);
        } else {
          // If not live, fetch YouTube
          fetch('/api/youtube')
            .then(res => res.json())
            .then(ytData => {
              if (ytData.video?.id?.videoId) {
                setVideoId(ytData.video.id.videoId);
              }
              setLoading(false);
            })
            .catch(console.error);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="latest-video-container">
      <h2>{isLive ? '🔴 Live on Twitch' : 'Latest Video'}</h2>
      
      {isLive ? (
        <div className="twitch-container" style={{ display: 'flex', gap: '1rem', minHeight: '500px', flexWrap: 'wrap' }}>
          <div className="video-player glass" style={{ flex: '1 1 600px', padding: '0', overflow: 'hidden', minHeight: '300px' }}>
            <iframe
              src="https://player.twitch.tv/?channel=ArashLIVE&parent=arashyt.ca&parent=localhost&parent=8135f22a.arashyt-ca.pages.dev"
              frameBorder="0"
              allowFullScreen={true}
              scrolling="no"
              height="100%"
              width="100%">
            </iframe>
          </div>
          <div className="twitch-chat glass" style={{ flex: '1 1 300px', padding: '0', overflow: 'hidden', minHeight: '400px', maxWidth: '100%' }}>
            <iframe
              id="twitch-chat-embed"
              src="https://www.twitch.tv/embed/ArashLIVE/chat?parent=arashyt.ca&parent=localhost&parent=8135f22a.arashyt-ca.pages.dev&darkpopout"
              height="100%"
              width="100%">
            </iframe>
          </div>
        </div>
      ) : (
        <div className="video-player glass" style={{ padding: videoId ? '0' : '2rem', overflow: 'hidden' }}>
          {videoId ? (
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${videoId}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{ width: '100%', height: '100%', aspectRatio: '16/9' }}
            ></iframe>
          ) : (
            <div className="video-placeholder">
              <span className="play-icon">▶</span>
              <p>{loading ? 'Loading latest video...' : 'No video found.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
