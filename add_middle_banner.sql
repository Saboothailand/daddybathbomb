-- ========================================
-- Middle 배너 확인 및 추가하기
-- Supabase SQL Editor에서 실행하세요
-- ========================================

-- 1단계: 현재 모든 배너 확인
SELECT 
    id,
    title,
    position,
    display_order,
    is_active,
    created_at
FROM public.banner_images
ORDER BY position, display_order;

-- 2단계: Middle 배너만 확인
SELECT 
    id,
    title,
    description,
    image_url,
    link_url,
    position,
    display_order,
    is_active
FROM public.banner_images
WHERE position = 'middle'
ORDER BY display_order;

-- ========================================
-- 3단계: Middle 배너가 없다면 추가하기
-- ========================================

-- FunFeatures와 HowToUse 사이에 표시될 Middle 배너들
INSERT INTO public.banner_images (
    title, 
    description, 
    image_url, 
    link_url,
    position, 
    display_order, 
    is_active
) VALUES
-- Middle 배너 1: 스페셜 프로모션
(
    'Special Promotion',
    'Limited time offer - Buy 2 Get 1 Free! 🎁',
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop',
    '/products',
    'middle',
    1,
    true
),
-- Middle 배너 2: 기프트 세트
(
    'Gift Sets Available',
    'Perfect gifts for your loved ones! 🎀',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=500&fit=crop',
    '/products',
    'middle',
    2,
    true
),
-- Middle 배너 3: 천연 성분
(
    'Natural Ingredients',
    '100% natural and safe for the whole family! 🌿',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=500&fit=crop',
    '/products',
    'middle',
    3,
    true
)
ON CONFLICT DO NOTHING;

-- ========================================
-- 태국어 버전 Middle 배너 (선택사항)
-- ========================================
/*
INSERT INTO public.banner_images (
    title, 
    description, 
    image_url, 
    link_url,
    position, 
    display_order, 
    is_active
) VALUES
(
    'โปรโมชั่นพิเศษ',
    'ซื้อ 2 แถม 1 ฟรี! เฉพาะเดือนนี้เท่านั้น 🎁',
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop',
    '/products',
    'middle',
    1,
    true
),
(
    'ชุดของขวัญพิเศษ',
    'ของขวัญที่สมบูรณ์แบบสำหรับคนที่คุณรัก! 🎀',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=500&fit=crop',
    '/products',
    'middle',
    2,
    true
),
(
    'ส่วนผสมธรรมชาติ',
    '100% ธรรมชาติและปลอดภัยสำหรับทุกคนในครอบครัว! 🌿',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=500&fit=crop',
    '/products',
    'middle',
    3,
    true
)
ON CONFLICT DO NOTHING;
*/

-- ========================================
-- 4단계: 추가 후 확인
-- ========================================
SELECT 
    id,
    title,
    description,
    position,
    display_order,
    is_active,
    created_at
FROM public.banner_images
WHERE position = 'middle'
ORDER BY display_order;

-- ========================================
-- 기존 배너를 활성화하기 (비활성화된 경우)
-- ========================================
-- 모든 middle 배너 활성화
-- UPDATE public.banner_images 
-- SET is_active = true
-- WHERE position = 'middle';

-- ========================================
-- 문제 해결: 테이블이 없는 경우
-- ========================================
-- banner_images 테이블이 없다면 먼저 생성
/*
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

-- RLS 정책 설정
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성 배너 읽기 가능
CREATE POLICY "Public read access for active banners" ON public.banner_images
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );
*/

-- ========================================
-- 완료! 웹사이트를 새로고침하세요
-- ========================================



