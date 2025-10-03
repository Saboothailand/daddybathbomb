-- ==========================================
-- 🔒 배너 RLS 정책 및 함수 완전 설정
-- Supabase SQL Editor에서 이 파일 전체를 실행하세요!
-- ==========================================

-- 1. RLS 활성화
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Public read access for active banners" ON public.banner_images;
DROP POLICY IF EXISTS "Admin full access for banner_images" ON public.banner_images;

-- 3. 공개 읽기 정책 (모든 사용자가 활성 배너 읽기 가능)
CREATE POLICY "Public read access for active banners" ON public.banner_images
    FOR SELECT 
    TO public
    USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

-- 4. 관리자 전체 접근 정책
-- ⚠️ 주의: .env 파일의 VITE_ADMIN_EMAIL과 동일해야 합니다!
CREATE POLICY "Admin full access for banner_images" ON public.banner_images
    FOR ALL 
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'poweryongin@gmail.com');

-- 5. admin_list_banner_images 함수 생성
CREATE OR REPLACE FUNCTION public.admin_list_banner_images()
RETURNS SETOF public.banner_images
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.banner_images
  ORDER BY position, display_order, created_at DESC;
$$;

-- 6. 함수 실행 권한 부여 (anon과 authenticated 모두)
GRANT EXECUTE ON FUNCTION public.admin_list_banner_images() TO anon, authenticated;

-- 7. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_banner_images_position_active 
    ON public.banner_images(position, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banner_images_dates 
    ON public.banner_images(start_date, end_date);

-- 8. Middle & Bottom 배너 데이터 삽입
INSERT INTO public.banner_images (
    title, description, image_url, link_url,
    position, display_order, is_active
) VALUES
-- MIDDLE 배너 (FunFeatures 아래)
('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free! 🎁', 
 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop&q=80', 
 '/products', 'middle', 1, true),
('Gift Sets Available', 'Perfect gifts for your loved ones! 🎀', 
 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=500&fit=crop&q=80', 
 '/products', 'middle', 2, true),
('Natural Ingredients', '100% natural and safe for the whole family! 🌿', 
 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=500&fit=crop&q=80', 
 '/products', 'middle', 3, true),

-- BOTTOM 배너 (HowToUse 아래)
('Ready for Super Fun?', 'Get your superhero bath bombs now! 🎉', 
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop&q=80', 
 '/products', 'bottom', 1, true),
('Follow Us on Social Media', 'Stay updated with our latest products! 📱', 
 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=500&fit=crop&q=80', 
 'https://instagram.com/daddybathbomb', 'bottom', 2, true),
('Join Our Community', 'Be part of the Daddy Bath Bomb family! 💜', 
 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=500&fit=crop&q=80', 
 '/contact', 'bottom', 3, true)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 9. 확인 쿼리
-- ==========================================

-- 모든 배너 조회 (이제 anon 키로도 가능해야 함!)
SELECT 
    position,
    title,
    is_active,
    display_order,
    created_at
FROM public.banner_images
ORDER BY position, display_order;

-- 위치별 배너 개수
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

-- ==========================================
-- ✅ 완료!
-- ==========================================

-- 다음 단계:
-- 1. Supabase에서 "Run as anon" 으로 위의 SELECT 쿼리가 성공하는지 확인
-- 2. 브라우저에서 Ctrl+Shift+R (강력 새로고침)
-- 3. Middle/Bottom 배너가 나타나는지 확인!

