-- 제품 20개 빠른 삽입 (Bath Bomb 10개 + Bath Gel 10개)
-- Supabase Dashboard > SQL Editor에서 실행

-- Bath Bomb 제품 10개
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id, buy_link)
SELECT 'Lavender Dream', '<p>ลาเวนเดอร์ผ่อนคลาย 💜</p>',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
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
SELECT 'Mint Fresh', '<p>สะระแหน่เย็นชา 🌿</p>',
  'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=1000', 'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=400',
  'Admin', 132, 19, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Vanilla Honey', '<p>วานิลลาน้ำผึ้ง 🍯</p>',
  'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=1000', 'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=400',
  'Admin', 178, 31, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Cherry Blossom', '<p>ซากุระบาน 🌸</p>',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
  'Admin', 156, 26, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Coconut Paradise', '<p>มะพร้าวสวรรค์ 🥥</p>',
  'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=1000', 'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=400',
  'Admin', 198, 38, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Eucalyptus Refresh', '<p>ยูคาลิปตัสสดชื่น 🍃</p>',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1000', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=400',
  'Admin', 134, 21, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Strawberry Delight', '<p>สตรอว์เบอร์รี่ 🍓</p>',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
  'Admin', 212, 45, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

-- Bath Gel 제품 10개
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id, buy_link)
SELECT 'Aloe Vera Gel', '<p>อโลเวร่าบริสุทธิ์ 🌱</p>',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
  'Admin', 223, 39, true, id, 'https://line.me/ti/p/daddybathbomb'
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Milk & Honey Gel', '<p>นมผึ้งบำรุง 🍯</p>',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
  'Admin', 187, 33, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Green Tea Gel', '<p>ชาเขียวต้านอนุมูล 🍵</p>',
  'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000', 'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=400',
  'Admin', 156, 27, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Cucumber Fresh Gel', '<p>แตงกวาสดชื่น 🥒</p>',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1000', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
  'Admin', 143, 24, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Chamomile Calm Gel', '<p>คาโมมายล์สงบ 🌼</p>',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
  'Admin', 171, 30, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Shea Butter Gel', '<p>ชีบัตเตอร์หรูหรา ✨</p>',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=1000', 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400',
  'Admin', 203, 41, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Collagen Boost Gel', '<p>คอลลาเจนกระชับ 💎</p>',
  'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=1000', 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400',
  'Admin', 165, 29, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Vitamin C Gel', '<p>วิตามินซีกระจ่างใส ☀️</p>',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1000', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
  'Admin', 192, 36, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Argan Oil Gel', '<p>อาร์แกนออยล์บำรุงลึก 💧</p>',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1000', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
  'Admin', 149, 25, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 'Jasmine Night Gel', '<p>มะลิกลางคืน 🌙</p>',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1000', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400',
  'Admin', 181, 34, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

-- 슬라이더 이미지 추가 (Lavender Dream - 3장)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000', 1, 'Main View', true
FROM public.gallery WHERE title = 'Lavender Dream' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1600461187344-4f5d9c02cd4c?w=1000', 2, 'Close-up'
FROM public.gallery WHERE title = 'Lavender Dream' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000', 3, 'In Water'
FROM public.gallery WHERE title = 'Lavender Dream' LIMIT 1;

-- Rose Garden (3장)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000', 1, 'Main', true
FROM public.gallery WHERE title = 'Rose Garden' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1000', 2, 'Petals'
FROM public.gallery WHERE title = 'Rose Garden' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1000', 3, 'Bloom'
FROM public.gallery WHERE title = 'Rose Garden' LIMIT 1;

-- Aloe Vera Gel (3장)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000', 1, 'Main', true
FROM public.gallery WHERE title = 'Aloe Vera Gel' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000', 2, 'Texture'
FROM public.gallery WHERE title = 'Aloe Vera Gel' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption)
SELECT id, 'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000', 3, 'Application'
FROM public.gallery WHERE title = 'Aloe Vera Gel' LIMIT 1;

-- 완료!
SELECT 
  '✅ 제품 20개 추가 완료!' as message,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IS NOT NULL) as total_products,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IN (SELECT id FROM public.product_categories WHERE name = 'Daddy Bath Bomb')) as bath_bomb,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IN (SELECT id FROM public.product_categories WHERE name = 'Daddy Bath Gel')) as bath_gel,
  (SELECT COUNT(*) FROM public.gallery_images) as slider_images;
