import React from 'react';

export const metadata = {
  title: 'Fan Art | Arash',
};

const fanArts = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
  'https://images.unsplash.com/photo-1560573934-08eb4cc2dfb5?w=400&q=80',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80',
  'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80',
  'https://images.unsplash.com/photo-1580227283626-d667c4587c6b?w=400&q=80',
];

export default function ArtGallery() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', textAlign: 'center', color: 'var(--accent)', marginBottom: '1rem' }}>🎨 Fan Art Gallery</h1>
      <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '3rem' }}>You guys are incredibly talented. Submit art in the Discord to be featured!</p>

      <div style={{ columnCount: 3, columnGap: '1.5rem', width: '100%' }}>
        {fanArts.map((img, i) => (
          <div key={i} className="glass" style={{ marginBottom: '1.5rem', breakInside: 'avoid', overflow: 'hidden', borderRadius: '12px', padding: '0.5rem' }}>
            <img src={img} alt={`Fan Art ${i}`} style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
            <p style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>By Anonymous Fan</p>
          </div>
        ))}
      </div>
    </div>
  );
}
