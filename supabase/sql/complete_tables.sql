-- 누락된 테이블들 생성

-- 1. product_images 테이블 (제품 이미지 갤러리)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. features 테이블 (홈페이지 특징 섹션)
CREATE TABLE IF NOT EXISTS public.features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. gallery_images 테이블 (인스타그램 갤러리)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. hero_banners 테이블에 banner_type 컬럼 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_banners' AND column_name = 'banner_type') THEN
        ALTER TABLE public.hero_banners ADD COLUMN banner_type TEXT DEFAULT 'hero' CHECK (banner_type IN ('hero', 'middle', 'bottom'));
    END IF;
END $$;

-- 5. RLS 정책 추가
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active features" ON public.features FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage features" ON public.features FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active gallery" ON public.gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage gallery" ON public.gallery_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin manage product images" ON public.product_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 6. 샘플 features 데이터
INSERT INTO public.features (title, description, image_url, icon, display_order) VALUES
('Natural Ingredients', 'Made from 100% natural ingredients, safe for the whole family', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=400&fit=crop', '🌿', 1),
('Beautiful Fizzy Colors', 'Beautiful colorful fizz with relaxing aromatherapy scents', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop', '✨', 2),
('Skin Nourishing', 'Moisturizes and nourishes skin for smooth, soft feeling after bath', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=400&fit=crop', '💧', 3),
('Perfect Gift', 'Perfect gift for special people on any occasion', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&sig=gift', '🎁', 4)
ON CONFLICT DO NOTHING;

-- 7. 샘플 갤러리 이미지
INSERT INTO public.gallery_images (image_url, caption, display_order) VALUES
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Relaxing bath time with our premium bath bombs', 1),
('https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop', 'Natural ingredients for healthy skin', 2),
('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop', 'Luxury spa experience at home', 3),
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&sig=2', 'Beautiful fizzy colors and scents', 4),
('https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&sig=3', 'Perfect for family relaxation time', 5),
('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&sig=4', 'Premium quality bath products', 6)
ON CONFLICT DO NOTHING;
