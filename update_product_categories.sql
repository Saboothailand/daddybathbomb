-- 기존 product_categories 테이블 업데이트
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. 필요한 컬럼 추가
ALTER TABLE public.product_categories 
ADD COLUMN IF NOT EXISTS name_th TEXT;

ALTER TABLE public.product_categories 
ADD COLUMN IF NOT EXISTS name_en TEXT;

ALTER TABLE public.product_categories 
ADD COLUMN IF NOT EXISTS description_th TEXT;

ALTER TABLE public.product_categories 
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- 2. 기존 데이터 업데이트 (name이 있으면 name_th와 name_en에 복사)
UPDATE public.product_categories 
SET 
  name_th = COALESCE(name_th, name),
  name_en = COALESCE(name_en, name)
WHERE name_th IS NULL OR name_en IS NULL;

-- 3. 기본 카테고리 데이터 업데이트 또는 삽입
INSERT INTO public.product_categories (name, name_th, name_en, description, description_th, description_en, icon, color, display_order, is_active) VALUES
('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', 'Premium fizzy bath bombs for ultimate relaxation', 'บาธบอมพ์พรีเมี่ยมสำหรับการผ่อนคลายสุดพิเศษ', 'Premium fizzy bath bombs for ultimate relaxation', '💣', '#FF2D55', 1, true),
('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', 'Luxurious bath gel for smooth and soft skin', 'เจลอาบน้ำหรูหราสำหรับผิวเนียนนุ่ม', 'Luxurious bath gel for smooth and soft skin', '🧴', '#007AFF', 2, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_th = EXCLUDED.name_th,
  name_en = EXCLUDED.name_en,
  description = EXCLUDED.description,
  description_th = EXCLUDED.description_th,
  description_en = EXCLUDED.description_en,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 4. gallery 테이블에 product_category_id 컬럼 추가
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS product_category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL;

-- 5. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gallery_product_category ON public.gallery(product_category_id, created_at DESC);

-- 완료!
SELECT 
  'Update complete!' as status,
  COUNT(*) as product_categories_count
FROM public.product_categories;
