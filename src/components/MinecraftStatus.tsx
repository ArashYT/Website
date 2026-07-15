'use client';
import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

interface MinecraftStatusProps {
  serverIp?: string;
}

interface ServerData {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  motd?: {
    html: string;
    clean: string;
  };
  version?: {
    name: string;
  };
}

export default function MinecraftStatus({ serverIp = 'mc.arashyt.ca' }: MinecraftStatusProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.mcstatus.io/v2/status/java/${serverIp}`)
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [serverIp]);

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    showToast('Minecraft Server IP copied to clipboard! 🎮', 'success');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', minHeight: '170px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ opacity: 0.6 }}>Loading server status...</span>
      </div>
    );
  }

  const isOnline = status ? status.online : false;

  return (
    <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
        <span>🟩</span> Community Server
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, justifyContent: 'center' }}>
        {/* Status Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Status</span>
          <span style={{ 
            background: isOnline ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 70, 85, 0.1)', 
            border: isOnline ? '1px solid #2ed573' : '1px solid #ff4655', 
            color: isOnline ? '#2ed573' : '#ff4655',
            fontSize: '0.8rem',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#2ed573' : '#ff4655', display: 'inline-block' }}></span>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Player Count */}
        {isOnline && status?.players && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Active Players</span>
            <span style={{ opacity: 0.8, fontSize: '0.95rem', fontWeight: 'bold' }}>
              {status.players.online} / {status.players.max}
            </span>
          </div>
        )}

        {/* Version */}
        {isOnline && status?.version?.name && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Version</span>
            <span style={{ opacity: 0.6, fontSize: '0.9rem', fontFamily: 'monospace' }}>
              {status.version.name}
            </span>
          </div>
        )}

        {/* Server MOTD Renders with Minecraft Colors */}
        {isOnline && status?.motd?.html && (
          <div 
            style={{ 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '8px', 
              padding: '0.6rem 0.8rem', 
              fontSize: '0.8rem', 
              lineHeight: '1.4', 
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'center'
            }} 
            dangerouslySetInnerHTML={{ __html: status.motd.html }} 
          />
        )}

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
            <span style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent)' }}>{serverIp}</span>
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
