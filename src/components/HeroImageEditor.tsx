import React, { useState, useRef } from 'react';
import { Upload, X, Save, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AdminService } from '../lib/adminService';
import { supabase } from '../lib/supabase';

interface HeroImageEditorProps {
  currentImageUrl?: string;
  currentEmoji?: string;
  onSave: (newImageUrl: string) => void;
  className?: string;
}

export default function HeroImageEditor({ 
  currentImageUrl, 
  currentEmoji = '🦸‍♂️', 
  onSave, 
  className = '' 
}: HeroImageEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // 관리자 모드 확인
    const checkAdminMode = () => {
      const adminMode = localStorage.getItem('adminMode') === 'true' || 
                       window.location.hash === '#admin';
      setIsAdminMode(adminMode);
    };

    checkAdminMode();
    
    const handleAdminModeChange = () => {
      checkAdminMode();
    };

    window.addEventListener('adminModeChanged', handleAdminModeChange);
    window.addEventListener('hashchange', handleAdminModeChange);
    
    return () => {
      window.removeEventListener('adminModeChanged', handleAdminModeChange);
      window.removeEventListener('hashchange', handleAdminModeChange);
    };
  }, []);

  // 이미지 리사이즈 함수 (히어로 이미지는 더 큰 사이즈)
  const resizeImage = (file: File, maxWidth: number = 400, maxHeight: number = 400): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 비율 계산
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // 캔버스 크기 설정
        canvas.width = width;
        canvas.height = height;

        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height);

        // Base64로 변환
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(resizedDataUrl);
      };

      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = URL.createObjectURL(file);
    });
  };

  // 이미지 업로드
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setUploading(true);
      
      // 이미지 리사이즈
      const resizedImageDataUrl = await resizeImage(file, 400, 400);
      
      // Base64를 Blob으로 변환
      const response = await fetch(resizedImageDataUrl);
      const blob = await response.blob();
      
      // Supabase Storage에 업로드
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `hero-character-${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 공개 URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      setPreview(imageUrl);
    } catch (error) {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!preview) return;

    try {
      await AdminService.updateSiteSetting('hero_character_image', preview, 'image_url');
      onSave(preview);
      setIsEditing(false);
      alert('히어로 이미지가 저장되었습니다!');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    setPreview(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      try {
        const imageUrl = await handleImageUpload(imageFile);
        setPreview(imageUrl);
      } catch (error) {
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  if (!isAdminMode) {
    // 관리자가 아닐 때는 일반 표시
    return (
      <div className={className}>
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="Hero Character"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-8xl animate-bounce" style={{ animationDuration: "2s" }}>
            {currentEmoji}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {!isEditing ? (
        <div className="relative">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Hero Character"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-8xl animate-bounce" style={{ animationDuration: "2s" }}>
              {currentEmoji}
            </div>
          )}
          
          {/* 편집 버튼 */}
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-[#007AFF] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-[#0051D5] shadow-lg z-10"
            title="히어로 이미지 편집하기"
          >
            <ImageIcon className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* 편집 모드 */
        <div className="absolute top-0 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-20">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">히어로 이미지 편집</span>
          </div>

          {/* 드래그 앤 드롭 영역 */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:border-purple-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              캐릭터 이미지를 드래그 앤 드롭하거나 클릭하여 선택
            </p>
            <p className="text-xs text-gray-500 mb-3">
              PNG, JPG, GIF (최대 5MB, 권장: 400x400px)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="hero-image-upload"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              disabled={uploading}
              className="mb-2"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? '업로드 중...' : '이미지 선택'}
            </Button>
          </div>

          {/* 미리보기 */}
          {preview && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">미리보기:</p>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Hero Image Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  <p>• 자동으로 400x400px로 리사이즈됩니다</p>
                  <p>• 원본 비율을 유지합니다</p>
                  <p>• 투명 배경 PNG 추천</p>
                </div>
              </div>
            </div>
          )}

          {/* 현재 이미지 URL 직접 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">또는 URL 직접 입력:</label>
            <Input
              value={preview || ''}
              onChange={(e) => setPreview(e.target.value)}
              placeholder="https://example.com/hero-image.png"
              className="text-sm"
            />
          </div>

          {/* 버튼들 */}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!preview || uploading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-3 h-3 mr-1" />
              저장
            </Button>
            <Button
              onClick={handleCancel}
              size="sm"
              variant="outline"
              disabled={uploading}
            >
              <X className="w-3 h-3 mr-1" />
              취소
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
