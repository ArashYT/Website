'use client';
import React, { useEffect, useState } from 'react';

export default function LatestVideo() {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/youtube')
      .then(res => res.json())
      .then(data => {
        if (data.video && data.video.id && data.video.id.videoId) {
          setVideoId(data.video.id.videoId);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="latest-video-container">
      <h2>Latest Video</h2>
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
            <p>Loading latest video...</p>
          </div>
        )}
      </div>
    </div>
  );
}
