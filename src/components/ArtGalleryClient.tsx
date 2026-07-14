'use client';
import React, { useState, useEffect } from 'react';

interface ArtGalleryClientProps {
  fanArts: string[];
}

export default function ArtGalleryClient({ fanArts }: ArtGalleryClientProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => {
    setSelectedIdx(idx);
    document.body.style.overflow = 'hidden'; // Disable scroll on body
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
    document.body.style.overflow = ''; // Re-enable scroll
  };

  const showNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx + 1) % fanArts.length);
  };

  const showPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx - 1 + fanArts.length) % fanArts.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  return (
    <div>
      {/* Masonry Columns Grid */}
      <div style={{ 
        columnCount: 3, 
        columnGap: '1.5rem', 
        width: '100%' 
      }} className="art-grid">
        {fanArts.map((img, i) => (
          <div 
            key={i} 
            className="glass reveal" 
            onClick={() => openLightbox(i)}
            style={{ 
              marginBottom: '1.5rem', 
              breakInside: 'avoid', 
              overflow: 'hidden', 
              borderRadius: '16px', 
              padding: '0.6rem',
              cursor: 'pointer',
              transition: 'transform 0.3s, border-color 0.3s'
            }}
          >
            <div style={{ overflow: 'hidden', borderRadius: '10px' }}>
              <img 
                src={img} 
                alt={`Fan Art ${i + 1}`} 
                style={{ 
                  width: '100%', 
                  display: 'block',
                  transition: 'transform 0.5s ease'
                }} 
                className="art-img"
              />
            </div>
            <p style={{ padding: '0.75rem 0.5rem 0.25rem 0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', margin: 0, opacity: 0.9 }}>
              By Anonymous Fan #{i + 1}
            </p>
          </div>
        ))}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {selectedIdx !== null && (
        <div 
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease forwards'
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
            title="Close (Esc)"
          >
            ✕
          </button>

          {/* Left Arrow */}
          <button
            onClick={showPrev}
            style={{
              position: 'absolute',
              left: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
            title="Previous (Left Arrow)"
          >
            ‹
          </button>

          {/* Image Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '85%', 
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <img 
              src={fanArts[selectedIdx]} 
              alt="Fan Art Full View" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}
            />
            <p style={{ color: 'white', marginTop: '1rem', fontWeight: 'bold', fontSize: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Anonymous Fan #{selectedIdx + 1} ({selectedIdx + 1} / {fanArts.length})
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={showNext}
            style={{
              position: 'absolute',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
            title="Next (Right Arrow)"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
