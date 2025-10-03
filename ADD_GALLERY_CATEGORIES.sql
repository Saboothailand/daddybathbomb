-- 갤러리 테이블에 카테고리 컬럼 추가 및 샘플 데이터 삽입

-- 1. gallery_images 테이블에 category 컬럼 추가
ALTER TABLE public.gallery_images 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'bath_bomb';

-- 2. 기존 데이터 업데이트 (bath_bomb으로 설정)
UPDATE public.gallery_images 
SET category = 'bath_bomb' 
WHERE category IS NULL;

-- 3. 기존 샘플 데이터 삭제
DELETE FROM public.gallery_images;

-- 4. Bath Bomb 카테고리 갤러리 이미지 추가
INSERT INTO public.gallery_images (image_url, caption, category, display_order) VALUES
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&fit=crop', 'Lavender Dreams Bath Bomb', 'bath_bomb', 1),
('https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&fit=crop', 'Rose Romance Bath Bomb', 'bath_bomb', 2),
('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&fit=crop', 'Eucalyptus Fresh Bath Bomb', 'bath_bomb', 3),
('https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=600&fit=crop', 'Vanilla Sweet Bath Bomb', 'bath_bomb', 4);

-- 5. Bath Gel 카테고리 갤러리 이미지 추가
INSERT INTO public.gallery_images (image_url, caption, category, display_order) VALUES
('https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=600&fit=crop', 'Lavender Dreams Bath Gel', 'bath_gel', 1),
('https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=600&fit=crop', 'Rose Romance Bath Gel', 'bath_gel', 2),
('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&fit=crop', 'Eucalyptus Fresh Bath Gel', 'bath_gel', 3),
('https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=600&fit=crop', 'Vanilla Sweet Bath Gel', 'bath_gel', 4);

-- 6. 결과 확인
SELECT category, COUNT(*) as count FROM public.gallery_images GROUP BY category;
