import React from 'react';
import TextWithBackground from './TextWithBackground';
import type { LanguageKey, PageKey } from '../App';

interface TextWithBackgroundDemoProps {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
}

export default function TextWithBackgroundDemo({ language, navigateTo }: TextWithBackgroundDemoProps) {
  const handleTextChange = (text: string) => {
    console.log('텍스트 변경됨:', text);
  };

  const handleImageChange = (imageUrl: string) => {
    console.log('이미지 변경됨:', imageUrl);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-fredoka">
            텍스트 + 배경 이미지 ✨
          </h1>
          <p className="text-[#B8C4DB] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {language === 'th' 
              ? '텍스트와 배경 이미지를 함께 사용하는 인터랙티브 컴포넌트입니다. 텍스트를 편집하고 배경 이미지를 변경해보세요!'
              : 'Interactive component that combines text with background images. Edit the text and change background images!'
            }
          </p>
        </div>
        
        {/* 기본 예제 - 그라디언트 배경 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-nunito">
            {language === 'th' ? '1. 기본 그라디언트 배경' : '1. Default Gradient Background'}
          </h2>
          <TextWithBackground
            initialText={language === 'th' ? "환영합니다! 🎉" : "Welcome! 🎉"}
            className="mb-8 shadow-2xl"
            textClassName="font-fredoka"
            onTextChange={handleTextChange}
            onImageChange={handleImageChange}
          />
        </div>
        
        {/* 커스텀 이미지 예제 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-nunito">
            {language === 'th' ? '2. 배경 이미지 적용' : '2. Custom Background Image'}
          </h2>
          <TextWithBackground
            initialText={language === 'th' 
              ? "Daddy Bath Bomb과 함께하는 즐거운 목욕 시간! 🛁✨" 
              : "Fun Bath Time with Daddy Bath Bomb! 🛁✨"
            }
            initialImageUrl="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            className="mb-8 shadow-2xl"
            textClassName="font-nunito"
            overlayClassName="bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-blue-900/60"
            onTextChange={handleTextChange}
            onImageChange={handleImageChange}
          />
        </div>
        
        {/* 다른 스타일 예제 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-nunito">
            {language === 'th' ? '3. 커스텀 스타일링' : '3. Custom Styling'}
          </h2>
          <TextWithBackground
            initialText={language === 'th' 
              ? "색상과 향기로 가득한 특별한 경험 🌈" 
              : "Special Experience Full of Colors and Scents 🌈"
            }
            initialImageUrl="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop"
            className="mb-8 shadow-2xl"
            textClassName="font-fredoka text-yellow-300"
            overlayClassName="bg-gradient-to-b from-transparent via-black/30 to-black/70"
            onTextChange={handleTextChange}
            onImageChange={handleImageChange}
          />
        </div>

        {/* 높이가 다른 예제 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-nunito">
            {language === 'th' ? '4. 컴팩트 사이즈' : '4. Compact Size'}
          </h2>
          <TextWithBackground
            initialText={language === 'th' ? "간단한 메시지 💝" : "Simple Message 💝"}
            className="mb-8 shadow-2xl min-h-[250px]"
            textClassName="font-nunito text-3xl"
            overlayClassName="bg-gradient-to-r from-blue-600/50 to-purple-600/50"
            onTextChange={handleTextChange}
            onImageChange={handleImageChange}
          />
        </div>
        
        {/* 사용법 안내 */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-white mb-4 font-fredoka">
            {language === 'th' ? '사용법 💡' : 'How to Use 💡'}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-[#B8C4DB]">
            <div>
              <h4 className="font-bold text-white mb-2">
                {language === 'th' ? '텍스트 편집:' : 'Edit Text:'}
              </h4>
              <p className="text-sm leading-relaxed">
                {language === 'th' 
                  ? '"텍스트 편집" 버튼을 클릭하여 내용을 수정할 수 있습니다.'
                  : 'Click the "Edit Text" button to modify the content.'
                }
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">
                {language === 'th' ? '배경 이미지 변경:' : 'Change Background:'}
              </h4>
              <p className="text-sm leading-relaxed">
                {language === 'th' 
                  ? '우상단의 업로드 버튼을 클릭하여 이미지 URL을 입력하거나 파일을 업로드하세요.'
                  : 'Click the upload button in the top-right to enter an image URL or upload a file.'
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* 돌아가기 버튼 */}
        <div className="text-center pt-8">
          <button
            onClick={() => navigateTo("home")}
            className="bg-gradient-to-r from-[#FF2D55] to-[#FF1744] hover:from-[#FF1744] hover:to-[#E91E63] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
          >
            {language === 'th' ? '홈으로 돌아가기 🏠' : 'Back to Home 🏠'}
          </button>
        </div>
      </div>
    </div>
  );
}

