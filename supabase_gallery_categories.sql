-- 갤러리 카테고리 관리 테이블
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 1. 갤러리 카테고리 테이블
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_th TEXT NOT NULL,
    description TEXT,
    description_th TEXT,
    color TEXT DEFAULT '#3B82F6', -- 카테고리 색상
    icon TEXT DEFAULT '📷', -- 카테고리 아이콘
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. 갤러리 테이블에 카테고리 ID 컬럼 추가
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.gallery_categories(id) ON DELETE SET NULL;

-- 3. RLS 정책 설정
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성 카테고리 읽기 가능
CREATE POLICY "Public read access for active categories" ON public.gallery_categories
    FOR SELECT USING (is_active = true);

-- 관리자만 카테고리 관리 가능
CREATE POLICY "Admin full access for gallery_categories" ON public.gallery_categories
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 4. 업데이트 트리거 추가
CREATE TRIGGER update_gallery_categories_updated_at
    BEFORE UPDATE ON public.gallery_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. 샘플 카테고리 데이터 삽입
INSERT INTO public.gallery_categories (name, name_th, description, description_th, color, icon, display_order) VALUES
('All', 'ทั้งหมด', 'All gallery items', 'รายการทั้งหมด', '#6B7280', '📷', 0),
('Products', 'สินค้า', 'Product photos and reviews', 'รูปภาพสินค้าและรีวิว', '#3B82F6', '🛍️', 1),
('Lifestyle', 'ไลฟ์สไตล์', 'Lifestyle and daily photos', 'รูปภาพไลฟ์สไตล์และชีวิตประจำวัน', '#10B981', '✨', 2),
('Reviews', 'รีวิว', 'Customer reviews and testimonials', 'รีวิวลูกค้าและคำรับรอง', '#F59E0B', '⭐', 3),
('Tutorials', 'วิธีใช้', 'How-to guides and tutorials', 'คู่มือและวิธีใช้', '#8B5CF6', '📚', 4),
('Events', 'กิจกรรม', 'Events and promotions', 'กิจกรรมและโปรโมชั่น', '#EF4444', '🎉', 5);

-- 6. 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_gallery_categories_active_order ON public.gallery_categories(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_category_id ON public.gallery(category_id);

-- 7. 뷰 생성 (현재 활성 카테고리 조회용)
CREATE OR REPLACE VIEW public.active_gallery_categories AS
SELECT 
    id,
    name,
    name_th,
    description,
    description_th,
    color,
    icon,
    display_order,
    created_at,
    updated_at
FROM public.gallery_categories
WHERE is_active = true
ORDER BY display_order, name;
