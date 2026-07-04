'use client';
import React, { useEffect, useState } from 'react';

export default function TopClips() {
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/twitch')
      .then(res => res.json())
      .then(data => {
        setClips(data.clips || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch clips", err);
        setLoading(false);
      });
  }, []);

  if (loading || clips.length === 0) return null;

  return (
    <div className="top-clips-container" style={{ marginTop: '3rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--card-border)', paddingBottom: '0.5rem' }}>Top Clips This Week</h2>
      <div className="clips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {clips.map(clip => (
          <a key={clip.id} href={clip.url} target="_blank" rel="noreferrer" className="clip-card glass" style={{ padding: '1rem', textAlign: 'center', textDecoration: 'none', color: 'var(--foreground)' }}>
            <div style={{ aspectRatio: '16/9', background: `url(${clip.thumbnail_url}) center/cover`, borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '50%' }}>
                <span style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>▶</span>
              </div>
            </div>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clip.title}</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{clip.view_count} views</p>
          </a>
        ))}
      </div>
    </div>
  );
}
