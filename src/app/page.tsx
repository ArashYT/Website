import LiveIndicator from "@/components/LiveIndicator";
import LatestVideo from "@/components/LatestVideo";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import TopClips from "@/components/TopClips";

export default function Home() {
  return (
    <div className="home-container">
      <LiveIndicator />
      
      <section className="hero-section">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
          alt="Arash Banner" 
          style={{ width: '100%', maxWidth: '800px', borderRadius: '16px', margin: '0 auto 2rem auto', border: '2px solid var(--card-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        />
        <h2>Welcome to the Channel</h2>
        <p>Your hub for the latest streams, videos, and social updates.</p>
      </section>

      <div className="content-grid">
        <LatestVideo />
        <SocialLinks />
      </div>

      <TopClips />
      
      <ContactForm />
    </div>
  );
}
