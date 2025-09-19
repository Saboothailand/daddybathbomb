import { useState, useEffect } from "react";
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

  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = async () => {
    try {
      const settings = await AdminService.getSiteSettings();
      
      setHeroContent({
        hero_title: settings.hero_title || copy.headlineTop,
        hero_subtitle: settings.hero_subtitle || copy.headlineMid,
        hero_tagline: settings.hero_tagline || copy.tagline,
        hero_description: settings.hero_description || copy.tagline,
        hero_character: settings.hero_character || '🦸‍♂️',
        hero_character_image: settings.hero_character_image || ''
      });
    } catch (error) {
      console.error('Error loading hero content:', error);
    }
  };

  const updateContent = async (key: string, value: string) => {
    try {
      await AdminService.updateSiteSetting(key, value, 'text');
      setHeroContent(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#FF2D55]/20 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
      <AnimatedBackground />
      
      {/* 관리자 토글 버튼 */}
      <AdminToggle />

      <div className="absolute top-16 right-10 hidden lg:block">
        <div className="bg-white rounded-full px-4 py-2 comic-border relative">
          <span className="font-fredoka text-black font-bold">POW!</span>
          <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* 태그라인 */}
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <Star className="w-8 h-8 text-[#FFD700] mr-2" />
              <SimpleEditable
                value={heroContent.hero_tagline}
                onSave={(value) => updateContent('hero_tagline', value)}
                className="font-nunito text-[#B8C4DB] text-lg font-bold"
                placeholder="태그라인을 입력하세요..."
              >
                <span className="font-nunito text-[#B8C4DB] text-lg font-bold">
                  {heroContent.hero_tagline}
                </span>
              </SimpleEditable>
              <Star className="w-8 h-8 text-[#FFD700] ml-2" />
            </div>

            {/* 메인 제목 */}
            <h1 className="font-fredoka text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none comic-shadow animate-pulse">
              <SimpleEditable
                value={heroContent.hero_title}
                onSave={(value) => updateContent('hero_title', value)}
                className="inline-block animate-bounce"
                placeholder="메인 제목을 입력하세요..."
              >
                <span className="inline-block animate-bounce" style={{ animationDelay: "0s" }}>
                  {heroContent.hero_title}
                </span>
              </SimpleEditable>
              
              <SimpleEditable
                value={heroContent.hero_subtitle}
                onSave={(value) => updateContent('hero_subtitle', value)}
                className="block text-[#FF2D55] relative"
                placeholder="부제목을 입력하세요..."
              >
                <span className="block text-[#FF2D55] relative">
                  <span className="inline-block animate-bounce" style={{ animationDelay: "0.2s" }}>
                    {heroContent.hero_subtitle.split(" ")[0]}
                  </span>
                  <span className="inline-block animate-bounce ml-4" style={{ animationDelay: "0.4s" }}>
                    {heroContent.hero_subtitle.split(" ")[1] ?? "BOMB"}
                  </span>
                  <Zap className="absolute -top-4 -right-12 w-16 h-16 text-[#FFD700] rotate-12 animate-spin" style={{ animationDuration: "3s" }} />
                </span>
              </SimpleEditable>
              
              <span className="block text-white animate-bounce" style={{ animationDelay: "0.6s" }}>
                {copy.headlineBottom}
              </span>
            </h1>

            {/* 설명 */}
            <SimpleEditable
              value={heroContent.hero_description}
              onSave={(value) => updateContent('hero_description', value)}
              type="textarea"
              className="font-nunito text-2xl sm:text-3xl text-[#B8C4DB] mb-8 leading-relaxed font-bold"
              placeholder="설명을 입력하세요..."
            >
              <p className="font-nunito text-2xl sm:text-3xl text-[#B8C4DB] mb-8 leading-relaxed font-bold">
                {heroContent.hero_description}
              </p>
            </SimpleEditable>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#FF2D55] hover:bg-[#FF1744] text-white px-10 py-6 text-xl font-bold font-nunito rounded-2xl comic-border comic-button border-4 border-black"
                onClick={() => navigateTo("products")}
              >
                <Heart className="w-6 h-6 mr-2" />
                {copy.primaryCta.toUpperCase()}
              </Button>
              <Button
                size="lg"
                className="bg-[#007AFF] hover:bg-[#0051D5] text-white px-10 py-6 text-xl font-bold font-nunito rounded-2xl comic-border comic-button border-4 border-black"
                onClick={() => navigateTo("about")}
              >
                <Zap className="w-6 h-6 mr-2" />
                {copy.secondaryCta.toUpperCase()}
              </Button>
            </div>
          </div>

          {/* 우측 히어로 캐릭터 - 편집 가능 */}
          <div className="relative animate-pulse">
            <div
              className="w-96 h-96 mx-auto bg-gradient-to-br from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-full comic-border border-8 border-white flex items-center justify-center relative overflow-hidden animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <HeroImageEditor
                currentImageUrl={heroContent.hero_character_image}
                currentEmoji={heroContent.hero_character}
                onSave={(newImageUrl) => updateContent('hero_character_image', newImageUrl)}
                className="w-64 h-64 flex items-center justify-center"
              />

              {/* 장식 요소들 */}
              <div className="absolute bottom-8 right-8 comic-button">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#00FF88] comic-border border-4 border-black flex items-center justify-center animate-spin" style={{ animationDuration: "4s" }}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2D55] to-[#007AFF]" />
                </div>
              </div>

              <div className="absolute -top-8 -left-8 w-20 h-20 bg-[#FFD700] rounded-full comic-border border-4 border-black flex items-center justify-center animate-pulse">
                <span className="font-fredoka font-bold text-black text-sm">FIZZ!</span>
              </div>

              <div className="absolute -bottom-6 -left-10 w-12 h-12 bg-[#00FF88] rounded-full comic-border border-4 border-black animate-bounce" />
              <div className="absolute -top-6 -right-8 w-14 h-14 bg-[#FF2D55] rounded-full comic-border border-4 border-black animate-pulse" />

              <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full animate-ping" />
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-1/2 left-2 w-4 h-4 bg-white rounded-full animate-ping" style={{ animationDelay: "1s" }} />
            </div>

            {/* 배경 효과들 */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#FF2D55] rounded-full opacity-20 blur-3xl animate-pulse" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#007AFF] rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/3 -right-8 w-20 h-20 bg-[#FFD700] rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-1/3 -left-8 w-24 h-24 bg-[#00FF88] rounded-full opacity-25 blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
