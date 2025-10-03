-- 정책 에러 해결
-- 1. 기존 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'banner_images';

-- 2. 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Public read access for active banners" ON public.banner_images;
DROP POLICY IF EXISTS "Admin full access for banner_images" ON public.banner_images;

-- 3. RLS 활성화 (이미 활성화되어 있을 수 있음)
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- 4. 새로운 정책 생성
CREATE POLICY "Public read access for active banners" ON public.banner_images
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

CREATE POLICY "Admin full access for banner_images" ON public.banner_images
    FOR ALL 
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'poweryongin@gmail.com');

-- 5. 함수 생성 (있다면 삭제 후 재생성)
DROP FUNCTION IF EXISTS public.admin_list_banner_images();
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

-- 6. 함수 권한 부여
GRANT EXECUTE ON FUNCTION public.admin_list_banner_images TO anon, authenticated;

-- 7. 배너 데이터 추가
DELETE FROM banner_images WHERE position IN ('middle', 'bottom');

INSERT INTO banner_images (title, description, image_url, link_url, position, display_order, is_active, start_date, end_date)
VALUES 
  ('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free! 🎁', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=500&fit=crop&q=80', '/products', 'middle', 1, true, NULL, NULL),
  ('Gift Sets Available', 'Perfect gifts for your loved ones', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&h=500&fit=crop&q=80', '/products', 'middle', 2, true, NULL, NULL),
  ('Follow Us', 'Stay updated with our latest products', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=500&fit=crop&q=80', 'https://instagram.com/daddybathbomb', 'bottom', 1, true, NULL, NULL),
  ('New Collection', 'Check out our latest bath bomb collection', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop&q=80', '/products', 'bottom', 2, true, NULL, NULL);

-- 8. 결과 확인
SELECT position, COUNT(*) as count FROM banner_images GROUP BY position;


