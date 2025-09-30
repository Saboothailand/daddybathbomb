-- 제품 및 갤러리 시스템 전체 설정
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. 제품 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  description_th TEXT,
  description_en TEXT,
  slug TEXT,
  icon TEXT DEFAULT '🛁',
  color TEXT DEFAULT '#FF2D55',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. 갤러리 카테고리 테이블 생성
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

-- 4. 갤러리 테이블 생성
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

-- 5. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gallery_active_notice_created ON public.gallery(is_active, is_notice, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_product_category ON public.gallery(product_category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_categories_active_order ON public.product_categories(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_categories_active_order ON public.gallery_categories(is_active, display_order);

-- 6. RLS 정책 설정
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 제품 카테고리 정책
DROP POLICY IF EXISTS "Everyone can view active product categories" ON public.product_categories;
CREATE POLICY "Everyone can view active product categories" ON public.product_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;
CREATE POLICY "Admins can manage product categories" ON public.product_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid()
    )
  );

-- 갤러리 카테고리 정책
DROP POLICY IF EXISTS "Everyone can view active gallery categories" ON public.gallery_categories;
CREATE POLICY "Everyone can view active gallery categories" ON public.gallery_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage gallery categories" ON public.gallery_categories;
CREATE POLICY "Admins can manage gallery categories" ON public.gallery_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid()
    )
  );

-- 갤러리 정책
DROP POLICY IF EXISTS "Everyone can view active gallery" ON public.gallery;
CREATE POLICY "Everyone can view active gallery" ON public.gallery
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Everyone can insert gallery" ON public.gallery;
CREATE POLICY "Everyone can insert gallery" ON public.gallery
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;
CREATE POLICY "Admins can manage gallery" ON public.gallery
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid()
    )
  );

-- 7. 트리거 설정
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

-- 8. 기본 데이터 삽입

-- 제품 카테고리
INSERT INTO public.product_categories (name, name_th, name_en, description, description_th, description_en, icon, color, display_order, slug, is_active) VALUES
('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', 'Premium fizzy bath bombs for ultimate relaxation', 'บาธบอมพ์พรีเมี่ยมสำหรับการผ่อนคลายสุดพิเศษ', 'Premium fizzy bath bombs for ultimate relaxation', '💣', '#FF2D55', 1, 'daddy-bath-bomb', true),
('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', 'Luxurious bath gel for smooth and soft skin', 'เจลอาบน้ำหรูหราสำหรับผิวเนียนนุ่ม', 'Luxurious bath gel for smooth and soft skin', '🧴', '#007AFF', 2, 'daddy-bath-gel', true)
ON CONFLICT DO NOTHING;

-- 갤러리 카테고리
INSERT INTO public.gallery_categories (name, name_th, description, color, icon, display_order, is_active) VALUES
('Products', 'สินค้า', 'Product showcase', '#3B82F6', '🛍️', 1, true),
('Lifestyle', 'ไลฟ์สไตล์', 'Lifestyle images', '#10B981', '✨', 2, true),
('Reviews', 'รีวิว', 'Customer reviews', '#F59E0B', '⭐', 3, true)
ON CONFLICT DO NOTHING;

-- 샘플 제품 데이터 (Daddy Bath Bomb)
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

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, product_category_id)
SELECT 
  'Luxury Spa Experience',
  '<p>Transform your home into a luxury spa with our premium bath bombs.</p>',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
  'Admin',
  120,
  18,
  5,
  false,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

-- 샘플 제품 데이터 (Daddy Bath Gel)
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, product_category_id)
SELECT 
  'Natural Ingredients Bath Gel',
  '<p>100% natural and safe for the whole family. Smooth and gentle on skin.</p>',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
  'Admin',
  95,
  12,
  3,
  false,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, product_category_id)
SELECT 
  'Moisturizing Bath Gel',
  '<p>Deep moisturizing formula for silky smooth skin.</p>',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=400&h=400&fit=crop',
  'Admin',
  80,
  15,
  7,
  false,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

-- 일반 갤러리 데이터 (product_category_id가 NULL)
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, category_id)
SELECT 
  'Customer Review',
  '<p>Amazing product! Highly recommended.</p>',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=400&h=400&fit=crop',
  'Customer',
  80,
  15,
  7,
  false,
  true,
  id
FROM public.gallery_categories WHERE name = 'Reviews' LIMIT 1;

-- 완료 확인
SELECT 
  'Setup complete! ✅' as status,
  (SELECT COUNT(*) FROM public.product_categories) as product_categories,
  (SELECT COUNT(*) FROM public.gallery_categories) as gallery_categories,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IS NOT NULL) as products,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IS NULL) as gallery_items;
