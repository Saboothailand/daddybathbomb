-- Supabase 테이블 설정 SQL 스크립트
-- 이 파일의 내용을 Supabase SQL Editor에서 실행하세요

-- 1. Hero Banners 테이블 생성
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT,
    tagline TEXT,
    primary_button_text TEXT,
    secondary_button_text TEXT,
    image_url TEXT,
    icon_name TEXT DEFAULT 'Heart',
    icon_color TEXT DEFAULT '#FF2D55',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Banners RLS 정책 설정
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Allow read access to hero banners" ON public.hero_banners
    FOR SELECT USING (true);

-- 관리자만 모든 작업 가능 (임시로 모든 사용자 허용)
CREATE POLICY "Allow admin to manage hero banners" ON public.hero_banners
    FOR ALL USING (true);

-- Hero Banners 샘플 데이터 삽입
INSERT INTO public.hero_banners (
    title, subtitle, description, tagline, 
    primary_button_text, secondary_button_text, 
    image_url, icon_name, icon_color, is_active, display_order
) VALUES 
(
    'DADDY',
    'BATH BOMB',
    'ฮีโร่อ่างอาบน้ำ',
    'สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ',
    'ช้อปบาธบอม',
    'ดูเรื่องราวสีสัน',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=600&fit=crop',
    'Heart',
    '#FF2D55',
    true,
    1
),
(
    'FUN',
    'BATH TIME',
    'Make every bath an adventure!',
    'Fun & Fizzy Adventures',
    'Shop Now',
    'Learn More',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
    'Zap',
    '#007AFF',
    true,
    2
),
(
    'COLORS',
    'GALORE',
    'Rainbow of fun awaits you!',
    'Colorful Bath Experience',
    'Explore',
    'Gallery',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop',
    'Palette',
    '#00FF88',
    true,
    3
),
(
    'SPARKLE',
    'MAGIC',
    'Add sparkle to your day!',
    'Magical Bath Moments',
    'Discover',
    'Stories',
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=600&fit=crop',
    'Sparkles',
    '#FFD700',
    true,
    4
),
(
    'RELAX',
    'REVIVE',
    'Perfect relaxation time!',
    'Relaxing Bath Therapy',
    'Shop',
    'About',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=600&fit=crop',
    'Wind',
    '#AF52DE',
    true,
    5
),
(
    'FAMILY',
    'FUN',
    'Fun for the whole family!',
    'Family Bath Time',
    'Products',
    'Contact',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop',
    'Users',
    '#FF9F1C',
    true,
    6
);

-- 2. Banner Images 테이블 생성
CREATE TABLE IF NOT EXISTS public.banner_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    position TEXT NOT NULL CHECK (position IN ('hero', 'middle', 'bottom', 'sidebar')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Banner Images RLS 정책 설정
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성 배너 읽기 가능
CREATE POLICY "Public read access for active banners" ON public.banner_images
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

-- 관리자만 배너 관리 가능 (임시로 모든 사용자 허용)
CREATE POLICY "Admin full access for banner_images" ON public.banner_images
    FOR ALL USING (true);

-- Banner Images 샘플 데이터 삽입
INSERT INTO public.banner_images (title, description, image_url, position, display_order) VALUES
('Welcome to Daddy Bath Bomb', 'Premium natural bath bombs for ultimate relaxation', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'hero', 1),
('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=400&fit=crop', 'middle', 1),
('Gift Sets Available', 'Perfect gifts for your loved ones', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=400&fit=crop', 'middle', 2),
('Follow Us on Social Media', 'Stay updated with our latest products and offers', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=300&fit=crop', 'bottom', 1),
('Newsletter Signup', 'Get exclusive deals and bath tips delivered to your inbox', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=300&fit=crop&sig=newsletter', 'bottom', 2);

-- 3. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_hero_banners_display_order ON public.hero_banners(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_banners_is_active ON public.hero_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banner_images_position_active ON public.banner_images(position, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banner_images_dates ON public.banner_images(start_date, end_date);

-- 4. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hero Banners 업데이트 트리거
CREATE TRIGGER update_hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Banner Images 업데이트 트리거
CREATE TRIGGER update_banner_images_updated_at
    BEFORE UPDATE ON public.banner_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. 테이블 생성 확인 쿼리
SELECT 'Tables created successfully' as status;

-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('hero_banners', 'banner_images')
ORDER BY table_name;

-- 데이터 개수 확인
SELECT 'hero_banners' as table_name, COUNT(*) as record_count FROM public.hero_banners
UNION ALL
SELECT 'banner_images' as table_name, COUNT(*) as record_count FROM public.banner_images;
