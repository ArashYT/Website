'use client';
import React, { useState } from 'react';

interface GearItem {
  name: string;
  value: string;
  search: string;
  category: 'pc' | 'peripherals';
  image?: string;
}

const gearItems: GearItem[] = [
  // PC Specs
  { name: 'CPU', value: 'Intel Core i7-13700KF (16 Cores)', search: 'Intel Core i7-13700KF', category: 'pc', image: '/images/gear/cpu.png' },
  { name: 'GPU', value: 'NVIDIA GeForce RTX 4060 Ti (8GB)', search: 'NVIDIA GeForce RTX 4060 Ti', category: 'pc', image: '/images/gear/gpu.png' },
  { name: 'Memory', value: '32GB DDR5 RAM', search: '32GB DDR5 RAM', category: 'pc', image: '/images/gear/ram.png' },
  { name: 'Storage', value: '1TB WD_BLACK SN850X NVMe SSD', search: 'WD_BLACK SN850X 1TB', category: 'pc', image: '/images/gear/ssd.png' },
  { name: 'OS', value: 'Windows 11 Pro', search: 'Windows 11 Pro', category: 'pc', image: '/images/gear/os.png' },
  // Peripherals
  { name: 'Microphone', value: 'Blue Yeti Blackout Edition', search: 'Blue Yeti Blackout Edition', category: 'peripherals', image: '/images/gear/microphone.png' },
  { name: 'Monitor', value: 'ASUS VG248', search: 'ASUS VG248 Monitor', category: 'peripherals', image: '/images/gear/monitor.png' },
  { name: 'Camera', value: 'Elgato Facecam 2 (or iPhone 15 Pro Max)', search: 'Elgato Facecam 2', category: 'peripherals', image: '/images/gear/camera.png' },
  { name: 'Headset', value: 'HyperX Cloud III Wireless', search: 'HyperX Cloud III Wireless Headset', category: 'peripherals', image: '/images/gear/headset.png' },
  { name: 'Capture Card', value: 'Elgato HD60 S', search: 'Elgato HD60 S Capture Card', category: 'peripherals', image: '/images/gear/capturecard.png' },
  { name: 'Mouse', value: 'Razer DeathAdder V2 Pro', search: 'Razer DeathAdder V2 Pro Mouse', category: 'peripherals', image: '/images/gear/mouse.png' },
  { name: 'Keyboard', value: 'Lofree Flow', search: 'Lofree Flow Keyboard', category: 'peripherals', image: '/images/gear/keyboard.png' },
  { name: 'Stream Deck', value: 'Elgato Stream Deck Mini', search: 'Elgato Stream Deck Mini', category: 'peripherals', image: '/images/gear/streamdeck.png' },
  { name: 'Controller', value: '8BitDo Ultimate Controller (Switch)', search: '8BitDo Ultimate Controller Switch', category: 'peripherals', image: '/images/gear/controller.png' },
];

export default function GearPageClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'pc' | 'peripherals'>('all');

  const filteredItems = gearItems.filter(item => 
    activeTab === 'all' || item.category === activeTab
  );

  return (
    <div>
      {/* Tab Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        marginBottom: '2.5rem' 
      }}>
        {(['all', 'pc', 'peripherals'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '24px',
              border: activeTab === tab ? '1px solid var(--accent)' : '1px solid var(--card-border)',
              background: activeTab === tab ? 'var(--accent)' : 'rgba(255,255,255,0.02)',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'capitalize',
              boxShadow: activeTab === tab ? '0 4px 15px var(--accent-glow)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {tab === 'all' ? '👀 Show All' : tab === 'pc' ? '🖥️ Gaming PC' : '🎧 Peripherals'}
          </button>
        ))}
      </div>

      {/* Dynamic Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '1.25rem',
          minHeight: '300px'
        }}
      >
        {filteredItems.map((item, i) => (
          <a 
            key={i} 
            href={`https://www.google.com/search?q=${encodeURIComponent(item.search)}`} 
            target="_blank" 
            rel="noreferrer"
            className="glass reveal gear-card" 
            style={{ 
              padding: '1rem', 
              borderRadius: '16px', 
              display: 'flex', 
              flexDirection: 'column', 
              textDecoration: 'none',
              color: 'white',
              position: 'relative',
              animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: `${i * 0.03}s`
            }}
          >
            {/* Product Image Frame */}
            {item.image && (
              <div style={{
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.12)',
                border: '1px solid var(--card-border)'
              }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{
                    maxHeight: '135px',
                    maxWidth: '90%',
                    objectFit: 'contain',
                    mixBlendMode: 'screen',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                  className="gear-img"
                />
              </div>
            )}

            {/* Product Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: item.category === 'pc' ? '#1e90ff' : 'var(--accent)', 
                  fontWeight: 'bold', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px'
                }}>
                  {item.category === 'pc' ? '🖥️ Component' : '🎧 Peripheral'}
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>🔍</span>
              </div>
              
              <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold', marginTop: '4px' }}>
                {item.name}
              </span>
              
              <h3 style={{ 
                fontSize: '1rem', 
                margin: '2px 0 0 0', 
                fontWeight: 'bold',
                lineHeight: '1.3',
                flex: 1
              }}>
                {item.value}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
