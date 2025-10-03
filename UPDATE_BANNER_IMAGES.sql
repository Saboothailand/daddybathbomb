-- ==========================================
-- 🎨 배너 이미지 업데이트
-- 더 좋은 Unsplash 이미지로 교체
-- ==========================================

-- Middle 배너 이미지 업데이트
UPDATE public.banner_images 
SET image_url = 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=500&fit=crop&q=80'
WHERE position = 'middle' AND title = 'Special Promotion';
-- 🎁 선물 박스와 리본 - 프로모션에 완벽!

UPDATE public.banner_images 
SET image_url = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&h=500&fit=crop&q=80'
WHERE position = 'middle' AND title = 'Gift Sets Available';
-- 🎀 아름다운 선물 세트 이미지

UPDATE public.banner_images 
SET image_url = 'https://images.unsplash.com/photo-1608181078989-8c4484d1edd7?w=1200&h=500&fit=crop&q=80'
WHERE position = 'middle' AND title = 'Natural Ingredients';
-- 🌿 천연 스파 제품 이미지

-- Bottom 배너 이미지 업데이트
UPDATE public.banner_images 
SET image_url = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=500&fit=crop&q=80'
WHERE position = 'bottom' AND title = 'Follow Us on Social Media';
-- 📱 소셜 미디어 느낌의 이미지

UPDATE public.banner_images 
SET image_url = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=500&fit=crop&q=80'
WHERE position = 'bottom' AND title = 'Newsletter Signup';
-- 💌 뉴스레터/이메일 느낌

UPDATE public.banner_images 
SET image_url = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=500&fit=crop&q=80'
WHERE position = 'bottom' AND title LIKE '%Community%';
-- 👥 커뮤니티/함께하는 느낌

-- 확인
SELECT 
    position,
    title,
    SUBSTRING(image_url, 1, 60) as image_preview
FROM public.banner_images
WHERE position IN ('middle', 'bottom')
ORDER BY position, display_order;

-- ==========================================
-- 대체 이미지 옵션들 (원하는 것으로 교체 가능)
-- ==========================================

/*
프로모션/세일 이미지:
- https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da (핑크 선물 박스)
- https://images.unsplash.com/photo-1549465220-1a8b9238cd48 (럭셔리 선물)
- https://images.unsplash.com/photo-1513885535751-8b9238bd345a (쇼핑백)

바스밤/스파 이미지:
- https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b (핑크 바스밤)
- https://images.unsplash.com/photo-1608181078989-8c4484d1edd7 (스파 제품)
- https://images.unsplash.com/photo-1596755389378-c31d21fd1273 (천연 제품)

소셜 미디어:
- https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7 (인스타그램)
- https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0 (소셜미디어 아이콘)
- https://images.unsplash.com/photo-1563986768609-322da13575f3 (인스타 느낌)

커뮤니티/사람들:
- https://images.unsplash.com/photo-1522071820081-009f0129c71c (팀워크)
- https://images.unsplash.com/photo-1529156069898-49953e39b3ac (친구들)
- https://images.unsplash.com/photo-1511632765486-a01980e01a18 (즐거운 사람들)
*/

-- ==========================================
-- 특정 이미지만 변경하려면:
-- ==========================================

-- 예시: Special Promotion만 변경
/*
UPDATE public.banner_images 
SET image_url = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop&q=80'
WHERE position = 'middle' AND title = 'Special Promotion';
*/



