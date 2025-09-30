-- 가장 간단한 테스트 - 카테고리 2개만 확실하게 생성
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 현재 카테고리 확인
SELECT '=== 현재 카테고리 ===' as step;
SELECT * FROM public.product_categories;

-- 2. 모든 카테고리 삭제
DELETE FROM public.product_categories;

-- 3. 카테고리 2개 직접 삽입 (최소 컬럼만)
INSERT INTO public.product_categories (name, name_th, name_en, icon, color, display_order, is_active) 
VALUES 
  ('Daddy Bath Bomb', 'Daddy Bath Bomb', 'Daddy Bath Bomb', '💣', '#FF2D55', 1, true),
  ('Daddy Bath Gel', 'Daddy Bath Gel', 'Daddy Bath Gel', '🧴', '#007AFF', 2, true);

-- 4. 결과 확인
SELECT '=== 생성된 카테고리 ===' as step;
SELECT id, name, name_th, icon, color, is_active FROM public.product_categories;

-- 5. 샘플 제품 3개 (테스트용)
INSERT INTO public.gallery (title, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 
  'Test Bath Bomb 1',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'Admin', 100, 10, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 
  'Test Bath Bomb 2',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1000',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
  'Admin', 90, 8, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Bomb' LIMIT 1;

INSERT INTO public.gallery (title, image_url, thumbnail_url, author_name, view_count, like_count, is_active, product_category_id)
SELECT 
  'Test Bath Gel 1',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
  'Admin', 80, 7, true, id
FROM public.product_categories WHERE name = 'Daddy Bath Gel' LIMIT 1;

-- 6. 제품 확인
SELECT '=== 생성된 제품 ===' as step;
SELECT 
  g.title, 
  pc.name as category_name,
  pc.icon
FROM public.gallery g
JOIN public.product_categories pc ON g.product_category_id = pc.id
ORDER BY pc.display_order, g.title;
