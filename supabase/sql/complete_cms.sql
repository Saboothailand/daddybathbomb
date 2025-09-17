-- 완전한 CMS (Content Management System) 구축
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- 페이지 타입 열거형
CREATE TYPE page_type AS ENUM ('page', 'product', 'faq_item', 'how_to_step');

-- 콘텐츠 블록 타입 열거형  
CREATE TYPE content_block_type AS ENUM ('text', 'image', 'video', 'gallery', 'button', 'divider', 'quote', 'list');

-- 메인 페이지 관리 테이블
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL, -- URL 슬러그 (예: 'about-us', 'how-to-use')
    title TEXT NOT NULL,
    meta_title TEXT, -- SEO 제목
    meta_description TEXT, -- SEO 설명
    page_type page_type DEFAULT 'page',
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false, -- 메뉴에 표시 여부
    menu_order INTEGER DEFAULT 0, -- 메뉴 순서
    parent_page_id UUID REFERENCES public.pages(id), -- 하위 페이지용
    template_name TEXT DEFAULT 'default', -- 템플릿 이름
    custom_css TEXT, -- 커스텀 CSS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 콘텐츠 블록 테이블 (페이지 구성 요소)
CREATE TABLE IF NOT EXISTS public.content_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    block_type content_block_type NOT NULL,
    title TEXT,
    content TEXT, -- HTML 콘텐츠
    image_url TEXT,
    link_url TEXT,
    settings JSONB DEFAULT '{}', -- 블록별 설정 (색상, 크기 등)
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- FAQ 관리 테이블
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general', -- FAQ 카테고리
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 사용법 단계 관리 테이블
CREATE TABLE IF NOT EXISTS public.how_to_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    icon TEXT, -- 아이콘 (이모지 또는 클래스명)
    tips TEXT, -- 추가 팁
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 제품 카테고리 테이블
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 제품 테이블 확장 (이미 있다면 스킵)
DO $$
BEGIN
    -- products 테이블에 컬럼 추가 (존재하지 않을 경우에만)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
        ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.product_categories(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'description_html') THEN
        ALTER TABLE public.products ADD COLUMN description_html TEXT; -- 리치 텍스트 설명
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'features') THEN
        ALTER TABLE public.products ADD COLUMN features JSONB DEFAULT '[]'; -- 제품 특징 배열
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'specifications') THEN
        ALTER TABLE public.products ADD COLUMN specifications JSONB DEFAULT '{}'; -- 제품 사양
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'meta_title') THEN
        ALTER TABLE public.products ADD COLUMN meta_title TEXT; -- SEO 제목
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'meta_description') THEN
        ALTER TABLE public.products ADD COLUMN meta_description TEXT; -- SEO 설명
    END IF;
END $$;

-- RLS 정책 설정
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.how_to_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public read access for published pages" ON public.pages
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for visible content blocks" ON public.content_blocks
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read access for published faqs" ON public.faqs
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for published how_to_steps" ON public.how_to_steps
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for active categories" ON public.product_categories
    FOR SELECT USING (is_active = true);

-- 관리자 전체 접근 정책
CREATE POLICY "Admin full access for pages" ON public.pages
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for content_blocks" ON public.content_blocks
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for faqs" ON public.faqs
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for how_to_steps" ON public.how_to_steps
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full access for product_categories" ON public.product_categories
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 업데이트 트리거
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at
    BEFORE UPDATE ON public.content_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_how_to_steps_updated_at
    BEFORE UPDATE ON public.how_to_steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at
    BEFORE UPDATE ON public.product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입
INSERT INTO public.pages (slug, title, meta_title, meta_description, is_featured, menu_order) VALUES
('about-us', 'About Us', 'About Daddy Bath Bomb - Premium Natural Bath Products', 'Learn about our story, mission, and commitment to natural bath bomb ingredients', true, 1),
('how-to-use', 'How to Use', 'How to Use Bath Bombs - Complete Guide', 'Step-by-step guide on how to use our premium bath bombs for the best experience', true, 2),
('faq', 'Frequently Asked Questions', 'FAQ - Daddy Bath Bomb', 'Find answers to common questions about our bath bombs, shipping, and more', true, 3),
('contact', 'Contact Us', 'Contact Daddy Bath Bomb - Get in Touch', 'Contact information and ways to reach our customer service team', true, 4);

-- About Us 페이지 콘텐츠 블록
INSERT INTO public.content_blocks (page_id, block_type, title, content, display_order) VALUES
((SELECT id FROM public.pages WHERE slug = 'about-us'), 'text', 'Our Story', '<h2>Welcome to Daddy Bath Bomb</h2><p>We are passionate about creating premium, natural bath bombs that transform your bathing experience into a luxurious spa retreat at home.</p>', 1),
((SELECT id FROM public.pages WHERE slug = 'about-us'), 'image', 'Our Products', NULL, 2),
((SELECT id FROM public.pages WHERE slug = 'about-us'), 'text', 'Our Mission', '<h3>Our Mission</h3><p>To provide 100% natural, safe, and effective bath products that promote relaxation, skin health, and overall well-being for the entire family.</p>', 3);

-- FAQ 샘플 데이터
INSERT INTO public.faqs (question, answer, category, display_order) VALUES
('How long do bath bombs last?', 'Our bath bombs have a shelf life of 12 months when stored in a cool, dry place away from moisture.', 'product', 1),
('Are your bath bombs safe for sensitive skin?', 'Yes! Our bath bombs are made with 100% natural ingredients and are gentle on all skin types, including sensitive skin.', 'product', 2),
('How do I use a bath bomb?', 'Simply fill your bathtub with warm water and drop the bath bomb in. Watch it fizz and release beautiful colors and fragrances!', 'usage', 3),
('Do you offer international shipping?', 'Currently, we ship within Thailand only. International shipping will be available soon.', 'shipping', 4),
('Can I return a product if I''m not satisfied?', 'Yes, we offer a 30-day return policy for unopened products. Please contact our customer service for assistance.', 'policy', 5);

-- How to Use 단계
INSERT INTO public.how_to_steps (step_number, title, description, icon, tips) VALUES
(1, 'Fill Your Bathtub', 'Fill your bathtub with warm water (not too hot to preserve the natural oils)', '🛁', 'Ideal water temperature is between 37-40°C'),
(2, 'Drop the Bath Bomb', 'Gently place the bath bomb into the water and watch it fizz', '💧', 'Drop it in the center for the best fizzing effect'),
(3, 'Enjoy the Colors', 'Watch as beautiful colors and fragrances fill your bath', '🌈', 'Take photos of the beautiful colors for social media!'),
(4, 'Relax and Soak', 'Soak for 15-20 minutes and let the natural ingredients nourish your skin', '😌', 'Use this time for meditation or reading'),
(5, 'Rinse Off', 'Rinse with clean water after soaking to remove any residue', '🚿', 'Pat dry gently with a soft towel');

-- 제품 카테고리
INSERT INTO public.product_categories (name, description, slug, display_order) VALUES
('Relaxing', 'Bath bombs designed for relaxation and stress relief', 'relaxing', 1),
('Energizing', 'Invigorating bath bombs to boost your energy', 'energizing', 2),
('Romantic', 'Perfect for romantic evenings and special occasions', 'romantic', 3),
('Kids', 'Fun and safe bath bombs specially made for children', 'kids', 4),
('Gift Sets', 'Beautifully packaged gift sets for special occasions', 'gift-sets', 5);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published_featured ON public.pages(is_published, is_featured, menu_order);
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_order ON public.content_blocks(page_id, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_category_order ON public.faqs(category, display_order);
CREATE INDEX IF NOT EXISTS idx_how_to_steps_number ON public.how_to_steps(step_number);
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON public.product_categories(slug);

-- 뷰: 메뉴 아이템
CREATE OR REPLACE VIEW public.menu_items AS
SELECT 
    id,
    slug,
    title,
    menu_order,
    parent_page_id
FROM public.pages
WHERE is_published = true AND is_featured = true
ORDER BY menu_order;

-- 뷰: 완전한 페이지 데이터 (콘텐츠 블록 포함)
CREATE OR REPLACE VIEW public.complete_pages AS
SELECT 
    p.id,
    p.slug,
    p.title,
    p.meta_title,
    p.meta_description,
    p.page_type,
    p.template_name,
    p.custom_css,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'id', cb.id,
            'block_type', cb.block_type,
            'title', cb.title,
            'content', cb.content,
            'image_url', cb.image_url,
            'link_url', cb.link_url,
            'settings', cb.settings,
            'display_order', cb.display_order
        ) ORDER BY cb.display_order
    ) as content_blocks
FROM public.pages p
LEFT JOIN public.content_blocks cb ON p.id = cb.page_id AND cb.is_visible = true
WHERE p.is_published = true
GROUP BY p.id, p.slug, p.title, p.meta_title, p.meta_description, p.page_type, p.template_name, p.custom_css;
