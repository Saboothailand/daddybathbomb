-- 제품 테이블 ON CONFLICT 에러 수정

-- 1. products 테이블에 SKU UNIQUE 제약조건 추가 (없는 경우에만)
DO $$
BEGIN
    -- SKU 컬럼에 UNIQUE 제약조건이 없으면 추가
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc 
        JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'products' 
        AND kcu.column_name = 'sku' 
        AND tc.constraint_type = 'UNIQUE'
    ) THEN
        -- 기존 중복 SKU가 있는지 확인하고 처리
        -- (일반적으로는 중복이 없을 것이므로 안전하게 진행)
        
        -- UNIQUE 제약조건 추가
        ALTER TABLE public.products ADD CONSTRAINT products_sku_unique UNIQUE (sku);
    END IF;
END $$;

-- 2. 안전한 제품 데이터 삽입 (ON CONFLICT 사용 가능)
INSERT INTO public.products (
  name, description, short_description, price, image_url, 
  category, sku, stock_quantity, is_featured, is_active, 
  color, scent, weight, rating, review_count, 
  colors, tags, benefits
) VALUES 
(
  'Super Hero Fizz Bomb',
  '슈퍼 히어로가 된 기분을 느낄 수 있는 특별한 바스 밤! 파워풀한 거품과 상쾌한 향으로 목욕 시간을 특별하게 만들어드립니다.',
  '파워풀한 거품과 상쾌한 향',
  450.00,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  'Super Heroes',
  'DBB-HERO-001',
  25,
  true,
  true,
  '#FF6B6B',
  'Fresh Citrus Power',
  '150g',
  4.8,
  124,
  ARRAY['#FF6B6B', '#4ECDC4'],
  ARRAY['superhero', 'citrus', 'energizing', 'power'],
  ARRAY['피부 진정', '활력 충전', '스트레스 해소', '상쾌한 기분']
),
(
  'Mystic Ocean Bubble',
  '신비로운 바다의 향이 가득한 릴렉싱 바스 밤! 깊은 바다의 미네랄 성분이 피부를 부드럽게 케어해줍니다.',
  '바다향과 미네랄 성분',
  520.00,
  'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400&h=400&fit=crop',
  'Ocean Dreams',
  'DBB-OCEAN-001',
  30,
  true,
  true,
  '#4ECDC4',
  'Deep Ocean Breeze',
  '140g',
  4.7,
  89,
  ARRAY['#4ECDC4', '#45B7D1'],
  ARRAY['ocean', 'relaxing', 'mineral', 'calm'],
  ARRAY['깊은 보습', '마음의 평화', '피부 재생', '스트레스 완화']
),
(
  'Rainbow Explosion',
  '무지개 색깔의 화려한 바스 밤! 물에 닿는 순간 아름다운 색상이 퍼지며 환상적인 목욕 경험을 선사합니다.',
  '무지개 색깔의 화려한 거품',
  380.00,
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
  'Colorful Magic',
  'DBB-RAINBOW-001',
  40,
  true,
  true,
  '#FF69B4',
  'Sweet Rainbow Mix',
  '130g',
  4.9,
  156,
  ARRAY['#FF69B4', '#FFD700', '#00CED1'],
  ARRAY['colorful', 'fun', 'kids', 'rainbow'],
  ARRAY['기분 전환', '즐거운 목욕', '컬러 테라피', '상상력 자극']
)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active,
  color = EXCLUDED.color,
  scent = EXCLUDED.scent,
  weight = EXCLUDED.weight,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  colors = EXCLUDED.colors,
  tags = EXCLUDED.tags,
  benefits = EXCLUDED.benefits,
  updated_at = NOW();

-- 3. 제품 갤러리 이미지 추가 (중복 방지)
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  CASE 
    WHEN p.sku = 'DBB-HERO-001' THEN 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    WHEN p.sku = 'DBB-OCEAN-001' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400&h=400&fit=crop'
  END,
  p.name || ' - Gallery Image',
  1,
  false
FROM public.products p
WHERE p.sku IN ('DBB-HERO-001', 'DBB-OCEAN-001', 'DBB-RAINBOW-001')
AND NOT EXISTS (
  SELECT 1 FROM public.product_images pi 
  WHERE pi.product_id = p.id AND pi.display_order = 1
);
