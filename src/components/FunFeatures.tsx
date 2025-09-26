import { useEffect, useMemo, useState } from "react";
import { Palette, Wind, Heart, Star, Zap, Droplets, Shield } from "lucide-react";

import type { LanguageKey } from "../App";
import { featuresService } from "../lib/supabase";

type Feature = {
  id: number | string;
  title: string;
  description: string;
  image_url?: string;
  color?: string;
};

type FunFeaturesProps = {
  language: LanguageKey;
};

const featureFallbackColors = [
  "#FF2D55",
  "#4ECDC4",
  "#4CAF50",
  "#FFD700",
  "#9C27B0",
  "#FF9800",
];

const sanitizeText = (value?: string | null, fallbackValue = ""): string => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return fallbackValue;
};

const ensureMinimumFeatures = (input: Feature[], baseDefaults: Feature[]): Feature[] => {
  const MIN_FEATURE_COUNT = 6;
  const deduped: Feature[] = [];
  const seenTitles = new Set<string>();

  const pushFeature = (feature: Feature) => {
    const key = sanitizeText(feature.title).toLowerCase();
    if (!key || seenTitles.has(key)) {
      return;
    }

    const color = feature.color || featureFallbackColors[deduped.length % featureFallbackColors.length];
    deduped.push({ ...feature, color });
    seenTitles.add(key);
  };

  input.forEach(pushFeature);

  let fallbackIndex = 0;
  while (deduped.length < MIN_FEATURE_COUNT && baseDefaults.length > 0) {
    const fallback = baseDefaults[fallbackIndex % baseDefaults.length];
    pushFeature({ ...fallback, id: `fallback-${fallback.id}-${fallbackIndex}` });
    fallbackIndex += 1;

    if (fallbackIndex > baseDefaults.length * 3) {
      break;
    }
  }

  if (deduped.length === 0) {
    return baseDefaults.slice(0, MIN_FEATURE_COUNT);
  }

  return deduped;
};

const getDefaultsForLanguage = (language: LanguageKey): Feature[] => {
  const source = language === "th" ? defaultFeaturesTranslations.th : defaultFeatures;
  return source.map((feature, index) => ({
    ...feature,
    color: feature.color || featureFallbackColors[index % featureFallbackColors.length],
  }));
};

const defaultFeatures: Feature[] = [
  {
    id: 1,
    title: "Natural Ingredients",
    description: "Made from 100% natural ingredients, safe for the whole family",
  },
  {
    id: 2,
    title: "Beautiful Fizzy Colors",
    description: "Beautiful colorful fizz with relaxing aromatherapy scents",
  },
  {
    id: 3,
    title: "Skin Nourishing",
    description: "Moisturizes and nourishes skin for smooth, soft feeling after bath",
  },
  {
    id: 4,
    title: "Perfect Gift",
    description: "Perfect gift for special people on any occasion",
  },
  {
    id: 5,
    title: "Long Lasting Bubbles",
    description: "Rich, long-lasting bubbles that maintain volume throughout bath time",
  },
  {
    id: 6,
    title: "Stress Relief Formula",
    description: "Specially formulated to help reduce daily stress and promote deep relaxation",
  },
];

const defaultFeaturesTranslations = {
  th: [
    {
      id: 1,
      title: "ส่วนผสมธรรมชาติ",
      description: "ผลิตจากส่วนผสมธรรมชาติ 100% ปลอดภัยสำหรับทุกคนในครอบครัว",
    },
    {
      id: 2,
      title: "สีสันสวยงาม",
      description: "สีสันสวยงามพร้อมกลิ่นหอมอโรมาเธราปีที่ผ่อนคลาย",
    },
    {
      id: 3,
      title: "บำรุงผิว",
      description: "เพิ่มความชุ่มชื้นและบำรุงผิวให้เนียนนุ่มหลังการอาบน้ำ",
    },
    {
      id: 4,
      title: "ของขวัญที่สมบูรณ์แบบ",
      description: "ของขวัญที่สมบูรณ์แบบสำหรับคนพิเศษในทุกโอกาส",
    },
    {
      id: 5,
      title: "ฟองสบู่นานนาน",
      description: "ฟองสบู่อุดมสมบูรณ์ที่คงความหนาแน่นตลอดการอาบน้ำ",
    },
    {
      id: 6,
      title: "สูตรคลายเครียด",
      description: "สูตรพิเศษที่ช่วยลดความเครียดในชีวิตประจำวันและส่งเสริมการผ่อนคลายอย่างลึกซึ้ง",
    },
  ]
};

const iconPalette = [
  <Palette className="w-16 h-16" key="palette" />,
  <Wind className="w-16 h-16" key="wind" />,
  <Heart className="w-16 h-16" key="heart" />,
  <Star className="w-16 h-16" key="star" />,
  <Droplets className="w-16 h-16" key="droplets" />,
  <Shield className="w-16 h-16" key="shield" />,
];

export default function FunFeatures({ language }: FunFeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>(() => {
    const defaults = getDefaultsForLanguage(language);
    return ensureMinimumFeatures(defaults, defaults);
  });

  const baseDefaults = useMemo(() => getDefaultsForLanguage(language), [language]);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        console.log('🔄 Features 로딩 시작...');
        const data = await featuresService.getActiveFeatures();
        console.log('📊 받은 Features 데이터:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          const mappedFeatures = data
            .filter((feature) => feature?.is_active ?? true)
            .map((feature, index) => {
              const fallback = baseDefaults[index % baseDefaults.length];
              return {
                id: feature.id ?? `feature-${index}`,
                title:
                  (language === "th" && sanitizeText(feature.title_th, fallback.title)) ||
                  sanitizeText(feature.title, fallback.title),
                description:
                  (language === "th" && sanitizeText(feature.description_th, fallback.description)) ||
                  sanitizeText(feature.description, fallback.description),
                image_url: sanitizeText(feature.image_url, fallback.image_url),
                color: sanitizeText(feature.highlight_color, fallback.color),
              };
            });

          const normalizedFeatures = ensureMinimumFeatures(mappedFeatures, baseDefaults);
          setFeatures(normalizedFeatures);
          console.log('✅ Features 데이터 로드됨:', normalizedFeatures.length, '개');
        } else {
          // 데이터가 없으면 기본값 사용
          const fallbackFeatures = ensureMinimumFeatures(baseDefaults, baseDefaults);
          setFeatures(fallbackFeatures);
          console.log('📋 기본 Features 데이터 사용');
        }
      } catch (error) {
        console.error("Unable to load features", error);
        // 에러 발생 시 기본값 사용
        const fallbackFeatures = ensureMinimumFeatures(baseDefaults, baseDefaults);
        setFeatures(fallbackFeatures);
        console.log('📋 오류 - 기본 Features 데이터 사용');
      }
    };

    loadFeatures();
    
    // 관리자 대시보드에서 데이터 변경 시 자동 업데이트
    const handleFeaturesUpdate = () => {
      console.log('🔄 Features 업데이트 이벤트 수신');
      loadFeatures();
    };
    
    window.addEventListener('featuresUpdated', handleFeaturesUpdate);
    
    return () => {
      window.removeEventListener('featuresUpdated', handleFeaturesUpdate);
    };
  }, [baseDefaults, language]);

  useEffect(() => {
    // 언어 변경 시 즉시 기본값으로 초기화하여 깜빡임 최소화
    setFeatures(ensureMinimumFeatures(baseDefaults, baseDefaults));
  }, [baseDefaults]);

  return (
    <section id="features" className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B0F1A] to-[#151B2E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFD700] rounded-full" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF2D55] rotate-45" />
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-[#00FF88] rounded-full" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 border-4 border-[#007AFF] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <Star className="w-8 h-8 text-[#FFD700] animate-pulse" />
            <Zap className="w-10 h-10 text-[#FF2D55] mx-4 animate-bounce" />
            <Star className="w-8 h-8 text-[#00FF88] animate-pulse" />
          </div>

          <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            {language === "th" ? "ฟีเจอร์สุดสนุก" : "FUN FEATURES"}
          </h2>

          <div className="bg-[#FF2D55] rounded-2xl px-6 py-3 comic-border border-4 border-black inline-block transform rotate-1">
            <p className="font-nunito text-white text-lg font-bold">
              {language === "th" ? "พลังซุปเปอร์ในทุกฟองฟู่!" : "💫 Super powers in every fizz! 💫"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <div key={feature.id} className="text-center group flex flex-col">
              <div className="bg-gradient-to-br from-[#FF2D55]/20 to-[#FFD700]/20 rounded-3xl p-6 comic-border border-4 border-black hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105 comic-button relative flex flex-col h-full">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FFD700] rounded-full comic-border border-3 border-black flex items-center justify-center rotate-12">
                  <Star className="w-6 h-6 text-black" />
                </div>

                <div className="flex justify-center mb-4">
                  <div
                    className="w-24 h-24 rounded-full comic-border border-4 border-black flex items-center justify-center relative"
                    style={{ backgroundColor: feature.color || featureFallbackColors[index % featureFallbackColors.length] }}
                  >
                    <div className="text-white">
                      {iconPalette[index % iconPalette.length]}
                    </div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FFD700] rounded-full animate-ping" />
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white rotate-45 animate-pulse" />
                  </div>
                </div>

                <h3 className="font-fredoka text-xl font-bold text-white mb-3 comic-shadow">
                  {feature.title}
                </h3>

                <p className="font-nunito text-[#B8C4DB] text-base leading-relaxed flex-grow">
                  {feature.description}
                </p>

                <div className="absolute -bottom-2 -left-2 w-8 h-1 bg-[#FFD700] transform -rotate-12 opacity-60" />
                <div className="absolute -bottom-3 -left-1 w-6 h-1 bg-[#00FF88] transform -rotate-12 opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
