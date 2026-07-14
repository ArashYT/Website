'use client';
import React, { useState } from 'react';
import { useToast } from './Toast';

interface MinecraftStatusProps {
  serverIp?: string;
}

export default function MinecraftStatus({ serverIp = 'mc.arashyt.ca' }: MinecraftStatusProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const serverIP = serverIp;

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    showToast('Minecraft Server IP copied to clipboard! 🎮', 'success');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
        <span>🟩</span> Community Server
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
        {/* Status Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Status</span>
          <span style={{ 
            background: 'rgba(46, 213, 115, 0.1)', 
            border: '1px solid #2ed573', 
            color: '#2ed573',
            fontSize: '0.8rem',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ed573', display: 'inline-block' }}></span>
            Online
          </span>
        </div>

        {/* Player Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Active Players</span>
          <span style={{ opacity: 0.8, fontSize: '0.95rem', fontWeight: 'bold' }}>42 / 100</span>
        </div>

        {/* IP Address Card */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '12px', 
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.25rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Server Address</span>
            <span style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent)' }}>{serverIP}</span>
          </div>
          <button 
            onClick={handleCopy}
            style={{
              background: copied ? '#2ed573' : 'rgba(255,255,255,0.05)',
              border: copied ? '1px solid #2ed573' : '1px solid var(--card-border)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {copied ? 'Copied! ✓' : 'Copy IP 📋'}
          </button>
        </div>
      </div>
    </div>
  );
}
