-- 기존 product_categories 테이블에 모든 필요한 컬럼 추가
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. 모든 필요한 컬럼 추가
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS name_th TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS description_th TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🛁';
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#FF2D55';
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.product_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. 기존 데이터 업데이트 (name 컬럼이 있다면)
UPDATE public.product_categories 
SET 
  name_th = COALESCE(name_th, name),
  name_en = COALESCE(name_en, name)
WHERE name IS NOT NULL AND (name_th IS NULL OR name_en IS NULL);

-- 3. 기존 데이터 삭제 (깨끗하게 시작)
DELETE FROM public.product_categories;

-- 4. 기본 카테고리 삽입
INSERT INTO public.product_categories (name, name_th, name_en, description, description_th, description_en, icon, color, display_order, is_active) VALUES
('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', 'Premium fizzy bath bombs for ultimate relaxation', 'บาธบอมพ์พรีเมี่ยมสำหรับการผ่อนคลายสุดพิเศษ', 'Premium fizzy bath bombs for ultimate relaxation', '💣', '#FF2D55', 1, true),
('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', 'Luxurious bath gel for smooth and soft skin', 'เจลอาบน้ำหรูหราสำหรับผิวเนียนนุ่ม', 'Luxurious bath gel for smooth and soft skin', '🧴', '#007AFF', 2, true);

-- 5. gallery 테이블에 product_category_id 컬럼 추가
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS product_category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL;

-- 6. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gallery_product_category ON public.gallery(product_category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_categories_active_order ON public.product_categories(is_active, display_order);

-- 7. RLS 정책 (이미 있다면 삭제 후 재생성)
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view active product categories" ON public.product_categories;
CREATE POLICY "Everyone can view active product categories" ON public.product_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;
CREATE POLICY "Admins can manage product categories" ON public.product_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid()
    )
  );

-- 8. 트리거 설정
DROP TRIGGER IF EXISTS update_product_categories_updated_at ON public.product_categories;
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 완료!
SELECT 
  'Product categories setup complete!' as status,
  COUNT(*) as categories_count,
  string_agg(name || ' (' || icon || ')', ', ') as categories
FROM public.product_categories;
