-- 갤러리 아이템별 여러 이미지 저장 테이블
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. 갤러리 이미지 테이블 생성
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES public.gallery(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery_id ON public.gallery_images(gallery_id, display_order);

-- 3. RLS 정책 설정
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view gallery images" ON public.gallery_images;
CREATE POLICY "Everyone can view gallery images" ON public.gallery_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.gallery 
      WHERE id = gallery_id AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;
CREATE POLICY "Admins can manage gallery images" ON public.gallery_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid()
    )
  );

-- 4. 테스트 이미지 데이터 삽입 (첫 번째 제품에 여러 이미지)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&h=1000&fit=crop',
  1,
  'Main Product Image',
  true
FROM public.gallery WHERE title = 'Perfect Gift for Special Occasions' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000&h=1000&fit=crop',
  2,
  'Rainbow Colors',
  false
FROM public.gallery WHERE title = 'Perfect Gift for Special Occasions' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000&h=1000&fit=crop',
  3,
  'Natural Ingredients',
  false
FROM public.gallery WHERE title = 'Perfect Gift for Special Occasions' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=1000&h=1000&fit=crop',
  4,
  'Family Bath Time',
  false
FROM public.gallery WHERE title = 'Perfect Gift for Special Occasions' LIMIT 1;

-- 5. 두 번째 제품에도 여러 이미지
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000&h=1000&fit=crop',
  1,
  'Luxury Spa Main',
  true
FROM public.gallery WHERE title = 'Luxury Spa Experience' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=1000&h=1000&fit=crop',
  2,
  'Gift Ready',
  false
FROM public.gallery WHERE title = 'Luxury Spa Experience' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=1000&h=1000&fit=crop',
  3,
  'Relaxing Aroma',
  false
FROM public.gallery WHERE title = 'Luxury Spa Experience' LIMIT 1;

-- 완료!
SELECT 
  'Gallery images setup complete!' as status,
  COUNT(*) as total_images,
  COUNT(DISTINCT gallery_id) as products_with_images
FROM public.gallery_images;
