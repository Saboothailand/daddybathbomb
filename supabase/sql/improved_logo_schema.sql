-- 개선된 로고 관리 시스템 스키마
-- 전용 branding_settings 테이블 생성으로 데이터 구조 일관성 확보

-- 1. 브랜딩 설정 전용 테이블 생성
CREATE TABLE IF NOT EXISTS public.branding_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 기본 브랜딩 정보
    site_title TEXT NOT NULL DEFAULT 'Daddy Bath Bomb',
    site_title_en TEXT DEFAULT 'Daddy Bath Bomb',
    site_description TEXT DEFAULT 'Premium natural bath bombs for ultimate relaxation experience',
    site_tagline TEXT DEFAULT 'Premium Bath Experience',
    
    -- 로고 설정
    logo_url TEXT,
    logo_mobile_url TEXT, -- 모바일용 로고
    logo_favicon_url TEXT, -- 파비콘
    logo_alt_text TEXT DEFAULT 'Daddy Bath Bomb Logo',
    logo_alt_text_en TEXT DEFAULT 'Daddy Bath Bomb Logo',
    
    -- 로고 크기 및 스타일
    logo_width INTEGER DEFAULT 48 CHECK (logo_width > 0 AND logo_width <= 500),
    logo_height INTEGER DEFAULT 48 CHECK (logo_height > 0 AND logo_height <= 500),
    logo_style TEXT DEFAULT 'rounded' CHECK (logo_style IN ('rounded', 'square', 'circle')),
    logo_enabled BOOLEAN DEFAULT true,
    
    -- 브랜드 컬러
    brand_primary_color TEXT DEFAULT '#FF2D55' CHECK (brand_primary_color ~ '^#[0-9A-Fa-f]{6}$'),
    brand_secondary_color TEXT DEFAULT '#007AFF' CHECK (brand_secondary_color ~ '^#[0-9A-Fa-f]{6}$'),
    brand_accent_color TEXT DEFAULT '#FFD700' CHECK (brand_accent_color ~ '^#[0-9A-Fa-f]{6}$'),
    
    -- 메타데이터
    logo_cache_version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- 2. 로고 변경 이력 테이블
CREATE TABLE IF NOT EXISTS public.logo_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branding_setting_id UUID REFERENCES public.branding_settings(id) ON DELETE CASCADE,
    
    -- 변경된 필드 정보
    changed_field TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    
    -- 메타데이터
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by UUID REFERENCES auth.users(id),
    change_reason TEXT DEFAULT 'Manual update'
);

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_branding_settings_active ON public.branding_settings(logo_enabled, updated_at);
CREATE INDEX IF NOT EXISTS idx_logo_history_branding ON public.logo_history(branding_setting_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_logo_history_user ON public.logo_history(changed_by, changed_at DESC);

-- 4. 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_branding_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.logo_cache_version = OLD.logo_cache_version + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 변경 이력 기록 트리거 함수
CREATE OR REPLACE FUNCTION log_branding_changes()
RETURNS TRIGGER AS $$
DECLARE
    field_name TEXT;
    old_val TEXT;
    new_val TEXT;
BEGIN
    -- 각 필드별로 변경사항 체크
    FOR field_name IN SELECT column_name FROM information_schema.columns 
                     WHERE table_name = 'branding_settings' 
                     AND column_name NOT IN ('id', 'created_at', 'updated_at', 'logo_cache_version')
    LOOP
        EXECUTE format('SELECT ($1).%I, ($2).%I', field_name, field_name) 
        INTO old_val, new_val USING OLD, NEW;
        
        -- 값이 변경된 경우 이력 기록
        IF old_val IS DISTINCT FROM new_val THEN
            INSERT INTO public.logo_history (
                branding_setting_id,
                changed_field,
                old_value,
                new_value,
                changed_by,
                change_reason
            ) VALUES (
                NEW.id,
                field_name,
                old_val::TEXT,
                new_val::TEXT,
                auth.uid(),
                'Admin update'
            );
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. 트리거 생성
DROP TRIGGER IF EXISTS branding_update_timestamp ON public.branding_settings;
CREATE TRIGGER branding_update_timestamp
    BEFORE UPDATE ON public.branding_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_branding_timestamp();

DROP TRIGGER IF EXISTS branding_change_log ON public.branding_settings;
CREATE TRIGGER branding_change_log
    AFTER UPDATE ON public.branding_settings
    FOR EACH ROW
    EXECUTE FUNCTION log_branding_changes();

-- 7. 개선된 로고 설정 관리 함수들

-- 현재 브랜딩 설정 조회 (단일 행 반환)
CREATE OR REPLACE FUNCTION get_current_branding()
RETURNS TABLE (
    id UUID,
    site_title TEXT,
    site_title_en TEXT,
    site_description TEXT,
    site_tagline TEXT,
    logo_url TEXT,
    logo_mobile_url TEXT,
    logo_favicon_url TEXT,
    logo_alt_text TEXT,
    logo_alt_text_en TEXT,
    logo_width INTEGER,
    logo_height INTEGER,
    logo_style TEXT,
    logo_enabled BOOLEAN,
    brand_primary_color TEXT,
    brand_secondary_color TEXT,
    brand_accent_color TEXT,
    logo_cache_version INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bs.id,
        bs.site_title,
        bs.site_title_en,
        bs.site_description,
        bs.site_tagline,
        bs.logo_url,
        bs.logo_mobile_url,
        bs.logo_favicon_url,
        bs.logo_alt_text,
        bs.logo_alt_text_en,
        bs.logo_width,
        bs.logo_height,
        bs.logo_style,
        bs.logo_enabled,
        bs.brand_primary_color,
        bs.brand_secondary_color,
        bs.brand_accent_color,
        bs.logo_cache_version,
        bs.updated_at
    FROM public.branding_settings bs
    ORDER BY bs.updated_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 브랜딩 설정 업데이트 함수 (개선된 버전)
CREATE OR REPLACE FUNCTION update_branding_settings(
    p_site_title TEXT DEFAULT NULL,
    p_site_title_en TEXT DEFAULT NULL,
    p_site_description TEXT DEFAULT NULL,
    p_site_tagline TEXT DEFAULT NULL,
    p_logo_url TEXT DEFAULT NULL,
    p_logo_mobile_url TEXT DEFAULT NULL,
    p_logo_favicon_url TEXT DEFAULT NULL,
    p_logo_alt_text TEXT DEFAULT NULL,
    p_logo_alt_text_en TEXT DEFAULT NULL,
    p_logo_width INTEGER DEFAULT NULL,
    p_logo_height INTEGER DEFAULT NULL,
    p_logo_style TEXT DEFAULT NULL,
    p_logo_enabled BOOLEAN DEFAULT NULL,
    p_brand_primary_color TEXT DEFAULT NULL,
    p_brand_secondary_color TEXT DEFAULT NULL,
    p_brand_accent_color TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    current_id UUID;
    result JSON;
BEGIN
    -- 현재 설정 조회
    SELECT id INTO current_id FROM public.branding_settings ORDER BY updated_at DESC LIMIT 1;
    
    -- 설정이 없으면 새로 생성
    IF current_id IS NULL THEN
        INSERT INTO public.branding_settings (
            site_title, site_title_en, site_description, site_tagline,
            logo_url, logo_mobile_url, logo_favicon_url,
            logo_alt_text, logo_alt_text_en,
            logo_width, logo_height, logo_style, logo_enabled,
            brand_primary_color, brand_secondary_color, brand_accent_color,
            updated_by
        ) VALUES (
            COALESCE(p_site_title, 'Daddy Bath Bomb'),
            COALESCE(p_site_title_en, 'Daddy Bath Bomb'),
            COALESCE(p_site_description, 'Premium natural bath bombs for ultimate relaxation experience'),
            COALESCE(p_site_tagline, 'Premium Bath Experience'),
            p_logo_url,
            p_logo_mobile_url,
            p_logo_favicon_url,
            COALESCE(p_logo_alt_text, 'Daddy Bath Bomb Logo'),
            COALESCE(p_logo_alt_text_en, 'Daddy Bath Bomb Logo'),
            COALESCE(p_logo_width, 48),
            COALESCE(p_logo_height, 48),
            COALESCE(p_logo_style, 'rounded'),
            COALESCE(p_logo_enabled, true),
            COALESCE(p_brand_primary_color, '#FF2D55'),
            COALESCE(p_brand_secondary_color, '#007AFF'),
            COALESCE(p_brand_accent_color, '#FFD700'),
            auth.uid()
        ) RETURNING id INTO current_id;
    ELSE
        -- 기존 설정 업데이트 (NULL이 아닌 값만 업데이트)
        UPDATE public.branding_settings SET
            site_title = COALESCE(p_site_title, site_title),
            site_title_en = COALESCE(p_site_title_en, site_title_en),
            site_description = COALESCE(p_site_description, site_description),
            site_tagline = COALESCE(p_site_tagline, site_tagline),
            logo_url = COALESCE(p_logo_url, logo_url),
            logo_mobile_url = COALESCE(p_logo_mobile_url, logo_mobile_url),
            logo_favicon_url = COALESCE(p_logo_favicon_url, logo_favicon_url),
            logo_alt_text = COALESCE(p_logo_alt_text, logo_alt_text),
            logo_alt_text_en = COALESCE(p_logo_alt_text_en, logo_alt_text_en),
            logo_width = COALESCE(p_logo_width, logo_width),
            logo_height = COALESCE(p_logo_height, logo_height),
            logo_style = COALESCE(p_logo_style, logo_style),
            logo_enabled = COALESCE(p_logo_enabled, logo_enabled),
            brand_primary_color = COALESCE(p_brand_primary_color, brand_primary_color),
            brand_secondary_color = COALESCE(p_brand_secondary_color, brand_secondary_color),
            brand_accent_color = COALESCE(p_brand_accent_color, brand_accent_color),
            updated_by = auth.uid()
        WHERE id = current_id;
    END IF;

    -- 업데이트된 설정 반환
    SELECT to_json(bs.*) INTO result
    FROM public.branding_settings bs
    WHERE bs.id = current_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 로고 변경 이력 조회 함수
CREATE OR REPLACE FUNCTION get_logo_history(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    changed_field TEXT,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP WITH TIME ZONE,
    changed_by UUID,
    change_reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lh.id,
        lh.changed_field,
        lh.old_value,
        lh.new_value,
        lh.changed_at,
        lh.changed_by,
        lh.change_reason
    FROM public.logo_history lh
    ORDER BY lh.changed_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RLS 정책 설정
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logo_history ENABLE ROW LEVEL SECURITY;

-- 브랜딩 설정 정책
CREATE POLICY branding_settings_policy ON public.branding_settings
    FOR ALL USING (true) -- 모든 사용자가 읽기 가능
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- 로고 이력 정책
CREATE POLICY logo_history_policy ON public.logo_history
    FOR SELECT USING (true) -- 모든 사용자가 읽기 가능
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- 9. 기본 데이터 삽입
INSERT INTO public.branding_settings (
    site_title, site_title_en, site_description, site_tagline,
    logo_url, logo_alt_text, logo_alt_text_en,
    logo_width, logo_height, logo_style, logo_enabled,
    brand_primary_color, brand_secondary_color, brand_accent_color
) VALUES (
    'Daddy Bath Bomb',
    'Daddy Bath Bomb',
    'Premium natural bath bombs for ultimate relaxation experience',
    'Premium Bath Experience',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center',
    'Daddy Bath Bomb Logo',
    'Daddy Bath Bomb Logo',
    48, 48, 'rounded', true,
    '#FF2D55', '#007AFF', '#FFD700'
) ON CONFLICT DO NOTHING;

-- 10. 유틸리티 뷰 생성 (관리자용)
CREATE OR REPLACE VIEW admin_branding_overview AS
SELECT 
    bs.*,
    u.email as updated_by_email,
    (SELECT COUNT(*) FROM public.logo_history lh WHERE lh.branding_setting_id = bs.id) as change_count,
    (SELECT MAX(changed_at) FROM public.logo_history lh WHERE lh.branding_setting_id = bs.id) as last_change
FROM public.branding_settings bs
LEFT JOIN auth.users u ON bs.updated_by = u.id
ORDER BY bs.updated_at DESC;

-- 11. 실시간 구독을 위한 복제 테이블 (Supabase Realtime용)
ALTER PUBLICATION supabase_realtime ADD TABLE public.branding_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.logo_history;
