-- ========================================
-- Bottom 배너 데이터 삽입하기
-- Supabase SQL Editor에서 실행하세요
-- ========================================

-- HowToUse 섹션 아래에 표시될 Bottom 배너들
INSERT INTO public.banner_images (
    title, 
    description, 
    image_url, 
    link_url,
    position, 
    display_order, 
    is_active
) VALUES
-- Bottom 배너 1: 제품 홍보
(
    'Ready for Super Fun?',
    'Get your superhero bath bombs now! 🎉',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop',
    '/products',
    'bottom',
    1,
    true
),
-- Bottom 배너 2: 소셜 미디어
(
    'Follow Us on Social Media',
    'Stay updated with our latest products and special offers! 📱',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=500&fit=crop',
    'https://instagram.com/daddybathbomb',
    'bottom',
    2,
    true
),
-- Bottom 배너 3: 스페셜 프로모션
(
    'Special Offer',
    'Limited time promotion - Buy 2 Get 1 Free! 🎁',
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop',
    '/products',
    'bottom',
    3,
    true
)
ON CONFLICT DO NOTHING;

-- ========================================
-- 확인용 쿼리: 모든 bottom 배너 조회
-- ========================================
SELECT 
    id,
    title,
    description,
    position,
    display_order,
    is_active,
    created_at
FROM public.banner_images
WHERE position = 'bottom'
ORDER BY display_order;

-- ========================================
-- 특정 배너 수정 예시
-- ========================================
-- 배너 제목 수정
-- UPDATE public.banner_images 
-- SET title = '새로운 제목'
-- WHERE position = 'bottom' AND display_order = 1;

-- 배너 이미지 수정
-- UPDATE public.banner_images 
-- SET image_url = '새로운_이미지_URL'
-- WHERE position = 'bottom' AND display_order = 1;

-- 배너 비활성화
-- UPDATE public.banner_images 
-- SET is_active = false
-- WHERE position = 'bottom' AND display_order = 1;

-- ========================================
-- 배너 삭제 예시
-- ========================================
-- 특정 배너 삭제
-- DELETE FROM public.banner_images 
-- WHERE position = 'bottom' AND display_order = 1;

-- 모든 bottom 배너 삭제 (주의!)
-- DELETE FROM public.banner_images WHERE position = 'bottom';



