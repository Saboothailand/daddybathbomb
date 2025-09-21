import { useState, useEffect, useCallback } from "react";
import type { LanguageKey, PageKey } from "../App";
import { Button } from "./ui/button";
import AnimatedBackground from "./AnimatedBackground";
import { Zap, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import SimpleEditable from "./SimpleEditable";
import AdminToggle from "./AdminToggle";
import HeroImageEditor from "./HeroImageEditor";
import { AdminService } from "../lib/adminService";

// AdminService에서 HeroBanner 타입 import
import type { HeroBanner } from "../lib/adminService";

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
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  // 기본 배너 데이터
  const defaultBanners: HeroBanner[] = [
    {
      id: "banner-1",
      title: copy.headlineTop,
      subtitle: copy.headlineMid,
      description: copy.tagline,
      tagline: copy.tagline,
      primaryButtonText: copy.primaryCta,
      secondaryButtonText: copy.secondaryCta,
      imageUrl: "",
      isActive: true,
      displayOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "banner-2",
      title: "FUN",
      subtitle: "BATH TIME",
      description: "Make every bath an adventure!",
      tagline: "Fun & Fizzy Adventures",
      primaryButtonText: "Shop Now",
      secondaryButtonText: "Learn More",
      imageUrl: "",
      isActive: true,
      displayOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "banner-3",
      title: "COLORS",
      subtitle: "GALORE",
      description: "Rainbow of fun awaits you!",
      tagline: "Colorful Bath Experience",
      primaryButtonText: "Explore",
      secondaryButtonText: "Gallery",
      imageUrl: "",
      isActive: true,
      displayOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "banner-4",
      title: "SPARKLE",
      subtitle: "MAGIC",
      description: "Add sparkle to your day!",
      tagline: "Magical Bath Moments",
      primaryButtonText: "Discover",
      secondaryButtonText: "Stories",
      imageUrl: "",
      isActive: true,
      displayOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "banner-5",
      title: "RELAX",
      subtitle: "REVIVE",
      description: "Perfect relaxation time!",
      tagline: "Relaxing Bath Therapy",
      primaryButtonText: "Shop",
      secondaryButtonText: "About",
      imageUrl: "",
      isActive: true,
      displayOrder: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "banner-6",
      title: "FAMILY",
      subtitle: "FUN",
      description: "Fun for the whole family!",
      tagline: "Family Bath Time",
      primaryButtonText: "Products",
      secondaryButtonText: "Contact",
      imageUrl: "",
      isActive: true,
      displayOrder: 6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      // AdminService에서 Hero 배너 데이터 가져오기
      const bannerData = await AdminService.getHeroBanners();
      if (bannerData && bannerData.length > 0) {
        setBanners(bannerData);
      } else {
        setBanners(defaultBanners);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      setBanners(defaultBanners);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5초마다 변경

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBanner = banners[currentBannerIndex] || banners[0];

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white text-xl">Loading banners...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
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
          {/* 왼쪽 텍스트 영역 - 애니메이션 효과 */}
          <div className="text-center lg:text-left">
            {/* 태그라인 */}
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <Star className="w-8 h-8 text-[#FFD700] mr-2 animate-pulse" />
              <span className="font-nunito text-[#B8C4DB] text-lg font-bold animate-bounce">
                {currentBanner.tagline}
              </span>
              <Star className="w-8 h-8 text-[#FFD700] ml-2 animate-pulse" />
            </div>

            {/* 메인 제목 */}
            <div className="text-center lg:text-left mb-8">
              <h1 className="font-fredoka text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-2 leading-none comic-shadow animate-bounce">
                {currentBanner.title}
              </h1>
              
              <h2 className="font-fredoka text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FF2D55] mb-2 leading-none comic-shadow relative animate-pulse">
                {currentBanner.subtitle}
                <Zap className="absolute -top-2 -right-8 w-12 h-12 text-[#FFD700] rotate-12 animate-spin" style={{ animationDuration: "3s" }} />
              </h2>
              
              <h3 className="font-fredoka text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-none comic-shadow animate-fade-in">
                {currentBanner.description}
              </h3>
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#FF2D55] hover:bg-[#FF1744] text-white px-8 py-4 text-lg font-bold font-nunito rounded-xl comic-border comic-button border-4 border-black transform hover:scale-105 transition-all animate-pulse"
                onClick={() => navigateTo("gallery")}
              >
                <Heart className="w-5 h-5 mr-2" />
                {currentBanner.primaryButtonText}
              </Button>
              <Button
                size="lg"
                className="bg-[#007AFF] hover:bg-[#0051D5] text-white px-8 py-4 text-lg font-bold font-nunito rounded-xl comic-border comic-button border-4 border-black transform hover:scale-105 transition-all animate-pulse"
                onClick={() => navigateTo("board")}
              >
                <Zap className="w-5 h-5 mr-2" />
                {currentBanner.secondaryButtonText}
              </Button>
            </div>
          </div>

          {/* 우측 이미지 영역 */}
          <div className="relative animate-pulse">
            <div
              className="w-96 h-96 mx-auto bg-gradient-to-br from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-full comic-border border-8 border-white flex items-center justify-center relative overflow-hidden animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              {currentBanner.imageUrl ? (
                <div className="w-full h-full relative">
                  <img
                    src={currentBanner.imageUrl}
                    alt={currentBanner.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <HeroImageEditor
                    currentImageUrl={currentBanner.imageUrl}
                    currentEmoji="🦸‍♂️"
                    onSave={async (newImageUrl) => {
                      // 배너 이미지 업데이트 로직
                      try {
                        await AdminService.updateHeroBanner(currentBanner.id, {
                          ...currentBanner,
                          imageUrl: newImageUrl
                        });
                        await loadBanners();
                      } catch (error) {
                        console.error('Error updating banner image:', error);
                      }
                    }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                  />
                </div>
              ) : (
                <HeroImageEditor
                  currentImageUrl=""
                  currentEmoji="🦸‍♂️"
                  onSave={async (newImageUrl) => {
                    // 배너 이미지 업데이트 로직
                    try {
                      await AdminService.updateHeroBanner(currentBanner.id, {
                        ...currentBanner,
                        imageUrl: newImageUrl
                      });
                      await loadBanners();
                    } catch (error) {
                      console.error('Error updating banner image:', error);
                    }
                  }}
                  className="w-64 h-64 flex items-center justify-center"
                />
              )}

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
        
        {/* 배너 네비게이션 */}
        {banners.length > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevBanner}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentBannerIndex
                      ? "bg-[#FF2D55] scale-125"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextBanner}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {/* 하단 아이콘 섹션 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <div className="flex items-center justify-center space-x-8 text-white">
            <div className="flex items-center space-x-2 cursor-pointer hover:scale-110 transition-transform" onClick={() => navigateTo("gallery")}>
              <Heart className="w-6 h-6 animate-pulse text-[#FFD700]" />
              <span className="font-nunito text-lg font-bold">
                {language === "th" ? "แกลเลอรี่" : "Gallery"}
              </span>
            </div>
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="flex items-center space-x-2 cursor-pointer hover:scale-110 transition-transform" onClick={() => navigateTo("board")}>
              <Star className="w-6 h-6 animate-spin text-[#FFD700]" />
              <span className="font-nunito text-lg font-bold">
                {language === "th" ? "กระทู้" : "Board"}
              </span>
            </div>
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="flex items-center space-x-2 cursor-pointer hover:scale-110 transition-transform" onClick={() => navigateTo("contact")}>
              <Zap className="w-6 h-6 animate-bounce text-[#FFD700]" />
              <span className="font-nunito text-lg font-bold">
                {language === "th" ? "ชุมชน" : "Community"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}