-- 빠른 수정 - 카테고리 확인 및 제품 재삽입
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 현재 상태 확인
SELECT 'Current Status:' as info;
SELECT COUNT(*) as product_categories_count FROM public.product_categories;
SELECT COUNT(*) as gallery_count FROM public.gallery;
SELECT COUNT(*) as products_with_category FROM public.gallery WHERE product_category_id IS NOT NULL;

-- 2. 카테고리가 없으면 생성
INSERT INTO public.product_categories (name, name_th, name_en, icon, color, display_order, slug, is_active) 
VALUES 
  ('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', '💣', '#FF2D55', 1, 'daddy-bath-bomb', true),
  ('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', '🧴', '#007AFF', 2, 'daddy-bath-gel', true)
ON CONFLICT DO NOTHING;

-- 3. 기존 gallery 제품들 삭제
DELETE FROM public.gallery WHERE product_category_id IS NOT NULL;

-- 4. Bath Bomb 제품 10개 재삽입
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id, buy_link)
SELECT 
  'Lavender Dream',
  '<p>ลาเวนเดอร์ผ่อนคลาย 🌿</p>',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'Admin', 245, 42, true, id, 'https://line.me/ti/p/daddybathbomb'
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Rose Garden', '<p>กุหลาบหอมหวาน 🌹</p>',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
  'Admin', 189, 35, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Ocean Breeze', '<p>ทะเลสดชื่น 🌊</p>',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
  'Admin', 167, 28, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Citrus Burst', '<p>ส้มสดใส 🍊</p>',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=1000', 'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=400',
  'Admin', 145, 22, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Mint Fresh', '<p>สะระแหน่ 🌿</p>',
  'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=1000', 'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=400',
  'Admin', 132, 19, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Vanilla Honey', '<p>วานิลลา 🍯</p>',
  'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=1000', 'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=400',
  'Admin', 178, 31, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Cherry Blossom', '<p>ซากุระ 🌸</p>',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
  'Admin', 156, 26, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Coconut Paradise', '<p>มะพร้าว 🥥</p>',
  'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=1000', 'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=400',
  'Admin', 198, 38, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Eucalyptus Refresh', '<p>ยูคาลิปตัส 🍃</p>',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1000', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=400',
  'Admin', 134, 21, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Strawberry Delight', '<p>สตรอว์เบอร์รี่ 🍓</p>',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
  'Admin', 212, 45, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

-- 5. Bath Gel 제품 10개
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id, buy_link)
SELECT 'Aloe Vera Gel', '<p>อโลเวร่า 🌱</p>',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
  'Admin', 223, 39, true, id, 'https://line.me/ti/p/daddybathbomb'
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Milk & Honey Gel', '<p>นมผึ้ง 🍯</p>',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
  'Admin', 187, 33, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Green Tea Gel', '<p>ชาเขียว 🍵</p>',
  'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000', 'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=400',
  'Admin', 156, 27, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Cucumber Gel', '<p>แตงกวา 🥒</p>',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1000', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
  'Admin', 143, 24, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Chamomile Gel', '<p>คาโมมายล์ 🌼</p>',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
  'Admin', 171, 30, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Shea Butter Gel', '<p>ชีบัตเตอร์ ✨</p>',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=1000', 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400',
  'Admin', 203, 41, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Collagen Gel', '<p>คอลลาเจน 💎</p>',
  'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=1000', 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400',
  'Admin', 165, 29, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Vitamin C Gel', '<p>วิตามินซี ☀️</p>',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1000', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
  'Admin', 192, 36, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Argan Oil Gel', '<p>อาร์แกนออยล์ 💧</p>',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1000', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
  'Admin', 149, 25, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Jasmine Gel', '<p>มะลิ 🌙</p>',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1000', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400',
  'Admin', 181, 34, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

-- 6. 결과 확인
SELECT 
  '✅ Products Added!' as status,
  (SELECT COUNT(*) FROM public.product_categories WHERE is_active = true) as active_categories,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IS NOT NULL) as total_products,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IN (SELECT id FROM public.product_categories WHERE name = 'Daddy Bath Bomb')) as bath_bomb_products,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IN (SELECT id FROM public.product_categories WHERE name = 'Daddy Bath Gel')) as bath_gel_products;
