-- 배너 이미지 관리 테이블
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 배너 이미지 테이블 (상단/중간/하단 배너 관리)
CREATE TABLE IF NOT EXISTS public.banner_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT, -- 클릭 시 이동할 URL (선택사항)
    position TEXT NOT NULL CHECK (position IN ('hero', 'middle', 'bottom', 'sidebar')), -- 배너 위치
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE, -- 배너 시작 날짜 (선택사항)
    end_date TIMESTAMP WITH TIME ZONE, -- 배너 종료 날짜 (선택사항)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 배너 클릭 통계 테이블 (선택사항)
CREATE TABLE IF NOT EXISTS public.banner_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    banner_id UUID REFERENCES public.banner_images(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    ip_address INET,
    user_agent TEXT
);

-- RLS 정책 설정
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_clicks ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성 배너 읽기 가능
CREATE POLICY "Public read access for active banners" ON public.banner_images
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

-- 관리자만 배너 관리 가능
CREATE POLICY "Admin full access for banner_images" ON public.banner_images
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 배너 클릭은 모든 사용자가 추가 가능
CREATE POLICY "Public insert for banner_clicks" ON public.banner_clicks
    FOR INSERT WITH CHECK (true);

-- 관리자만 클릭 통계 조회 가능
CREATE POLICY "Admin read access for banner_clicks" ON public.banner_clicks
    FOR SELECT USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 업데이트 트리거 추가
CREATE TRIGGER update_banner_images_updated_at
    BEFORE UPDATE ON public.banner_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 배너 데이터 삽입
INSERT INTO public.banner_images (title, description, image_url, position, display_order) VALUES
-- Hero 배너 (메인 상단)
('Welcome to Daddy Bath Bomb', 'Premium natural bath bombs for ultimate relaxation', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'hero', 1),
('Luxury Spa Experience', 'Transform your home into a luxury spa', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop', 'hero', 2),
('Natural Ingredients', '100% natural and safe for the whole family', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=600&fit=crop', 'hero', 3),

-- Middle 배너 (중간 섹션)
('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=400&fit=crop', 'middle', 1),
('Gift Sets Available', 'Perfect gifts for your loved ones', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=400&fit=crop', 'middle', 2),

-- Bottom 배너 (하단 섹션)
('Follow Us on Social Media', 'Stay updated with our latest products and offers', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=300&fit=crop', 'bottom', 1),
('Newsletter Signup', 'Get exclusive deals and bath tips delivered to your inbox', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=300&fit=crop&sig=newsletter', 'bottom', 2);

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_banner_images_position_active ON public.banner_images(position, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banner_images_dates ON public.banner_images(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_banner_clicks_banner_date ON public.banner_clicks(banner_id, clicked_at);

-- 뷰 생성 (현재 활성 배너 조회용)
CREATE OR REPLACE VIEW public.active_banners AS
SELECT 
    id,
    title,
    description,
    image_url,
    link_url,
    position,
    display_order,
    created_at,
    updated_at
FROM public.banner_images
WHERE 
    is_active = true 
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW())
ORDER BY position, display_order;

-- 함수: 배너 클릭 기록
CREATE OR REPLACE FUNCTION record_banner_click(
    p_banner_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.banner_clicks (banner_id, ip_address, user_agent)
    VALUES (p_banner_id, p_ip_address, p_user_agent);
END;
$$;

-- 함수: 배너 통계 조회
CREATE OR REPLACE FUNCTION get_banner_stats(p_banner_id UUID DEFAULT NULL)
RETURNS TABLE (
    banner_id UUID,
    banner_title TEXT,
    total_clicks BIGINT,
    clicks_today BIGINT,
    clicks_this_week BIGINT,
    clicks_this_month BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bi.id,
        bi.title,
        COUNT(bc.id) as total_clicks,
        COUNT(CASE WHEN bc.clicked_at >= CURRENT_DATE THEN 1 END) as clicks_today,
        COUNT(CASE WHEN bc.clicked_at >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) as clicks_this_week,
        COUNT(CASE WHEN bc.clicked_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as clicks_this_month
    FROM public.banner_images bi
    LEFT JOIN public.banner_clicks bc ON bi.id = bc.banner_id
    WHERE (p_banner_id IS NULL OR bi.id = p_banner_id)
    GROUP BY bi.id, bi.title
    ORDER BY total_clicks DESC;
END;
$$;
