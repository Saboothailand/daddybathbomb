import { useEffect, useState } from "react";
import { Droplets, CircleDot, Waves, Star, Zap, Heart } from "lucide-react";

import type { LanguageKey } from "../App";
import { cmsService } from "../lib/supabase";

type HowToStep = {
  id: number | string;
  step_number: number;
  title: string;
  description: string;
  icon?: string;
  tips?: string;
};

type HowToUseProps = {
  language: LanguageKey;
};

const iconMap: Record<number, JSX.Element> = {
  1: <Droplets className="w-12 h-12" />,
  2: <CircleDot className="w-12 h-12" />,
  3: <Waves className="w-12 h-12" />,
};

const defaultSteps: HowToStep[] = [
  {
    id: 1,
    step_number: 1,
    title: "Fill",
    description: "Fill your tub with warm water and get ready for superhero bath time!",
  },
  {
    id: 2,
    step_number: 2,
    title: "Drop",
    description: "Drop your super bath bomb and watch the magical fizzy explosion begin!",
  },
  {
    id: 3,
    step_number: 3,
    title: "Soak",
    description: "Soak in the colorful bubbles and enjoy your amazing hero adventure!",
  },
];

const colourPalette = ["#FF2D55", "#007AFF", "#00FF88"];

export default function HowToUse({ language }: HowToUseProps) {
  const [steps, setSteps] = useState<HowToStep[]>(defaultSteps);

  useEffect(() => {
    const loadSteps = async () => {
      try {
        const data = await cmsService.getHowToSteps();
        if (Array.isArray(data) && data.length > 0) {
          setSteps(
            data.map((step, index) => ({
              id: step.id ?? index,
              step_number: step.step_number ?? index + 1,
              title: (language === "th" && step.title_th) || step.title || defaultSteps[index % defaultSteps.length].title,
              description:
                (language === "th" && step.description_th) || step.description ||
                defaultSteps[index % defaultSteps.length].description,
              icon: step.icon,
              tips: step.tips,
            })),
          );
        }
      } catch (error) {
        console.error("Unable to load how-to steps", error);
      }
    };

    loadSteps();
  }, [language]);

  return (
    <section id="how-to-use" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] relative overflow-hidden">
      <div className="absolute top-10 right-10 hidden lg:block">
        <div className="bg-[#FFD700] rounded-2xl px-6 py-3 comic-border border-4 border-black relative">
          <span className="font-fredoka text-black font-bold text-lg">
            {language === "th" ? "ง่ายสุด ๆ" : "So Easy!"}
          </span>
          <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-6 border-r-6 border-t-12 border-transparent border-t-[#FFD700]" />
        </div>
      </div>

      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-32 left-20 w-16 h-16 bg-[#FF2D55] rounded-full" />
        <div className="absolute bottom-40 right-32 w-12 h-12 bg-[#007AFF] rotate-45" />
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-[#00FF88] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-[#FF2D55] animate-pulse" />
            <Zap className="w-10 h-10 text-[#FFD700] mx-4 animate-bounce" />
            <Star className="w-8 h-8 text-[#00FF88] animate-pulse" />
          </div>

          <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            {language === "th" ? "วิธีใช้" : "HOW TO USE"}
          </h2>

          <div className="bg-[#007AFF] rounded-2xl px-8 py-4 comic-border border-4 border-black inline-block transform -rotate-1">
            <p className="font-nunito text-white text-xl font-bold">
              {language === "th"
                ? "🛁 ขั้นตอนซุปเปอร์ง่ายสำหรับซูเปอร์ฮีโร่ทุกคน!"
                : "🛁 Super simple superhero steps! 🦸‍♂️"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {steps.map((step, index) => (
            <div key={step.id} className="text-center relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-12 h-1 bg-gradient-to-r from-[#FFD700] to-transparent transform -translate-y-1/2 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-2 border-b-2 border-transparent border-l-[#FFD700]" />
                </div>
              )}

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#FFD700] rounded-full comic-border border-4 border-black flex items-center justify-center relative">
                    <span className="font-fredoka text-3xl font-bold text-black">
                      {String(step.step_number).padStart(2, "0")}
                    </span>
                    <Star className="absolute -top-2 -right-2 w-6 h-6 text-[#FF2D55] animate-spin" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#00FF88] rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  <div
                    className="w-24 h-24 rounded-3xl comic-border border-4 border-black flex items-center justify-center text-white transform hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: colourPalette[index % colourPalette.length] }}
                  >
                    {step.icon ? <span className="text-4xl">{step.icon}</span> : iconMap[step.step_number] ?? iconMap[(index % 3) + 1]}
                  </div>
                </div>

                <h3 className="font-fredoka text-3xl font-bold text-white mb-4 comic-shadow">
                  {step.title.toUpperCase()}
                </h3>

                <div className="bg-[#151B2E] rounded-2xl p-6 comic-border border-3 border-black">
                  <p className="font-nunito text-[#B8C4DB] text-lg leading-relaxed">{step.description}</p>
                  {step.tips && (
                    <p className="font-nunito text-sm text-[#94A3B8] mt-3">
                      {language === "th" ? "เคล็ดลับ:" : "Tip:"} {step.tips}
                    </p>
                  )}
                </div>

                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full opacity-30 animate-ping" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#FF2D55] to-[#007AFF] rounded-3xl p-8 comic-border border-4 border-black inline-block">
            <h3 className="font-fredoka text-3xl font-bold text-white mb-3 comic-shadow">
              {language === "th" ? "พร้อมสำหรับความสนุกแล้วหรือยัง?" : "READY FOR SUPER FUN?"}
            </h3>
            <p className="font-nunito text-white text-xl">
              {language === "th" ? "🎉 หยิบบาธบอมฮีโร่ของคุณได้เลย!" : "🎉 Get your superhero bath bombs now! 🎉"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
