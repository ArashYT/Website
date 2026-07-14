'use client';
import React, { useState } from 'react';
import { useToast } from './Toast';

interface SoundItem {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  type: 'gg' | 'zap' | 'powerup' | 'bass' | 'sweep' | 'buzzer';
}

const sounds: SoundItem[] = [
  { id: '1', name: 'GG Ding', emoji: '🔔', desc: 'Standard victory chime', type: 'gg' },
  { id: '2', name: 'Laser Zap', emoji: '⚡', desc: 'Arcade laser shoot', type: 'zap' },
  { id: '3', name: 'Power Up', emoji: '🚀', desc: '8-bit retro powerup', type: 'powerup' },
  { id: '4', name: 'Bass Drop', emoji: '🔊', desc: 'Deep subwoofer drop', type: 'bass' },
  { id: '5', name: 'Success Sweep', emoji: '🏆', desc: 'Level up success sweep', type: 'sweep' },
  { id: '6', name: 'Fail Buzzer', emoji: '🚨', desc: 'Funny buzzer fail tone', type: 'buzzer' },
];

export default function Soundboard() {
  const { showToast } = useToast();
  const [volume, setVolume] = useState(0.3); // 30% default volume
  const [playingId, setPlayingId] = useState<string | null>(null);

  const playSynthesizedSound = (type: string, id: string) => {
    if (typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Set volume
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 3000);

      const now = ctx.currentTime;

      switch (type) {
        case 'gg': // Ding chime
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.setValueAtTime(880, now + 0.1); // A5
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
          break;

        case 'zap': // Laser sweep
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
          break;

        case 'powerup': // Ascending arpeggio
          osc.type = 'triangle';
          const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
          notes.forEach((freq, idx) => {
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          });
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.45);
          break;

        case 'bass': // Sub drop
          osc.type = 'sine';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.exponentialRampToValueAtTime(25, now + 0.8);
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
          osc.start(now);
          osc.stop(now + 0.9);
          break;

        case 'sweep': // Level up arpeggio
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.5);
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
          break;

        case 'buzzer': // Fail buzzer
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, now);
          osc.frequency.setValueAtTime(125, now + 0.15);
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
          break;
      }
    } catch (e) {
      console.error('AudioContext synthesis failed', e);
      showToast('Audio synthesis failed in this browser.', 'error');
    }
  };

  return (
    <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🎵</span> Stream Soundboard
        </h2>
        
        {/* Volume Controller */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem' }}>🔊</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ 
              width: '70px', 
              accentColor: 'var(--accent)',
              cursor: 'pointer',
              height: '4px',
              borderRadius: '2px'
            }} 
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '0 0 1rem 0' }}>
        Click any effect below to play soundbytes synthesized directly in your browser.
      </p>

      {/* Grid of Sound Buttons */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '0.5rem' 
      }}>
        {sounds.map((sound) => {
          const isPlaying = playingId === sound.id;
          return (
            <button
              key={sound.id}
              onClick={() => playSynthesizedSound(sound.type, sound.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 0.5rem',
                background: isPlaying ? 'rgba(225, 48, 108, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: isPlaying ? '1px solid var(--accent)' : '1px solid var(--card-border)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              title={sound.desc}
              className="sound-button"
            >
              <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{sound.emoji}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{sound.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
