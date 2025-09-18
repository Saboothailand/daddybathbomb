// @ts-nocheck
import React, { useState, useRef } from 'react';
import { validateImageFile, createImagePreview, uploadImageToCloudinary } from '../utils/imageUpload';

export default function ImageUpload({ onImageUpload, currentImage = '', label = "Upload Image" }) {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = async (file) => {
    const validation = validateImageFile(file);
    
    if (!validation.valid) {
      alert(`Upload Error: ${validation.error}`);
      return;
    }

    try {
      setUploading(true);
      
      // Create preview
      const previewUrl = await createImagePreview(file);
      setPreview(previewUrl);
      
      // For demo purposes, we'll use a placeholder URL
      // In production, you would upload to Cloudinary or your preferred service
      const mockUploadUrl = `https://images.unsplash.com/photo-${Date.now()}?w=500&h=400&fit=crop`;
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onImageUpload && onImageUpload(mockUploadUrl);
      
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
              <div className="text-sm text-gray-600">Uploading...</div>
            </div>
          </div>
        )}
      </div>
      
      {preview && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPreview('');
            onImageUpload && onImageUpload('');
          }}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Remove image
        </button>
      )}
    </div>
  );
}
