-- 기존 테이블 구조에 맞춘 안전한 업데이트

-- 1. 기존 orders 테이블에 필요한 컬럼만 추가
DO $$
BEGIN
    -- order_number 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
        ALTER TABLE public.orders ADD COLUMN order_number TEXT;
    END IF;
    
    -- customer_name 컬럼 추가 (기존 shipping_name과 별도)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
        ALTER TABLE public.orders ADD COLUMN customer_name TEXT;
    END IF;
    
    -- customer_phone 컬럼 추가 (기존 shipping_phone과 별도)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
        ALTER TABLE public.orders ADD COLUMN customer_phone TEXT;
    END IF;
    
    -- customer_email 컬럼 추가 (기존 shipping_email과 별도)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_email') THEN
        ALTER TABLE public.orders ADD COLUMN customer_email TEXT;
    END IF;
    
    -- subtotal 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal') THEN
        ALTER TABLE public.orders ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- shipping_cost 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_cost') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- discount_amount 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
        ALTER TABLE public.orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- customer_notes 컬럼 추가 (기존 notes와 별도)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_notes') THEN
        ALTER TABLE public.orders ADD COLUMN customer_notes TEXT;
    END IF;
    
    -- admin_notes 컬럼 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'admin_notes') THEN
        ALTER TABLE public.orders ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- 2. products 테이블에 필요한 컬럼 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
        ALTER TABLE public.products ADD COLUMN sku TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'short_description') THEN
        ALTER TABLE public.products ADD COLUMN short_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'long_description') THEN
        ALTER TABLE public.products ADD COLUMN long_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'original_price') THEN
        ALTER TABLE public.products ADD COLUMN original_price DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
        ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
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
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tags') THEN
        ALTER TABLE public.products ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- 3. product_categories 테이블 생성 (없는 경우만)
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

-- 4. site_settings 테이블 생성 (없는 경우만)
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

-- 5. hero_banners 테이블 생성 (없는 경우만)
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_link TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. 주문 번호 생성 함수
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'DBB' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 7. 주문 번호 자동 할당 트리거
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_number_trigger ON public.orders;
CREATE TRIGGER order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- 8. 안전한 인덱스 생성 (컬럼 존재 확인 후)
DO $$
BEGIN
    -- order_number 인덱스 (컬럼이 있는 경우만)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number_unique ON public.orders(order_number) WHERE order_number IS NOT NULL;
    END IF;
    
    -- sku 인덱스 (컬럼이 있는 경우만)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique ON public.products(sku) WHERE sku IS NOT NULL;
    END IF;
END $$;

-- 9. 기본 데이터 삽입
INSERT INTO public.product_categories (name, slug, description) VALUES
('Fruit Splash Series', 'fruit-splash-series', '과일 향 배쓰밤 스페셜 컬렉션'),
('Hero Series', 'hero-series', 'Superhero themed bath bombs'),
('Adventure', 'adventure', 'Adventure themed bath bombs'),
('Calm & Relax', 'calm-relax', 'Relaxing bath bombs')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'Daddy Bath Bomb', 'text', 'branding', 'Site name', true),
('site_logo', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=80&fit=crop', 'image', 'branding', 'Main logo URL', true),
('primary_color', '#ec4899', 'text', 'branding', 'Primary brand color', true),
('secondary_color', '#8b5cf6', 'text', 'branding', 'Secondary brand color', true)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- 10. 샘플 제품 데이터 (기존 테이블 구조 사용)
DO $$
DECLARE
    fruit_cat_id UUID;
BEGIN
    SELECT id INTO fruit_cat_id FROM public.product_categories WHERE slug = 'fruit-splash-series';
    
    -- 기존 products 테이블 구조에 맞춰 삽입
    INSERT INTO public.products (name, description, price, image_url, stock_quantity, is_active, category, scent, weight, ingredients) 
    SELECT 'Strawberry Splash Bubble Bomb', '싱싱한 딸기 향이 폭발하는 버블 배쓰밤', 390.00, 'https://images.unsplash.com/photo-1585325701961-89c09fd9b1f7?w=500&h=400&fit=crop', 50, true, 'Fruit Splash', 'Fresh Strawberry', '120g', 'Strawberry extract, coconut oil, shea butter'
    WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Strawberry Splash Bubble Bomb');
    
    INSERT INTO public.products (name, description, price, image_url, stock_quantity, is_active, category, scent, weight, ingredients) 
    SELECT 'Mango Tango Fizzy Bomb', '열대 망고 향이 가득한 트로피컬 버블', 420.00, 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=500&h=400&fit=crop', 45, true, 'Fruit Splash', 'Tropical Mango', '125g', 'Mango butter, coconut milk powder, sea salt'
    WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Mango Tango Fizzy Bomb');
    
    INSERT INTO public.products (name, description, price, image_url, stock_quantity, is_active, category, scent, weight, ingredients) 
    SELECT 'Pineapple Paradise Soak', '파인애플과 라임이 어우러진 상큼 버블', 380.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=400&fit=crop', 40, true, 'Fruit Splash', 'Pineapple Lime', '115g', 'Pineapple extract, lime oil, baking soda'
    WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Pineapple Paradise Soak');
    
    INSERT INTO public.products (name, description, price, image_url, stock_quantity, is_active, category, scent, weight, ingredients) 
    SELECT 'Blueberry Bliss Bomb', '진한 블루베리 향의 딥블루 버블', 410.00, 'https://images.unsplash.com/photo-1593251698860-4fcc1e2392b9?w=500&h=400&fit=crop', 38, true, 'Fruit Splash', 'Blueberry Vanilla', '130g', 'Blueberry extract, vanilla bean, almond oil'
    WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Blueberry Bliss Bomb');
    
    INSERT INTO public.products (name, description, price, image_url, stock_quantity, is_active, category, scent, weight, ingredients) 
    SELECT 'Watermelon Wave Soother', '수박 주스 같은 청량 버블', 360.00, 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&h=400&fit=crop', 48, true, 'Fruit Splash', 'Watermelon Mint', '120g', 'Watermelon extract, mint oil, aloe powder'
    WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Watermelon Wave Soother');
END $$;

-- 11. 주문 번호 생성 함수
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'DBB' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 12. 주문 번호 자동 할당 트리거 (컬럼이 있는 경우만)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
        CREATE OR REPLACE FUNCTION set_order_number()
        RETURNS TRIGGER AS $func$
        BEGIN
            IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
                NEW.order_number := generate_order_number();
            END IF;
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;
        
        DROP TRIGGER IF EXISTS order_number_trigger ON public.orders;
        CREATE TRIGGER order_number_trigger
            BEFORE INSERT ON public.orders
            FOR EACH ROW EXECUTE FUNCTION set_order_number();
    END IF;
END $$;

-- 13. RLS 정책 (기존 테이블에 적용)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public create orders" ON public.orders;
CREATE POLICY "Public create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage all orders" ON public.orders;
CREATE POLICY "Admin manage all orders" ON public.orders FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public create order items" ON public.order_items;
CREATE POLICY "Public create order items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin view all order items" ON public.order_items;
CREATE POLICY "Admin view all order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin manage products" ON public.products;
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
