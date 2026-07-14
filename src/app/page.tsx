import LiveIndicator from "@/components/LiveIndicator";
import LatestVideo from "@/components/LatestVideo";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import TopClips from "@/components/TopClips";
import RandomClip from "@/components/RandomClip";
import TweetEmbed from "@/components/TweetEmbed";

export default function Home() {
  return (
    <div className="home-container">
      <LiveIndicator />
      
      <section className="hero-section">
        <h2>Welcome to the Channel</h2>
        <p>Your hub for the latest streams, videos, and social updates.</p>
      </section>

      <div className="content-grid">
        <LatestVideo />
        <RandomClip />
        <TweetEmbed />
        <SocialLinks />
      </div>

      <TopClips />
      
      <ContactForm />
    </div>
  );
}
