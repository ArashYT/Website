import LatestVideo from "@/components/LatestVideo";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import TopClips from "@/components/TopClips";
import RandomClip from "@/components/RandomClip";
import TweetEmbed from "@/components/TweetEmbed";
import StreamSchedule from "@/components/StreamSchedule";
import ValorantStats from "@/components/ValorantStats";
import MinecraftStatus from "@/components/MinecraftStatus";
import Soundboard from "@/components/Soundboard";

export default function Home() {
  return (
    <div className="home-container">
      {/* 1. Full-width Twitch Stream / Latest Video Section */}
      <LatestVideo />

      {/* 2. Responsive Dashboard Grid */}
      <div className="home-dashboard-grid">
        {/* Column 1: Twitter & Contact */}
        <div className="dashboard-column">
          <TweetEmbed />
          <ContactForm />
        </div>

        {/* Column 2: Stream Info, MC Server & Soundboard */}
        <div className="dashboard-column">
          <StreamSchedule />
          <MinecraftStatus />
          <Soundboard />
        </div>

        {/* Column 3: Stats, Clips & Socials */}
        <div className="dashboard-column">
          <ValorantStats />
          <RandomClip />
          <SocialLinks />
        </div>
      </div>

      {/* 3. Popular Clips Section */}
      <TopClips />
    </div>
  );
}
