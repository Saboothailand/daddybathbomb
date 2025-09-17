-- 고객 주문 및 배송 정보 관리 테이블
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 주문 상태 열거형 (기존 것과 중복되지 않도록 확인)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        CREATE TYPE order_status_enum AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
    END IF;
END $$;

-- 결제 방법 열거형
CREATE TYPE payment_method_enum AS ENUM ('bank_transfer', 'qr_payment', 'cash_on_delivery', 'line_pay');

-- 고객 정보 및 배송 주소 테이블
CREATE TABLE IF NOT EXISTS public.customer_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL, -- 주문번호 (예: DB-20240115-001)
    
    -- 고객 정보
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    
    -- 배송 주소
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_province TEXT,
    shipping_postal_code TEXT,
    shipping_country TEXT DEFAULT 'Thailand',
    
    -- 주문 정보
    order_items JSONB NOT NULL, -- 주문 상품 배열
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- 결제 및 상태
    payment_method payment_method_enum DEFAULT 'bank_transfer',
    order_status order_status_enum DEFAULT 'pending',
    
    -- 추가 정보
    customer_notes TEXT, -- 고객 요청사항
    admin_notes TEXT, -- 관리자 메모
    
    -- 배송 정보
    tracking_number TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 주문 상태 변경 로그 테이블
CREATE TABLE IF NOT EXISTS public.order_status_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.customer_orders(id) ON DELETE CASCADE,
    old_status order_status_enum,
    new_status order_status_enum NOT NULL,
    changed_by TEXT, -- 변경한 사람 (관리자 이메일 등)
    notes TEXT, -- 상태 변경 사유
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 고객 주소록 테이블 (재주문 편의성)
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_email TEXT NOT NULL,
    address_name TEXT DEFAULT 'Default', -- 주소 별칭 (집, 회사 등)
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Thailand',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS 정책 설정
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

-- 관리자는 모든 주문 조회/관리 가능
CREATE POLICY "Admin full access for customer_orders" ON public.customer_orders
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for order_status_logs" ON public.order_status_logs
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for customer_addresses" ON public.customer_addresses
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 고객은 자신의 주문만 조회 가능 (이메일 기반)
CREATE POLICY "Customer read own orders" ON public.customer_orders
    FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Customer read own addresses" ON public.customer_addresses
    FOR ALL USING (customer_email = auth.jwt() ->> 'email');

-- 누구나 주문 생성 가능 (비회원 주문 지원)
CREATE POLICY "Anyone can create orders" ON public.customer_orders
    FOR INSERT WITH CHECK (true);

-- 업데이트 트리거
CREATE TRIGGER update_customer_orders_updated_at
    BEFORE UPDATE ON public.customer_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at
    BEFORE UPDATE ON public.customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 주문 상태 변경 시 로그 자동 생성 트리거
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.order_status IS DISTINCT FROM NEW.order_status THEN
        INSERT INTO public.order_status_logs (order_id, old_status, new_status, changed_by, notes)
        VALUES (NEW.id, OLD.order_status, NEW.order_status, 
                COALESCE(auth.jwt() ->> 'email', 'system'), 
                'Status changed via admin panel');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_log
    AFTER UPDATE ON public.customer_orders
    FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- 주문번호 자동 생성 함수
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    today_date TEXT;
    sequence_num INTEGER;
    order_num TEXT;
BEGIN
    today_date := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- 오늘 날짜의 주문 수 계산
    SELECT COUNT(*) + 1 INTO sequence_num
    FROM public.customer_orders
    WHERE DATE(created_at) = CURRENT_DATE;
    
    order_num := 'DB-' || today_date || '-' || LPAD(sequence_num::TEXT, 3, '0');
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- 주문 생성 시 주문번호 자동 생성 트리거
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.customer_orders
    FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_customer_orders_email ON public.customer_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_customer_orders_status ON public.customer_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_customer_orders_date ON public.customer_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_orders_number ON public.customer_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_order ON public.order_status_logs(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_email ON public.customer_addresses(customer_email);

-- 뷰: 주문 요약 (관리자용)
CREATE OR REPLACE VIEW public.order_summary AS
SELECT 
    co.id,
    co.order_number,
    co.customer_name,
    co.customer_email,
    co.customer_phone,
    co.total_amount,
    co.order_status,
    co.payment_method,
    co.created_at,
    co.updated_at,
    JSON_ARRAY_LENGTH(co.order_items) as item_count,
    CASE 
        WHEN co.order_status = 'pending' THEN 0
        WHEN co.order_status = 'confirmed' THEN 1
        WHEN co.order_status = 'processing' THEN 2
        WHEN co.order_status = 'shipped' THEN 3
        WHEN co.order_status = 'delivered' THEN 4
        WHEN co.order_status = 'cancelled' THEN -1
        ELSE 0
    END as status_priority
FROM public.customer_orders co
ORDER BY co.created_at DESC;

-- 함수: 주문 통계
CREATE OR REPLACE FUNCTION get_order_statistics()
RETURNS TABLE (
    total_orders BIGINT,
    pending_orders BIGINT,
    processing_orders BIGINT,
    completed_orders BIGINT,
    total_revenue DECIMAL,
    avg_order_value DECIMAL,
    orders_today BIGINT,
    orders_this_week BIGINT,
    orders_this_month BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN order_status IN ('confirmed', 'processing', 'shipped') THEN 1 END) as processing_orders,
        COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) as completed_orders,
        COALESCE(SUM(CASE WHEN order_status = 'delivered' THEN total_amount END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN order_status = 'delivered' THEN total_amount END), 0) as avg_order_value,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as orders_today,
        COUNT(CASE WHEN created_at >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) as orders_this_week,
        COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as orders_this_month
    FROM public.customer_orders;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
