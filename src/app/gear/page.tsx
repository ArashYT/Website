import React from 'react';

export const metadata = {
  title: 'My Gear | Arash',
  description: 'Check out the gear I use to stream and make videos!',
};

const pcSpecs = [
  { name: 'CPU', value: 'Intel Core i7-13700KF (16 Cores)', search: 'Intel Core i7-13700KF' },
  { name: 'GPU', value: 'NVIDIA GeForce RTX 4060 Ti (8GB)', search: 'NVIDIA GeForce RTX 4060 Ti' },
  { name: 'Memory', value: '32GB DDR5 RAM', search: '32GB DDR5 RAM' },
  { name: 'Storage', value: '1TB WD_BLACK SN850X NVMe SSD', search: 'WD_BLACK SN850X 1TB' },
  { name: 'OS', value: 'Windows 11 Pro', search: 'Windows 11 Pro' },
];

const peripherals = [
  { name: 'Microphone', value: 'Blue Yeti Blackout Edition', search: 'Blue Yeti Blackout Edition' },
  { name: 'Monitor', value: 'ASUS VG248', search: 'ASUS VG248 Monitor' },
  { name: 'Camera', value: 'Elgato Facecam 2 (or iPhone 15 Pro Max)', search: 'Elgato Facecam 2' },
  { name: 'Headset', value: 'HyperX Cloud III Wireless', search: 'HyperX Cloud III Wireless Headset' },
  { name: 'Capture Card', value: 'Elgato HD60 S', search: 'Elgato HD60 S Capture Card' },
  { name: 'Mouse', value: 'Razer DeathAdder V2 Pro', search: 'Razer DeathAdder V2 Pro Mouse' },
  { name: 'Keyboard', value: 'Lofree Flow', search: 'Lofree Flow Keyboard' },
  { name: 'Stream Deck', value: 'Elgato Stream Deck Mini', search: 'Elgato Stream Deck Mini' },
  { name: 'Controller', value: '8BitDo Ultimate Controller (Switch)', search: '8BitDo Ultimate Controller Switch' },
];

export default function GearPage() {
  return (
    <div className="gear-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', color: 'var(--accent)' }}>My Setup & Gear</h1>
      <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '3rem' }}>Everything I use to power the streams and create content.</p>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--card-border)', paddingBottom: '0.5rem' }}>🖥️ Gaming PC Specs</h2>
      <div className="gear-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {pcSpecs.map((spec, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{spec.name}</p>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{spec.value}</h3>
            </div>
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(spec.search)}`} 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', textAlign: 'center', textDecoration: 'none', color: 'var(--foreground)', fontSize: '0.9rem', border: '1px solid var(--card-border)' }}
            >
              🔍 Look Up Product
            </a>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--card-border)', paddingBottom: '0.5rem' }}>🎧 Stream Peripherals</h2>
      <div className="gear-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {peripherals.map((item, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.name}</p>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{item.value}</h3>
            </div>
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(item.search)}`} 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', textAlign: 'center', textDecoration: 'none', color: 'var(--foreground)', fontSize: '0.9rem', border: '1px solid var(--card-border)' }}
            >
              🔍 Look Up Product
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
