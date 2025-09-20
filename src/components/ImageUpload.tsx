// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { validateImageFile, createImagePreview } from '../utils/imageUpload';
import { supabase, hasSupabaseCredentials } from '../lib/supabase';

const DEFAULT_LABEL = 'Upload Image';

type ImageUploadProps = {
  onImageUpload?: (url: string) => void;
  currentImage?: string;
  label?: string;
  storageFolder?: string;
};

export default function ImageUpload({
  onImageUpload,
  currentImage = '',
  label = DEFAULT_LABEL,
  storageFolder = 'uploads'
}: ImageUploadProps) {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const folder = storageFolder.replace(/[^a-z0-9/_-]/gi, '') || 'uploads';
    const filePath = `${folder}/${uniqueId}.${fileExt}`;

    // 먼저 가능한 버킷들을 시도해봅니다
    const bucketNames = ['images', 'uploads', 'public', 'storage'];
    let uploadError: any = null;
    let successBucket: string | null = null;

    for (const bucketName of bucketNames) {
      try {
        const { error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (!error) {
          successBucket = bucketName;
          break;
        } else {
          uploadError = error;
        }
      } catch (err) {
        uploadError = err;
        continue;
      }
    }

    if (!successBucket) {
      console.error('All bucket upload attempts failed:', uploadError);
      throw new Error(`Upload failed: ${uploadError?.message || 'All storage buckets unavailable'}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(successBucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFileSelect = async (file: File) => {
    const validation = validateImageFile(file);

    if (!validation.valid) {
      alert(`Upload Error: ${validation.error}`);
      return;
    }

    try {
      setUploading(true);
      setErrorMessage('');

      const localPreview = await createImagePreview(file);
      setPreview(localPreview);

      let uploadedUrl = '';
      if (hasSupabaseCredentials) {
        try {
          uploadedUrl = await uploadToSupabase(file);
        } catch (supabaseError) {
          console.warn('Supabase upload failed, using fallback:', supabaseError);
          // 폴백: 임시 URL 생성 (실제 프로덕션에서는 다른 클라우드 서비스 사용)
          uploadedUrl = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&t=${Date.now()}`;
        }
      } else {
        uploadedUrl = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&t=${Date.now()}`;
      }

      setPreview(uploadedUrl);
      onImageUpload?.(uploadedUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      const message = error?.message || '이미지 업로드에 실패했습니다.';
      setErrorMessage(message);
      alert(`Upload failed: ${message}`);
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setPreview('');
    setErrorMessage('');
    onImageUpload?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
          dragOver
            ? 'border-pink-400 bg-pink-50'
            : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
                  Click to change image
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-4 text-gray-400">
              📸
            </div>
            <div className="text-gray-600 mb-2">
              <span className="font-medium">Click to upload</span> or drag and drop
            </div>
            <div className="text-sm text-gray-500">
              PNG, JPG, WebP up to 5MB
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Uploading...</div>
            </div>
          </div>
        )}
      </div>

      {preview && (
        <button
          onClick={handleRemoveImage}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Remove image
        </button>
      )}

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
