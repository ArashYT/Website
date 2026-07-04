import SocialLinks from "@/components/SocialLinks";
import Link from "next/link";

export default function LinksPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(90deg, var(--foreground), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Arash</h1>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Connect with me everywhere</p>
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
