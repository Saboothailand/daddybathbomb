import React from 'react';
import type { LanguageKey, PageKey } from '../App';

interface ProductListingProps {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
}

export default function ProductListing({ language, navigateTo }: ProductListingProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            {language === "th" ? "สินค้าทั้งหมด" : "All Products"}
          </h1>
          <p className="text-[#B8C4DB] text-xl">
            {language === "th" 
              ? "ค้นพบผลิตภัณฑ์บาธบอมที่น่าตื่นเต้น" 
              : "Discover our exciting bath bomb products"}
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 comic-border border-4 border-white/20 text-center">
            <div className="text-8xl mb-8">🛀</div>
            <h2 className="font-fredoka text-4xl font-bold text-white mb-6">
              {language === "th" ? "เร็ว ๆ นี้!" : "Coming Soon!"}
            </h2>
            <p className="text-[#B8C4DB] text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              {language === "th" 
                ? "เรากำลังเตรียมสินค้าบาธบอมที่น่าตื่นเต้นและมีคุณภาพสูงสำหรับคุณ กรุณารอติดตามในเร็ว ๆ นี้" 
                : "We're preparing exciting and high-quality bath bomb products for you. Please stay tuned for updates coming soon!"}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigateTo("gallery")}
                className="bg-[#FF2D55] hover:bg-[#FF1744] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 comic-border border-4 border-black"
              >
                {language === "th" ? "ดูแกลเลอรี่" : "View Gallery"}
              </button>
              <button
                onClick={() => navigateTo("contact")}
                className="bg-[#007AFF] hover:bg-[#0051D5] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 comic-border border-4 border-black"
              >
                {language === "th" ? "ติดต่อเรา" : "Contact Us"}
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 comic-border border-4 border-white/10 text-center">
            <div className="text-4xl mb-4">🌈</div>
            <h3 className="font-fredoka text-xl font-bold text-white mb-3">
              {language === "th" ? "สีสันสดใส" : "Vibrant Colors"}
            </h3>
            <p className="text-[#B8C4DB]">
              {language === "th" 
                ? "บาธบอมหลากสีที่จะทำให้การอาบน้ำสนุกยิ่งขึ้น" 
                : "Colorful bath bombs that make bathing more fun"}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 comic-border border-4 border-white/10 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-fredoka text-xl font-bold text-white mb-3">
              {language === "th" ? "ส่วนผสมธรรมชาติ" : "Natural Ingredients"}
            </h3>
            <p className="text-[#B8C4DB]">
              {language === "th" 
                ? "ผลิตจากส่วนผสมธรรมชาติที่ปลอดภัยต่อผิว" 
                : "Made from natural ingredients safe for skin"}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 comic-border border-4 border-white/10 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="font-fredoka text-xl font-bold text-white mb-3">
              {language === "th" ? "ความสนุกสำหรับทุกคน" : "Fun for Everyone"}
            </h3>
            <p className="text-[#B8C4DB]">
              {language === "th" 
                ? "เหมาะสำหรับทุกวัยและทุกคนในครอบครัว" 
                : "Perfect for all ages and the whole family"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
