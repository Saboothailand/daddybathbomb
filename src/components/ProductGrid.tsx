import React from 'react';
import type { LanguageKey, PageKey } from '../App';

interface ProductGridProps {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
}

export default function ProductGrid({ language, navigateTo }: ProductGridProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B0F1A] to-[#1a1f2e]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-fredoka text-4xl font-bold text-white mb-8 comic-shadow">
          {language === "th" ? "สินค้าของเรา" : "Our Products"}
        </h2>
        <p className="text-[#B8C4DB] text-xl mb-12">
          {language === "th" 
            ? "ค้นพบผลิตภัณฑ์บาธบอมที่น่าตื่นเต้น" 
            : "Discover our exciting bath bomb products"}
        </p>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 comic-border border-4 border-white/20">
          <div className="text-center">
            <div className="text-6xl mb-4">🛀</div>
            <h3 className="font-fredoka text-2xl font-bold text-white mb-4">
              {language === "th" ? "เร็ว ๆ นี้!" : "Coming Soon!"}
            </h3>
            <p className="text-[#B8C4DB] mb-6">
              {language === "th" 
                ? "เรากำลังเตรียมสินค้าที่น่าตื่นเต้นสำหรับคุณ" 
                : "We're preparing exciting products for you"}
            </p>
            <button
              onClick={() => navigateTo("gallery")}
              className="bg-[#FF2D55] hover:bg-[#FF1744] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 comic-border border-4 border-black"
            >
              {language === "th" ? "ดูแกลเลอรี่" : "View Gallery"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
