-- 배너 테스트 쿼리
-- 1. 테이블 존재 확인
SELECT table_name FROM information_schema.tables WHERE table_name = 'banner_images';

-- 2. 전체 배너 개수 확인
SELECT COUNT(*) as total_banners FROM banner_images;

-- 3. position별 개수 확인
SELECT position, COUNT(*) as count FROM banner_images GROUP BY position;

-- 4. middle/bottom 배너 상세 확인
SELECT id, title, position, is_active, start_date, end_date, created_at 
FROM banner_images 
WHERE position IN ('middle', 'bottom')
ORDER BY position, display_order;

-- 5. 활성 배너만 확인
SELECT id, title, position, is_active 
FROM banner_images 
WHERE is_active = true 
AND position IN ('middle', 'bottom')
ORDER BY position, display_order;


