-- 🛒 개선된 이커머스 시스템 데이터베이스 스키마
-- 실서비스용 안정적인 장바구니/주문 시스템

-- ===== 1. 기존 테이블 정리 및 확장 =====

-- 제품 테이블에 유니크 인덱스 추가
DO $$
BEGIN
    -- products 테이블 확장
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'slug') THEN
        ALTER TABLE public.products ADD COLUMN slug TEXT;
    END IF;
    
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
END $$;

-- 제품 유니크 인덱스 추가
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_unique ON public.products(slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique ON public.products(sku) WHERE sku IS NOT NULL;

-- ===== 2. 장바구니 세션 테이블 (간소화) =====
CREATE TABLE IF NOT EXISTS public.cart_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) DEFAULT 0,
    item_count INTEGER DEFAULT 0,
    is_converted BOOLEAN DEFAULT false, -- 주문으로 전환되었는지
    converted_order_id UUID REFERENCES public.orders(id),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== 3. 장바구니 아이템 테이블 =====
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cart_session_id UUID REFERENCES public.cart_sessions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(cart_session_id, product_id)
);

-- ===== 4. 쿠폰 시스템 =====
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0,
    maximum_discount DECIMAL(10,2), -- 최대 할인 금액 (percentage 타입용)
    usage_limit INTEGER, -- 총 사용 제한
    usage_count INTEGER DEFAULT 0, -- 현재 사용 횟수
    user_usage_limit INTEGER DEFAULT 1, -- 사용자당 사용 제한
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== 5. 쿠폰 사용 내역 =====
CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== 6. 주문 테이블 확장 =====
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'cart_session_id') THEN
        ALTER TABLE public.orders ADD COLUMN cart_session_id UUID REFERENCES public.cart_sessions(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
        ALTER TABLE public.orders ADD COLUMN order_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal') THEN
        ALTER TABLE public.orders ADD COLUMN subtotal DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_cost') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
        ALTER TABLE public.orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'coupon_id') THEN
        ALTER TABLE public.orders ADD COLUMN coupon_id UUID REFERENCES public.coupons(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'admin_notes') THEN
        ALTER TABLE public.orders ADD COLUMN admin_notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_notes') THEN
        ALTER TABLE public.orders ADD COLUMN customer_notes TEXT;
    END IF;
END $$;

-- 주문 번호 유니크 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number_unique ON public.orders(order_number) WHERE order_number IS NOT NULL;

-- ===== 7. 주문 상태 히스토리 =====
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== 8. 사이트 설정 테이블 =====
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

-- ===== 9. 배너 관리 =====
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

-- ===== 10. 인덱스 최적화 =====
-- 장바구니 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON public.cart_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_user_id ON public.cart_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_expires ON public.cart_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_session ON public.cart_items(cart_session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON public.cart_items(product_id);

-- 쿠폰 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active_dates ON public.coupons(is_active, starts_at, expires_at);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_user ON public.coupon_usages(coupon_id, user_id);

-- 주문 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_desc ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id, created_at DESC);

-- ===== 11. 트리거 및 함수 =====

-- 장바구니 총액 업데이트 함수
CREATE OR REPLACE FUNCTION update_cart_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- cart_items 변경 시 cart_sessions 총액 업데이트
    IF TG_OP = 'DELETE' THEN
        UPDATE public.cart_sessions 
        SET 
            total_amount = COALESCE((
                SELECT SUM(total_price) 
                FROM public.cart_items 
                WHERE cart_session_id = OLD.cart_session_id
            ), 0),
            item_count = COALESCE((
                SELECT SUM(quantity) 
                FROM public.cart_items 
                WHERE cart_session_id = OLD.cart_session_id
            ), 0),
            updated_at = NOW()
        WHERE id = OLD.cart_session_id;
        RETURN OLD;
    ELSE
        UPDATE public.cart_sessions 
        SET 
            total_amount = COALESCE((
                SELECT SUM(total_price) 
                FROM public.cart_items 
                WHERE cart_session_id = NEW.cart_session_id
            ), 0),
            item_count = COALESCE((
                SELECT SUM(quantity) 
                FROM public.cart_items 
                WHERE cart_session_id = NEW.cart_session_id
            ), 0),
            updated_at = NOW()
        WHERE id = NEW.cart_session_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 장바구니 총액 업데이트 트리거
DROP TRIGGER IF EXISTS cart_totals_trigger ON public.cart_items;
CREATE TRIGGER cart_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.cart_items
    FOR EACH ROW EXECUTE FUNCTION update_cart_totals();

-- 장바구니를 주문으로 전환하는 함수
CREATE OR REPLACE FUNCTION mark_cart_converted(cart_session_id UUID, order_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.cart_sessions 
    SET 
        is_converted = true,
        converted_order_id = order_id,
        updated_at = NOW()
    WHERE id = cart_session_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 주문 번호 생성 함수
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'DBB' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 주문 생성 시 주문번호 자동 생성
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_number_trigger ON public.orders;
CREATE TRIGGER order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- 제품 슬러그 자동 생성
CREATE OR REPLACE FUNCTION generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9가-힣]', '-', 'g'));
        NEW.slug := REGEXP_REPLACE(NEW.slug, '-+', '-', 'g');
        NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
        
        -- 중복 방지
        WHILE EXISTS (SELECT 1 FROM public.products WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
            NEW.slug := NEW.slug || '-' || FLOOR(RANDOM() * 1000)::TEXT;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_slug_trigger ON public.products;
CREATE TRIGGER product_slug_trigger
    BEFORE INSERT OR UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION generate_product_slug();

-- 주문 상태 변경 기록 함수
CREATE OR REPLACE FUNCTION record_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.order_status_history (order_id, previous_status, new_status, changed_by, notes)
        VALUES (NEW.id, OLD.status::TEXT, NEW.status::TEXT, auth.uid(), NEW.admin_notes);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_status_change_trigger ON public.orders;
CREATE TRIGGER order_status_change_trigger
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION record_order_status_change();

-- 쿠폰 사용량 업데이트 함수
CREATE OR REPLACE FUNCTION update_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.coupons 
        SET usage_count = usage_count + 1
        WHERE id = NEW.coupon_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.coupons 
        SET usage_count = GREATEST(usage_count - 1, 0)
        WHERE id = OLD.coupon_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS coupon_usage_trigger ON public.coupon_usages;
CREATE TRIGGER coupon_usage_trigger
    AFTER INSERT OR DELETE ON public.coupon_usages
    FOR EACH ROW EXECUTE FUNCTION update_coupon_usage();

-- ===== 12. RLS 정책 =====
-- 장바구니 세션
ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart sessions" ON public.cart_sessions FOR ALL USING (
    (user_id IS NOT NULL AND auth.uid() = user_id) OR
    (user_id IS NULL) -- 비회원은 프론트엔드에서 session_id로 관리
);

-- 장바구니 아이템
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage cart items" ON public.cart_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.cart_sessions cs 
        WHERE cs.id = cart_session_id 
        AND ((cs.user_id IS NOT NULL AND auth.uid() = cs.user_id) OR cs.user_id IS NULL)
    )
);

-- 쿠폰
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active coupons" ON public.coupons FOR SELECT USING (
    is_active = true 
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (expires_at IS NULL OR expires_at >= NOW())
);
CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 쿠폰 사용 내역
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own coupon usage" ON public.coupon_usages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System create coupon usage" ON public.coupon_usages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view all coupon usage" ON public.coupon_usages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 사이트 설정
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admin manage site settings" ON public.site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 배너
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active banners" ON public.hero_banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage banners" ON public.hero_banners FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ===== 13. 유용한 뷰 생성 =====
-- 장바구니 상세 뷰
CREATE OR REPLACE VIEW cart_details AS
SELECT 
    cs.id as cart_session_id,
    cs.session_id,
    cs.user_id,
    cs.total_amount,
    cs.item_count,
    ci.id as cart_item_id,
    ci.product_id,
    ci.quantity,
    ci.unit_price,
    ci.total_price,
    p.name as product_name,
    p.image_url as product_image,
    p.stock_quantity
FROM public.cart_sessions cs
LEFT JOIN public.cart_items ci ON cs.id = ci.cart_session_id
LEFT JOIN public.products p ON ci.product_id = p.id;

-- 주문 요약 뷰
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total_amount,
    o.subtotal,
    o.shipping_cost,
    o.discount_amount,
    o.shipping_name,
    o.shipping_email,
    o.shipping_phone,
    o.created_at,
    COUNT(oi.id) as item_count,
    STRING_AGG(p.name, ', ') as product_names
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
LEFT JOIN public.products p ON oi.product_id = p.id
GROUP BY o.id, o.order_number, o.status, o.total_amount, o.subtotal, o.shipping_cost, o.discount_amount, o.shipping_name, o.shipping_email, o.shipping_phone, o.created_at
ORDER BY o.created_at DESC;

-- ===== 14. 기본 데이터 삽입 =====
-- 사이트 설정
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'Daddy Bath Bomb', 'text', 'branding', 'Site name', true),
('site_logo', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=80&fit=crop', 'image', 'branding', 'Main logo URL', true),
('primary_color', '#ec4899', 'text', 'branding', 'Primary brand color', true),
('secondary_color', '#8b5cf6', 'text', 'branding', 'Secondary brand color', true),
('free_shipping_threshold', '1000', 'text', 'shipping', 'Free shipping minimum amount', false),
('default_shipping_cost', '100', 'text', 'shipping', 'Default shipping cost', false)
ON CONFLICT (setting_key) DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    updated_at = NOW();

-- 샘플 쿠폰
INSERT INTO public.coupons (code, name, description, discount_type, discount_value, minimum_amount, usage_limit) VALUES
('WELCOME10', '신규 고객 10% 할인', '첫 주문 고객 대상 10% 할인 쿠폰', 'percentage', 10.00, 500.00, 100),
('FREESHIP', '무료 배송', '무료 배송 쿠폰', 'fixed_amount', 100.00, 0.00, 500),
('SPRING20', '봄맞이 20% 할인', '봄 시즌 특별 할인', 'percentage', 20.00, 1000.00, 50)
ON CONFLICT (code) DO NOTHING;

-- 히어로 배너
INSERT INTO public.hero_banners (title, subtitle, description, image_url, button_text, button_link, display_order) VALUES
('Premium Bath Bombs', '100% Natural & Fun', 'Experience the ultimate bathing adventure with our superhero-themed natural bath bombs', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'View Products', '/products', 1),
('Luxury Spa Experience', 'Transform Bath Time', 'Turn your home into a luxury spa with our amazing fizzy bath bombs', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop', 'About Us', '/about', 2),
('Perfect Gift for Kids', 'Special Moments', 'Give happiness and fun to your loved ones with Daddy Bath Bomb', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=600&fit=crop', 'Contact Us', '/contact', 3)
ON CONFLICT DO NOTHING;

-- 샘플 제품 (간단한 버전)
INSERT INTO public.products (
    name, description, short_description, price, original_price, 
    image_url, sku, stock_quantity, is_featured, is_active, 
    color, scent, weight, ingredients, rating, review_count
) 
SELECT 
    'SUPER RED FIZZ', 
    'POW! Cherry explosion with super bubbles and strawberry fun power!',
    'Cherry explosion with super bubbles',
    390.00, 450.00, 
    'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format', 
    'DBB-SRF-001', 25, true, true, 
    '#FF2D55', 'Cherry-Strawberry Power', '120g', 
    'Natural cherry extract, strawberry oil, Epsom salt, coconut oil',
    4.8, 124
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'DBB-SRF-001');

INSERT INTO public.products (
    name, description, short_description, price, original_price, 
    image_url, sku, stock_quantity, is_featured, is_active, 
    color, scent, weight, ingredients, rating, review_count
) 
SELECT 
    'HERO BLUE BLAST', 
    'BOOM! Ocean breeze with cooling mint and superhero strength bubbles!',
    'Ocean breeze with cooling mint',
    420.00, 480.00, 
    'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format&sig=blue', 
    'DBB-HBB-002', 30, true, true, 
    '#007AFF', 'Ocean-Mint', '120g', 
    'Peppermint oil, eucalyptus, sea salt, shea butter',
    4.6, 89
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'DBB-HBB-002');

INSERT INTO public.products (
    name, description, short_description, price, original_price, 
    image_url, sku, stock_quantity, is_featured, is_active, 
    color, scent, weight, ingredients, rating, review_count
) 
SELECT 
    'RAINBOW MEGA MIX', 
    'AMAZING! All colors unite for the ultimate superhero bath adventure!',
    'Ultimate superhero bath adventure',
    580.00, 650.00, 
    'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&auto=format&sig=rainbow', 
    'DBB-RMM-006', 15, true, true, 
    '#FF69B4', 'Multi-Scent Surprise', '150g', 
    'Blend of all natural oils and extracts, rainbow colorants',
    4.4, 78
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'DBB-RMM-006');
