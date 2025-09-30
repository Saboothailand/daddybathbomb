-- ============================================
-- 완전한 제품 시스템 설정 (All-in-One)
-- Supabase Dashboard > SQL Editor에서 이 파일만 실행하세요!
-- ============================================

-- STEP 1: 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 2: product_categories 테이블 설정
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 필요한 컬럼 추가
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS name_th TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS description_th TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🛁';
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#FF2D55';
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- slug NULL 허용
ALTER TABLE public.product_categories ALTER COLUMN slug DROP NOT NULL;

-- STEP 3: gallery_categories 테이블 생성
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

-- STEP 4: gallery 테이블 생성
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- gallery 테이블에 필요한 컬럼 추가
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS category_id UUID;
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS product_category_id UUID;
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS buy_link TEXT;

-- 외래키 제약조건 추가 (없으면)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gallery_category_id_fkey'
  ) THEN
    ALTER TABLE public.gallery 
    ADD CONSTRAINT gallery_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES public.gallery_categories(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gallery_product_category_id_fkey'
  ) THEN
    ALTER TABLE public.gallery 
    ADD CONSTRAINT gallery_product_category_id_fkey 
    FOREIGN KEY (product_category_id) REFERENCES public.product_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- STEP 5: gallery_images 테이블 생성 (슬라이더용)
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES public.gallery(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- STEP 6: 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gallery_active_notice_created ON public.gallery(is_active, is_notice, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_product_category ON public.gallery(product_category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_categories_active_order ON public.product_categories(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_categories_active_order ON public.gallery_categories(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery_id ON public.gallery_images(gallery_id, display_order);

-- STEP 7: RLS 정책
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Everyone can view gallery images" ON public.gallery_images;
CREATE POLICY "Everyone can view gallery images" ON public.gallery_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.gallery 
      WHERE id = gallery_id AND is_active = true
    )
  );

-- STEP 8: 트리거
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

-- STEP 9: 기존 데이터 정리
DELETE FROM public.product_categories;
DELETE FROM public.gallery_categories;

-- STEP 10: 제품 카테고리 데이터
INSERT INTO public.product_categories (name, name_th, name_en, description, description_th, description_en, icon, color, display_order, slug, is_active) VALUES
('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', 'Premium fizzy bath bombs', 'บาธบอมพ์พรีเมี่ยมสำหรับการผ่อนคลาย', 'Premium fizzy bath bombs for ultimate relaxation', '💣', '#FF2D55', 1, 'daddy-bath-bomb', true),
('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', 'Luxurious bath gel', 'เจลอาบน้ำหรูหราสำหรับผิวเนียนนุ่ม', 'Luxurious bath gel for smooth and soft skin', '🧴', '#007AFF', 2, 'daddy-bath-gel', true);

-- STEP 11: 갤러리 카테고리 데이터
INSERT INTO public.gallery_categories (name, name_th, description, color, icon, display_order, is_active) VALUES
('Products', 'สินค้า', 'Product showcase', '#3B82F6', '🛍️', 1, true),
('Lifestyle', 'ไลฟ์สไตล์', 'Lifestyle images', '#10B981', '✨', 2, true),
('Reviews', 'รีวิว', 'Customer reviews', '#F59E0B', '⭐', 3, true);

-- STEP 12: BATH BOMB 제품 10개 샘플
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, product_category_id, buy_link)
SELECT 
  'Lavender Dream Bath Bomb',
  '<p>ลาเวนเดอร์ผ่อนคลาย สำหรับการพักผ่อนหลังวันเหนื่อย 🌿</p>',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  'Admin',
  245, 42, 15, true, true, id,
  'https://line.me/ti/p/YOUR_LINE_ID'
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id, buy_link)
SELECT 
  'Rose Garden Bath Bomb',
  '<p>กลิ่นกุหลาบหอมหวาน เหมาะสำหรับช่วงเวลาพิเศษ 🌹</p>',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
  'Admin',
  189, 35, 8, true, id,
  'https://shopee.co.th/product/123456'
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Ocean Breeze Bath Bomb', '<p>กลิ่นทะเลสดชื่น 🌊</p>',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
  'Admin', 167, 28, 6, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Citrus Burst Bath Bomb', '<p>ส้มสดใส 🍊</p>',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=400&h=400&fit=crop',
  'Admin', 145, 22, 5, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Mint Fresh Bath Bomb', '<p>สะระแหน่เย็นชา 🌿</p>',
  'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=400&h=400&fit=crop',
  'Admin', 132, 19, 4, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Vanilla Honey Bath Bomb', '<p>วานิลลาหอมหวาน 🍯</p>',
  'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=400&h=400&fit=crop',
  'Admin', 178, 31, 7, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Cherry Blossom Bath Bomb', '<p>ซากุระบานสะพรั่ง 🌸</p>',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
  'Admin', 156, 26, 9, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Coconut Paradise Bath Bomb', '<p>มะพร้าวหอมกรุ่น 🥥</p>',
  'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=400&h=400&fit=crop',
  'Admin', 198, 38, 11, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Eucalyptus Refresh Bath Bomb', '<p>ยูคาลิปตัสสดชื่น 🍃</p>',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=400&h=400&fit=crop',
  'Admin', 134, 21, 3, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Strawberry Delight Bath Bomb', '<p>สตรอว์เบอร์รี่หวานฉ่ำ 🍓</p>',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
  'Admin', 212, 45, 13, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

-- STEP 13: BATH GEL 제품 10개 샘플
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, product_category_id, buy_link)
SELECT 
  'Aloe Vera Soothing Gel',
  '<p>อโลเวร่าบริสุทธิ์ ผิวชุ่มชื้น 🌱</p>',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  'Admin', 223, 39, 12, true, true, id,
  'https://line.me/ti/p/YOUR_LINE_ID'
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Milk & Honey Bath Gel', '<p>นมผึ้ง บำรุงผิว 🍯</p>',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
  'Admin', 187, 33, 9, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Green Tea Antioxidant Gel', '<p>ชาเขียว ต้านอนุมูลอิสระ 🍵</p>',
  'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=400&h=400&fit=crop',
  'Admin', 156, 27, 6, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Cucumber Fresh Bath Gel', '<p>แตงกวาสดชื่น 🥒</p>',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
  'Admin', 143, 24, 5, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Chamomile Calm Bath Gel', '<p>คาโมมายล์สงบ 🌼</p>',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
  'Admin', 171, 30, 7, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Shea Butter Luxury Gel', '<p>ชีบัตเตอร์บำรุง ✨</p>',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop',
  'Admin', 203, 41, 10, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Collagen Boost Bath Gel', '<p>คอลลาเจน ผิวกระชับ 💎</p>',
  'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop',
  'Admin', 165, 29, 8, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Vitamin C Brightening Gel', '<p>วิตามินซี ผิวกระจ่างใส ☀️</p>',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
  'Admin', 192, 36, 11, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Argan Oil Moisture Gel', '<p>อาร์แกนออยล์ บำรุงลึก 💧</p>',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop',
  'Admin', 149, 25, 4, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Jasmine Night Bath Gel', '<p>มะลิกลางคืน 🌙</p>',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop',
  'Admin', 181, 34, 12, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

-- STEP 14: 이미지 슬라이더 데이터 (Lavender Dream)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&h=1000&fit=crop', 1, 'Main View', true
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000&h=1000&fit=crop', 2, 'Detail'
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000&h=1000&fit=crop', 3, 'In Water'
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=1000&h=1000&fit=crop', 4, 'Packaging'
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

-- 이미지 슬라이더 데이터 (Aloe Vera)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&h=1000&fit=crop', 1, 'Main View', true
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000&h=1000&fit=crop', 2, 'Texture'
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000&h=1000&fit=crop', 3, 'Application'
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

-- STEP 15: RLS 정책 업데이트
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 완료!
SELECT 
  '✅ ALL-IN-ONE SETUP COMPLETE! ✅' as message,
  (SELECT COUNT(*) FROM public.product_categories) as categories,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IS NOT NULL) as products,
  (SELECT COUNT(*) FROM public.gallery_images) as slider_images;
