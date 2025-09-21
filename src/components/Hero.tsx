import { useState, useEffect, useCallback, useMemo } from "react";
import type { LanguageKey, PageKey } from "../App";
import { Button } from "./ui/button";
import AnimatedBackground from "./AnimatedBackground";
import { Zap, Heart, Star, ChevronLeft, ChevronRight, Palette, Wind, Users, Sparkles } from "lucide-react";
import SimpleEditable from "./SimpleEditable";
import AdminToggle from "./AdminToggle";
import HeroImageEditor from "./HeroImageEditor";
import { AdminService } from "../lib/adminService";
import { defaultBanners } from "../data/defaultBanners";

// AdminService에서 HeroBanner 타입 import
import type { HeroBanner } from "../lib/adminService";

// 상수 정의
const BANNER_TRANSITION_INTERVAL = 5000;
const DEFAULT_ICON_COLOR = "#FF2D55";

// 로딩 스켈레톤 컴포넌트
const LoadingSkeleton = () => (
  <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
    <div className="max-w-7xl mx-auto text-center w-full">
      <div className="animate-pulse">
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[16/7] bg-white/10 rounded-2xl mb-8"></div>
        <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  </section>
);

// 빈 상태 컴포넌트
const EmptyState = () => (
  <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
    <div className="max-w-7xl mx-auto text-center">
      <div className="text-white text-xl">No banners available</div>
      <p className="text-[#B8C4DB] mt-4">Please check back later or contact support.</p>
    </div>
  </section>
);
const HERO_SECTION_HEIGHTS = {
  mobile: "85vh",
  tablet: "90vh", 
  desktop: "95vh",
  large: "100vh"
};

// 스타일 상수
const BANNER_CLASSES = {
  container: "w-full h-full bg-gradient-to-r from-[#FF2D55]/20 via-[#007AFF]/20 to-[#FFD700]/20 rounded-2xl comic-border border-4 border-white/20 flex items-center justify-center overflow-hidden",
  overlay: "absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 flex items-center justify-center",
  title: "font-fredoka text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 comic-shadow animate-bounce",
  subtitle: "font-fredoka text-2xl sm:text-4xl lg:text-6xl font-bold text-[#FF2D55] comic-shadow animate-pulse"
};

const BUTTON_BASE_CLASSES = "px-8 py-4 text-lg font-bold font-nunito rounded-xl comic-border comic-button border-4 border-black transform hover:scale-105 transition-all";

// 아이콘 매핑
const iconMap = {
  Heart,
  Zap,
  Star,
  Palette,
  Wind,
  Users,
  Sparkles,
} as const;

// 타입 정의
type IconName = keyof typeof iconMap;

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
  // 복사본 텍스트 메모이제이션
  const copy = useMemo(() => copyMap[language], [language]);
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 개선된 아이콘 렌더링 함수
  const renderIcon = useCallback((iconName?: string, color?: string, className: string = "w-8 h-8"): JSX.Element => {
    if (!iconName || !(iconName in iconMap)) {
      return <Heart className={className} style={{ color: color || DEFAULT_ICON_COLOR }} />;
    }
    const IconComponent = iconMap[iconName as IconName];
    return <IconComponent className={className} style={{ color: color || DEFAULT_ICON_COLOR }} />;
  }, []);

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // AdminService에서 Hero 배너 데이터 가져오기
      const bannerData = await AdminService.getHeroBanners();
      if (bannerData && bannerData.length > 0) {
        setBanners(bannerData);
      } else {
        setBanners(defaultBanners);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      setError('Failed to load banners. Using default banners.');
      setBanners(defaultBanners);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  // 현재 배너 계산을 메모이제이션
  const currentBanner = useMemo(() => {
    return banners.length > 0 ? banners[currentBannerIndex] || banners[0] : null;
  }, [banners, currentBannerIndex]);

  // 배너 업데이트 함수를 useCallback으로 래핑
  const updateBannerImage = useCallback(async (newImageUrl: string) => {
    if (!currentBanner) return;
    
    try {
      await AdminService.updateHeroBanner(currentBanner.id, {
        ...currentBanner,
        imageUrl: newImageUrl
      });
      await loadBanners();
    } catch (error) {
      console.error('Error updating banner image:', error);
    }
  }, [currentBanner, loadBanners]);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, BANNER_TRANSITION_INTERVAL);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToNextBanner = useCallback(() => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrevBanner = useCallback(() => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // 로딩 상태와 에러 상태를 분리하여 처리
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!currentBanner) {
    return <EmptyState />;
  }

  return (
    <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] overflow-hidden">
      <AnimatedBackground />
      
      {/* 에러 알림 */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right">
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-white/80 hover:text-white"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
      
      {/* 관리자 토글 버튼 */}
      <AdminToggle />

      <div className="absolute top-4 right-4 z-20 hidden lg:block">
        <div className="bg-white rounded-full px-4 py-2 comic-border relative">
          <span className="font-fredoka text-black font-bold">POW!</span>
          <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white" />
        </div>
      </div>

      {/* 메인 배너 영역 - 100% 너비, 매우 큰 반응형 높이 */}
      <div className={`w-full h-[${HERO_SECTION_HEIGHTS.mobile}] sm:h-[${HERO_SECTION_HEIGHTS.tablet}] lg:h-[${HERO_SECTION_HEIGHTS.desktop}] xl:h-[${HERO_SECTION_HEIGHTS.large}] relative z-10 mb-12`}>
        <div className={BANNER_CLASSES.container}>
          {currentBanner.imageUrl ? (
            <div className="w-full h-full relative">
              <img
                src={currentBanner.imageUrl}
                alt={`${currentBanner.title} - ${currentBanner.subtitle}`}
                className="w-full h-full object-cover"
              />
              <div className={BANNER_CLASSES.overlay}>
                <div className="text-center text-white">
                  <h1 className={BANNER_CLASSES.title}>
                    {currentBanner.title}
                  </h1>
                  <h2 className={BANNER_CLASSES.subtitle}>
                    {currentBanner.subtitle}
                  </h2>
                </div>
              </div>
              <HeroImageEditor
                currentImageUrl={currentBanner.imageUrl}
                currentEmoji="🦸‍♂️"
                onSave={updateBannerImage}
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center">
              <div>
                <h1 className="font-fredoka text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-4 comic-shadow animate-bounce">
                  {currentBanner.title}
                </h1>
                <h2 className="font-fredoka text-2xl sm:text-4xl lg:text-6xl font-bold text-[#FF2D55] mb-4 comic-shadow animate-pulse relative">
                  {currentBanner.subtitle}
                  <Zap className="absolute -top-2 -right-8 w-12 h-12 text-[#FFD700] rotate-12 animate-spin" style={{ animationDuration: "3s" }} />
                </h2>
                <p className="font-nunito text-xl text-[#B8C4DB] font-medium">
                  {currentBanner.description}
                </p>
              </div>
              <HeroImageEditor
                currentImageUrl=""
                currentEmoji="🦸‍♂️"
                onSave={async (newImageUrl) => {
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
                className="absolute top-4 right-4 w-16 h-16 opacity-50 hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
        
        {/* 배너 네비게이션 - 배너 하단에 위치 */}
        {banners.length > 1 && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-lg rounded-full px-6 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevBanner}
              className="border-white/20 text-white hover:bg-white/10 w-8 h-8 p-0"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex space-x-2" role="tablist" aria-label="Banner navigation">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentBannerIndex
                      ? "bg-[#FF2D55] scale-125"
                      : "bg-white/70 hover:bg-white/90"
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                  aria-current={index === currentBannerIndex ? "true" : "false"}
                  role="tab"
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextBanner}
              className="border-white/20 text-white hover:bg-white/10 w-8 h-8 p-0"
              aria-label="Next banner"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* 하단 콘텐츠 영역 - 간단한 버튼과 설명 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10 text-center">
        {/* 태그라인 */}
        <div className="flex items-center justify-center mb-6">
          {renderIcon(currentBanner.iconName, currentBanner.iconColor, "w-6 h-6 mr-2 animate-pulse")}
          <span className="font-nunito text-[#B8C4DB] text-lg font-bold animate-bounce">
            {currentBanner.tagline}
          </span>
          {renderIcon(currentBanner.iconName, currentBanner.iconColor, "w-6 h-6 ml-2 animate-pulse")}
        </div>

        {/* 설명 */}
        <p className="font-nunito text-xl text-[#B8C4DB] mb-8 leading-relaxed font-medium max-w-2xl mx-auto">
          {currentBanner.description}
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className={`bg-[#FF2D55] hover:bg-[#FF1744] text-white ${BUTTON_BASE_CLASSES}`}
            onClick={() => navigateTo("gallery")}
            aria-label={`${currentBanner.primaryButtonText} - Navigate to gallery`}
          >
            <Heart className="w-5 h-5 mr-2" />
            {currentBanner.primaryButtonText}
          </Button>
          <Button
            size="lg"
            className={`bg-[#007AFF] hover:bg-[#0051D5] text-white ${BUTTON_BASE_CLASSES}`}
            onClick={() => navigateTo("board")}
            aria-label={`${currentBanner.secondaryButtonText} - Navigate to board`}
          >
            <Zap className="w-5 h-5 mr-2" />
            {currentBanner.secondaryButtonText}
          </Button>
        </div>
        
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