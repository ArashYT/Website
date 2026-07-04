import React from 'react';

export const metadata = {
  title: 'Series & Playlists | Arash',
};

const series = [
  {
    title: '🔥 Valorant Comp Grind',
    videos: [
      { id: 'dQw4w9WgXcQ', title: 'Radiant Push Ep 1', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
      { id: 'dQw4w9WgXcQ', title: 'Radiant Push Ep 2', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
      { id: 'dQw4w9WgXcQ', title: 'Radiant Push Ep 3', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
      { id: 'dQw4w9WgXcQ', title: 'Radiant Push Ep 4', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
    ]
  },
  {
    title: '⛏️ Minecraft Hardcore',
    videos: [
      { id: 'dQw4w9WgXcQ', title: 'Day 1 - 10', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
      { id: 'dQw4w9WgXcQ', title: 'Day 10 - 50', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
      { id: 'dQw4w9WgXcQ', title: 'Day 50 - 100', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
    ]
  }
];

export default function SeriesPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', overflow: 'hidden' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}>Binge the Series</h1>
      <p style={{ opacity: 0.8, marginBottom: '3rem' }}>Catch up on all the major playthroughs and montages.</p>

      {series.map((s, idx) => (
        <div key={idx} style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{s.title}</h2>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollBehavior: 'smooth' }}>
            {s.videos.map((v, i) => (
              <a key={i} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="glass" style={{ minWidth: '300px', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s', display: 'block' }}>
                <div style={{ width: '100%', height: '170px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{v.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
