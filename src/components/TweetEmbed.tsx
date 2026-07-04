'use client';
import React, { useEffect } from 'react';

export default function TweetEmbed() {
  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: '16px', height: '600px', overflowY: 'auto' }}>
      <h2>🐦 Latest Tweets</h2>
      <a 
        className="twitter-timeline" 
        data-theme="dark"
        data-height="500"
        href="https://twitter.com/arashyt?ref_src=twsrc%5Etfw"
      >
        Tweets by arashyt
      </a>
    </div>
  );
}
