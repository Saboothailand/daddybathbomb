-- ========================================
-- 🚀 Middle & Bottom 배너 즉시 추가하기
-- Supabase SQL Editor에서 이 파일 전체를 복사해서 실행하세요!
-- ========================================

-- 1. 기존 테스트 데이터 확인
SELECT 
    position,
    COUNT(*) as count,
    string_agg(title, ', ') as titles
FROM public.banner_images
GROUP BY position
ORDER BY position;

-- 2. Middle & Bottom 배너 추가
INSERT INTO public.banner_images (
    title, 
    description, 
    image_url, 
    link_url,
    position, 
    display_order, 
    is_active
) VALUES
-- ===== MIDDLE 배너 (FunFeatures 아래) =====
(
    'Special Promotion',
    'Limited time offer - Buy 2 Get 1 Free! 🎁',
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop&q=80',
    '/products',
    'middle',
    1,
    true
),
(
    'Gift Sets Available',
    'Perfect gifts for your loved ones! 🎀',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=500&fit=crop&q=80',
    '/products',
    'middle',
    2,
    true
),
(
    'Natural Ingredients',
    '100% natural and safe for the whole family! 🌿',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=500&fit=crop&q=80',
    '/products',
    'middle',
    3,
    true
),

-- ===== BOTTOM 배너 (HowToUse 아래) =====
(
    'Ready for Super Fun?',
    'Get your superhero bath bombs now! 🎉',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop&q=80',
    '/products',
    'bottom',
    1,
    true
),
(
    'Follow Us on Social Media',
    'Stay updated with our latest products and special offers! 📱',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=500&fit=crop&q=80',
    'https://instagram.com/daddybathbomb',
    'bottom',
    2,
    true
),
(
    'Join Our Community',
    'Be part of the Daddy Bath Bomb family! 💜',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=500&fit=crop&q=80',
    '/contact',
    'bottom',
    3,
    true
)
ON CONFLICT DO NOTHING;

-- 3. 추가 후 확인
SELECT 
    id,
    title,
    position,
    display_order,
    is_active,
    SUBSTRING(image_url, 1, 50) as image_preview,
    created_at
FROM public.banner_images
WHERE position IN ('middle', 'bottom')
ORDER BY position, display_order;

-- 4. 전체 배너 개수 확인
SELECT 
    position,
    COUNT(*) as total,
    SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active
FROM public.banner_images
GROUP BY position
ORDER BY 
    CASE position
        WHEN 'hero' THEN 1
        WHEN 'middle' THEN 2
        WHEN 'bottom' THEN 3
        WHEN 'sidebar' THEN 4
        ELSE 5
    END;

-- ========================================
-- ✅ 완료!
-- 이제 웹사이트를 새로고침하세요 (Ctrl+Shift+R)
-- ========================================



