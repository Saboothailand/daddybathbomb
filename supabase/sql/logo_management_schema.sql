-- 로고 관리 시스템을 위한 데이터베이스 스키마
-- 기존 site_settings 테이블 확장

-- site_settings 테이블에 로고 관련 컬럼 추가 (이미 존재하는 경우 무시)
DO $$ 
BEGIN
    -- 로고 이미지 URL
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'logo_url') THEN
        ALTER TABLE public.site_settings ADD COLUMN logo_url TEXT;
    END IF;
    
    -- 사이트 타이틀
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'site_title') THEN
        ALTER TABLE public.site_settings ADD COLUMN site_title TEXT DEFAULT 'Daddy Bath Bomb';
    END IF;
    
    -- 로고 너비 (픽셀)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'logo_width') THEN
        ALTER TABLE public.site_settings ADD COLUMN logo_width INTEGER DEFAULT 48;
    END IF;
    
    -- 로고 높이 (픽셀)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'logo_height') THEN
        ALTER TABLE public.site_settings ADD COLUMN logo_height INTEGER DEFAULT 48;
    END IF;
    
    -- 로고 설명/대체 텍스트
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'logo_alt_text') THEN
        ALTER TABLE public.site_settings ADD COLUMN logo_alt_text TEXT DEFAULT 'Daddy Bath Bomb Logo';
    END IF;
    
    -- 로고 활성화 상태
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'logo_enabled') THEN
        ALTER TABLE public.site_settings ADD COLUMN logo_enabled BOOLEAN DEFAULT true;
    END IF;
    
    -- 로고 스타일 (원형, 사각형 등)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'logo_style') THEN
        ALTER TABLE public.site_settings ADD COLUMN logo_style TEXT DEFAULT 'rounded' CHECK (logo_style IN ('rounded', 'square', 'circle'));
    END IF;
    
    -- 브랜드 컬러 (헤더 배경 등에 사용)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'brand_color') THEN
        ALTER TABLE public.site_settings ADD COLUMN brand_color TEXT DEFAULT '#FF2D55';
    END IF;
    
    -- 브랜드 서브 컬러 (그라데이션 등에 사용)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'brand_sub_color') THEN
        ALTER TABLE public.site_settings ADD COLUMN brand_sub_color TEXT DEFAULT '#007AFF';
    END IF;
END $$;

-- 기본 로고 설정 데이터 삽입 (존재하지 않는 경우에만)
DO $$ 
BEGIN
    -- 기본 로고 설정이 없으면 삽입
    IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE setting_key = 'logo_url') THEN
        INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description, language) VALUES
        ('logo_url', '', 'image_url', '사이트 로고 이미지 URL', 'ko'),
        ('site_title', 'Daddy Bath Bomb', 'text', '사이트 타이틀', 'ko'),
        ('logo_width', '48', 'number', '로고 너비 (픽셀)', 'ko'),
        ('logo_height', '48', 'number', '로고 높이 (픽셀)', 'ko'),
        ('logo_alt_text', 'Daddy Bath Bomb Logo', 'text', '로고 대체 텍스트', 'ko'),
        ('logo_enabled', 'true', 'boolean', '로고 표시 여부', 'ko'),
        ('logo_style', 'rounded', 'select', '로고 스타일 (rounded, square, circle)', 'ko'),
        ('brand_color', '#FF2D55', 'color', '브랜드 메인 컬러', 'ko'),
        ('brand_sub_color', '#007AFF', 'color', '브랜드 서브 컬러', 'ko');
    END IF;
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
    -- site_settings 테이블 업데이트
    UPDATE public.site_settings SET 
        setting_value = CASE 
            WHEN setting_key = 'logo_url' THEN p_logo_url
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
    SELECT json_agg(
        json_build_object(
            'key', setting_key,
            'value', setting_value,
            'type', setting_type
        )
    ) INTO result
    FROM public.site_settings 
    WHERE setting_key IN (
        'logo_url', 'site_title', 'logo_width', 'logo_height', 
        'logo_alt_text', 'logo_enabled', 'logo_style', 
        'brand_color', 'brand_sub_color'
    );

    RETURN result;
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
        SET setting_value = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center'
        WHERE setting_key = 'logo_url';
    END IF;
END $$;

