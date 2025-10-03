-- 현재 정책 상태 확인
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 1. 현재 정책들 확인
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename IN ('banner_images', 'banner_clicks')
ORDER BY tablename, policyname;

-- 2. 현재 사용자 확인
SELECT 
    auth.jwt() ->> 'email' as current_email,
    auth.uid() as current_user_id;

-- 3. 배너 데이터 확인
SELECT 
    position, 
    title, 
    description, 
    is_active,
    display_order,
    COUNT(*) as count 
FROM banner_images 
GROUP BY position, title, description, is_active, display_order
ORDER BY position, display_order;
