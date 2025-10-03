-- 배너 조건 디버깅
-- 1. 전체 배너 확인
SELECT id, title, position, is_active, start_date, end_date, created_at 
FROM banner_images 
ORDER BY position, display_order;

-- 2. is_active = true 조건만
SELECT id, title, position, is_active 
FROM banner_images 
WHERE is_active = true
ORDER BY position, display_order;

-- 3. 날짜 조건 확인 (현재 시간 기준)
SELECT 
  id, 
  title, 
  position, 
  is_active,
  start_date,
  end_date,
  CASE 
    WHEN start_date IS NULL THEN 'start_date is NULL'
    WHEN start_date <= NOW() THEN 'start_date is valid'
    ELSE 'start_date is future'
  END as start_status,
  CASE 
    WHEN end_date IS NULL THEN 'end_date is NULL'
    WHEN end_date >= NOW() THEN 'end_date is valid'
    ELSE 'end_date is past'
  END as end_status
FROM banner_images 
WHERE is_active = true
ORDER BY position, display_order;

-- 4. 최종 필터링 조건 (프론트엔드와 동일)
SELECT id, title, position, is_active
FROM banner_images 
WHERE is_active = true 
  AND (start_date IS NULL OR start_date <= NOW())
  AND (end_date IS NULL OR end_date >= NOW())
ORDER BY position, display_order;

-- 5. position별 개수
SELECT 
  position,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_count,
  COUNT(CASE WHEN is_active = true 
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW()) 
    THEN 1 END) as final_count
FROM banner_images 
GROUP BY position
ORDER BY position;


