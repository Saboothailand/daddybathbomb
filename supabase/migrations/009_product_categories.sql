-- 제품 카테고리 시스템
-- Daddy Bath Bomb / Daddy Bath Gel 등의 제품 카테고리 관리

-- 1. 제품 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  description_th TEXT,
  description_en TEXT,
  icon TEXT DEFAULT '🛁',
  color TEXT DEFAULT '#FF2D55',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. gallery 테이블에 product_category_id 추가
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS product_category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL;

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gallery_product_category ON public.gallery(product_category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_categories_active_order ON public.product_categories(is_active, display_order);

-- 4. RLS 정책 설정
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- 제품 카테고리 조회 정책
CREATE POLICY "Everyone can view active product categories" ON public.product_categories
  FOR SELECT USING (is_active = true);

-- 관리자만 제품 카테고리 관리
CREATE POLICY "Admins can manage product categories" ON public.product_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. 업데이트 트리거
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 기본 카테고리 데이터 삽입
INSERT INTO public.product_categories (name, name_th, name_en, description, description_th, description_en, icon, color, display_order, is_active) VALUES
('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', 'Premium fizzy bath bombs for ultimate relaxation', 'บาธบอมพ์พรีเมี่ยมสำหรับการผ่อนคลายสุดพิเศษ', 'Premium fizzy bath bombs for ultimate relaxation', '💣', '#FF2D55', 1, true),
('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', 'Luxurious bath gel for smooth and soft skin', 'เจลอาบน้ำหรูหราสำหรับผิวเนียนนุ่ม', 'Luxurious bath gel for smooth and soft skin', '🧴', '#007AFF', 2, true)
ON CONFLICT DO NOTHING;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Product Categories 시스템이 성공적으로 추가되었습니다!';
  RAISE NOTICE '기본 카테고리: Daddy Bath Bomb, Daddy Bath Gel';
END $$;
