import SocialLinks from "@/components/SocialLinks";
import Link from "next/link";

export default function LinksPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(90deg, var(--foreground), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ArashYT</h1>
        <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Content Creator | Streamer | Gamer</p>
      </div>
      
      <SocialLinks />

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>
          &larr; Back to Main Website
        </Link>
      </div>
    </div>
  );
}
