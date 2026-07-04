import React, { Suspense } from 'react';
import ContactForm from './ClipsForm'; // We will extract the client component

export const metadata = {
  title: 'Submit a Clip | Arash',
};

export default function ClipsPage() {
  return (
    <div className="clips-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', color: 'var(--accent)' }}>Submit a Clip</h1>
      <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '2rem' }}>Caught a funny moment on stream? Submit it here for a chance to be featured on TikTok or YouTube Shorts!</p>
      
      <Suspense fallback={<div>Loading...</div>}>
        <ContactForm />
      </Suspense>
    </div>
  );
}
