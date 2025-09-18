import { useEffect, useState } from "react";
import { Palette, Wind, Heart, Star, Zap } from "lucide-react";

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
    title: "Color Burst",
    description: "Watch your bath transform into a rainbow explosion of super fun colors!",
  },
  {
    id: 2,
    title: "Fragrance Lift",
    description: "Superhero scents that transport you to amazing adventure lands!",
  },
  {
    id: 3,
    title: "Skin-Kind Clean",
    description: "Gentle hero formula that loves your skin while having mega fun!",
  },
];

const iconPalette = [
  <Palette className="w-16 h-16" key="palette" />,
  <Wind className="w-16 h-16" key="wind" />,
  <Heart className="w-16 h-16" key="heart" />,
];

export default function FunFeatures({ language }: FunFeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await featuresService.getActiveFeatures();
        if (Array.isArray(data) && data.length > 0) {
          setFeatures(
            data.map((feature, index) => ({
              id: feature.id ?? index,
              title: feature.title ?? defaultFeatures[index % defaultFeatures.length].title,
              description:
                (language === "th" && feature.description_th) || feature.description ||
                defaultFeatures[index % defaultFeatures.length].description,
              image_url: feature.image_url,
              color: feature.highlight_color,
            })),
          );
        }
      } catch (error) {
        console.error("Unable to load features", error);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.id} className="text-center group">
              <div className="bg-gradient-to-br from-[#FF2D55]/20 to-[#FFD700]/20 rounded-3xl p-8 comic-border border-4 border-black hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105 comic-button relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FFD700] rounded-full comic-border border-3 border-black flex items-center justify-center rotate-12">
                  <Star className="w-6 h-6 text-black" />
                </div>

                <div className="flex justify-center mb-6">
                  <div
                    className="w-24 h-24 rounded-full comic-border border-4 border-black flex items-center justify-center relative"
                    style={{ backgroundColor: feature.color || ["#FF2D55", "#007AFF", "#00FF88"][index % 3] }}
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
