-- Bath Bomb과 Bath Gel 샘플 제품 각 10개 생성
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 먼저 기존 샘플 데이터 삭제 (선택사항)
-- DELETE FROM public.gallery WHERE author_name = 'Admin';

-- DADDY BATH BOMB 제품 10개
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, product_category_id, buy_link)
SELECT 
  'Lavender Dream Bath Bomb',
  '<p>ลาเวนเดอร์ผ่อนคลาย สำหรับการพักผ่อนหลังวันเหนื่อย</p>',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  'Admin',
  245,
  42,
  15,
  true,
  true,
  id,
  'https://line.me/ti/p/YOUR_LINE_ID'
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id, buy_link)
SELECT 
  'Rose Garden Bath Bomb',
  '<p>กลิ่นกุหลาบหอมหวาน เหมาะสำหรับช่วงเวลาพิเศษ</p>',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
  'Admin',
  189,
  35,
  8,
  true,
  id,
  'https://shopee.co.th/product/123456'
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id, buy_link)
SELECT 
  'Ocean Breeze Bath Bomb',
  '<p>กลิ่นทะเลสดชื่น ให้ความรู้สึกสบายๆ</p>',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
  'Admin',
  167,
  28,
  6,
  true,
  id,
  'https://www.lazada.co.th/products/bath-bomb-123'
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Citrus Burst Bath Bomb',
  '<p>ส้มสดใส ให้พลังงานตลอดวัน</p>',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=400&h=400&fit=crop',
  'Admin',
  145,
  22,
  5,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Mint Fresh Bath Bomb',
  '<p>สะระแหน่เย็นชา สดชื่น</p>',
  'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=400&h=400&fit=crop',
  'Admin',
  132,
  19,
  4,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Vanilla Honey Bath Bomb',
  '<p>วานิลลาหอมหวาน ผสมน้ำผึ้ง</p>',
  'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=400&h=400&fit=crop',
  'Admin',
  178,
  31,
  7,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Cherry Blossom Bath Bomb',
  '<p>ซากุระบานสะพรั่ง ความหอมละมุน</p>',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
  'Admin',
  156,
  26,
  9,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Coconut Paradise Bath Bomb',
  '<p>มะพร้าวหอมกรุ่น ให้ความชุ่มชื้น</p>',
  'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=400&h=400&fit=crop',
  'Admin',
  198,
  38,
  11,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Eucalyptus Refresh Bath Bomb',
  '<p>ยูคาลิปตัสสดชื่น ช่วยหายใจสะดวก</p>',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=400&h=400&fit=crop',
  'Admin',
  134,
  21,
  3,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Strawberry Delight Bath Bomb',
  '<p>สตรอว์เบอร์รี่หวานฉ่ำ สนุกสนาน</p>',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
  'Admin',
  212,
  45,
  13,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

-- DADDY BATH GEL 제품 10개
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active, product_category_id, buy_link)
SELECT 
  'Aloe Vera Soothing Gel',
  '<p>อโลเวร่าบริสุทธิ์ ผิวชุ่มชื้น</p>',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  'Admin',
  223,
  39,
  12,
  true,
  true,
  id,
  'https://line.me/ti/p/YOUR_LINE_ID'
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id, buy_link)
SELECT 
  'Milk & Honey Bath Gel',
  '<p>นมผึ้ง บำรุงผิวเนียนนุ่ม</p>',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
  'Admin',
  187,
  33,
  9,
  true,
  id,
  'https://shopee.co.th/product/789012'
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Green Tea Antioxidant Gel',
  '<p>ชาเขียว ต้านอนุมูลอิสระ</p>',
  'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=400&h=400&fit=crop',
  'Admin',
  156,
  27,
  6,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Cucumber Fresh Bath Gel',
  '<p>แตงกวาสดชื่น เย็นสบาย</p>',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
  'Admin',
  143,
  24,
  5,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Chamomile Calm Bath Gel',
  '<p>คาโมมายล์สงบ ผ่อนคลาย</p>',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
  'Admin',
  171,
  30,
  7,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Shea Butter Luxury Gel',
  '<p>ชีบัตเตอร์บำรุงผิว หรูหรา</p>',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop',
  'Admin',
  203,
  41,
  10,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Collagen Boost Bath Gel',
  '<p>คอลลาเจน ผิวกระชับ เต่งตึง</p>',
  'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop',
  'Admin',
  165,
  29,
  8,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Vitamin C Brightening Gel',
  '<p>วิตามินซี ผิวกระจ่างใส</p>',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
  'Admin',
  192,
  36,
  11,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Argan Oil Moisture Gel',
  '<p>อาร์แกนออยล์ บำรุงผิวลึก</p>',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop',
  'Admin',
  149,
  25,
  4,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_active, product_category_id)
SELECT 
  'Jasmine Night Bath Gel',
  '<p>มะลิกลางคืน หอมละมุน</p>',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1000&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop',
  'Admin',
  181,
  34,
  12,
  true,
  id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

-- 샘플 이미지 슬라이더용 추가 이미지 (첫 번째 Bath Bomb 제품)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&h=1000&fit=crop',
  1,
  'Lavender Dream - Main View',
  true
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000&h=1000&fit=crop',
  2,
  'Close-up Detail',
  false
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1000&h=1000&fit=crop',
  3,
  'In Water Effect',
  false
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=1000&h=1000&fit=crop',
  4,
  'Packaging View',
  false
FROM public.gallery WHERE title = 'Lavender Dream Bath Bomb' LIMIT 1;

-- 샘플 이미지 슬라이더용 추가 이미지 (첫 번째 Bath Gel 제품)
INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&h=1000&fit=crop',
  1,
  'Aloe Vera Gel - Main',
  true
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1000&h=1000&fit=crop',
  2,
  'Texture View',
  false
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

INSERT INTO public.gallery_images (gallery_id, image_url, display_order, caption, is_primary)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600428687810-5e888a5d9f85?w=1000&h=1000&fit=crop',
  3,
  'Application Demo',
  false
FROM public.gallery WHERE title = 'Aloe Vera Soothing Gel' LIMIT 1;

-- 완료!
SELECT 
  'Sample products created!' as status,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IN (SELECT id FROM public.product_categories WHERE name = 'Daddy Bath Bomb')) as bath_bomb_count,
  (SELECT COUNT(*) FROM public.gallery WHERE product_category_id IN (SELECT id FROM public.product_categories WHERE name = 'Daddy Bath Gel')) as bath_gel_count,
  (SELECT COUNT(*) FROM public.gallery_images) as total_slider_images;
