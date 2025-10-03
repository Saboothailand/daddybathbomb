-- 배너 정책 수정 - 기존 정책 삭제 후 재생성
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 기존 정책들 삭제 (에러 방지)
DROP POLICY IF EXISTS "Public read access for active banners" ON public.banner_images;
DROP POLICY IF EXISTS "Admin full access for banner_images" ON public.banner_images;
DROP POLICY IF EXISTS "Public insert for banner_clicks" ON public.banner_clicks;
DROP POLICY IF EXISTS "Admin read access for banner_clicks" ON public.banner_clicks;

-- 새로운 정책들 생성
CREATE POLICY "Public read access for active banners" ON public.banner_images
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

CREATE POLICY "Admin full access for banner_images" ON public.banner_images
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Public insert for banner_clicks" ON public.banner_clicks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read access for banner_clicks" ON public.banner_clicks
    FOR SELECT USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 미들 배너 샘플 데이터 삽입 (텍스트 없음)
INSERT INTO public.banner_images (title, description, image_url, position, display_order, is_active) 
VALUES 
    ('', '', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'middle', 1, true)
ON CONFLICT DO NOTHING;

-- 결과 확인
SELECT position, COUNT(*) as count FROM public.banner_images GROUP BY position;

