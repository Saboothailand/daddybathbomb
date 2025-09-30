-- 최종 데이터베이스 설정 (기존 테이블 업데이트)
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- STEP 1: 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 2: product_categories 테이블에 컬럼 추가
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS name_th TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS description_th TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🛁';
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#FF2D55';
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- slug 컬럼 NULL 허용
ALTER TABLE public.product_categories ALTER COLUMN slug DROP NOT NULL;

-- STEP 3: 갤러리 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description TEXT,
  description_th TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT '📷',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- STEP 4: 갤러리 테이블 생성
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  author_id UUID,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_notice BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  category_id UUID REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
  product_category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- STEP 5: 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gallery_active_notice_created ON public.gallery(is_active, is_notice, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_product_category ON public.gallery(product_category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_categories_active_order ON public.product_categories(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_categories_active_order ON public.gallery_categories(is_active, display_order);

-- STEP 6: RLS 정책
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view active product categories" ON public.product_categories;
CREATE POLICY "Everyone can view active product categories" ON public.product_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Everyone can view active gallery categories" ON public.gallery_categories;
CREATE POLICY "Everyone can view active gallery categories" ON public.gallery_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Everyone can view active gallery" ON public.gallery;
CREATE POLICY "Everyone can view active gallery" ON public.gallery
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Everyone can insert gallery" ON public.gallery;
CREATE POLICY "Everyone can insert gallery" ON public.gallery
  FOR INSERT WITH CHECK (true);

-- STEP 7: 트리거
DROP TRIGGER IF EXISTS update_product_categories_updated_at ON public.product_categories;
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_categories_updated_at ON public.gallery_categories;
CREATE TRIGGER update_gallery_categories_updated_at
  BEFORE UPDATE ON public.gallery_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 8: 기존 데이터 삭제 후 새로 삽입
DELETE FROM public.product_categories;

-- STEP 9: 제품 카테고리 데이터 삽입
INSERT INTO public.product_categories (name, name_th, name_en, description, description_th, description_en, icon, color, display_order, slug, is_active) VALUES
('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', 'Premium fizzy bath bombs for ultimate relaxation', 'บาธบอมพ์พรีเมี่ยมสำหรับการผ่อนคลายสุดพิเศษ', 'Premium fizzy bath bombs for ultimate relaxation', '💣', '#FF2D55', 1, 'daddy-bath-bomb', true),
('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', 'Luxurious bath gel for smooth and soft skin', 'เจลอาบน้ำหรูหราสำหรับผิวเนียนนุ่ม', 'Luxurious bath gel for smooth and soft skin', '🧴', '#007AFF', 2, 'daddy-bath-gel', true);

-- STEP 10: 갤러리 카테고리 데이터 삽입
INSERT INTO public.gallery_categories (name, name_th, description, color, icon, display_order, is_active) VALUES
('Products', 'สินค้า', 'Product showcase', '#3B82F6', '🛍️', 1, true),
('Lifestyle', 'ไลฟ์สไตล์', 'Lifestyle images', '#10B981', '✨', 2, true),
('Reviews', 'รีวิว', 'Customer reviews', '#F59E0B', '⭐', 3, true)
ON CONFLICT DO NOTHING;

-- STEP 11: 샘플 제품 데이터 (Daddy Bath Bomb)
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, product_category_id)
SELECT 
  'Perfect Gift for Special Occasions',
  '<p>Our bath bombs make the perfect gift for any special occasion. Made with natural ingredients!</p>',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  'Admin',
  150,
  25,
  8,
  true,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Luxury Spa Experience',
  '<p>Transform your home into a luxury spa.</p>',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
  'Admin',
  120,
  18,
  5,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

-- STEP 12: 샘플 제품 데이터 (Daddy Bath Gel)
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Natural Ingredients Bath Gel',
  '<p>100% natural and safe for the whole family.</p>',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
  'Admin',
  95,
  12,
  3,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Moisturizing Bath Gel',
  '<p>Deep moisturizing formula.</p>',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=400&h=400&fit=crop',
  'Admin',
  80,
  15,
  7,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

-- 완료!
SELECT 
  'Setup complete! ✅' as message,
  (SELECT COUNT(*) FROM public.product_categories) as product_categories,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IS NOT NULL) as products,
  (SELECT json_agg(json_build_object('name', name, 'icon', icon)) FROM public.product_categories) as categories;
