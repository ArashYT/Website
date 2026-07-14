import LatestVideo from "@/components/LatestVideo";
import SocialLinks from "@/components/SocialLinks";
import TopClips from "@/components/TopClips";
import TweetEmbed from "@/components/TweetEmbed";
import ValorantStats from "@/components/ValorantStats";

export default function Home() {
  return (
    <div className="home-container">
      {/* 1. Full-width Twitch Stream / Latest Video Section */}
      <LatestVideo />

      {/* 2. Balanced Two-Column Dashboard Grid */}
      <div className="home-dashboard-grid">
        {/* Column 1: Twitter Feed */}
        <div className="dashboard-column">
          <TweetEmbed />
        </div>

        {/* Column 2: Stats & Socials */}
        <div className="dashboard-column">
          <ValorantStats />
          <SocialLinks />
        </div>
      </div>

      {/* 3. Popular Clips Section */}
      <TopClips />
    </div>
  );
}
