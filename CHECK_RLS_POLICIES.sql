-- RLS 정책 확인
-- 1. 테이블 RLS 상태
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'banner_images';

-- 2. 현재 정책들
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'banner_images';

-- 3. anon 역할로 테스트 쿼리 (실제 프론트엔드와 동일)
SET ROLE anon;
SELECT id, title, position, is_active
FROM banner_images 
WHERE is_active = true 
  AND (start_date IS NULL OR start_date <= NOW())
  AND (end_date IS NULL OR end_date >= NOW())
ORDER BY position, display_order;
RESET ROLE;


