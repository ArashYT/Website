'use client';
import React, { useEffect, useState } from 'react';

interface MockTweet {
  id: number;
  date: string;
  content: string;
  likes: string;
  retweets: string;
  replies: string;
}

const fallbackTweets: MockTweet[] = [
  {
    id: 1,
    date: '2h',
    content: 'Valorant stream is LIVE! Playing ranked matches with viewers. Come hang out and say hi! 🎮🔥\n\nWatch here: twitch.tv/ArashLIVE',
    likes: '142',
    retweets: '24',
    replies: '18'
  },
  {
    id: 2,
    date: '1d',
    content: 'New video just dropped! We spent 100 days in a custom Hardcore Minecraft Apocalypse world... and you won\'t believe how it ended! ☠️🌲\n\nCheck it out on my channel!',
    likes: '289',
    retweets: '45',
    replies: '32'
  },
  {
    id: 3,
    date: '3d',
    content: 'Setup upgrades arrived! Got the new camera and a stream deck mini. Stream quality is about to go through the roof! 🎙️✨\n\nLet me know what you guys think of the specs on the Gear page.',
    likes: '356',
    retweets: '18',
    replies: '27'
  }
];

export default function TweetEmbed() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [likesState, setLikesState] = useState<{ [key: number]: { count: number; active: boolean } }>({
    1: { count: 142, active: false },
    2: { count: 289, active: false },
    3: { count: 356, active: false }
  });

  useEffect(() => {
    // Attempt to load Twitter widgets
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    
    script.onerror = () => {
      setIsBlocked(true);
    };

    document.body.appendChild(script);

    // Timeout check: if Twitter timeline iframe isn't rendered after 3 seconds, trigger fallback
    const checkTimer = setTimeout(() => {
      const renderedTimeline = document.querySelector('.twitter-timeline-rendered');
      if (!renderedTimeline) {
        setIsBlocked(true);
      }
    }, 3000);

    return () => {
      clearTimeout(checkTimer);
    };
  }, []);

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikesState(prev => {
      const current = prev[id];
      const active = !current.active;
      const count = active ? current.count + 1 : current.count - 1;
      return {
        ...prev,
        [id]: { count, active }
      };
    });
  };

  const handleTweetClick = () => {
    window.open('https://x.com/arashyt', '_blank', 'noreferrer');
  };

  if (isBlocked) {
    return (
      <div className="tweet-embed-container glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', height: '600px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🐦</span> Latest Updates
          </h2>
          <span style={{ fontSize: '0.8rem', opacity: 0.5, background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
            Live Feed
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {fallbackTweets.map((tweet) => {
            const hasLiked = likesState[tweet.id]?.active;
            const likesCount = likesState[tweet.id]?.count;

            return (
              <div 
                key={tweet.id} 
                onClick={handleTweetClick}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--card-border)', 
                  borderRadius: '12px', 
                  padding: '1rem', 
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                className="tweet-card-fallback"
              >
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {/* Mock Avatar */}
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'var(--accent)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    A
                  </div>
                  {/* Tweet Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Arash</span>
                      <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>✓</span>
                      <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>@ArashYT</span>
                      <span style={{ opacity: 0.3, fontSize: '0.85rem' }}>•</span>
                      <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>{tweet.date}</span>
                    </div>
                    
                    <p style={{ 
                      fontSize: '0.9rem', 
                      lineHeight: '1.4', 
                      margin: '0.5rem 0', 
                      whiteSpace: 'pre-line',
                      opacity: 0.9 
                    }}>
                      {tweet.content}
                    </p>

                    {/* Interactive Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      maxWidth: '250px', 
                      marginTop: '0.75rem',
                      opacity: 0.6,
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }} className="action-reply">
                        💬 {tweet.replies}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }} className="action-retweet">
                        🔁 {tweet.retweets}
                      </span>
                      <span 
                        onClick={(e) => handleLike(tweet.id, e)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          cursor: 'pointer', 
                          transition: 'color 0.2s, transform 0.1s',
                          color: hasLiked ? '#FF2255' : 'inherit',
                          fontWeight: hasLiked ? 'bold' : 'normal'
                        }} 
                        className="action-like"
                      >
                        ❤️ {likesCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="tweet-embed-container glass reveal" style={{ padding: '2rem', borderRadius: '16px', height: '600px', overflowY: 'auto' }}>
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
