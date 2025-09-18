-- 과일 시리즈 제품 데이터 (테이블 생성 후 실행)

-- 1. 과일 카테고리 생성
INSERT INTO public.product_categories (name, slug, description)
VALUES ('Fruit Splash Series', 'fruit-splash-series', '과일 향 배쓰밤 스페셜 컬렉션')
ON CONFLICT (slug) DO UPDATE SET 
    description = EXCLUDED.description,
    updated_at = NOW();

-- 2. 과일 제품 20종 추가
DO $$
DECLARE
    fruit_cat_id UUID;
BEGIN
    -- 카테고리 ID 가져오기
    SELECT id INTO fruit_cat_id FROM public.product_categories WHERE slug = 'fruit-splash-series';
    
    -- 과일 제품들 삽입
    INSERT INTO public.products (
        name, description, short_description, long_description, price, original_price,
        image_url, category_id, sku, stock_quantity, is_featured, is_active,
        color, scent, weight, ingredients, tags, benefits, rating, review_count, colors
    ) VALUES
    (
        'Strawberry Splash Bubble Bomb',
        '싱싱한 딸기 향이 폭발하는 버블 배쓰밤',
        '딸기향 버블과 핑크빛 거품',
        '싱그러운 딸기와 크림이 어우러진 향이 욕조를 가득 채웁니다.',
        18.90, 22.90,
        'https://images.unsplash.com/photo-1585325701961-89c09fd9b1f7?w=500&h=400&fit=crop',
        fruit_cat_id, 'DBB-FRUIT-001', 50, true, true,
        '#ff5b7f', 'Fresh Strawberry Milkshake', '120g',
        'Strawberry extract, coconut oil, shea butter, Epsom salt',
        ARRAY['fruit','strawberry','sweet','kids'],
        ARRAY['피부 진정','촉촉한 보습','상큼한 향기','기분 전환'],
        4.8, 126, ARRAY['#ff5b7f','#ff8fb5']
    ),
    (
        'Mango Tango Fizzy Bomb',
        '열대 망고 향이 가득한 트로피컬 버블',
        '망고와 코코넛의 달콤한 조화',
        '열대 정원의 풍미가 담긴 망고·코코넛 버블로 휴양지 기분을 선사합니다.',
        19.50, 24.00,
        'https://images.unsplash.com/photo-1514996937319-344454492b37?w=500&h=400&fit=crop',
        fruit_cat_id, 'DBB-FRUIT-002', 45, true, true,
        '#ffa726', 'Tropical Mango & Coconut', '125g',
        'Mango butter, coconut milk powder, sea salt, vitamin E',
        ARRAY['fruit','tropical','vacation'],
        ARRAY['피부 영양 공급','달콤한 향','휴양지 무드'],
        4.7, 98, ARRAY['#ffa726','#ffd180']
    ),
    (
        'Pineapple Paradise Soak',
        '파인애플과 라임이 어우러진 상큼 버블',
        '파인애플 향 폭발',
        '톡 쏘는 라임과 달콤한 파인애플이 만나 상큼한 배쓰타임을 연출합니다.',
        18.20, 21.90,
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=400&fit=crop',
        fruit_cat_id, 'DBB-FRUIT-003', 40, true, true,
        '#ffd54f', 'Pineapple Lime Sparkle', '115g',
        'Pineapple extract, lime oil, baking soda, cocoa butter',
        ARRAY['fruit','pineapple','citrus'],
        ARRAY['활력 충전','비타민 활력','상큼한 거품'],
        4.6, 84, ARRAY['#ffd54f','#ffe082']
    ),
    (
        'Blueberry Bliss Bubbling Bomb',
        '진한 블루베리 향의 딥블루 버블',
        '베리향 릴랙스 타임',
        '블루베리 안티옥시던트가 피부에 활력을 주고, 보라빛 물결이 깊은 휴식을 제공합니다.',
        19.80, 25.50,
        'https://images.unsplash.com/photo-1593251698860-4fcc1e2392b9?w=500&h=400&fit=crop',
        fruit_cat_id, 'DBB-FRUIT-004', 38, true, true,
        '#5c6bc0', 'Blueberry Vanilla', '130g',
        'Blueberry extract, vanilla bean, Himalayan salt, almond oil',
        ARRAY['fruit','berry','relax'],
        ARRAY['피부 항산화','심신 안정','달콤한 향'],
        4.9, 154, ARRAY['#5c6bc0','#9fa8da']
    ),
    (
        'Watermelon Wave Soother',
        '수박 주스 같은 청량 버블',
        '한여름 수박 향기',
        '시원한 수박 향과 민트가 어우러진 청량 배쓰밤으로 여름철 필수템입니다.',
        17.20, 20.50,
        'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&h=400&fit=crop',
        fruit_cat_id, 'DBB-FRUIT-005', 48, true, true,
        '#ff6f91', 'Watermelon Mint Cooler', '120g',
        'Watermelon extract, mint oil, aloe powder, sea salt',
        ARRAY['fruit','summer','cooling'],
        ARRAY['열감 완화','수딩 효과','시원한 향'],
        4.4, 61, ARRAY['#ff6f91','#ffb3d1']
    )
    ON CONFLICT (sku) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        image_url = EXCLUDED.image_url,
        updated_at = NOW();
END $$;
