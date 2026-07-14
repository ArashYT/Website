'use client';
import React, { useEffect } from 'react';

interface AdUnitProps {
  publisherId: string;
  adSlotId: string;
}

export default function AdUnit({ publisherId, adSlotId }: AdUnitProps) {
  useEffect(() => {
    try {
      // Initialize the ad push context
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense failed to push ad context:', e);
    }
  }, []);

  if (!publisherId || !adSlotId) {
    return null;
  }

  return (
    <div 
      className="glass reveal" 
      style={{ 
        padding: '1.2rem', 
        borderRadius: '16px', 
        textAlign: 'center', 
        margin: '1.5rem 0',
        overflow: 'hidden',
        border: '1px solid var(--card-border)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}
    >
      <span 
        style={{ 
          fontSize: '0.65rem', 
          opacity: 0.4, 
          display: 'block', 
          marginBottom: '10px', 
          textTransform: 'uppercase', 
          letterSpacing: '1px',
          fontWeight: 'bold'
        }}
      >
        Sponsored Advertisement
      </span>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
