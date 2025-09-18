import { Instagram, Facebook, Twitter, Youtube, Video, Heart, Star, Zap } from "lucide-react";

import type { LanguageKey, PageKey } from "../App";
import { t } from "../utils/translations";

type FooterProps = {
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
};

type FooterLinkKey = "home" | "about" | "products" | "notice" | "faq" | "contact";

const footerLinks: Array<{ labelKey: FooterLinkKey; page: PageKey }> = [
  { labelKey: "home", page: "home" },
  { labelKey: "about", page: "about" },
  { labelKey: "products", page: "products" },
  { labelKey: "notice", page: "notice" },
  { labelKey: "faq", page: "faq" },
  { labelKey: "contact", page: "contact" },
];

export default function Footer({ navigateTo, language }: FooterProps) {
  return (
    <footer className="bg-[#0B0F1A] border-t-4 border-[#FFD700] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-16 h-16 bg-[#FF2D55] rounded-full" />
        <div className="absolute top-20 right-32 w-12 h-12 bg-[#00FF88] rotate-45" />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 border-4 border-[#007AFF] rounded-full" />
        <div className="absolute bottom-10 right-20 w-8 h-8 bg-[#FFD700] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full flex items-center justify-center comic-border border-4 border-black mr-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-fredoka text-3xl font-bold text-white comic-shadow">
              DADDY BATH BOMB
            </h3>
          </div>

          <div className="bg-[#151B2E] rounded-2xl px-8 py-4 comic-border border-4 border-black inline-block mb-8 transform rotate-1">
            <p className="font-nunito text-[#B8C4DB] text-lg font-bold">
              🦸‍♂️ {language === "th" ? "ทำให้เวลามหัศจรรย์ในอ่างน้ำสนุกเสมอ!" : "Making bath time super fun every single day!"} 💥
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-4 mb-8">
            {footerLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => navigateTo(link.page)}
                className="font-nunito text-[#B8C4DB] hover:text-[#FFD700] transition-colors text-lg font-bold relative group"
              >
                {t(link.labelKey, language)}
                <div className="absolute -bottom-2 left-0 w-0 h-2 bg-[#FFD700] transition-all group-hover:w-full rounded-full" />
              </button>
            ))}
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://instagram.com/daddybathbomb"
              className="group p-4 bg-[#FF2D55] hover:bg-[#FF1744] text-white rounded-full comic-border border-4 border-black comic-button relative"
            >
              <Instagram className="h-8 w-8" />
              <Star className="absolute -top-2 -right-2 w-5 h-5 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity animate-spin" />
            </a>
            <a
              href="https://facebook.com/daddybathbomb"
              className="group p-4 bg-[#007AFF] hover:bg-[#0051D5] text-white rounded-full comic-border border-4 border-black comic-button relative"
            >
              <Facebook className="h-8 w-8" />
              <Heart className="absolute -top-2 -right-2 w-5 h-5 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </a>
            <a
              href="https://youtube.com"
              className="group p-4 bg-[#00FF88] hover:bg-[#00E678] text-black rounded-full comic-border border-4 border-black comic-button relative"
            >
              <Video className="h-8 w-8" />
              <Zap className="absolute -top-2 -right-2 w-5 h-5 text-[#FF2D55] opacity-0 group-hover:opacity-100 transition-opacity animate-bounce" />
            </a>
            <a
              href="https://twitter.com"
              className="group p-4 bg-[#FFD700] hover:bg-[#FFC700] text-black rounded-full comic-border border-4 border-black comic-button relative"
            >
              <Twitter className="h-8 w-8" />
              <Star className="absolute -top-2 -right-2 w-5 h-5 text-[#007AFF] opacity-0 group-hover:opacity-100 transition-opacity animate-ping" />
            </a>
            <a
              href="https://youtube.com"
              className="group p-4 bg-[#AF52DE] hover:bg-[#9F42CE] text-white rounded-full comic-border border-4 border-black comic-button relative"
            >
              <Youtube className="h-8 w-8" />
              <Heart className="absolute -top-2 -right-2 w-5 h-5 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity animate-spin" />
            </a>
          </div>

          <div className="bg-gradient-to-r from-[#FF2D55]/20 to-[#007AFF]/20 rounded-2xl p-6 comic-border border-3 border-black">
            <p className="font-nunito text-[#B8C4DB] text-lg">
              &copy; 2024 Daddy Bath Bomb. {language === "th" ? "สงวนลิขสิทธิ์ทั้งหมด" : "All superhero rights reserved."}
              <span className="text-[#FFD700] font-bold"> {language === "th" ? "ขอบคุณที่สนุกไปด้วยกัน!" : "Thanks for being awesome!"} </span>
              🌟
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
