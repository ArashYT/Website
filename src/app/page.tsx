import LatestVideo from "@/components/LatestVideo";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import TopClips from "@/components/TopClips";
import RandomClip from "@/components/RandomClip";
import TweetEmbed from "@/components/TweetEmbed";

export default function Home() {
  return (
    <div className="home-container">
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
