-- 배너 데이터 빠른 수정
-- 먼저 기존 데이터 확인
SELECT position, COUNT(*) as count FROM banner_images GROUP BY position;

-- 기존 middle, bottom 배너 삭제 (중복 방지)
DELETE FROM banner_images WHERE position IN ('middle', 'bottom');

-- middle과 bottom 배너 추가
INSERT INTO banner_images (title, description, image_url, link_url, position, display_order, is_active, start_date, end_date)
VALUES 
  ('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free! 🎁', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=500&fit=crop&q=80', '/products', 'middle', 1, true, NULL, NULL),
  ('Gift Sets Available', 'Perfect gifts for your loved ones', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&h=500&fit=crop&q=80', '/products', 'middle', 2, true, NULL, NULL),
  ('Follow Us', 'Stay updated with our latest products', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=500&fit=crop&q=80', 'https://instagram.com/daddybathbomb', 'bottom', 1, true, NULL, NULL),
  ('New Collection', 'Check out our latest bath bomb collection', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop&q=80', '/products', 'bottom', 2, true, NULL, NULL);

-- 결과 확인
SELECT position, COUNT(*) as count FROM banner_images GROUP BY position;
