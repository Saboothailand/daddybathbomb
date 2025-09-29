-- Contact Banners Management Table
-- Contact Us 페이지 배너 관리를 위한 테이블 생성

-- 1. contact_banners 테이블 생성
CREATE TABLE IF NOT EXISTS public.contact_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL, -- 배너 제목
    subtitle TEXT, -- 배너 부제목
    image_url TEXT NOT NULL, -- 배너 이미지 URL
    display_order INTEGER DEFAULT 0, -- 표시 순서
    is_active BOOLEAN DEFAULT true, -- 활성화 여부
    overlay_opacity DECIMAL(3,2) DEFAULT 0.4, -- 오버레이 투명도 (0.0-1.0)
    text_color VARCHAR(20) DEFAULT '#FFFFFF', -- 텍스트 색상
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 정책 설정
ALTER TABLE public.contact_banners ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 조회 가능 (활성화된 배너만)
CREATE POLICY "Contact banners are viewable by everyone" ON public.contact_banners
    FOR SELECT USING (is_active = true);

-- 인증된 사용자만 수정 가능 (관리자)
CREATE POLICY "Contact banners are updatable by authenticated users" ON public.contact_banners
    FOR ALL USING (auth.role() = 'authenticated');

-- 3. 샘플 데이터 삽입
INSERT INTO public.contact_banners (title, subtitle, image_url, display_order, overlay_opacity, text_color) VALUES
('ติดต่อเรา', 'มีคำถามหรือต้องการความช่วยเหลือ? เราพร้อมให้บริการ!', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80', 1, 0.4, '#FFFFFF'),
('Contact Us', 'Have questions or need help? We are ready to serve!', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80', 2, 0.4, '#FFFFFF');

-- 4. 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_contact_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 트리거 생성
CREATE TRIGGER update_contact_banners_updated_at
    BEFORE UPDATE ON public.contact_banners
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_banners_updated_at();

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_contact_banners_active ON public.contact_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_banners_order ON public.contact_banners(display_order);

-- 7. 관리자용 함수들
-- 모든 배너 조회 (관리자용)
CREATE OR REPLACE FUNCTION get_all_contact_banners()
RETURNS TABLE (
    id UUID,
    title VARCHAR(200),
    subtitle TEXT,
    image_url TEXT,
    display_order INTEGER,
    is_active BOOLEAN,
    overlay_opacity DECIMAL(3,2),
    text_color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cb.id,
        cb.title,
        cb.subtitle,
        cb.image_url,
        cb.display_order,
        cb.is_active,
        cb.overlay_opacity,
        cb.text_color,
        cb.created_at,
        cb.updated_at
    FROM public.contact_banners cb
    ORDER BY cb.display_order ASC, cb.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 활성화된 배너만 조회 (공개용)
CREATE OR REPLACE FUNCTION get_active_contact_banners()
RETURNS TABLE (
    id UUID,
    title VARCHAR(200),
    subtitle TEXT,
    image_url TEXT,
    display_order INTEGER,
    overlay_opacity DECIMAL(3,2),
    text_color VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cb.id,
        cb.title,
        cb.subtitle,
        cb.image_url,
        cb.display_order,
        cb.overlay_opacity,
        cb.text_color
    FROM public.contact_banners cb
    WHERE cb.is_active = true
    ORDER BY cb.display_order ASC, cb.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 배너 추가
CREATE OR REPLACE FUNCTION add_contact_banner(
    p_title VARCHAR(200),
    p_subtitle TEXT DEFAULT NULL,
    p_image_url TEXT,
    p_display_order INTEGER DEFAULT 0,
    p_overlay_opacity DECIMAL(3,2) DEFAULT 0.4,
    p_text_color VARCHAR(20) DEFAULT '#FFFFFF'
)
RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.contact_banners (
        title, subtitle, image_url, display_order, overlay_opacity, text_color
    ) VALUES (
        p_title, p_subtitle, p_image_url, p_display_order, p_overlay_opacity, p_text_color
    ) RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 배너 업데이트
CREATE OR REPLACE FUNCTION update_contact_banner(
    p_id UUID,
    p_title VARCHAR(200) DEFAULT NULL,
    p_subtitle TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_display_order INTEGER DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL,
    p_overlay_opacity DECIMAL(3,2) DEFAULT NULL,
    p_text_color VARCHAR(20) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.contact_banners
    SET 
        title = COALESCE(p_title, title),
        subtitle = COALESCE(p_subtitle, subtitle),
        image_url = COALESCE(p_image_url, image_url),
        display_order = COALESCE(p_display_order, display_order),
        is_active = COALESCE(p_is_active, is_active),
        overlay_opacity = COALESCE(p_overlay_opacity, overlay_opacity),
        text_color = COALESCE(p_text_color, text_color),
        updated_at = NOW()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 배너 삭제 (비활성화)
CREATE OR REPLACE FUNCTION delete_contact_banner(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.contact_banners
    SET is_active = false, updated_at = NOW()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 권한 설정
GRANT SELECT ON public.contact_banners TO anon;
GRANT ALL ON public.contact_banners TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_contact_banners() TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_contact_banners() TO anon;
GRANT EXECUTE ON FUNCTION add_contact_banner(VARCHAR, TEXT, TEXT, INTEGER, DECIMAL, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION update_contact_banner(UUID, VARCHAR, TEXT, TEXT, INTEGER, BOOLEAN, DECIMAL, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_contact_banner(UUID) TO authenticated;
