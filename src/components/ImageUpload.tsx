import { useRef, useState } from 'react'
import { useImageUpload } from '../hooks/useImageUpload'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  className?: string
  folder?: string
  placeholder?: string
}

export default function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  className = '', 
  folder = '',
  placeholder = '이미지를 업로드하세요'
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const { uploadImage, uploading, error } = useImageUpload()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload image
    const url = await uploadImage(file, 'images', folder)
    if (url) {
      onImageUploaded(url)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview(null)
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex gap-2">
              <button
                onClick={handleClick}
                disabled={uploading}
                className="bg-white text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-100 transition-colors"
              >
                {uploading ? '업로드 중...' : '변경'}
              </button>
              <button
                onClick={handleRemove}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={uploading}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-pink-500 hover:bg-pink-50 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
              <span className="text-gray-600">업로드 중...</span>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-gray-600">{placeholder}</span>
              <span className="text-gray-400 text-sm mt-1">JPG, PNG, GIF (최대 5MB)</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
