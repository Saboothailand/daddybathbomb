import { useEffect, useState } from "react";
import { Palette, Wind, Heart, Star, Zap, Sparkles } from "lucide-react";

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
    title: "Relaxing Experience",
    description: "Transform your bath time into a luxurious spa experience",
  },
  {
    id: 6,
    title: "Long Lasting Scent",
    description: "Enjoy beautiful fragrances that last long after your bath",
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
      title: "ประสบการณ์ผ่อนคลาย",
      description: "เปลี่ยนเวลาอาบน้ำให้กลายเป็นประสบการณ์สปาหรูหรา",
    },
    {
      id: 6,
      title: "กลิ่นหอมยาวนาน",
      description: "เพลิดเพลินกับกลิ่นหอมสวยงามที่คงอยู่นานหลังการอาบน้ำ",
    },
  ]
};

const iconPalette = [
  <Palette className="w-16 h-16" key="palette" />,
  <Wind className="w-16 h-16" key="wind" />,
  <Heart className="w-16 h-16" key="heart" />,
  <Star className="w-16 h-16" key="star" />,
  <Zap className="w-16 h-16" key="zap" />,
  <Sparkles className="w-16 h-16" key="sparkles" />,
];

export default function FunFeatures({ language }: FunFeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>(
    language === "th" ? defaultFeaturesTranslations.th : defaultFeatures
  );

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await featuresService.getActiveFeatures();
        if (Array.isArray(data) && data.length > 0) {
          const baseFeatures = language === "th" ? defaultFeaturesTranslations.th : defaultFeatures;
          setFeatures(
            data.map((feature, index) => ({
              id: feature.id ?? index,
              title: feature.title ?? baseFeatures[index % baseFeatures.length].title,
              description:
                (language === "th" && feature.description_th) || feature.description ||
                baseFeatures[index % baseFeatures.length].description,
              image_url: feature.image_url,
              color: feature.highlight_color,
            })),
          );
        } else {
          // 데이터가 없으면 기본값 사용
          setFeatures(language === "th" ? defaultFeaturesTranslations.th : defaultFeatures);
        }
      } catch (error) {
        console.error("Unable to load features", error);
        // 에러 발생 시 기본값 사용
        setFeatures(language === "th" ? defaultFeaturesTranslations.th : defaultFeatures);
      }
    };

    loadFeatures();
  }, [language]);

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B0F1A] to-[#151B2E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFD700] rounded-full" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF2D55] rotate-45" />
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-[#00FF88] rounded-full" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 border-4 border-[#007AFF] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.id} className="text-center group">
              <div className="bg-gradient-to-br from-[#FF2D55]/20 to-[#FFD700]/20 rounded-3xl p-8 comic-border border-4 border-black hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105 comic-button relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FFD700] rounded-full comic-border border-3 border-black flex items-center justify-center rotate-12">
                  <Star className="w-6 h-6 text-black" />
                </div>

                <div className="flex justify-center mb-6">
                  <div
                    className="w-24 h-24 rounded-full comic-border border-4 border-black flex items-center justify-center relative"
                    style={{ backgroundColor: feature.color || ["#FF2D55", "#007AFF", "#00FF88", "#FFD700", "#AF52DE", "#FF9F1C"][index % 6] }}
                  >
                    <div className="text-white">
                      {iconPalette[index % iconPalette.length]}
                    </div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FFD700] rounded-full animate-ping" />
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white rotate-45 animate-pulse" />
                  </div>
                </div>

                <h3 className="font-fredoka text-2xl font-bold text-white mb-4 comic-shadow">
                  {feature.title}
                </h3>

                <p className="font-nunito text-[#B8C4DB] text-lg leading-relaxed">
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
