import React from 'react';
import { Heart, Zap } from 'lucide-react';

interface ActionButtonsProps {
  language?: 'th' | 'en';
  navigateTo?: (page: string) => void;
}

export default function ActionButtons({ language = 'th', navigateTo }: ActionButtonsProps) {
  const handleShopClick = () => {
    if (navigateTo) {
      navigateTo('products');
    }
  };

  const handleStoryClick = () => {
    if (navigateTo) {
      navigateTo('gallery');
    }
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      {/* 빨간색 버튼 - 쇼핑하기 */}
      <button
        onClick={handleShopClick}
        className="flex items-center gap-2 bg-[#FF2D55] hover:bg-[#E0244A] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        <Heart className="w-5 h-5" />
        <span>
          {language === 'th' ? 'ช้อปบาธบอม' : 'Shop Bath Bombs'}
        </span>
      </button>

      {/* 파란색 버튼 - 이야기 보기 */}
      <button
        onClick={handleStoryClick}
        className="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0056CC] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        <Zap className="w-5 h-5" />
        <span>
          {language === 'th' ? 'ดูเรื่องราวสีสัน' : 'View Colorful Stories'}
        </span>
      </button>
    </div>
  );
}


