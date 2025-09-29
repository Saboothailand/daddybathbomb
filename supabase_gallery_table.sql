-- 갤러리 테이블 생성
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 1. 갤러리 테이블 생성
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    author_name TEXT NOT NULL DEFAULT 'Admin',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_notice BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    category_id UUID REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. RLS 정책 설정
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성 갤러리 항목 읽기 가능
CREATE POLICY "Public read access for active gallery items" ON public.gallery
    FOR SELECT USING (is_active = true);

-- 관리자만 갤러리 관리 가능
CREATE POLICY "Admin full access for gallery" ON public.gallery
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 3. 업데이트 트리거 추가
CREATE TRIGGER update_gallery_updated_at
    BEFORE UPDATE ON public.gallery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_gallery_active ON public.gallery(is_active, created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_notice ON public.gallery(is_notice, created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_search ON public.gallery USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));

-- 5. 샘플 갤러리 데이터 삽입
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, category_id) VALUES
('Perfect Gift for Special Occasions', 'Our bath bombs make the perfect gift for any special occasion. Made with natural ingredients and beautiful fragrances.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Admin', 150, 25, 8, true, (SELECT id FROM public.gallery_categories WHERE name = 'Products' LIMIT 1)),
('Luxury Spa Experience', 'Transform your home into a luxury spa with our premium bath bombs. Relax and unwind with our carefully crafted formulas.', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop', 'Admin', 120, 18, 5, false, (SELECT id FROM public.gallery_categories WHERE name = 'Products' LIMIT 1)),
('Natural Ingredients', '100% natural and safe for the whole family. No harmful chemicals, just pure relaxation.', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop', 'Admin', 95, 12, 3, false, (SELECT id FROM public.gallery_categories WHERE name = 'Products' LIMIT 1)),
('Customer Review', 'Amazing product! Highly recommended. The fragrance is incredible and the colors are beautiful.', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=400&h=400&fit=crop', 'Customer', 80, 15, 7, false, (SELECT id FROM public.gallery_categories WHERE name = 'Reviews' LIMIT 1)),
('Lifestyle Photo', 'Perfect for a relaxing evening at home. Create your own spa experience with our bath bombs.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', 'Customer', 65, 10, 4, false, (SELECT id FROM public.gallery_categories WHERE name = 'Lifestyle' LIMIT 1)),
('Tutorial: How to Use', 'Step-by-step guide on how to get the most out of your bath bomb experience.', 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=400&h=400&fit=crop', 'Admin', 110, 20, 6, false, (SELECT id FROM public.gallery_categories WHERE name = 'Tutorials' LIMIT 1)),
('Special Event', 'Join us for our special promotion event! Limited time offer on all products.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', 'Admin', 90, 14, 5, false, (SELECT id FROM public.gallery_categories WHERE name = 'Events' LIMIT 1)),
('Product Showcase', 'Check out our latest collection of bath bombs. Each one is handcrafted with love.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Admin', 75, 12, 3, false, (SELECT id FROM public.gallery_categories WHERE name = 'Products' LIMIT 1));

-- 6. 뷰 생성 (현재 활성 갤러리 항목 조회용)
CREATE OR REPLACE VIEW public.active_gallery AS
SELECT 
    g.id,
    g.title,
    g.content,
    g.image_url,
    g.thumbnail_url,
    g.author_name,
    g.view_count,
    g.like_count,
    g.comment_count,
    g.is_notice,
    g.category_id,
    g.created_at,
    g.updated_at,
    c.name as category_name,
    c.name_th as category_name_th,
    c.color as category_color,
    c.icon as category_icon
FROM public.gallery g
LEFT JOIN public.gallery_categories c ON g.category_id = c.id
WHERE g.is_active = true
ORDER BY g.is_notice DESC, g.created_at DESC;
