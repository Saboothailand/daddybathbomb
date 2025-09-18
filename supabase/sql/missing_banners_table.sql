-- 배너 테이블 생성 (누락된 테이블)
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    banner_type TEXT NOT NULL CHECK (banner_type IN ('hero', 'middle', 'bottom')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    button_text TEXT,
    button_link TEXT,
    background_color TEXT DEFAULT '#0B0F1A',
    text_color TEXT DEFAULT '#FFFFFF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- RLS 정책 설정
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public can view active banners" ON public.banners
    FOR SELECT USING (is_active = true);

-- 관리자 전체 권한 정책
CREATE POLICY "Admins can manage banners" ON public.banners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_banners_type_order ON public.banners(banner_type, display_order);
CREATE INDEX IF NOT EXISTS idx_banners_active ON public.banners(is_active);

-- 샘플 배너 데이터 삽입 (조건부)
DO $$
BEGIN
    -- Hero 배너가 없으면 삽입
    IF NOT EXISTS (SELECT 1 FROM public.banners WHERE banner_type = 'hero') THEN
        INSERT INTO public.banners (title, subtitle, description, image_url, banner_type, display_order, button_text, button_link) VALUES
        (
            'DADDY BATH BOMB',
            'Super Fun. Super Fizzy. Super You.',
            '슈퍼 히어로 바스 밤으로 특별한 목욕 시간을 만들어보세요!',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            'hero',
            1,
            'Shop Fun Bombs',
            '/products'
        );
    END IF;

    -- Middle 배너가 없으면 삽입
    IF NOT EXISTS (SELECT 1 FROM public.banners WHERE banner_type = 'middle') THEN
        INSERT INTO public.banners (title, subtitle, description, image_url, banner_type, display_order, button_text, button_link) VALUES
        (
            'Special Offer',
            'Get 20% Off Your First Order',
            '첫 주문 시 20% 할인 혜택을 받으세요!',
            'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=800&h=400&fit=crop',
            'middle',
            1,
            'Shop Now',
            '/products'
        );
    END IF;

    -- Bottom 배너가 없으면 삽입
    IF NOT EXISTS (SELECT 1 FROM public.banners WHERE banner_type = 'bottom') THEN
        INSERT INTO public.banners (title, subtitle, description, image_url, banner_type, display_order, button_text, button_link) VALUES
        (
            'Follow Us',
            'Join Our Bath Bomb Community',
            '인스타그램에서 더 많은 즐거운 목욕 시간을 확인하세요!',
            'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=400&fit=crop',
            'bottom',
            1,
            'Follow @daddybathbomb',
            'https://instagram.com/daddybathbomb'
        );
    END IF;
END $$;
