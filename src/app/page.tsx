import LatestVideo from "@/components/LatestVideo";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import TopClips from "@/components/TopClips";
import RandomClip from "@/components/RandomClip";
import TweetEmbed from "@/components/TweetEmbed";
import ValorantStats from "@/components/ValorantStats";
import MinecraftStatus from "@/components/MinecraftStatus";

export default function Home() {
  return (
    <div className="home-container">
      {/* 1. Full-width Twitch Stream / Latest Video Section */}
      <LatestVideo />

      {/* 2. Balanced Two-Column Dashboard Grid */}
      <div className="home-dashboard-grid">
        {/* Column 1: Twitter & MC Server */}
        <div className="dashboard-column">
          <TweetEmbed />
          <MinecraftStatus />
        </div>

        {/* Column 2: Stats, Clips & Socials */}
        <div className="dashboard-column">
          <ValorantStats />
          <RandomClip />
          <SocialLinks />
        </div>
      </div>

      {/* 3. Popular Clips Section */}
      <TopClips />

      {/* 4. Business Contact Form (Full Width) */}
      <ContactForm />
    </div>
  );
}
