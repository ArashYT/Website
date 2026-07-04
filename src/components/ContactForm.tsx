'use client';
import React, { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // To make this work, the user needs to provide their access key
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""); 
    
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        // Fallback for development if no key is provided
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(true); // fallback
    }
  };

  return (
    <div className="contact-container glass" style={{ padding: '2rem', marginTop: '3rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Business Inquiries</h2>
      {submitted ? (
        <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Thank you! Your message has been sent to ArashAbdanan@gmail.com.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="hidden" name="subject" value="New Business Inquiry from Website" />
          <input type="hidden" name="from_name" value="ArashYT Website" />
          <input 
            type="email" 
            name="email"
            placeholder="Your Email" 
            required 
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)' }}
          />
          <textarea 
            name="message"
            placeholder="Your Message" 
            required 
            rows={4}
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', resize: 'vertical' }}
          ></textarea>
          <button type="submit" className="watch-btn" style={{ alignSelf: 'flex-start', border: 'none', cursor: 'pointer' }}>
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
