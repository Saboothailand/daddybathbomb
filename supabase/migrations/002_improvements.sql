-- 데이터베이스 성능 및 안정성 개선사항
-- 이 파일은 기본 스키마 생성 후 추가로 실행하세요

-- 1. 성능 향상을 위한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_content_content_type ON public.content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_order_index ON public.content(order_index);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_order_index ON public.instagram_posts(order_index);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 2. 데이터 무결성을 위한 제약조건 추가
-- 가격과 수량에 대한 체크 제약조건
DO $$
BEGIN
    -- 제약조건이 존재하지 않으면 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_price_positive' AND table_name = 'products') THEN
        ALTER TABLE public.products ADD CONSTRAINT check_price_positive CHECK (price > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_stock_non_negative' AND table_name = 'products') THEN
        ALTER TABLE public.products ADD CONSTRAINT check_stock_non_negative CHECK (stock_quantity >= 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_quantity_positive' AND table_name = 'order_items') THEN
        ALTER TABLE public.order_items ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_unit_price_positive' AND table_name = 'order_items') THEN
        ALTER TABLE public.order_items ADD CONSTRAINT check_unit_price_positive CHECK (unit_price > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_total_price_positive' AND table_name = 'order_items') THEN
        ALTER TABLE public.order_items ADD CONSTRAINT check_total_price_positive CHECK (total_price > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_total_price_calculation' AND table_name = 'order_items') THEN
        ALTER TABLE public.order_items ADD CONSTRAINT check_total_price_calculation 
            CHECK (ABS(total_price - (quantity * unit_price)) < 0.01);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_total_amount_positive' AND table_name = 'orders') THEN
        ALTER TABLE public.orders ADD CONSTRAINT check_total_amount_positive CHECK (total_amount > 0);
    END IF;
    
    -- 3. 이메일 형식 검증
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_email_format' AND table_name = 'users') THEN
        ALTER TABLE public.users ADD CONSTRAINT check_email_format 
            CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_shipping_email_format' AND table_name = 'orders') THEN
        ALTER TABLE public.orders ADD CONSTRAINT check_shipping_email_format 
            CHECK (shipping_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
END $$;

-- 4. 재고 관리를 위한 함수 및 트리거
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- 주문 아이템 생성 시 재고 차감
  IF TG_OP = 'INSERT' THEN
    UPDATE public.products 
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
    -- 재고가 음수가 되면 에러 발생
    IF (SELECT stock_quantity FROM public.products WHERE id = NEW.product_id) < 0 THEN
      RAISE EXCEPTION '재고가 부족합니다. 제품 ID: %', NEW.product_id;
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- 주문 아이템 삭제 시 재고 복구
  IF TG_OP = 'DELETE' THEN
    UPDATE public.products 
    SET stock_quantity = stock_quantity + OLD.quantity
    WHERE id = OLD.product_id;
    
    RETURN OLD;
  END IF;
  
  -- 주문 아이템 수량 변경 시 재고 조정
  IF TG_OP = 'UPDATE' THEN
    UPDATE public.products 
    SET stock_quantity = stock_quantity + OLD.quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
    -- 재고가 음수가 되면 에러 발생
    IF (SELECT stock_quantity FROM public.products WHERE id = NEW.product_id) < 0 THEN
      RAISE EXCEPTION '재고가 부족합니다. 제품 ID: %', NEW.product_id;
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 재고 관리 트리거 생성 (중복 방지)
DROP TRIGGER IF EXISTS trigger_update_product_stock ON public.order_items;
CREATE TRIGGER trigger_update_product_stock
  AFTER INSERT OR UPDATE OR DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- 5. 주문 상태 변경 시 로깅을 위한 테이블 및 함수
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_status_history') THEN
        CREATE TABLE public.order_status_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
          old_status order_status,
          new_status order_status,
          changed_by UUID REFERENCES public.users(id),
          changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          notes TEXT
        );
    END IF;
END $$;

-- 주문 상태 변경 로깅 함수
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- UPDATE일 때만 로깅
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.order_status_history (order_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 주문 상태 변경 로깅 트리거 (중복 방지)
DROP TRIGGER IF EXISTS trigger_log_order_status_change ON public.orders;
CREATE TRIGGER trigger_log_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- 6. 관리자 설정을 위한 설정 테이블 (하드코딩 제거)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'app_settings') THEN
        CREATE TABLE public.app_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
    END IF;
END $$;

-- 기본 설정 값들 삽입
INSERT INTO public.app_settings (key, value, description) VALUES
('admin_emails', 'admin@daddybathbomb.com', '관리자 이메일 목록 (쉼표로 구분)'),
('site_name', 'Daddy Bath Bomb', '사이트 이름'),
('currency', 'THB', '기본 통화'),
('tax_rate', '0.07', '세율 (7%)'),
('shipping_fee', '50.00', '기본 배송비'),
('free_shipping_threshold', '1000.00', '무료배송 최소 주문금액')
ON CONFLICT (key) DO NOTHING;

-- 7. 개선된 사용자 등록 함수 (설정 테이블 사용)
CREATE OR REPLACE FUNCTION public.handle_new_user_improved()
RETURNS trigger AS $$
DECLARE
  admin_emails_setting TEXT;
BEGIN
  -- 설정에서 관리자 이메일 목록 가져오기
  SELECT value INTO admin_emails_setting 
  FROM public.app_settings 
  WHERE key = 'admin_emails';
  
  INSERT INTO public.users (id, email, nickname, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN position(NEW.email in COALESCE(admin_emails_setting, '')) > 0 THEN 'admin'::user_role
      ELSE 'customer'::user_role
    END
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- 기존 트리거 삭제 후 새 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created_improved
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_improved();

-- 8. RLS 정책 추가 (설정 테이블용)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- 관리자만 설정 관리 가능
CREATE POLICY "Admins can manage app settings" ON public.app_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 관리자만 주문 상태 히스토리 조회 가능
CREATE POLICY "Admins can view order status history" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. 유용한 뷰 생성
-- 주문 상세 정보 뷰
CREATE OR REPLACE VIEW public.order_details AS
SELECT 
  o.id as order_id,
  o.user_id,
  u.email as user_email,
  u.nickname as user_nickname,
  o.total_amount,
  o.status,
  o.shipping_name,
  o.shipping_email,
  o.shipping_address,
  o.shipping_city,
  o.shipping_province,
  o.shipping_postal_code,
  o.payment_method,
  o.payment_status,
  o.created_at as order_date,
  COUNT(oi.id) as item_count,
  STRING_AGG(p.name, ', ') as product_names
FROM public.orders o
JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
LEFT JOIN public.products p ON oi.product_id = p.id
GROUP BY o.id, u.id;

-- 제품 판매 통계 뷰
CREATE OR REPLACE VIEW public.product_sales_stats AS
SELECT 
  p.id,
  p.name,
  p.price,
  p.stock_quantity,
  COALESCE(SUM(oi.quantity), 0) as total_sold,
  COALESCE(SUM(oi.total_price), 0) as total_revenue,
  COUNT(DISTINCT oi.order_id) as order_count
FROM public.products p
LEFT JOIN public.order_items oi ON p.id = oi.product_id
LEFT JOIN public.orders o ON oi.order_id = o.id AND o.status != 'cancelled'
GROUP BY p.id, p.name, p.price, p.stock_quantity;

-- 10. 트리거 추가 (설정 테이블 updated_at)
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
