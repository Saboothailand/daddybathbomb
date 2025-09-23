import React, { useState, useRef } from 'react';
import { Upload, Edit3, Save, X } from 'lucide-react';
import { Button } from './ui/button';

interface TextWithBackgroundProps {
  initialText?: string;
  initialImageUrl?: string;
  className?: string;
  textClassName?: string;
  overlayClassName?: string;
  editable?: boolean;
  onTextChange?: (text: string) => void;
  onImageChange?: (imageUrl: string) => void;
}

export default function TextWithBackground({
  initialText = "여기에 텍스트를 입력하세요",
  initialImageUrl = "",
  className = "",
  textClassName = "",
  overlayClassName = "",
  editable = true,
  onTextChange,
  onImageChange
}: TextWithBackgroundProps) {
  const [text, setText] = useState(initialText);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSave = () => {
    setIsEditingText(false);
    onTextChange?.(text);
  };

  const handleImageUrlSave = () => {
    if (tempImageUrl.trim()) {
      setImageUrl(tempImageUrl);
      onImageChange?.(tempImageUrl);
      setTempImageUrl("");
    }
    setIsEditingImage(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        onImageChange?.(result);
      };
      reader.readAsDataURL(file);
    }
    setIsEditingImage(false);
  };

  const defaultBackgroundStyle = {
    backgroundImage: imageUrl 
      ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${imageUrl})`
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div 
      className={`relative min-h-[400px] rounded-2xl overflow-hidden flex items-center justify-center ${className}`}
      style={defaultBackgroundStyle}
    >
      {/* 텍스트 오버레이 */}
      <div className={`absolute inset-0 bg-black/20 ${overlayClassName}`} />
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center p-8 max-w-4xl mx-auto">
        {isEditingText ? (
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 text-lg bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/30 focus:border-white/60 focus:outline-none resize-none min-h-[120px]"
              placeholder="텍스트를 입력하세요..."
              autoFocus
            />
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleTextSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                저장
              </Button>
              <Button
                onClick={() => {
                  setIsEditingText(false);
                  setText(initialText);
                }}
                variant="outline"
                className="bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 
              className={`text-2xl md:text-4xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight ${textClassName}`}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              {text}
            </h1>
            
            {editable && (
              <Button
                onClick={() => setIsEditingText(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Edit3 className="w-4 h-4" />
                텍스트 편집
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 이미지 편집 버튼들 */}
      {editable && (
        <div className="absolute top-4 right-4 z-20">
          {isEditingImage ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 space-y-3 min-w-[280px]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 URL 입력:
                </label>
                <input
                  type="text"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  또는 파일 업로드:
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center gap-2 justify-center"
                >
                  <Upload className="w-4 h-4" />
                  파일 선택
                </Button>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleImageUrlSave}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  저장
                </Button>
                <Button
                  onClick={() => {
                    setIsEditingImage(false);
                    setTempImageUrl("");
                  }}
                  variant="outline"
                  className="flex-1 text-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditingImage(true)}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white border border-white/30 p-2 rounded-lg"
              title="배경 이미지 변경"
            >
              <Upload className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {/* 장식 요소들 */}
      <div className="absolute top-8 left-8 text-white/30 text-4xl animate-pulse">
        ✨
      </div>
      <div className="absolute bottom-8 right-8 text-white/30 text-3xl animate-bounce">
        💫
      </div>
    </div>
  );
}

