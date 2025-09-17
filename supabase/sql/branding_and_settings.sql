-- 브랜딩 및 사이트 설정 테이블
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 브랜딩 설정 테이블 (로고, 파비콘, 색상 등)
CREATE TABLE IF NOT EXISTS public.branding_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    logo_url TEXT, -- 메인 로고 이미지 URL
    logo_dark_url TEXT, -- 다크모드용 로고 (선택사항)
    favicon_url TEXT, -- 파비콘 URL
    site_title TEXT DEFAULT 'Daddy Bath Bomb',
    site_description TEXT DEFAULT 'Premium natural bath bombs for relaxation',
    primary_color TEXT DEFAULT '#ec4899', -- 핑크색
    secondary_color TEXT DEFAULT '#8b5cf6', -- 보라색
    accent_color TEXT DEFAULT '#06b6d4', -- 청록색
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 사이트 전반적인 설정 확장
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS description TEXT;

-- RLS 정책 설정
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Public read access for branding_settings" ON public.branding_settings
    FOR SELECT USING (true);

-- 관리자만 수정 가능
CREATE POLICY "Admin full access for branding_settings" ON public.branding_settings
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 업데이트 트리거 추가
CREATE TRIGGER update_branding_settings_updated_at
    BEFORE UPDATE ON public.branding_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 초기 브랜딩 데이터 삽입 (기본값)
INSERT INTO public.branding_settings (
    site_title, 
    site_description, 
    primary_color, 
    secondary_color, 
    accent_color
) VALUES (
    'Daddy Bath Bomb',
    'Premium natural bath bombs for ultimate relaxation experience',
    '#ec4899',
    '#8b5cf6', 
    '#06b6d4'
) ON CONFLICT DO NOTHING;

-- 추가 사이트 설정 데이터
INSERT INTO public.app_settings (key, value, category, description) VALUES
('site_name', 'Daddy Bath Bomb', 'branding', 'Website name displayed in header'),
('tagline', 'Premium Bath Experience', 'branding', 'Site tagline or slogan'),
('contact_email', 'hello@daddybathbomb.com', 'contact', 'Main contact email'),
('contact_phone', '+66-XXX-XXX-XXXX', 'contact', 'Contact phone number'),
('business_hours', 'Mon-Fri 9AM-6PM', 'contact', 'Business operating hours'),
('shipping_info', 'Free shipping nationwide', 'ecommerce', 'Shipping information'),
('return_policy', '30-day return policy', 'ecommerce', 'Return policy text'),
('currency', 'THB', 'ecommerce', 'Default currency'),
('language_default', 'th', 'localization', 'Default site language'),
('timezone', 'Asia/Bangkok', 'localization', 'Site timezone')
ON CONFLICT (key) DO NOTHING;

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_app_settings_category ON public.app_settings(category);
CREATE INDEX IF NOT EXISTS idx_branding_settings_updated_at ON public.branding_settings(updated_at DESC);

-- 뷰 생성 (편리한 데이터 조회용)
CREATE OR REPLACE VIEW public.site_config AS
SELECT 
    bs.logo_url,
    bs.logo_dark_url,
    bs.favicon_url,
    bs.site_title,
    bs.site_description,
    bs.primary_color,
    bs.secondary_color,
    bs.accent_color,
    bs.updated_at as branding_updated_at,
    (SELECT value FROM public.app_settings WHERE key = 'instagram_url') as instagram_url,
    (SELECT value FROM public.app_settings WHERE key = 'facebook_url') as facebook_url,
    (SELECT value FROM public.app_settings WHERE key = 'contact_email') as contact_email,
    (SELECT value FROM public.app_settings WHERE key = 'contact_phone') as contact_phone
FROM public.branding_settings bs
ORDER BY bs.updated_at DESC
LIMIT 1;

-- 함수: 브랜딩 설정 업데이트 (upsert)
CREATE OR REPLACE FUNCTION update_branding_setting(
    p_logo_url TEXT DEFAULT NULL,
    p_logo_dark_url TEXT DEFAULT NULL,
    p_favicon_url TEXT DEFAULT NULL,
    p_site_title TEXT DEFAULT NULL,
    p_site_description TEXT DEFAULT NULL,
    p_primary_color TEXT DEFAULT NULL,
    p_secondary_color TEXT DEFAULT NULL,
    p_accent_color TEXT DEFAULT NULL
)
RETURNS public.branding_settings
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result public.branding_settings;
BEGIN
    -- 기존 레코드 업데이트 또는 새로 생성
    INSERT INTO public.branding_settings (
        logo_url, logo_dark_url, favicon_url, site_title, site_description,
        primary_color, secondary_color, accent_color
    ) VALUES (
        p_logo_url, p_logo_dark_url, p_favicon_url, p_site_title, p_site_description,
        p_primary_color, p_secondary_color, p_accent_color
    )
    ON CONFLICT (id) DO UPDATE SET
        logo_url = COALESCE(p_logo_url, branding_settings.logo_url),
        logo_dark_url = COALESCE(p_logo_dark_url, branding_settings.logo_dark_url),
        favicon_url = COALESCE(p_favicon_url, branding_settings.favicon_url),
        site_title = COALESCE(p_site_title, branding_settings.site_title),
        site_description = COALESCE(p_site_description, branding_settings.site_description),
        primary_color = COALESCE(p_primary_color, branding_settings.primary_color),
        secondary_color = COALESCE(p_secondary_color, branding_settings.secondary_color),
        accent_color = COALESCE(p_accent_color, branding_settings.accent_color),
        updated_at = NOW()
    RETURNING * INTO result;
    
    RETURN result;
END;
$$;
