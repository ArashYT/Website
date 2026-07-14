'use client';
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "🎥 How long have you been content creating?",
    answer: "I started making videos in 2021, and began live streaming regularly in 2023. It's been an incredible journey and I appreciate every single subscriber and viewer!"
  },
  {
    question: "🟩 What Minecraft version is the community server?",
    answer: "The server mc.arashyt.ca supports Java edition (latest version). It is running in Survival mode with custom quality-of-life plugins to make it fun for everyone."
  },
  {
    question: "🎨 Can I submit my fan art to be featured here?",
    answer: "Yes, absolutely! Join our Discord server and upload your artwork in the #fan-art channel. We periodically update the Fan Art page with new submissions."
  },
  {
    question: "🖥️ Where can I see your PC specs?",
    answer: "You can click on the 'Gear' tab in the top navigation menu to see a complete, categorised list of my gaming PC specs and peripherals!"
  }
];

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="glass reveal" style={{ padding: '1.5rem 2rem', borderRadius: '16px', marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '1.5rem', color: 'white', fontWeight: 'bold' }}>
        💬 Frequently Asked Questions
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {faqData.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              style={{
                borderBottom: '1px solid var(--card-border)',
                paddingBottom: '0.75rem'
              }}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleFAQ(idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  outline: 'none'
                }}
              >
                <span>{faq.question}</span>
                <span style={{ 
                  color: 'var(--accent)', 
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  fontSize: '1rem'
                }}>
                  ▼
                </span>
              </button>
              
              {/* Answer Content */}
              <div
                style={{
                  maxHeight: isOpen ? '120px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s',
                  opacity: isOpen ? 1 : 0
                }}
              >
                <p style={{ 
                  fontSize: '0.9rem', 
                  opacity: 0.8, 
                  lineHeight: '1.5',
                  margin: '0.5rem 0 0 0',
                  paddingLeft: '1.5rem'
                }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
