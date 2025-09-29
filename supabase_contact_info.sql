-- Contact Information Management Table
-- 연락처 정보 관리를 위한 테이블 생성

-- 1. contact_info 테이블 생성
CREATE TABLE IF NOT EXISTS public.contact_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_type VARCHAR(50) NOT NULL, -- 'email', 'phone', 'line', 'address', 'business_hours', 'qr_code'
    title VARCHAR(100) NOT NULL, -- 표시될 제목
    value TEXT NOT NULL, -- 실제 값 (이메일, 전화번호, 주소 등)
    display_order INTEGER DEFAULT 0, -- 표시 순서
    is_active BOOLEAN DEFAULT true, -- 활성화 여부
    icon VARCHAR(50), -- 아이콘 이름 (선택사항)
    color VARCHAR(20), -- 색상 코드 (선택사항)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 정책 설정
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 조회 가능
CREATE POLICY "Contact info is viewable by everyone" ON public.contact_info
    FOR SELECT USING (is_active = true);

-- 인증된 사용자만 수정 가능 (관리자)
CREATE POLICY "Contact info is updatable by authenticated users" ON public.contact_info
    FOR ALL USING (auth.role() = 'authenticated');

-- 3. 샘플 데이터 삽입
INSERT INTO public.contact_info (contact_type, title, value, display_order, icon, color) VALUES
-- 이메일 정보
('email', 'Email', 'admin@daddybathbomb.com', 1, 'Mail', '#FF2D55'),

-- LINE 정보
('line', 'LINE', '@daddybathbomb', 2, 'MessageSquare', '#00FF88'),

-- 전화번호 정보
('phone', 'Phone', '+66 123-456-7890', 3, 'Phone', '#007AFF'),

-- 주소 정보
('address', 'Address', 'Bangkok, Thailand', 4, 'MapPin', '#00FF88'),
('address', 'Delivery', 'We deliver nationwide!', 5, 'Truck', '#00C2FF'),

-- 영업시간 정보
('business_hours', 'Monday - Friday', '9:00 AM - 6:00 PM', 6, 'Clock', '#FFD700'),
('business_hours', 'Saturday', '10:00 AM - 4:00 PM', 7, 'Clock', '#FFD700'),
('business_hours', 'Sunday', 'Closed', 8, 'Clock', '#FF6B6B'),

-- QR 코드 정보
('qr_code', 'LINE QR Code', 'https://example.com/qr-code.png', 9, 'QrCode', '#00FF88'),
('qr_code', 'LINE ID', '@daddybathbomb', 10, 'MessageSquare', '#00FF88');

-- 4. 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_contact_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 트리거 생성
CREATE TRIGGER update_contact_info_updated_at
    BEFORE UPDATE ON public.contact_info
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_info_updated_at();

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_contact_info_type ON public.contact_info(contact_type);
CREATE INDEX IF NOT EXISTS idx_contact_info_active ON public.contact_info(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_info_order ON public.contact_info(display_order);

-- 7. 관리자용 함수들
-- 모든 연락처 정보 조회
CREATE OR REPLACE FUNCTION get_contact_info()
RETURNS TABLE (
    id UUID,
    contact_type VARCHAR(50),
    title VARCHAR(100),
    value TEXT,
    display_order INTEGER,
    is_active BOOLEAN,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.id,
        ci.contact_type,
        ci.title,
        ci.value,
        ci.display_order,
        ci.is_active,
        ci.icon,
        ci.color,
        ci.created_at,
        ci.updated_at
    FROM public.contact_info ci
    WHERE ci.is_active = true
    ORDER BY ci.display_order ASC, ci.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 연락처 정보 업데이트
CREATE OR REPLACE FUNCTION update_contact_info(
    p_id UUID,
    p_title VARCHAR(100),
    p_value TEXT,
    p_display_order INTEGER DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL,
    p_icon VARCHAR(50) DEFAULT NULL,
    p_color VARCHAR(20) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.contact_info
    SET 
        title = COALESCE(p_title, title),
        value = COALESCE(p_value, value),
        display_order = COALESCE(p_display_order, display_order),
        is_active = COALESCE(p_is_active, is_active),
        icon = COALESCE(p_icon, icon),
        color = COALESCE(p_color, color),
        updated_at = NOW()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 연락처 정보 추가
CREATE OR REPLACE FUNCTION add_contact_info(
    p_contact_type VARCHAR(50),
    p_title VARCHAR(100),
    p_value TEXT,
    p_display_order INTEGER DEFAULT 0,
    p_icon VARCHAR(50) DEFAULT NULL,
    p_color VARCHAR(20) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.contact_info (
        contact_type, title, value, display_order, icon, color
    ) VALUES (
        p_contact_type, p_title, p_value, p_display_order, p_icon, p_color
    ) RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 연락처 정보 삭제 (비활성화)
CREATE OR REPLACE FUNCTION delete_contact_info(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.contact_info
    SET is_active = false, updated_at = NOW()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 권한 설정
GRANT SELECT ON public.contact_info TO anon;
GRANT ALL ON public.contact_info TO authenticated;
GRANT EXECUTE ON FUNCTION get_contact_info() TO anon;
GRANT EXECUTE ON FUNCTION update_contact_info(UUID, VARCHAR, TEXT, INTEGER, BOOLEAN, VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION add_contact_info(VARCHAR, VARCHAR, TEXT, INTEGER, VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_contact_info(UUID) TO authenticated;
