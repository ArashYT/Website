'use client';
import React, { useEffect, useState, useRef } from 'react';

export default function LatestVideo() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [twitchScriptLoaded, setTwitchScriptLoaded] = useState(false);
  const [hostname, setHostname] = useState('localhost');

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname);
    }
  }, []);

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

  useEffect(() => {
    if (!isLive) return;

    const checkTwitch = () => {
      if ((window as any).Twitch) {
        setTwitchScriptLoaded(true);
        return true;
      }
      return false;
    };

    if (checkTwitch()) return;

    // Check if script is already in document
    let script = document.querySelector('script[src="https://embed.twitch.tv/embed/v1.js"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://embed.twitch.tv/embed/v1.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      setTwitchScriptLoaded(true);
    };

    script.addEventListener('load', handleLoad);
    
    const interval = setInterval(() => {
      if (checkTwitch()) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      script.removeEventListener('load', handleLoad);
      clearInterval(interval);
    };
  }, [isLive]);

  useEffect(() => {
    if (!isLive || !twitchScriptLoaded || !containerRef.current) return;

    if (playerRef.current) return;

    const Twitch = (window as any).Twitch;
    if (!Twitch || !Twitch.Player) return;

    containerRef.current.innerHTML = '';

    const parents = ['localhost', 'arashyt.ca', '8135f22a.arashyt-ca.pages.dev'];
    if (hostname && !parents.includes(hostname)) {
      parents.push(hostname);
    }

    const player = new Twitch.Player(containerRef.current, {
      channel: 'ArashLIVE',
      width: '100%',
      height: '100%',
      autoplay: true,
      muted: false,
      parent: parents,
    });

    playerRef.current = player;

    player.addEventListener(Twitch.Player.READY, () => {
      try {
        const qualities = player.getQualities();
        if (qualities && qualities.includes('chunked')) {
          player.setQuality('chunked');
        } else if (qualities && qualities.length > 0) {
          player.setQuality(qualities[0]);
        }
      } catch (err) {
        console.error('Failed to set Twitch video quality:', err);
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isLive, twitchScriptLoaded, hostname]);

  const parents = ['localhost', 'arashyt.ca', '8135f22a.arashyt-ca.pages.dev'];
  if (hostname && !parents.includes(hostname)) {
    parents.push(hostname);
  }
  const chatSrc = `https://www.twitch.tv/embed/ArashLIVE/chat?${parents.map(p => `parent=${p}`).join('&')}&darkpopout`;

  return (
    <div className={`latest-video-container ${isLive ? 'is-live' : ''}`}>
      <h2>{isLive ? '🔴 Live on Twitch' : 'Latest Video'}</h2>
      
      {isLive ? (
        <div className="twitch-container">
          <div ref={containerRef} className="video-player glass">
            {!twitchScriptLoaded && <p style={{ padding: '2rem' }}>Loading Twitch Stream...</p>}
          </div>
          <div className="twitch-chat glass">
            <iframe
              id="twitch-chat-embed"
              src={chatSrc}
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
