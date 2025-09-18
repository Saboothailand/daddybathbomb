-- 깨끗한 테이블 생성 스키마

-- 주문 상태 타입
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered', 'cancelled');
    END IF;
END $$;

-- 제품 카테고리 테이블
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 제품 테이블
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    long_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image_url TEXT,
    category_id UUID REFERENCES public.product_categories(id),
    sku TEXT UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    color TEXT,
    scent TEXT,
    weight TEXT,
    ingredients TEXT,
    tags TEXT[],
    benefits TEXT[],
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    colors TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 제품 이미지 테이블
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 사이트 설정 테이블
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text',
    category TEXT DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 기본 카테고리 데이터
INSERT INTO public.product_categories (name, slug, description) VALUES
('Fruit Splash Series', 'fruit-splash-series', '과일 향 배쓰밤 스페셜 컬렉션'),
('Hero Series', 'hero-series', 'Superhero themed bath bombs'),
('Adventure', 'adventure', 'Adventure themed bath bombs'),
('Calm & Relax', 'calm-relax', 'Relaxing bath bombs')
ON CONFLICT (slug) DO NOTHING;

-- 기본 사이트 설정
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'Daddy Bath Bomb', 'text', 'branding', 'Site name', true),
('site_logo', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=80&fit=crop', 'image', 'branding', 'Main logo URL', true),
('primary_color', '#ec4899', 'text', 'branding', 'Primary brand color', true),
('secondary_color', '#8b5cf6', 'text', 'branding', 'Secondary brand color', true)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
