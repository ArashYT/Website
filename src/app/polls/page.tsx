'use client';
import React, { useState, useEffect } from 'react';

export default function PollsPage() {
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [pollData, setPollData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/polls')
      .then(res => res.json())
      .then(data => setPollData(data));
  }, []);

  const handleVote = async (id: number) => {
    if (votedFor) return;
    setVotedFor(id);
    
    const res = await fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId: id })
    });
    const data = await res.json();
    if (data.success) {
      setPollData(data.polls);
    }
  };

  if (!pollData) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading poll data...</div>;
  }

  const totalVotes = pollData.options.reduce((a: any, b: any) => a + b.votes, 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', textAlign: 'center', color: 'var(--accent)', marginBottom: '1rem' }}>Community Polls</h1>
      <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '3rem' }}>Have your voice heard! Vote on stream decisions.</p>

      <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🔥 {pollData.question}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pollData.options.map((opt: any) => {
            const isVoted = votedFor === opt.id;
            const percentage = Math.round((opt.votes / (totalVotes || 1)) * 100);

            return (
              <button 
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                disabled={votedFor !== null}
                style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  border: isVoted ? '2px solid var(--accent)' : '2px solid transparent',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: votedFor ? 'default' : 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
              >
                {/* Progress bar background if voted */}
                {votedFor && (
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, height: '100%', 
                    width: `${percentage}%`, 
                    background: 'var(--accent-glow)', 
                    zIndex: 0 
                  }} />
                )}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{opt.text}</span>
                  {votedFor && <span>{percentage}%</span>}
                </div>
              </button>
            )
          })}
        </div>
        {votedFor && <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--accent)' }}>Thanks for voting! ({totalVotes} total votes)</p>}
      </div>
    </div>
  );
}
