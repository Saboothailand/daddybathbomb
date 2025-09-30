-- 카테고리 생성 및 RLS 정책 수정
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 현재 상태 확인
SELECT '=== 현재 product_categories 테이블 ===' as info;
SELECT * FROM public.product_categories;

-- 2. RLS 정책 완전히 비활성화 (테스트용)
ALTER TABLE public.product_categories DISABLE ROW LEVEL SECURITY;

-- 3. 기존 데이터 삭제
DELETE FROM public.product_categories;

-- 4. 카테고리 2개 삽입 (가장 기본 방식)
INSERT INTO public.product_categories (name, name_th, name_en, icon, color, display_order, is_active) 
VALUES 
  ('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', '💣', '#FF2D55', 1, true);

INSERT INTO public.product_categories (name, name_th, name_en, icon, color, display_order, is_active) 
VALUES 
  ('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', '🧴', '#007AFF', 2, true);

-- 5. RLS 다시 활성화 (모두 읽기 허용)
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "view_product_categories" ON public.product_categories;
DROP POLICY IF EXISTS "Everyone can view active product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;

-- 모두에게 읽기 허용하는 간단한 정책
CREATE POLICY "allow_all_select" ON public.product_categories
  FOR SELECT USING (true);

-- 6. 결과 확인
SELECT '=== 생성 완료! ===' as info;
SELECT id, name, name_th, name_en, icon, color, display_order, is_active 
FROM public.product_categories 
ORDER BY display_order;

-- 7. 제품과 카테고리 매핑 확인
SELECT '=== 제품-카테고리 매핑 ===' as info;
SELECT 
  g.title as product_title,
  pc.name as category_name,
  pc.icon as category_icon
FROM public.gallery g
LEFT JOIN public.product_categories pc ON g.product_category_id = pc.id
WHERE g.product_category_id IS NOT NULL
ORDER BY pc.display_order, g.title;
