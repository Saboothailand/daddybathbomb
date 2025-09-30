-- ============================================
-- 깨끗한 시작 - 기존 데이터 백업 후 재설정
-- Supabase Dashboard > SQL Editor에서 실행
-- ============================================

-- PART 1: 기존 테이블 삭제 (주의: 데이터가 모두 삭제됩니다!)
DROP TABLE IF EXISTS public.gallery_images CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.gallery_categories CASCADE;

-- PART 2: 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PART 3: product_categories 테이블 정리
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS name_th TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS description_th TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🛁';
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#FF2D55';
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.product_categories ALTER COLUMN slug DROP NOT NULL;

DELETE FROM public.product_categories;

INSERT INTO public.product_categories (name, name_th, name_en, description, description_th, description_en, icon, color, display_order, slug, is_active) VALUES
('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', 'Premium fizzy bath bombs', 'บาธบอมพ์พรีเมี่ยม', 'Premium fizzy bath bombs', '💣', '#FF2D55', 1, 'daddy-bath-bomb', true),
('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', 'Luxurious bath gel', 'เจลอาบน้ำหรูหรา', 'Luxurious bath gel', '🧴', '#007AFF', 2, 'daddy-bath-gel', true);

-- PART 4: gallery_categories 테이블 생성
CREATE TABLE public.gallery_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT '📷',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

INSERT INTO public.gallery_categories (name, name_th, color, icon, display_order) VALUES
('Products', 'สินค้า', '#3B82F6', '🛍️', 1),
('Lifestyle', 'ไลฟ์สไตล์', '#10B981', '✨', 2),
('Reviews', 'รีวิว', '#F59E0B', '⭐', 3);

-- PART 5: gallery 테이블 생성
CREATE TABLE public.gallery (
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
  buy_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- PART 6: gallery_images 테이블 생성 (이미지 슬라이더용)
CREATE TABLE public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID NOT NULL REFERENCES public.gallery(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- PART 7: 인덱스 생성
CREATE INDEX idx_gallery_active ON public.gallery(is_active, created_at DESC);
CREATE INDEX idx_gallery_product_category ON public.gallery(product_category_id, created_at DESC);
CREATE INDEX idx_gallery_images_gallery ON public.gallery_images(gallery_id, display_order);

-- PART 8: RLS 정책
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view_product_categories" ON public.product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "view_gallery_categories" ON public.gallery_categories FOR SELECT USING (is_active = true);
CREATE POLICY "view_gallery" ON public.gallery FOR SELECT USING (is_active = true);
CREATE POLICY "insert_gallery" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "view_gallery_images" ON public.gallery_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.gallery WHERE id = gallery_id AND is_active = true)
);

-- PART 9: 샘플 제품 데이터 (Bath Bomb 10개)
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, product_category_id, buy_link)
SELECT 'Lavender Dream Bath Bomb', '<p>ลาเวนเดอร์ผ่อนคลาย 🌿</p>',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'Admin', 245, 42, 15, true, id, 'https://line.me/ti/p/YOUR_LINE'
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id, buy_link)
SELECT 'Rose Garden Bath Bomb', '<p>กุหลาบหอมหวาน 🌹</p>',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
  'Admin', 189, 35, id, 'https://shopee.co.th'
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Ocean Breeze', '<p>ทะเลสดชื่น 🌊</p>',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
  'Admin', 167, 28, id FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Citrus Burst', '<p>ส้มสดใส 🍊</p>',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=1000', 'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=400',
  'Admin', 145, 22, id FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Mint Fresh', '<p>สะระแหน่ 🌿</p>',
  'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=1000', 'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=400',
  'Admin', 132, 19, id FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Vanilla Honey', '<p>วานิลลา 🍯</p>',
  'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=1000', 'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=400',
  'Admin', 178, 31, id FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Cherry Blossom', '<p>ซากุระ 🌸</p>',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
  'Admin', 156, 26, id FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Coconut Paradise', '<p>มะพร้าว 🥥</p>',
  'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=1000', 'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=400',
  'Admin', 198, 38, id FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Eucalyptus Refresh', '<p>ยูคาลิปตัส 🍃</p>',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1000', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=400',
  'Admin', 134, 21, id FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Strawberry Delight', '<p>สตรอว์เบอร์รี่ 🍓</p>',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
  'Admin', 212, 45, id FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

-- PART 10: 샘플 제품 (Bath Gel 10개)
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, product_category_id, buy_link)
SELECT 'Aloe Vera Soothing Gel', '<p>อโลเวร่า 🌱</p>',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
  'Admin', 223, 39, 12, true, id, 'https://line.me/ti/p/YOUR_LINE'
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Milk & Honey Gel', '<p>นมผึ้ง 🍯</p>',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
  'Admin', 187, 33, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Green Tea Gel', '<p>ชาเขียว 🍵</p>',
  'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000', 'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=400',
  'Admin', 156, 27, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Cucumber Fresh Gel', '<p>แตงกวา 🥒</p>',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1000', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
  'Admin', 143, 24, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Chamomile Calm Gel', '<p>คาโมมายล์ 🌼</p>',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
  'Admin', 171, 30, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Shea Butter Gel', '<p>ชีบัตเตอร์ ✨</p>',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=1000', 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400',
  'Admin', 203, 41, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Collagen Boost Gel', '<p>คอลลาเจน 💎</p>',
  'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=1000', 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400',
  'Admin', 165, 29, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Vitamin C Gel', '<p>วิตามินซี ☀️</p>',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1000', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
  'Admin', 192, 36, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Argan Oil Gel', '<p>อาร์แกนออยล์ 💧</p>',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1000', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
  'Admin', 149, 25, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, product_category_id)
SELECT 'Jasmine Night Gel', '<p>มะลิ 🌙</p>',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1000', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400',
  'Admin', 181, 34, id FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

-- PART 11: 슬라이더 이미지 (Lavender Dream - 4장)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000', 1, 'Main', true
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000', 2, 'Detail'
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000', 3, 'Effect'
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=1000', 4, 'Package'
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

-- 슬라이더 이미지 (Aloe Vera - 3장)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000', 1, 'Main', true
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000', 2, 'Texture'
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000', 3, 'Application'
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

-- 완료!
SELECT 
  '🎉 CLEAN START COMPLETE! 🎉' as message,
  (SELECT COUNT(*) FROM public.product_categories) as categories,
  (SELECT COUNT(*) FROM public.gallery) as total_products,
  (SELECT COUNT(*) FROM public.gallery_images) as slider_images;
