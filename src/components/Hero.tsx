import { useState, useEffect, useCallback } from "react";
import type { LanguageKey, PageKey } from "../App";
import { Button } from "./ui/button";
import AnimatedBackground from "./AnimatedBackground";
import { Zap, Heart, Star } from "lucide-react";
import SimpleEditable from "./SimpleEditable";
import AdminToggle from "./AdminToggle";
import HeroImageEditor from "./HeroImageEditor";
import { AdminService } from "../lib/adminService";

const copyMap: Record<LanguageKey, {
  headlineTop: string;
  headlineMid: string;
  headlineBottom: string;
  tagline: string;
  primaryCta: string;
  secondaryCta: string;
}> = {
  th: {
    headlineTop: "DADDY",
    headlineMid: "BATH BOMB",
    headlineBottom: "ฮีโร่อ่างอาบน้ำ",
    tagline: "สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ",
    primaryCta: "ช้อปบาธบอม",
    secondaryCta: "ดูเรื่องราวสีสัน",
  },
  en: {
    headlineTop: "DADDY",
    headlineMid: "BATH BOMB",
    headlineBottom: "Super Bath Adventures",
    tagline: "Super Fun. Super Fizzy. Super You.",
    primaryCta: "Shop Fun Bombs",
    secondaryCta: "Play in Colors",
  },
};

type HeroProps = {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
};

export default function Hero({ language, navigateTo }: HeroProps) {
  const copy = copyMap[language];
  const [heroContent, setHeroContent] = useState({
    hero_title: copy.headlineTop,
    hero_subtitle: copy.headlineMid,
    hero_tagline: copy.tagline,
    hero_description: copy.tagline,
    hero_character: '🦸‍♂️',
    hero_character_image: ''
  });

  const loadHeroContent = useCallback(async () => {
    try {
      const content = await AdminService.getContentBlocks();
      if (content) {
        setHeroContent(prev => ({
          ...prev,
          hero_title: content.hero_title || copy.headlineTop,
          hero_subtitle: content.hero_subtitle || copy.headlineMid,
          hero_tagline: content.hero_tagline || copy.tagline,
          hero_description: content.hero_description || copy.tagline,
          hero_character: content.hero_character || '🦸‍♂️',
          hero_character_image: content.hero_character_image || ''
        }));
      }
    } catch (error) {
      console.error("Error loading hero content:", error);
    }
  }, [copy]);

  useEffect(() => {
    loadHeroContent();
  }, [loadHeroContent]);

  const updateHeroContent = async (key: string, value: string) => {
    try {
      await AdminService.updateContentBlock(key, value);
      setHeroContent(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('히어로 콘텐츠 업데이트 실패:', error);
      throw error;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FF2D55] via-[#007AFF] to-[#FFD700] relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <AdminToggle>
              <SimpleEditable
                value={heroContent.hero_character}
                onSave={(value) => updateHeroContent('hero_character', value)}
                className="text-8xl mb-6 block"
              >
                <span className="text-8xl mb-6 block animate-bounce">
                  {heroContent.hero_character}
                </span>
              </SimpleEditable>
            </AdminToggle>
            
            {heroContent.hero_character_image && (
              <AdminToggle>
                <HeroImageEditor
                  currentImageUrl={heroContent.hero_character_image}
                  onSave={(newImageUrl) => updateHeroContent('hero_character_image', newImageUrl)}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-full"
                />
              </AdminToggle>
            )}
          </div>

          <AdminToggle>
            <SimpleEditable
              value={heroContent.hero_title}
              onSave={(value) => updateHeroContent('hero_title', value)}
              className="font-fredoka text-6xl md:text-8xl font-bold text-white mb-4 comic-shadow"
            >
              <h1 className="font-fredoka text-6xl md:text-8xl font-bold text-white mb-4 comic-shadow">
                {heroContent.hero_title}
              </h1>
            </SimpleEditable>
          </AdminToggle>

          <AdminToggle>
            <SimpleEditable
              value={heroContent.hero_subtitle}
              onSave={(value) => updateHeroContent('hero_subtitle', value)}
              className="font-fredoka text-4xl md:text-6xl font-bold text-[#FFD700] mb-6 comic-shadow"
            >
              <h2 className="font-fredoka text-4xl md:text-6xl font-bold text-[#FFD700] mb-6 comic-shadow">
                {heroContent.hero_subtitle}
              </h2>
            </SimpleEditable>
          </AdminToggle>

          <AdminToggle>
            <SimpleEditable
              value={heroContent.hero_tagline}
              onSave={(value) => updateHeroContent('hero_tagline', value)}
              className="font-nunito text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto"
            >
              <p className="font-nunito text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto">
                {heroContent.hero_tagline}
              </p>
            </SimpleEditable>
          </AdminToggle>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button
              onClick={() => navigateTo("products")}
              className="bg-white text-[#FF2D55] hover:bg-[#FFD700] hover:text-black px-8 py-4 text-lg font-bold rounded-2xl comic-button border-4 border-black transform hover:scale-105 transition-all shadow-2xl"
            >
              <Heart className="w-6 h-6 mr-2" />
              {copy.primaryCta}
            </Button>
            <Button
              onClick={() => navigateTo("about")}
              className="bg-[#FF2D55] text-white hover:bg-[#FF1744] px-8 py-4 text-lg font-bold rounded-2xl comic-button border-4 border-black transform hover:scale-105 transition-all shadow-2xl"
            >
              <Zap className="w-6 h-6 mr-2" />
              {copy.secondaryCta}
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-white">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 animate-pulse text-[#FFD700]" />
              <span className="font-nunito text-lg font-bold">
                {language === "th" ? "แกลเลอรี่" : "Gallery"}
              </span>
            </div>
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 animate-spin text-[#FFD700]" />
              <span className="font-nunito text-lg font-bold">
                {language === "th" ? "กระทู้" : "Board"}
              </span>
            </div>
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 animate-bounce text-[#FFD700]" />
              <span className="font-nunito text-lg font-bold">
                {language === "th" ? "ชุมชน" : "Community"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-4 border-white rounded-full flex justify-center">
          <div className="w-2 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}