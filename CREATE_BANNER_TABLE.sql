-- ========================================
-- 🎨 배너 테이블 생성 및 설정
-- Supabase SQL Editor에서 실행하세요
-- ========================================

-- 1. 배너 이미지 테이블 생성
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

-- 2. RLS 활성화
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책 생성 (기존 정책이 있으면 스킵)
-- 모든 사용자가 활성 배너 읽기 가능
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'banner_images' 
        AND policyname = 'Public read access for active banners'
    ) THEN
        CREATE POLICY "Public read access for active banners" ON public.banner_images
            FOR SELECT USING (
                is_active = true 
                AND (start_date IS NULL OR start_date <= NOW())
                AND (end_date IS NULL OR end_date >= NOW())
            );
    END IF;
END $$;

-- 관리자가 배너 관리 가능
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'banner_images' 
        AND policyname = 'Admins can manage banners'
    ) THEN
        CREATE POLICY "Admins can manage banners" ON public.banner_images
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            );
    END IF;
END $$;

-- 4. 업데이트 트리거 함수 (이미 있다면 스킵)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 업데이트 트리거 (기존 트리거가 있으면 스킵)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_banner_images_updated_at'
    ) THEN
        CREATE TRIGGER update_banner_images_updated_at 
            BEFORE UPDATE ON public.banner_images
            FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- 6. 샘플 배너 데이터 추가
INSERT INTO public.banner_images (
    title, 
    description, 
    image_url, 
    link_url,
    position, 
    display_order, 
    is_active
) VALUES
-- Middle 배너 (FunFeatures 아래)
(
    'Special Promotion',
    'Limited time offer - Buy 2 Get 1 Free! 🎁',
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop&q=80',
    '/products',
    'middle',
    1,
    true
),
(
    'Gift Sets Available',
    'Perfect gifts for your loved ones! 🎀',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=500&fit=crop&q=80',
    '/products',
    'middle',
    2,
    true
),
(
    'Natural Ingredients',
    '100% natural and safe for the whole family! 🌿',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=500&fit=crop&q=80',
    '/products',
    'middle',
    3,
    true
),

-- Bottom 배너 (HowToUse 아래)
(
    'Ready for Super Fun?',
    'Get your superhero bath bombs now! 🎉',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop&q=80',
    '/products',
    'bottom',
    1,
    true
),
(
    'Follow Us on Social Media',
    'Stay updated with our latest products and special offers! 📱',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=500&fit=crop&q=80',
    'https://instagram.com/daddybathbomb',
    'bottom',
    2,
    true
),
(
    'Join Our Community',
    'Be part of the Daddy Bath Bomb family! 💜',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=500&fit=crop&q=80',
    '/contact',
    'bottom',
    3,
    true
)
ON CONFLICT DO NOTHING;

-- 7. 추가 후 확인
SELECT 
    id,
    title,
    position,
    display_order,
    is_active,
    SUBSTRING(image_url, 1, 50) as image_preview,
    created_at
FROM public.banner_images
WHERE position IN ('middle', 'bottom')
ORDER BY position, display_order;

-- 8. 전체 배너 개수 확인
SELECT 
    position,
    COUNT(*) as total,
    SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active
FROM public.banner_images
GROUP BY position
ORDER BY 
    CASE position
        WHEN 'hero' THEN 1
        WHEN 'middle' THEN 2
        WHEN 'bottom' THEN 3
        WHEN 'sidebar' THEN 4
        ELSE 5
    END;

-- ========================================
-- ✅ 완료!
-- 이제 웹사이트를 새로고침하세요 (Ctrl+Shift+R)
-- ========================================
