import React from 'react';
import type { PageKey, LanguageKey } from '../App';

type ProductsPageProps = {
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
};

export default function ProductsPage({ navigateTo, language }: ProductsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1A1F3A] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
          {language === "th" ? "สินค้า" : "Products"}
        </h1>
        <p className="text-[#B8C4DB] text-xl mb-12">
          {language === "th" 
            ? "บาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ 100%" 
            : "High-quality bath bombs made from 100% natural ingredients"}
        </p>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 comic-border border-4 border-white/20">
          <div className="text-6xl mb-6">🛁</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === "th" ? "เร็วๆ นี้" : "Coming Soon"}
          </h2>
          <p className="text-[#B8C4DB] text-lg">
            {language === "th" 
              ? "เรากำลังเตรียมสินค้าสุดพิเศษสำหรับคุณ!" 
              : "We're preparing something special for you!"}
          </p>
        </div>
      </div>
    </div>
  );
}
