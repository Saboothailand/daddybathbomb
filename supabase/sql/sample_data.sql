-- 🎯 테스트용 샘플 데이터 삽입 (중복 실행 안전하게 처리)

BEGIN;

-- 1. 샘플 제품 데이터 (SKU 기준 Upsert)
WITH upserted_products AS (
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
    benefits = EXCLUDED.benefits
  RETURNING id, sku
), target_products AS (
  SELECT id, sku FROM upserted_products
  UNION
  SELECT p.id, p.sku
  FROM public.products p
  WHERE p.sku IN ('DBB-HERO-001', 'DBB-OCEAN-001', 'DBB-RAINBOW-001')
)

-- 2. 제품 갤러리 이미지 (중복 방지)
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  tp.id,
  CASE 
    WHEN tp.sku = 'DBB-HERO-001' THEN 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    WHEN tp.sku = 'DBB-OCEAN-001' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400&h=400&fit=crop'
  END,
  (SELECT name FROM public.products WHERE id = tp.id) || ' - Gallery Image',
  1,
  false
FROM target_products tp
WHERE NOT EXISTS (
  SELECT 1
  FROM public.product_images pi
  WHERE pi.product_id = tp.id
    AND pi.display_order = 1
);


-- 3. 추가 사이트 설정
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, is_public, description) VALUES
  ('hero_background_color', '#0B0F1A', 'text', 'hero', true, 'Hero section background color'),
  ('primary_color', '#FF2D55', 'text', 'branding', true, 'Primary brand color'),
  ('secondary_color', '#007AFF', 'text', 'branding', true, 'Secondary brand color'),
  ('accent_color', '#00FF88', 'text', 'branding', true, 'Accent brand color'),
  ('site_slogan', 'Transform your bath time into an epic adventure!', 'text', 'branding', true, 'Site slogan'),
  ('contact_email', 'hello@daddybathbomb.com', 'text', 'contact', true, 'Contact email'),
  ('contact_phone', '+66 2 123 4567', 'text', 'contact', true, 'Contact phone'),
  ('shipping_info', 'Free shipping for orders over ฿1000', 'text', 'shipping', true, 'Shipping information'),
  ('return_policy', '30-day return policy for unused products', 'text', 'policy', true, 'Return policy')
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, updated_at = NOW();

-- 4. 관리자 사용자는 Supabase Auth를 통해 생성해야 함
-- 직접 users 테이블에 삽입하지 않고, 실제 회원가입 후 role을 업데이트하는 방식 사용

-- 참고: 관리자 계정 생성 방법
-- 1. 사이트에서 admin@daddybathbomb.com으로 회원가입
-- 2. 아래 쿼리로 관리자 권한 부여:
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@daddybathbomb.com';

COMMIT;
