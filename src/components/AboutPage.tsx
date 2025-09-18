import type { LanguageKey, PageKey } from "../App";
import AboutHero from "./AboutHero";
import OriginStory from "./OriginStory";
import Timeline from "./Timeline";
import TeamShowcase from "./TeamShowcase";
import Values from "./Values";

type AboutPageProps = {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
};

export default function AboutPage(_props: AboutPageProps) {
  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      <AboutHero />
      <OriginStory />
      <Timeline />
      <TeamShowcase />
      <Values />
    </div>
  );
}
