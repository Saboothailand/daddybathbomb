-- 고급 개선사항 및 실무 최적화
-- 이 파일은 002_improvements.sql 실행 후 추가로 실행하세요

-- 1. 주문 상태에 따른 재고 관리 개선
CREATE OR REPLACE FUNCTION handle_order_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  -- 주문이 취소되면 해당 주문의 모든 아이템 재고 복구
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE public.products 
    SET stock_quantity = stock_quantity + oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND products.id = oi.product_id;
    
    -- 로그 남기기
    INSERT INTO public.order_status_history (order_id, old_status, new_status, changed_by, notes)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid(), '주문 취소로 인한 재고 복구 완료');
  END IF;
  
  -- 취소된 주문이 다시 활성화되면 재고 차감
  IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
    -- 재고 부족 사전 체크
    IF EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.order_items oi ON p.id = oi.product_id
      WHERE oi.order_id = NEW.id AND p.stock_quantity < oi.quantity
    ) THEN
      RAISE EXCEPTION '재고가 부족하여 주문을 복구할 수 없습니다. 주문 ID: %', NEW.id;
    END IF;
    
    -- 재고 차감
    UPDATE public.products 
    SET stock_quantity = stock_quantity - oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND products.id = oi.product_id;
    
    -- 로그 남기기
    INSERT INTO public.order_status_history (order_id, old_status, new_status, changed_by, notes)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid(), '주문 복구로 인한 재고 차감 완료');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 주문 취소/복구 트리거
DROP TRIGGER IF EXISTS trigger_handle_order_cancellation ON public.orders;
CREATE TRIGGER trigger_handle_order_cancellation
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION handle_order_cancellation();

-- 2. 동시성 제어를 위한 개선된 재고 관리
CREATE OR REPLACE FUNCTION update_product_stock_with_lock()
RETURNS TRIGGER AS $$
DECLARE
  current_stock INTEGER;
  product_name TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- SELECT FOR UPDATE로 락 획득하여 동시성 문제 방지
    SELECT stock_quantity, name INTO current_stock, product_name
    FROM public.products 
    WHERE id = NEW.product_id
    FOR UPDATE;
    
    -- 재고 부족 체크
    IF current_stock < NEW.quantity THEN
      RAISE EXCEPTION '재고가 부족합니다. 제품: %, 현재 재고: %, 요청 수량: %', 
        product_name, current_stock, NEW.quantity;
    END IF;
    
    -- 재고 차감
    UPDATE public.products 
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    -- 재고 복구 (락 사용)
    UPDATE public.products 
    SET stock_quantity = stock_quantity + OLD.quantity
    WHERE id = OLD.product_id;
    
    RETURN OLD;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    -- 수량 변경 시 재고 조정 (락 사용)
    SELECT stock_quantity, name INTO current_stock, product_name
    FROM public.products 
    WHERE id = NEW.product_id
    FOR UPDATE;
    
    -- 추가 필요 재고 계산
    DECLARE
      additional_needed INTEGER := NEW.quantity - OLD.quantity;
    BEGIN
      IF additional_needed > 0 AND current_stock < additional_needed THEN
        RAISE EXCEPTION '재고가 부족합니다. 제품: %, 현재 재고: %, 추가 필요: %', 
          product_name, current_stock, additional_needed;
      END IF;
      
      UPDATE public.products 
      SET stock_quantity = stock_quantity - additional_needed
      WHERE id = NEW.product_id;
    END;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 기존 재고 트리거 교체
DROP TRIGGER IF EXISTS trigger_update_product_stock ON public.order_items;
CREATE TRIGGER trigger_update_product_stock_with_lock
  AFTER INSERT OR UPDATE OR DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_product_stock_with_lock();

-- 3. 성능 최적화를 위한 추가 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_active_category ON public.products(is_active, category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_order_items_product_order ON public.order_items(product_id, order_id);
CREATE INDEX IF NOT EXISTS idx_content_type_active ON public.content(content_type, is_active) WHERE is_active = true;

-- 4. 태국 전화번호 검증 함수
CREATE OR REPLACE FUNCTION is_valid_thai_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- 태국 전화번호 형식: +66, 0, 또는 66으로 시작하는 9-10자리
  -- 예: +66812345678, 0812345678, 66812345678
  IF phone IS NULL OR LENGTH(phone) = 0 THEN
    RETURN TRUE; -- NULL이나 빈 문자열은 허용 (선택사항 필드)
  END IF;
  
  RETURN phone ~ '^(\+66|66|0)[0-9]{8,9}$';
END;
$$ LANGUAGE plpgsql;

-- 전화번호 검증 제약조건 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_phone_format' AND table_name = 'users') THEN
        ALTER TABLE public.users ADD CONSTRAINT check_phone_format 
            CHECK (phone IS NULL OR is_valid_thai_phone(phone));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_shipping_phone_format' AND table_name = 'orders') THEN
        ALTER TABLE public.orders ADD CONSTRAINT check_shipping_phone_format 
            CHECK (is_valid_thai_phone(shipping_phone));
    END IF;
END $$;

-- 5. 주문 아카이브 시스템 (데이터 관리)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'archived_orders') THEN
        CREATE TABLE public.archived_orders (
            LIKE public.orders INCLUDING ALL
        );
        
        -- 아카이브 테이블에도 인덱스 추가
        CREATE INDEX idx_archived_orders_created_at ON public.archived_orders(created_at DESC);
        CREATE INDEX idx_archived_orders_user_id ON public.archived_orders(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'archived_order_items') THEN
        CREATE TABLE public.archived_order_items (
            LIKE public.order_items INCLUDING ALL
        );
        
        CREATE INDEX idx_archived_order_items_order_id ON public.archived_order_items(order_id);
    END IF;
END $$;

-- 주문 아카이브 함수
CREATE OR REPLACE FUNCTION archive_old_orders(days_old INTEGER DEFAULT 365)
RETURNS TABLE(archived_orders_count INTEGER, archived_items_count INTEGER) AS $$
DECLARE
  orders_count INTEGER := 0;
  items_count INTEGER := 0;
BEGIN
  -- 오래된 완료/취소된 주문들을 아카이브로 이동
  WITH moved_orders AS (
    DELETE FROM public.orders 
    WHERE created_at < NOW() - (days_old || ' days')::INTERVAL 
    AND status IN ('delivered', 'cancelled')
    RETURNING *
  )
  INSERT INTO public.archived_orders SELECT * FROM moved_orders;
  
  GET DIAGNOSTICS orders_count = ROW_COUNT;
  
  -- 관련 주문 아이템들도 아카이브로 이동
  WITH moved_items AS (
    DELETE FROM public.order_items 
    WHERE order_id IN (
      SELECT id FROM public.archived_orders 
      WHERE created_at < NOW() - (days_old || ' days')::INTERVAL
    )
    RETURNING *
  )
  INSERT INTO public.archived_order_items SELECT * FROM moved_items;
  
  GET DIAGNOSTICS items_count = ROW_COUNT;
  
  RETURN QUERY SELECT orders_count, items_count;
END;
$$ LANGUAGE plpgsql;

-- 6. 재고 알림 시스템
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TABLE(product_id UUID, product_name TEXT, current_stock INTEGER, recommended_reorder INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.stock_quantity,
    CASE 
      WHEN p.stock_quantity <= 5 THEN 50  -- 5개 이하면 50개 주문 권장
      WHEN p.stock_quantity <= 10 THEN 30 -- 10개 이하면 30개 주문 권장
      ELSE 20 -- 그 외는 20개 주문 권장
    END as recommended_reorder
  FROM public.products p
  WHERE p.is_active = true 
  AND p.stock_quantity <= 15  -- 15개 이하인 제품들
  ORDER BY p.stock_quantity ASC;
END;
$$ LANGUAGE plpgsql;

-- 7. 매출 분석을 위한 뷰 개선
CREATE OR REPLACE VIEW public.daily_sales_report AS
SELECT 
  DATE(o.created_at) as sale_date,
  COUNT(DISTINCT o.id) as order_count,
  COUNT(DISTINCT o.user_id) as customer_count,
  SUM(o.total_amount) as total_revenue,
  AVG(o.total_amount) as avg_order_value,
  SUM(oi.quantity) as total_items_sold
FROM public.orders o
JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled')
GROUP BY DATE(o.created_at)
ORDER BY sale_date DESC;

-- 월별 매출 뷰
CREATE OR REPLACE VIEW public.monthly_sales_report AS
SELECT 
  DATE_TRUNC('month', o.created_at) as sale_month,
  COUNT(DISTINCT o.id) as order_count,
  COUNT(DISTINCT o.user_id) as customer_count,
  SUM(o.total_amount) as total_revenue,
  AVG(o.total_amount) as avg_order_value,
  SUM(oi.quantity) as total_items_sold
FROM public.orders o
JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled')
GROUP BY DATE_TRUNC('month', o.created_at)
ORDER BY sale_month DESC;

-- 8. 고객 분석 뷰
CREATE OR REPLACE VIEW public.customer_analytics AS
SELECT 
  u.id,
  u.email,
  u.nickname,
  u.created_at as registration_date,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total_amount), 0) as lifetime_value,
  COALESCE(AVG(o.total_amount), 0) as avg_order_value,
  MAX(o.created_at) as last_order_date,
  CASE 
    WHEN MAX(o.created_at) > NOW() - INTERVAL '30 days' THEN 'Active'
    WHEN MAX(o.created_at) > NOW() - INTERVAL '90 days' THEN 'At Risk'
    WHEN MAX(o.created_at) IS NOT NULL THEN 'Inactive'
    ELSE 'Never Ordered'
  END as customer_status
FROM public.users u
LEFT JOIN public.orders o ON u.id = o.user_id AND o.status NOT IN ('cancelled')
WHERE u.role = 'customer'
GROUP BY u.id, u.email, u.nickname, u.created_at
ORDER BY lifetime_value DESC;

-- 9. 데이터베이스 유지보수 함수
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
  archived_result RECORD;
BEGIN
  -- 1년 이상 된 완료/취소 주문 아카이브
  SELECT * INTO archived_result FROM archive_old_orders(365);
  result := result || format('아카이브된 주문: %s개, 주문 아이템: %s개', 
                            archived_result.archived_orders_count, 
                            archived_result.archived_items_count) || E'\n';
  
  -- 오래된 상태 변경 히스토리 삭제 (2년 이상)
  DELETE FROM public.order_status_history 
  WHERE changed_at < NOW() - INTERVAL '2 years';
  
  result := result || format('삭제된 상태 히스토리: %s개', FOUND) || E'\n';
  
  -- 통계 업데이트 (PostgreSQL ANALYZE)
  ANALYZE public.products;
  ANALYZE public.orders;
  ANALYZE public.order_items;
  
  result := result || '테이블 통계 업데이트 완료' || E'\n';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 10. RLS 정책 추가 (새 테이블들)
ALTER TABLE public.archived_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archived_order_items ENABLE ROW LEVEL SECURITY;

-- 관리자만 아카이브 데이터 접근 가능
CREATE POLICY "Admins can access archived orders" ON public.archived_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can access archived order items" ON public.archived_order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. 성능 모니터링을 위한 함수
CREATE OR REPLACE FUNCTION get_table_stats()
RETURNS TABLE(
  table_name TEXT,
  row_count BIGINT,
  table_size TEXT,
  index_size TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname||'.'||tablename as table_name,
    n_tup_ins - n_tup_del as row_count,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size
  FROM pg_stat_user_tables 
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '고급 개선사항이 성공적으로 적용되었습니다!';
  RAISE NOTICE '- 동시성 제어 개선';
  RAISE NOTICE '- 주문 상태별 재고 관리';
  RAISE NOTICE '- 태국 전화번호 검증';
  RAISE NOTICE '- 데이터 아카이브 시스템';
  RAISE NOTICE '- 매출 분석 뷰';
  RAISE NOTICE '- 성능 최적화 인덱스';
END $$;
