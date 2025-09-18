-- 누락된 테이블들 생성
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 1. Features 테이블 (특징 관리)
CREATE TABLE IF NOT EXISTS public.features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    icon TEXT, -- 이모지 아이콘
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Gallery Images 테이블 (Instagram 갤러리)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Banner Images 테이블 (배너 관리)
CREATE TABLE IF NOT EXISTS public.banner_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT, -- 클릭 시 이동할 URL
    position TEXT NOT NULL CHECK (position IN ('hero', 'middle', 'bottom', 'sidebar')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE, -- 시작 날짜
    end_date TIMESTAMP WITH TIME ZONE, -- 종료 날짜
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Branding Settings 테이블 (로고, 색상 등)
CREATE TABLE IF NOT EXISTS public.branding_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    logo_url TEXT, -- 메인 로고 이미지
    logo_dark_url TEXT, -- 다크모드 로고
    favicon_url TEXT, -- 파비콘
    site_title TEXT DEFAULT 'Daddy Bath Bomb',
    site_description TEXT DEFAULT 'Premium natural bath bombs',
    primary_color TEXT DEFAULT '#ec4899',
    secondary_color TEXT DEFAULT '#8b5cf6',
    accent_color TEXT DEFAULT '#06b6d4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. App Settings 테이블 (이미 있을 수 있지만 확인)
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    category TEXT DEFAULT 'general',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS 정책 설정
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public read features" ON public.features FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery" ON public.gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public read banners" ON public.banner_images FOR SELECT USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW())
);
CREATE POLICY "Public read branding" ON public.branding_settings FOR SELECT USING (true);

-- 관리자 전체 접근 정책
CREATE POLICY "Admin full features" ON public.features FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');
CREATE POLICY "Admin full gallery" ON public.gallery_images FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');
CREATE POLICY "Admin full banners" ON public.banner_images FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');
CREATE POLICY "Admin full branding" ON public.branding_settings FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 업데이트 트리거 (update_updated_at_column 함수가 있다고 가정)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON public.features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_banner_images_updated_at BEFORE UPDATE ON public.banner_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_branding_settings_updated_at BEFORE UPDATE ON public.branding_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 샘플 데이터 삽입
INSERT INTO public.features (title, description, image_url, icon, display_order) VALUES
('Natural Ingredients', 'Made from 100% natural ingredients, safe for the whole family', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=400&fit=crop', '🌿', 1),
('Beautiful Fizzy Colors', 'Beautiful colorful fizz with relaxing aromatherapy scents', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop', '✨', 2),
('Skin Nourishing', 'Moisturizes and nourishes skin for smooth, soft feeling after bath', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=400&fit=crop', '💧', 3),
('Perfect Gift', 'Perfect gift for special people on any occasion', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&sig=gift', '🎁', 4)
ON CONFLICT DO NOTHING;

INSERT INTO public.gallery_images (image_url, caption, display_order) VALUES
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Relaxing bath time with our premium bath bombs', 1),
('https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop', 'Natural ingredients for healthy skin', 2),
('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop', 'Luxury spa experience at home', 3),
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&sig=2', 'Beautiful fizzy colors and scents', 4),
('https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&sig=3', 'Perfect for family relaxation time', 5),
('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&sig=4', 'Premium quality bath products', 6)
ON CONFLICT DO NOTHING;

INSERT INTO public.banner_images (title, description, image_url, position, display_order) VALUES
('Welcome to Daddy Bath Bomb', 'Premium natural bath bombs for ultimate relaxation', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'hero', 1),
('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=400&fit=crop', 'middle', 1),
('Follow Us on Social Media', 'Stay updated with our latest products', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=300&fit=crop', 'bottom', 1)
ON CONFLICT DO NOTHING;

INSERT INTO public.branding_settings (site_title, site_description, primary_color, secondary_color, accent_color) VALUES
('Daddy Bath Bomb', 'Premium natural bath bombs for ultimate relaxation experience', '#ec4899', '#8b5cf6', '#06b6d4')
ON CONFLICT DO NOTHING;

INSERT INTO public.app_settings (key, value, category, description) VALUES
('instagram_url', 'https://instagram.com/daddybathbomb', 'social', 'Instagram page URL'),
('facebook_url', 'https://facebook.com/daddybathbomb', 'social', 'Facebook page URL'),
('hero_slider_interval', '5000', 'ui', 'Hero slider transition time in milliseconds')
ON CONFLICT (key) DO NOTHING;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_features_active_order ON public.features(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_active_order ON public.gallery_images(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banners_position_active ON public.banner_images(position, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(key);

