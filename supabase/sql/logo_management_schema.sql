-- 로고 관리 시스템을 위한 데이터베이스 스키마
-- site_settings 테이블에 로고 관련 기본값을 키-값 형태로 보강

-- 로고 관련 기본값 업서트 (브랜딩 카테고리, 공개 설정)
DO $$
BEGIN
    INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, is_public, description)
    VALUES
        ('logo_url', '', 'image_url', 'branding', true, '사이트 로고 이미지 URL'),
        ('site_title', 'Daddy Bath Bomb', 'text', 'branding', true, '사이트 타이틀'),
        ('logo_width', '48', 'number', 'branding', true, '로고 너비 (픽셀)'),
        ('logo_height', '48', 'number', 'branding', true, '로고 높이 (픽셀)'),
        ('logo_alt_text', 'Daddy Bath Bomb Logo', 'text', 'branding', true, '로고 대체 텍스트'),
        ('logo_enabled', 'true', 'boolean', 'branding', true, '로고 표시 여부'),
        ('logo_style', 'rounded', 'select', 'branding', true, '로고 스타일 (rounded, square, circle)'),
        ('brand_color', '#FF2D55', 'color', 'branding', true, '브랜드 메인 컬러'),
        ('brand_sub_color', '#007AFF', 'color', 'branding', true, '브랜드 서브 컬러')
    ON CONFLICT (setting_key) DO UPDATE
        SET setting_type = EXCLUDED.setting_type,
            category = EXCLUDED.category,
            is_public = true,
            description = COALESCE(site_settings.description, EXCLUDED.description),
            updated_at = NOW();
END $$;

-- 로고 관리용 함수들

-- 로고 설정 업데이트 함수
CREATE OR REPLACE FUNCTION update_logo_settings(
    p_logo_url TEXT,
    p_site_title TEXT DEFAULT NULL,
    p_logo_width INTEGER DEFAULT NULL,
    p_logo_height INTEGER DEFAULT NULL,
    p_logo_alt_text TEXT DEFAULT NULL,
    p_logo_enabled BOOLEAN DEFAULT NULL,
    p_logo_style TEXT DEFAULT NULL,
    p_brand_color TEXT DEFAULT NULL,
    p_brand_sub_color TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- 유효성 검사
    IF p_logo_width IS NOT NULL AND p_logo_width <= 0 THEN
        RAISE EXCEPTION 'logo_width must be greater than zero';
    END IF;

    IF p_logo_height IS NOT NULL AND p_logo_height <= 0 THEN
        RAISE EXCEPTION 'logo_height must be greater than zero';
    END IF;

    IF p_logo_style IS NOT NULL AND p_logo_style NOT IN ('rounded', 'square', 'circle') THEN
        RAISE EXCEPTION 'logo_style must be one of rounded, square, circle';
    END IF;

    IF p_brand_color IS NOT NULL AND p_brand_color !~ '^#[0-9A-Fa-f]{6}$' THEN
        RAISE EXCEPTION 'brand_color must be a valid hex color (e.g. #A1B2C3)';
    END IF;

    IF p_brand_sub_color IS NOT NULL AND p_brand_sub_color !~ '^#[0-9A-Fa-f]{6}$' THEN
        RAISE EXCEPTION 'brand_sub_color must be a valid hex color (e.g. #A1B2C3)';
    END IF;

    -- site_settings 테이블 업데이트
    UPDATE public.site_settings SET 
        setting_value = CASE 
            WHEN setting_key = 'logo_url' AND p_logo_url IS NOT NULL THEN p_logo_url
            WHEN setting_key = 'site_title' AND p_site_title IS NOT NULL THEN p_site_title
            WHEN setting_key = 'logo_width' AND p_logo_width IS NOT NULL THEN p_logo_width::TEXT
            WHEN setting_key = 'logo_height' AND p_logo_height IS NOT NULL THEN p_logo_height::TEXT
            WHEN setting_key = 'logo_alt_text' AND p_logo_alt_text IS NOT NULL THEN p_logo_alt_text
            WHEN setting_key = 'logo_enabled' AND p_logo_enabled IS NOT NULL THEN p_logo_enabled::TEXT
            WHEN setting_key = 'logo_style' AND p_logo_style IS NOT NULL THEN p_logo_style
            WHEN setting_key = 'brand_color' AND p_brand_color IS NOT NULL THEN p_brand_color
            WHEN setting_key = 'brand_sub_color' AND p_brand_sub_color IS NOT NULL THEN p_brand_sub_color
            ELSE setting_value
        END,
        updated_at = NOW()
    WHERE setting_key IN (
        'logo_url', 'site_title', 'logo_width', 'logo_height', 
        'logo_alt_text', 'logo_enabled', 'logo_style', 
        'brand_color', 'brand_sub_color'
    );

    -- 업데이트된 설정 반환
    SELECT json_object_agg(
        setting_key,
        json_build_object(
            'value', setting_value,
            'type', setting_type,
            'description', description
        )
    ) INTO result
    FROM public.site_settings 
    WHERE setting_key IN (
        'logo_url', 'site_title', 'logo_width', 'logo_height', 
        'logo_alt_text', 'logo_enabled', 'logo_style', 
        'brand_color', 'brand_sub_color'
    );

    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql;

-- 로고 설정 조회 함수
CREATE OR REPLACE FUNCTION get_logo_settings()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_object_agg(setting_key, json_build_object(
        'value', setting_value,
        'type', setting_type,
        'description', description
    )) INTO result
    FROM public.site_settings 
    WHERE setting_key IN (
        'logo_url', 'site_title', 'logo_width', 'logo_height', 
        'logo_alt_text', 'logo_enabled', 'logo_style', 
        'brand_color', 'brand_sub_color'
    );

    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql;

-- RLS 정책 (관리자만 로고 설정 변경 가능)
DO $$
BEGIN
    -- site_settings 테이블에 대한 RLS 정책이 없다면 생성
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'logo_settings_policy') THEN
        CREATE POLICY logo_settings_policy ON public.site_settings
        FOR ALL USING (
            -- 모든 사용자가 읽기 가능
            true
        ) WITH CHECK (
            -- 관리자만 수정 가능 (users 테이블의 role이 'admin'인 경우)
            EXISTS (
                SELECT 1 FROM public.users 
                WHERE users.id = auth.uid() 
                AND users.role = 'admin'
            )
        );
    END IF;
END $$;

-- 로고 관련 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_site_settings_logo ON public.site_settings(setting_key) 
WHERE setting_key LIKE 'logo_%' OR setting_key IN ('site_title', 'brand_color', 'brand_sub_color');

-- 로고 변경 이벤트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION notify_logo_change()
RETURNS TRIGGER AS $$
BEGIN
    -- 로고 관련 설정이 변경되면 클라이언트에 알림
    IF TG_OP = 'UPDATE' AND (
        OLD.setting_key != NEW.setting_key OR 
        OLD.setting_value != NEW.setting_value
    ) AND NEW.setting_key IN (
        'logo_url', 'site_title', 'logo_width', 'logo_height', 
        'logo_alt_text', 'logo_enabled', 'logo_style', 
        'brand_color', 'brand_sub_color'
    ) THEN
        PERFORM pg_notify('logo_updated', json_build_object(
            'key', NEW.setting_key,
            'value', NEW.setting_value,
            'timestamp', NOW()
        )::text);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS logo_change_trigger ON public.site_settings;
CREATE TRIGGER logo_change_trigger
    AFTER UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION notify_logo_change();

-- 샘플 로고 데이터 (테스트용)
DO $$ 
BEGIN
    -- 기본 로고 URL이 비어있다면 샘플 로고 설정
    IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE setting_key = 'logo_url' AND setting_value != '') THEN
        UPDATE public.site_settings 
        SET setting_value = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center',
            updated_at = NOW()
        WHERE setting_key = 'logo_url';
    END IF;
END $$;

-- 로고 설정 변경 이력 테이블 (감사 추적용)
CREATE TABLE IF NOT EXISTS public.logo_settings_audit (
    id BIGSERIAL PRIMARY KEY,
    setting_key TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by UUID,
    change_source TEXT DEFAULT 'trigger:logo_settings_audit',
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 감사 로그 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_logo_settings_audit_key ON public.logo_settings_audit(setting_key);
CREATE INDEX IF NOT EXISTS idx_logo_settings_audit_changed_at ON public.logo_settings_audit(changed_at DESC);

-- 감사 로그 RLS 정책 (관리자 전용)
ALTER TABLE public.logo_settings_audit ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'logo_settings_audit' 
          AND policyname = 'logo_settings_audit_admin'
    ) THEN
        CREATE POLICY logo_settings_audit_admin ON public.logo_settings_audit
        FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM public.users 
                WHERE users.id = auth.uid() 
                AND users.role = 'admin'
            )
        )
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM public.users 
                WHERE users.id = auth.uid() 
                AND users.role = 'admin'
            )
        );
    END IF;
END $$;

-- 로고 설정 변경 시 감사 로그 적재
CREATE OR REPLACE FUNCTION audit_logo_change()
RETURNS TRIGGER AS $$
DECLARE
    v_changed_by UUID := auth.uid();
BEGIN
    IF NEW.setting_key IN (
        'logo_url', 'site_title', 'logo_width', 'logo_height',
        'logo_alt_text', 'logo_enabled', 'logo_style',
        'brand_color', 'brand_sub_color'
    ) THEN
        IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.setting_value IS DISTINCT FROM NEW.setting_value) THEN
            INSERT INTO public.logo_settings_audit (
                setting_key,
                old_value,
                new_value,
                changed_by,
                change_source,
                changed_at
            ) VALUES (
                NEW.setting_key,
                CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.setting_value END,
                NEW.setting_value,
                v_changed_by,
                TG_NAME,
                NOW()
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 감사 로그 트리거 설정
DROP TRIGGER IF EXISTS logo_settings_audit_trigger ON public.site_settings;
CREATE TRIGGER logo_settings_audit_trigger
    AFTER INSERT OR UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION audit_logo_change();

-- 로고 설정 변경 이력 조회 함수
CREATE OR REPLACE FUNCTION get_logo_settings_history(p_limit INTEGER DEFAULT 50)
RETURNS JSON AS $$
DECLARE
    result JSON;
    effective_limit INTEGER := GREATEST(COALESCE(p_limit, 50), 1);
BEGIN
    SELECT COALESCE(json_agg(row_to_json(history_entry)), '[]'::json)
    INTO result
    FROM (
        SELECT 
            id,
            setting_key,
            old_value,
            new_value,
            changed_by,
            change_source,
            changed_at
        FROM public.logo_settings_audit
        WHERE setting_key IN (
            'logo_url', 'site_title', 'logo_width', 'logo_height',
            'logo_alt_text', 'logo_enabled', 'logo_style',
            'brand_color', 'brand_sub_color'
        )
        ORDER BY changed_at DESC
        LIMIT effective_limit
    ) AS history_entry;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 로고 설정 기본값으로 초기화 함수
CREATE OR REPLACE FUNCTION reset_logo_settings_to_defaults()
RETURNS JSON AS $$
BEGIN
    WITH defaults AS (
        SELECT * FROM (VALUES
            ('logo_url', '', 'image_url', 'branding', true, '사이트 로고 이미지 URL'),
            ('site_title', 'Daddy Bath Bomb', 'text', 'branding', true, '사이트 타이틀'),
            ('logo_width', '48', 'number', 'branding', true, '로고 너비 (픽셀)'),
            ('logo_height', '48', 'number', 'branding', true, '로고 높이 (픽셀)'),
            ('logo_alt_text', 'Daddy Bath Bomb Logo', 'text', 'branding', true, '로고 대체 텍스트'),
            ('logo_enabled', 'true', 'boolean', 'branding', true, '로고 표시 여부'),
            ('logo_style', 'rounded', 'select', 'branding', true, '로고 스타일 (rounded, square, circle)'),
            ('brand_color', '#FF2D55', 'color', 'branding', true, '브랜드 메인 컬러'),
            ('brand_sub_color', '#007AFF', 'color', 'branding', true, '브랜드 서브 컬러')
        ) AS d(setting_key, setting_value, setting_type, category, is_public, description)
    )
    INSERT INTO public.site_settings AS ss (
        setting_key,
        setting_value,
        setting_type,
        category,
        is_public,
        description
    )
    SELECT 
        d.setting_key,
        d.setting_value,
        d.setting_type,
        d.category,
        d.is_public,
        d.description
    FROM defaults d
    ON CONFLICT (setting_key) DO UPDATE
        SET setting_value = EXCLUDED.setting_value,
            setting_type = EXCLUDED.setting_type,
            category = EXCLUDED.category,
            is_public = EXCLUDED.is_public,
            description = COALESCE(ss.description, EXCLUDED.description),
            updated_at = NOW();

    RETURN get_logo_settings();
END;
$$ LANGUAGE plpgsql;
