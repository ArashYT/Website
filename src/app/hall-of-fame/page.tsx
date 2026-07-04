import React from 'react';

export const metadata = {
  title: 'Wall of Fame | Arash',
  description: 'Thank you to the biggest supporters!',
};

const topDonators = [
  { name: 'Ninja', amount: '$5,000', badge: '💎 MVP' },
  { name: 'Shroud', amount: '$2,500', badge: '🥇 1st Place' },
  { name: 'TimTheTatman', amount: '$1,000', badge: '🥈 2nd Place' },
  { name: 'DrDisrespect', amount: '$500', badge: '🥉 3rd Place' },
];

const topSubs = [
  { name: 'xQc', months: '48 Months', badge: '👑 Legend' },
  { name: 'Pokimane', months: '36 Months', badge: '🛡️ Veteran' },
  { name: 'Sykkuno', months: '24 Months', badge: '⚔️ Knight' },
  { name: 'Valkyrae', months: '12 Months', badge: '⭐ VIP' },
];

export default function HallOfFame() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', textAlign: 'center', color: 'var(--accent)', marginBottom: '1rem', textShadow: '0 0 20px var(--accent-glow)' }}>The Wall of Fame</h1>
      <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '3rem', fontSize: '1.1rem' }}>A massive thank you to everyone who supports the stream. You make this possible!</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Donators */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--card-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            💸 Top Donators
          </h2>
          <ul style={{ listStyle: 'none' }}>
            {topDonators.map((d, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{i+1}. {d.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: '900', fontSize: '1.1rem', display: 'block' }}>{d.amount}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{d.badge}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Subs */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--card-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            💜 Longest Subs
          </h2>
          <ul style={{ listStyle: 'none' }}>
            {topSubs.map((s, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{i+1}. {s.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#9b59b6', fontWeight: '900', fontSize: '1.1rem', display: 'block' }}>{s.months}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{s.badge}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
