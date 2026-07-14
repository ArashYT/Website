import React from 'react';
import GearPageClient from '@/components/GearPageClient';

export const metadata = {
  title: 'My Gear | Arash',
  description: 'Check out the gear I use to stream and make videos!',
};

export default function GearPage() {
  return (
    <div className="gear-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>My Setup & Gear</h1>
      <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '2.5rem' }}>Everything I use to power the streams and create content.</p>

      <GearPageClient />
    </div>
  );
}
