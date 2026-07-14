'use client';
import React, { useEffect, useState } from 'react';

export default function ScrollEnhancements() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll Progress and Back-to-Top Button logic
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for Scroll Reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Initial observe
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    // MutationObserver to watch for dynamic page updates (e.g. client side navigation changes)
    const mutationObserver = new MutationObserver(() => {
      const unrevealed = document.querySelectorAll('.reveal:not(.revealed)');
      unrevealed.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll Progress Bar at the top */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, var(--accent) 0%, #ff4655 100%)',
          boxShadow: '0 1px 10px var(--accent-glow)',
          zIndex: 99999,
          pointerEvents: 'none',
          transition: 'width 0.1s ease-out'
        }}
      />

      {/* Floating Back-to-Top Button */}
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          zIndex: 9998,
          background: 'rgba(20, 20, 20, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--card-border)',
          borderRadius: '50%',
          width: '46px',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.1rem',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          opacity: showBackToTop ? 1 : 0,
          transform: showBackToTop ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
          pointerEvents: showBackToTop ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s',
          outline: 'none'
        }}
        className="back-to-top-btn"
        title="Scroll to Top"
      >
        ▲
      </button>
    </>
  );
}
