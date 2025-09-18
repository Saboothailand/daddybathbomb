-- 🛒 완전한 이커머스 시스템 데이터베이스 스키마 (수정됨)
-- 실제 작동하는 쇼핑몰 시스템

-- ===== 1. 브랜딩 및 사이트 설정 =====
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text',
    category TEXT DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== 2. 제품 카테고리 =====
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.product_categories(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== 3. 제품 테이블 확장 =====
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'slug') THEN
        ALTER TABLE public.products ADD COLUMN slug TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'short_description') THEN
        ALTER TABLE public.products ADD COLUMN short_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'long_description') THEN
        ALTER TABLE public.products ADD COLUMN long_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
        ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.product_categories(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
        ALTER TABLE public.products ADD COLUMN sku TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'original_price') THEN
        ALTER TABLE public.products ADD COLUMN original_price DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
        ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tags') THEN
        ALTER TABLE public.products ADD COLUMN tags TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'color') THEN
        ALTER TABLE public.products ADD COLUMN color TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'benefits') THEN
        ALTER TABLE public.products ADD COLUMN benefits TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
        ALTER TABLE public.products ADD COLUMN rating DECIMAL(2,1) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
        ALTER TABLE public.products ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'colors') THEN
        ALTER TABLE public.products ADD COLUMN colors TEXT[];
    END IF;
END $$;

-- ===== 4. 제품 이미지 갤러리 =====
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== 5. 배너 관리 시스템 =====
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_link TEXT,
    background_color TEXT DEFAULT '#0B0F1A',
    text_color TEXT DEFAULT '#ffffff',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== 6. 장바구니 시스템 =====
CREATE TABLE IF NOT EXISTS public.cart_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 고유 제약 조건 별도 추가
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_sessions_unique_user 
ON public.cart_sessions (user_id, product_id) 
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_sessions_unique_session 
ON public.cart_sessions (session_id, product_id) 
WHERE session_id IS NOT NULL;

-- ===== 7. RLS 정책 =====
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admin manage site settings" ON public.site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active categories" ON public.product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage categories" ON public.product_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin manage product images" ON public.product_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active banners" ON public.hero_banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage banners" ON public.hero_banners FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON public.cart_sessions FOR ALL USING (
    (user_id IS NOT NULL AND auth.uid() = user_id) OR
    (user_id IS NULL)
);

-- ===== 8. 기본 데이터 삽입 =====
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'Daddy Bath Bomb', 'text', 'branding', 'Site name', true),
('site_logo', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=80&fit=crop', 'image', 'branding', 'Main logo URL', true),
('primary_color', '#ec4899', 'text', 'branding', 'Primary brand color', true),
('secondary_color', '#8b5cf6', 'text', 'branding', 'Secondary brand color', true)
ON CONFLICT (setting_key) DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    updated_at = NOW();

INSERT INTO public.product_categories (name, slug, description) VALUES
('Hero Series', 'hero-series', 'Superhero themed bath bombs for adventurous kids'),
('Adventure', 'adventure', 'Adventure themed bath bombs for exploration'),
('Calm & Relax', 'calm-relax', 'Relaxing bath bombs for peaceful bath time'),
('Special Edition', 'special-edition', 'Limited edition bath bombs')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.hero_banners (title, subtitle, description, image_url, button_text, button_link, display_order) VALUES
('Premium Bath Bombs', '100% Natural & Fun', 'Experience the ultimate bathing adventure with our superhero-themed natural bath bombs', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'View Products', '/products', 1),
('Luxury Spa Experience', 'Transform Bath Time', 'Turn your home into a luxury spa with our amazing fizzy bath bombs', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop', 'About Us', '/about', 2),
('Perfect Gift for Kids', 'Special Moments', 'Give happiness and fun to your loved ones with Daddy Bath Bomb', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=600&fit=crop', 'Contact Us', '/contact', 3)
ON CONFLICT DO NOTHING;

-- 실제 제품 데이터
DO $$
DECLARE
    hero_cat_id UUID;
    adventure_cat_id UUID;
    calm_cat_id UUID;
    special_cat_id UUID;
BEGIN
    SELECT id INTO hero_cat_id FROM public.product_categories WHERE slug = 'hero-series';
    SELECT id INTO adventure_cat_id FROM public.product_categories WHERE slug = 'adventure';
    SELECT id INTO calm_cat_id FROM public.product_categories WHERE slug = 'calm-relax';
    SELECT id INTO special_cat_id FROM public.product_categories WHERE slug = 'special-edition';
    
    INSERT INTO public.products (
        name, description, short_description, long_description, price, original_price, 
        image_url, category_id, sku, stock_quantity, is_featured, is_active, 
        color, scent, weight, ingredients, tags, benefits, rating, review_count, colors
    ) VALUES
    (
        'SUPER RED FIZZ', 
        'POW! Cherry explosion with super bubbles and strawberry fun power!',
        'Cherry explosion with super bubbles',
        'POW! Experience the ultimate superhero power with this explosive cherry-scented bath bomb. Watch as it fizzes and creates amazing red and blue swirls while releasing the energizing scent of adventure! Perfect for little superheroes who love excitement.',
        390.00, 450.00, 
        'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format', 
        hero_cat_id, 'DBB-SRF-001', 25, true, true, 
        '#FF2D55', 'Cherry-Strawberry Power', '120g', 
        'Natural cherry extract, strawberry oil, Epsom salt, coconut oil, natural colorants', 
        ARRAY['superhero', 'cherry', 'kids', 'fizzy'],
        ARRAY['Moisturizes and softens skin', 'Creates exciting fizzy action', 'Superhero-themed fun experience', 'Natural ingredients safe for kids'],
        4.8, 124, ARRAY['#FF2D55', '#007AFF']
    ),
    (
        'HERO BLUE BLAST', 
        'BOOM! Ocean breeze with cooling mint and superhero strength bubbles!',
        'Ocean breeze with cooling mint',
        'BOOM! Dive into an ocean adventure with this refreshing blue bath bomb that creates waves of relaxation and ocean-fresh scents! Experience the power of the sea with refreshing mint that cools and energizes.',
        420.00, 480.00, 
        'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format&sig=blue', 
        hero_cat_id, 'DBB-HBB-002', 30, true, true, 
        '#007AFF', 'Ocean-Mint', '120g', 
        'Peppermint oil, eucalyptus, sea salt, shea butter, ocean minerals', 
        ARRAY['superhero', 'mint', 'ocean', 'cooling'],
        ARRAY['Cooling peppermint sensation', 'Rich in ocean minerals', 'Refreshing ocean scent', 'Relaxing blue water effect'],
        4.6, 89, ARRAY['#007AFF', '#4169E1']
    ),
    (
        'MAGIC GREEN GO', 
        'ZAP! Tropical lime with energizing bubbles and adventure scent power!',
        'Tropical lime with energizing bubbles',
        'ZAP! Get ready for an amazing tropical adventure with this lime-powered bath bomb that energizes and refreshes. Perfect for young explorers who love tropical scents and exciting green bubbles!',
        410.00, 460.00, 
        'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format&sig=green', 
        adventure_cat_id, 'DBB-MGG-003', 20, true, true, 
        '#00FF88', 'Tropical-Lime', '120g', 
        'Lime essential oil, lemongrass, tea tree oil, coconut oil', 
        ARRAY['adventure', 'lime', 'tropical', 'energizing'],
        ARRAY['Refreshing lime sensation', 'Energizing tropical scent', 'Natural antiseptic properties', 'Invigorating green water'],
        4.5, 67, ARRAY['#00FF88', '#228B22']
    ),
    (
        'GOLDEN SUN POWER', 
        'SHINE! Sunny orange with citrus burst and happiness bubble magic!',
        'Sunny orange with citrus burst',
        'SHINE! Bring sunshine and joy to your bath time with this golden bath bomb that creates happiness bubbles and fills the air with sunny citrus scents. Perfect for brightening up any day!',
        450.00, 500.00, 
        'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format&sig=gold', 
        adventure_cat_id, 'DBB-GSP-004', 35, true, true, 
        '#FFD700', 'Citrus-Orange', '120g', 
        'Orange essential oil, grapefruit, vanilla extract, jojoba oil', 
        ARRAY['adventure', 'citrus', 'sunny', 'happiness'],
        ARRAY['Uplifting citrus scent', 'Moisturizing jojoba oil', 'Mood-boosting aromatherapy', 'Golden water effect'],
        4.9, 203, ARRAY['#FFD700', '#FF8800']
    ),
    (
        'PURPLE STORM FUN', 
        'WHOOSH! Lavender lightning with dreamy bubbles and calm superhero vibes!',
        'Lavender lightning with dreamy bubbles',
        'WHOOSH! Perfect for bedtime relaxation, this purple storm bath bomb creates a calming lavender experience with dreamy bubbles that help little superheroes wind down after a day of adventure.',
        430.00, 480.00, 
        'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format&sig=purple', 
        calm_cat_id, 'DBB-PSF-005', 40, true, true, 
        '#AF52DE', 'Lavender-Dreams', '120g', 
        'Lavender oil, chamomile, vanilla, cocoa butter', 
        ARRAY['calm', 'lavender', 'bedtime', 'relaxing'],
        ARRAY['Gentle on sensitive skin', 'Promotes relaxation', 'Bedtime aromatherapy', 'Nourishing cocoa butter'],
        4.7, 156, ARRAY['#AF52DE', '#8B5CF6']
    ),
    (
        'RAINBOW MEGA MIX', 
        'AMAZING! All colors unite for the ultimate superhero bath adventure!',
        'Ultimate superhero bath adventure',
        'AMAZING! Experience all our amazing scents in one incredible bath bomb! This special edition creates a rainbow of colors and combines the best of all our superhero scents for the ultimate bath adventure.',
        580.00, 650.00, 
        'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format&sig=rainbow', 
        special_cat_id, 'DBB-RMM-006', 15, true, true, 
        '#FF69B4', 'Multi-Scent Surprise', '150g', 
        'Blend of all natural oils and extracts, rainbow colorants', 
        ARRAY['special', 'rainbow', 'ultimate', 'premium'],
        ARRAY['Creates spectacular rainbow effects', 'Long-lasting fragrance', 'Premium moisturizing formula', 'Collectible special edition'],
        4.4, 78, ARRAY['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF']
    )
    ON CONFLICT (sku) DO UPDATE SET 
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        image_url = EXCLUDED.image_url,
        updated_at = NOW();
END $$;
