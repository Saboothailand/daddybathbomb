-- 최종 배너 수정 - RLS 정책 완전 재설정
-- 1. 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Public read access for active banners" ON public.banner_images;
DROP POLICY IF EXISTS "Admin full access for banner_images" ON public.banner_images;

-- 2. RLS 비활성화 후 재활성화
ALTER TABLE public.banner_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- 3. 공개 읽기 정책 생성 (더 간단하게)
CREATE POLICY "Allow public read access" ON public.banner_images
    FOR SELECT USING (is_active = true);

-- 4. 관리자 정책 생성
CREATE POLICY "Allow admin full access" ON public.banner_images
    FOR ALL 
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'poweryongin@gmail.com');

-- 5. 함수 재생성
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

-- 7. 테스트 쿼리 (anon 권한으로)
SELECT position, COUNT(*) as count 
FROM banner_images 
WHERE is_active = true 
GROUP BY position;


