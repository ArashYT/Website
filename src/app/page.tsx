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
      <div className="content-grid">
        {/* Left Column (Main Feed) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <LatestVideo />
          <TweetEmbed />
        </div>

        {/* Right Column (Dashboard widgets) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <StreamSchedule />
          <ValorantStats />
          <MinecraftStatus />
          <Soundboard />
          <RandomClip />
          <SocialLinks />
        </div>
      </div>

      <TopClips />
      
      <ContactForm />
    </div>
  );
}
