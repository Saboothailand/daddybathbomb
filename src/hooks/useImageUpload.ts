import { useState } from 'react'
import { supabase } from '../lib/supabase'

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File, bucket = 'images', folder = ''): Promise<string | null> => {
    setUploading(true)
    setError(null)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('이미지 파일만 업로드 가능합니다.')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('파일 크기는 5MB 이하여야 합니다.')
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return publicUrl

    } catch (err: any) {
      setError(err.message || '이미지 업로드 중 오류가 발생했습니다.')
      return null
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (url: string, bucket = 'images'): Promise<boolean> => {
    try {
      // Extract file path from URL
      const urlParts = url.split('/')
      const filePath = urlParts[urlParts.length - 1]

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        throw error
      }

      return true
    } catch (err: any) {
      setError(err.message || '이미지 삭제 중 오류가 발생했습니다.')
      return false
    }
  }

  return {
    uploadImage,
    deleteImage,
    uploading,
    error
  }
}
