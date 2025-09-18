-- 수정된 스키마 (컬럼명 오류 해결)

-- 1. 기존 products 테이블에 필요한 컬럼만 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
        ALTER TABLE public.products ADD COLUMN sku TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'short_description') THEN
        ALTER TABLE public.products ADD COLUMN short_description TEXT;
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
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
        ALTER TABLE public.products ADD COLUMN rating DECIMAL(2,1) DEFAULT 4.5;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
        ALTER TABLE public.products ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'benefits') THEN
        ALTER TABLE public.products ADD COLUMN benefits TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'colors') THEN
        ALTER TABLE public.products ADD COLUMN colors TEXT[];
    END IF;
END $$;

-- 2. orders 테이블에 필요한 컬럼 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
        ALTER TABLE public.orders ADD COLUMN order_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal') THEN
        ALTER TABLE public.orders ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_cost') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
        ALTER TABLE public.orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- 3. 실제 제품 데이터 삽입 (올바른 컬럼명 사용)
INSERT INTO public.products (
    name, description, short_description, price, original_price, 
    image_url, sku, stock_quantity, is_featured, is_active, 
    category, scent, weight, ingredients, color, rating, review_count
) 
SELECT 
    'Strawberry Splash Bomb', 
    '싱싱한 딸기 향이 폭발하는 버블 배쓰밤', 
    '딸기향 버블과 핑크빛 거품', 
    390.00, 450.00, 
    'https://images.unsplash.com/photo-1585325701961-89c09fd9b1f7?w=500&h=400&fit=crop', 
    'DBB-FRUIT-001', 50, true, true, 
    'Fruit Splash', 'Fresh Strawberry', '120g', 
    'Strawberry extract, coconut oil, shea butter', 
    '#ff5b7f', 4.8, 126
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'DBB-FRUIT-001');

INSERT INTO public.products (
    name, description, short_description, price, original_price, 
    image_url, sku, stock_quantity, is_featured, is_active, 
    category, scent, weight, ingredients, color, rating, review_count
) 
SELECT 
    'Mango Tango Fizzy Bomb', 
    '열대 망고 향이 가득한 트로피컬 버블', 
    '망고와 코코넛의 달콤한 조화', 
    420.00, 480.00, 
    'https://images.unsplash.com/photo-1514996937319-344454492b37?w=500&h=400&fit=crop', 
    'DBB-FRUIT-002', 45, true, true, 
    'Fruit Splash', 'Tropical Mango', '125g', 
    'Mango butter, coconut milk powder, sea salt', 
    '#ffa726', 4.7, 98
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'DBB-FRUIT-002');

INSERT INTO public.products (
    name, description, short_description, price, original_price, 
    image_url, sku, stock_quantity, is_featured, is_active, 
    category, scent, weight, ingredients, color, rating, review_count
) 
SELECT 
    'Pineapple Paradise Soak', 
    '파인애플과 라임이 어우러진 상큼 버블', 
    '파인애플 향 폭발', 
    380.00, 430.00, 
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=400&fit=crop', 
    'DBB-FRUIT-003', 40, true, true, 
    'Fruit Splash', 'Pineapple Lime', '115g', 
    'Pineapple extract, lime oil, baking soda', 
    '#ffd54f', 4.6, 84
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'DBB-FRUIT-003');

INSERT INTO public.products (
    name, description, short_description, price, original_price, 
    image_url, sku, stock_quantity, is_featured, is_active, 
    category, scent, weight, ingredients, color, rating, review_count
) 
SELECT 
    'Blueberry Bliss Bomb', 
    '진한 블루베리 향의 딥블루 버블', 
    '베리향 릴랙스 타임', 
    410.00, 470.00, 
    'https://images.unsplash.com/photo-1593251698860-4fcc1e2392b9?w=500&h=400&fit=crop', 
    'DBB-FRUIT-004', 38, true, true, 
    'Fruit Splash', 'Blueberry Vanilla', '130g', 
    'Blueberry extract, vanilla bean, almond oil', 
    '#5c6bc0', 4.9, 154
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'DBB-FRUIT-004');

INSERT INTO public.products (
    name, description, short_description, price, original_price, 
    image_url, sku, stock_quantity, is_featured, is_active, 
    category, scent, weight, ingredients, color, rating, review_count
) 
SELECT 
    'Watermelon Wave Soother', 
    '수박 주스 같은 청량 버블', 
    '한여름 수박 향기', 
    360.00, 410.00, 
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&h=400&fit=crop', 
    'DBB-FRUIT-005', 48, true, true, 
    'Fruit Splash', 'Watermelon Mint', '120g', 
    'Watermelon extract, mint oil, aloe powder', 
    '#ff6f91', 4.4, 61
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'DBB-FRUIT-005');

-- 4. 주문 번호 생성 함수
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'DBB' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 5. 주문 번호 자동 할당 (안전하게)
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

-- 6. 안전한 인덱스 생성
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number_unique ON public.orders(order_number) WHERE order_number IS NOT NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique ON public.products(sku) WHERE sku IS NOT NULL;
    END IF;
END $$;
