-- 누락된 테이블들과 RPC 함수들 수정
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 1. site_settings 테이블 생성 (app_settings와 통합)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text', -- 'text', 'number', 'boolean', 'json'
    is_public BOOLEAN DEFAULT false, -- 공개 설정인지 여부
    category TEXT DEFAULT 'general',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. gallery 테이블 생성 (gallery_images와 동일)
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. features 테이블이 없다면 생성
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

-- 4. banners 테이블 생성 (banner_images와 동일)
CREATE TABLE IF NOT EXISTS public.banners (
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

-- RLS 정책 설정
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public read features" ON public.features FOR SELECT USING (is_active = true);
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW())
);

-- 관리자 전체 접근 정책
CREATE POLICY "Admin full site_settings" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Admin full gallery" ON public.gallery FOR ALL USING (true);
CREATE POLICY "Admin full features" ON public.features FOR ALL USING (true);
CREATE POLICY "Admin full banners" ON public.banners FOR ALL USING (true);

-- RPC 함수들 생성

-- 1. admin_list_banner_images 함수
CREATE OR REPLACE FUNCTION admin_list_banner_images()
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    position TEXT,
    display_order INTEGER,
    is_active BOOLEAN,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.description,
        b.image_url,
        b.link_url,
        b.position,
        b.display_order,
        b.is_active,
        b.start_date,
        b.end_date,
        b.created_at,
        b.updated_at
    FROM public.banners b
    ORDER BY b.display_order ASC, b.created_at DESC;
END;
$$;

-- 2. get_current_branding 함수
CREATE OR REPLACE FUNCTION get_current_branding()
RETURNS TABLE (
    logo_url TEXT,
    site_title TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    accent_color TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(ss1.setting_value, '') as logo_url,
        COALESCE(ss2.setting_value, 'Daddy Bath Bomb') as site_title,
        COALESCE(ss3.setting_value, '#FF2D55') as primary_color,
        COALESCE(ss4.setting_value, '#007AFF') as secondary_color,
        COALESCE(ss5.setting_value, '#FFD700') as accent_color
    FROM public.site_settings ss1
    FULL OUTER JOIN public.site_settings ss2 ON true
    FULL OUTER JOIN public.site_settings ss3 ON true
    FULL OUTER JOIN public.site_settings ss4 ON true
    FULL OUTER JOIN public.site_settings ss5 ON true
    WHERE 
        (ss1.setting_key = 'logo_url' OR ss1.setting_key IS NULL)
        AND (ss2.setting_key = 'site_title' OR ss2.setting_key IS NULL)
        AND (ss3.setting_key = 'primary_color' OR ss3.setting_key IS NULL)
        AND (ss4.setting_key = 'secondary_color' OR ss4.setting_key IS NULL)
        AND (ss5.setting_key = 'accent_color' OR ss5.setting_key IS NULL)
    LIMIT 1;
END;
$$;

-- 3. update_updated_at_column 함수 (없다면 생성)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 트리거들 생성
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at
    BEFORE UPDATE ON public.gallery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_features_updated_at
    BEFORE UPDATE ON public.features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON public.banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 기본 데이터 삽입
INSERT INTO public.site_settings (setting_key, setting_value, is_public, category, description) VALUES
('logo_url', '', true, 'branding', 'Main logo URL'),
('site_title', 'Daddy Bath Bomb', true, 'branding', 'Site title'),
('primary_color', '#FF2D55', true, 'branding', 'Primary brand color'),
('secondary_color', '#007AFF', true, 'branding', 'Secondary brand color'),
('accent_color', '#FFD700', true, 'branding', 'Accent color')
ON CONFLICT (setting_key) DO NOTHING;

-- 샘플 갤러리 데이터
INSERT INTO public.gallery (image_url, caption, display_order, is_active) VALUES
('https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=500&fit=crop', 'Beautiful bath bomb colors', 1, true),
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop', 'Relaxing bath time', 2, true),
('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop', 'Natural ingredients', 3, true)
ON CONFLICT DO NOTHING;

-- 샘플 features 데이터
INSERT INTO public.features (title, description, image_url, icon, display_order, is_active) VALUES
('Natural Ingredients', 'Made from 100% natural ingredients, safe for the whole family', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=400&fit=crop', '🌿', 1, true),
('Beautiful Fizzy Colors', 'Beautiful colorful fizz with relaxing aromatherapy scents', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop', '✨', 2, true),
('Skin Nourishing', 'Moisturizes and nourishes skin for smooth, soft feeling after bath', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=400&fit=crop', '💧', 3, true)
ON CONFLICT DO NOTHING;

-- 샘플 banners 데이터
INSERT INTO public.banners (title, description, image_url, position, display_order, is_active) VALUES
('Hero Banner 1', 'Main hero banner', 'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=1200&h=400&fit=crop', 'hero', 1, true),
('Middle Banner 1', 'Middle section banner', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=300&fit=crop', 'middle', 1, true)
ON CONFLICT DO NOTHING;
