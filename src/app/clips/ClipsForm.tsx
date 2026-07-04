'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ClipsForm() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      setSuccess(true);
    }
  }, [searchParams]);

  if (success) {
    return (
      <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px' }}>
        <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Clip Submitted! 🎉</h2>
        <p>Thanks for the submission! It has been sent directly to the Discord server.</p>
        <button 
          onClick={() => setSuccess(false)}
          style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form className="glass" style={{ padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} method="POST" action="/api/submit-clip">
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Your Name (Optional)</label>
        <input name="username" type="text" placeholder="Twitch/Discord Username" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Clip URL *</label>
        <input name="url" type="url" required placeholder="https://clips.twitch.tv/..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Comment</label>
        <textarea name="comment" rows={3} placeholder="What happened in this clip?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', resize: 'vertical' }}></textarea>
      </div>
      <button type="submit" style={{ padding: '1rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
        Submit Clip
      </button>
    </form>
  );
}
