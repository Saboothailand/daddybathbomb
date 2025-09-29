import React, { useState, useRef } from 'react';
import { Upload, X, Save, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AdminService } from '../lib/adminService';
import { supabase } from '../lib/supabase';
import { authService } from '../utils/auth';

interface LogoEditorProps {
  currentLogoUrl?: string;
  onSave: (newLogoUrl: string) => void;
  className?: string;
}

export default function LogoEditor({ currentLogoUrl, onSave, className = '' }: LogoEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(authService.isAdmin());
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let active = true;

    const updateAdminState = () => {
      if (!active) return;
      setIsAdminMode(authService.isAdmin());
    };

    authService.initialize().finally(updateAdminState);
    const unsubscribe = authService.subscribe(updateAdminState);

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  // 이미지 리사이즈 함수
  const resizeImage = (file: File, maxWidth: number = 200, maxHeight: number = 200): Promise<string> => {
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
      const resizedImageDataUrl = await resizeImage(file, 200, 200);
      
      // Base64를 Blob으로 변환
      const response = await fetch(resizedImageDataUrl);
      const blob = await response.blob();
      
      // Supabase Storage에 업로드
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

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
      const logoUrl = await handleImageUpload(file);
      setPreview(logoUrl);
    } catch (error) {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!preview) return;

    try {
      await AdminService.updateSiteSetting('logo_url', preview, 'image_url');
      onSave(preview);
      setIsEditing(false);
      alert('로고가 저장되었습니다!');
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
        const logoUrl = await handleImageUpload(imageFile);
        setPreview(logoUrl);
      } catch (error) {
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  if (!isAdminMode) {
    // 관리자가 아닐 때는 일반 로고 표시
    return (
      <div className={className}>
        {currentLogoUrl ? (
          <img
            src={currentLogoUrl}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">DB</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {!isEditing ? (
        <div className="relative">
          {currentLogoUrl ? (
            <img
              src={currentLogoUrl}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">DB</span>
            </div>
          )}
          
          {/* 편집 버튼 */}
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-[#007AFF] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-[#0051D5] shadow-lg z-10"
            title="로고 편집하기"
          >
            <ImageIcon className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* 편집 모드 */
        <div className="absolute top-0 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-20">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">로고 편집</span>
          </div>

          {/* 드래그 앤 드롭 영역 */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:border-blue-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              이미지를 드래그 앤 드롭하거나 클릭하여 선택
            </p>
            <p className="text-xs text-gray-500 mb-3">
              PNG, JPG, GIF (최대 5MB, 권장: 200x200px)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="logo-upload"
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
                <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  <p>• 자동으로 200x200px로 리사이즈됩니다</p>
                  <p>• 원본 비율을 유지합니다</p>
                </div>
              </div>
            </div>
          )}

          {/* 현재 로고 URL 직접 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">또는 URL 직접 입력:</label>
            <Input
              value={preview || ''}
              onChange={(e) => setPreview(e.target.value)}
              placeholder="https://example.com/logo.png"
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
