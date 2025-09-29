-- Supabase 테이블 설정 SQL 스크립트 (안전한 버전)
-- 이 파일의 내용을 Supabase SQL Editor에서 실행하세요

-- 1. Hero Banners 테이블 생성 또는 수정
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

-- 누락된 컬럼 추가 (기존 테이블이 있는 경우)
DO $$ 
BEGIN
    -- tagline 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'tagline') THEN
        ALTER TABLE public.hero_banners ADD COLUMN tagline TEXT;
    END IF;
    
    -- primary_button_text 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'primary_button_text') THEN
        ALTER TABLE public.hero_banners ADD COLUMN primary_button_text TEXT;
    END IF;
    
    -- secondary_button_text 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'secondary_button_text') THEN
        ALTER TABLE public.hero_banners ADD COLUMN secondary_button_text TEXT;
    END IF;
    
    -- icon_name 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'icon_name') THEN
        ALTER TABLE public.hero_banners ADD COLUMN icon_name TEXT DEFAULT 'Heart';
    END IF;
    
    -- icon_color 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'icon_color') THEN
        ALTER TABLE public.hero_banners ADD COLUMN icon_color TEXT DEFAULT '#FF2D55';
    END IF;
    
    -- is_active 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'is_active') THEN
        ALTER TABLE public.hero_banners ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- display_order 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'display_order') THEN
        ALTER TABLE public.hero_banners ADD COLUMN display_order INTEGER DEFAULT 1;
    END IF;
    
    -- created_at 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'created_at') THEN
        ALTER TABLE public.hero_banners ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- updated_at 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_banners' AND column_name = 'updated_at') THEN
        ALTER TABLE public.hero_banners ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

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

-- 3. RLS 정책 설정
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Allow read access to hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Allow admin to manage hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Public read access for active banners" ON public.banner_images;
DROP POLICY IF EXISTS "Admin full access for banner_images" ON public.banner_images;

-- Hero Banners 정책 생성
CREATE POLICY "Allow read access to hero banners" ON public.hero_banners
    FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage hero banners" ON public.hero_banners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Banner Images 정책 생성
CREATE POLICY "Public read access for active banners" ON public.banner_images
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

CREATE POLICY "Admin full access for banner_images" ON public.banner_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS update_hero_banners_updated_at ON public.hero_banners;
DROP TRIGGER IF EXISTS update_banner_images_updated_at ON public.banner_images;

CREATE TRIGGER update_hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banner_images_updated_at
    BEFORE UPDATE ON public.banner_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. 기존 데이터 삭제 (새로 시작하려면)
-- DELETE FROM public.hero_banners;
-- DELETE FROM public.banner_images;

-- 6. 샘플 데이터 삽입
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
)
ON CONFLICT (id) DO NOTHING;

-- Banner Images 샘플 데이터
INSERT INTO public.banner_images (title, description, image_url, position, display_order) VALUES
('Welcome to Daddy Bath Bomb', 'Premium natural bath bombs for ultimate relaxation', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'hero', 1),
('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=400&fit=crop', 'middle', 1),
('Follow Us on Social Media', 'Stay updated with our latest products and offers', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=300&fit=crop', 'bottom', 1)
ON CONFLICT (id) DO NOTHING;

-- 7. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_hero_banners_display_order ON public.hero_banners(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_banners_is_active ON public.hero_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banner_images_position_active ON public.banner_images(position, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banner_images_dates ON public.banner_images(start_date, end_date);

-- 8. 테이블 구조 확인
SELECT 'Tables setup completed successfully' as status;

-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('hero_banners', 'banner_images')
ORDER BY table_name;

-- 컬럼 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'hero_banners' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 데이터 개수 확인
SELECT 'hero_banners' as table_name, COUNT(*) as record_count FROM public.hero_banners
UNION ALL
SELECT 'banner_images' as table_name, COUNT(*) as record_count FROM public.banner_images;
