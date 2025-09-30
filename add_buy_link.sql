-- 제품 구매 링크 기능 추가
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. gallery 테이블에 buy_link 컬럼 추가
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS buy_link TEXT;

-- 2. 테스트 구매 링크 추가
UPDATE public.gallery 
SET buy_link = 'https://line.me/ti/p/YOUR_LINE_ID'
WHERE title = 'Perfect Gift for Special Occasions';

UPDATE public.gallery 
SET buy_link = 'https://shopee.co.th/shop/YOUR_SHOP_ID'
WHERE title = 'Luxury Spa Experience';

UPDATE public.gallery 
SET buy_link = 'https://www.lazada.co.th/shop/YOUR_SHOP_ID'
WHERE title = 'Natural Ingredients Bath Gel';

-- 완료!
SELECT 
  'Buy link feature added!' as status,
  COUNT(*) as products_with_links
FROM public.gallery 
WHERE buy_link IS NOT NULL;
