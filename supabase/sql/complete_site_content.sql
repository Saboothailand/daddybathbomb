-- 사이트 전체 콘텐츠를 테이블로 관리
-- Supabase 대시보드 → SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS public.page_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_name TEXT NOT NULL, -- 'home', 'about', 'products', 'contact', 'faq', 'notice'
    section_name TEXT NOT NULL, -- 'hero', 'middle', 'bottom'
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_link TEXT,
    background_color TEXT DEFAULT '#000000',
    text_color TEXT DEFAULT '#ffffff',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (page_name, section_name, title)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_constraint
        WHERE  conname = 'page_banners_page_name_section_name_title_key'
    ) THEN
        ALTER TABLE public.page_banners
            ADD CONSTRAINT page_banners_page_name_section_name_title_key
            UNIQUE (page_name, section_name, title);
    END IF;
END $$;

-- 2. 사이트 콘텐츠 테이블 (모든 텍스트 콘텐츠)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_name TEXT NOT NULL, -- 페이지 이름
    section_name TEXT NOT NULL, -- 섹션 이름
    content_key TEXT NOT NULL, -- 콘텐츠 키 (예: 'hero_title', 'about_description')
    content_value_th TEXT, -- 태국어 콘텐츠
    content_value_en TEXT, -- 영어 콘텐츠
    content_type TEXT DEFAULT 'text', -- 'text', 'html', 'markdown'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(page_name, section_name, content_key)
);

-- 3. 메뉴 관리 테이블
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_type TEXT NOT NULL, -- 'header', 'footer', 'sidebar'
    label_th TEXT NOT NULL,
    label_en TEXT NOT NULL,
    link_url TEXT NOT NULL,
    icon TEXT, -- 아이콘 (이모지 또는 클래스)
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_external BOOLEAN DEFAULT false, -- 외부 링크 여부
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (menu_type, label_en)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_constraint
        WHERE  conname = 'menu_items_menu_type_label_en_key'
    ) THEN
        ALTER TABLE public.menu_items
            ADD CONSTRAINT menu_items_menu_type_label_en_key
            UNIQUE (menu_type, label_en);
    END IF;
END $$;

-- 4. 제품 정보 확장 (기존 products 테이블에 컬럼 추가)
DO $$
BEGIN
    -- 제품 이미지 갤러리용
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_gallery') THEN
        ALTER TABLE public.products ADD COLUMN image_gallery JSONB DEFAULT '[]';
    END IF;
    
    -- 제품 상세 설명 (HTML)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'description_html') THEN
        ALTER TABLE public.products ADD COLUMN description_html TEXT;
    END IF;
    
    -- 제품 특징
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'features_list') THEN
        ALTER TABLE public.products ADD COLUMN features_list JSONB DEFAULT '[]';
    END IF;
    
    -- 제품 사양
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'specifications') THEN
        ALTER TABLE public.products ADD COLUMN specifications JSONB DEFAULT '{}';
    END IF;
END $$;

-- 5. FAQ 테이블
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_th TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_th TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (question_en)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_constraint
        WHERE  conname = 'faqs_question_en_key'
    ) THEN
        ALTER TABLE public.faqs
            ADD CONSTRAINT faqs_question_en_key
            UNIQUE (question_en);
    END IF;
END $$;

-- 6. How to Use 단계 테이블
CREATE TABLE IF NOT EXISTS public.how_to_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_number INTEGER NOT NULL,
    title_th TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_th TEXT NOT NULL,
    description_en TEXT NOT NULL,
    image_url TEXT,
    icon TEXT,
    tips_th TEXT,
    tips_en TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (step_number)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_constraint
        WHERE  conname = 'how_to_steps_step_number_key'
    ) THEN
        ALTER TABLE public.how_to_steps
            ADD CONSTRAINT how_to_steps_step_number_key
            UNIQUE (step_number);
    END IF;
END $$;

-- RLS 정책 추가 (중복 실행 안전)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.how_to_steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
DROP POLICY IF EXISTS "Public read menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Public read faqs" ON public.faqs;
DROP POLICY IF EXISTS "Public read how_to_steps" ON public.how_to_steps;
DROP POLICY IF EXISTS "Admin full site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admin full menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Admin full faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin full how_to_steps" ON public.how_to_steps;

CREATE POLICY "Public read site_content"
  ON public.site_content
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public read menu_items"
  ON public.menu_items
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public read faqs"
  ON public.faqs
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Public read how_to_steps"
  ON public.how_to_steps
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admin full site_content"
  ON public.site_content
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full menu_items"
  ON public.menu_items
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full faqs"
  ON public.faqs
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

CREATE POLICY "Admin full how_to_steps"
  ON public.how_to_steps
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@daddybathbomb.com');

-- 현재 사이트 콘텐츠 데이터 삽입

-- 홈페이지 Hero 섹션
INSERT INTO public.site_content (page_name, section_name, content_key, content_value_th, content_value_en) VALUES
('home', 'hero', 'title_1', 'Premium Bath Bombs', 'Premium Bath Bombs'),
('home', 'hero', 'subtitle_1', 'ธรรมชาติ 100%', '100% Natural'),
('home', 'hero', 'description_1', 'สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ', 'Experience the ultimate bathing experience with natural bath bombs'),
('home', 'hero', 'button_1', 'ดูสินค้า', 'View Products'),

('home', 'hero', 'title_2', 'Luxury Spa Experience', 'Luxury Spa Experience'),
('home', 'hero', 'subtitle_2', 'ผ่อนคลายที่บ้าน', 'Relax at Home'),
('home', 'hero', 'description_2', 'เปลี่ยนบ้านของคุณให้เป็นสปาสุดหรูด้วยกลิ่นหอมบำบัด', 'Transform your home into a luxury spa with aromatherapy scents'),
('home', 'hero', 'button_2', 'เกี่ยวกับเรา', 'About Us'),

('home', 'hero', 'title_3', 'Perfect Gift for Loved Ones', 'Perfect Gift for Loved Ones'),
('home', 'hero', 'subtitle_3', 'ของขวัญสุดพิเศษ', 'Special Gift'),
('home', 'hero', 'description_3', 'มอบความสุขและผ่อนคลายให้คนที่คุณรักด้วย Daddy Bath Bomb', 'Give happiness and relaxation to your loved ones with Daddy Bath Bomb'),
('home', 'hero', 'button_3', 'ติดต่อเรา', 'Contact Us'),

-- Features 섹션
('home', 'features', 'title', 'ทำไมต้องเลือกเรา?', 'Why Choose Us?'),
('home', 'features', 'subtitle', 'ค้นพบเหตุผลที่ทำให้บาธบอมของเราพิเศษกว่าใคร', 'Discover what makes our bath bombs special'),

-- Instagram 갤러리 섹션
('home', 'instagram', 'title', 'แกลลอรี่ Instagram', 'Instagram Gallery'),
('home', 'instagram', 'subtitle', 'ติดตามความสวยงามและแรงบันดาลใจจาก Instagram ของเรา', 'Follow our beautiful and inspiring content on Instagram'),
('home', 'instagram', 'button', '📸 ติดตามเรา', '📸 Follow Us'),

-- How to Use 섹션
('home', 'how_to', 'title', 'วิธีใช้งาน', 'How to Use'),
('home', 'how_to', 'subtitle', 'เรียนรู้วิธีใช้บาธบอมเพื่อประสบการณ์ที่ดีที่สุด', 'Learn how to use bath bombs for the best experience'),

-- About 페이지
('about', 'hero', 'title', 'เกี่ยวกับเรา', 'About Us'),
('about', 'hero', 'subtitle', 'ความเป็นมาและปรัชญาของ Daddy Bath Bomb', 'Our story and philosophy at Daddy Bath Bomb'),

('about', 'story', 'title', 'เรื่องราวของเรา', 'Our Story'),
('about', 'story', 'content', 'Daddy Bath Bomb เกิดขึ้นจากความรักในการดูแลตัวเองและครอบครัว เราเชื่อว่าเวลาอาบน้ำไม่ใช่แค่การทำความสะอาดร่างกาย แต่เป็นช่วงเวลาแห่งการผ่อนคลายและฟื้นฟูจิตใจ', 'Daddy Bath Bomb was born from a love of self-care and family wellness. We believe bath time is not just about cleaning the body, but a moment of relaxation and mental restoration'),

-- Contact 페이지
('contact', 'hero', 'title', 'ติดต่อเรา', 'Contact Us'),
('contact', 'hero', 'subtitle', 'เรายินดีให้บริการและตอบคำถามของคุณ', 'We are happy to serve and answer your questions'),

('contact', 'info', 'question', 'มีคำถาม?', 'Have Questions?'),
('contact', 'info', 'description', 'ติดต่อทีมงานของเราผ่าน LINE Chat เพื่อความช่วยเหลือแบบเรียลไทม์', 'Contact our team via LINE Chat for real-time assistance'),
('contact', 'info', 'button', '💬 ติดต่อเรา', '💬 Contact Us')

ON CONFLICT (page_name, section_name, content_key) DO NOTHING;

-- 페이지별 배너 데이터
INSERT INTO public.page_banners (page_name, section_name, title, subtitle, description, image_url, button_text, button_link)
VALUES
-- 홈페이지 Hero
('home', 'hero', 'Premium Bath Bombs', 'ธรรมชาติ 100%', 'สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop', 'ดูสินค้า', '/products'),
('home', 'hero', 'Luxury Spa Experience', 'ผ่อนคลายที่บ้าน', 'เปลี่ยนบ้านของคุณให้เป็นสปาสุดหรูด้วยกลิ่นหอมบำบัด', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=800&fit=crop', 'เกี่ยวกับเรา', '/about'),
('home', 'hero', 'Perfect Gift for Loved Ones', 'ของขวัญสุดพิเศษ', 'มอบความสุขและผ่อนคลายให้คนที่คุณรักด้วย Daddy Bath Bomb', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=800&fit=crop', 'ติดต่อเรา', '/contact'),

-- 홈페이지 중간 배너
('home', 'middle', 'Special Promotion', 'โปรโมชั่นพิเศษ', 'ซื้อ 2 แถม 1 ฟรี! เฉพาะเดือนนี้เท่านั้น', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=400&fit=crop', 'สั่งซื้อเลย', '/products'),

-- About 페이지
('about', 'hero', 'About Daddy Bath Bomb', 'เกี่ยวกับเรา', 'ความเป็นมาและปรัชญาของ Daddy Bath Bomb', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'ดูสินค้า', '/products'),

-- Products 페이지
('products', 'hero', 'Our Products', 'สินค้าของเรา', 'บาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=600&fit=crop', 'เลือกซื้อ', '#products'),

-- Contact 페이지
('contact', 'hero', 'Contact Us', 'ติดต่อเรา', 'เรายินดีให้บริการและตอบคำถามของคุณ', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop', 'LINE Chat', 'https://line.me/ti/p/daddybathbomb')

ON CONFLICT (page_name, section_name, title) DO UPDATE
SET subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    button_text = EXCLUDED.button_text,
    button_link = EXCLUDED.button_link,
    updated_at = TIMEZONE('utc'::text, NOW());

-- 메뉴 아이템 데이터
INSERT INTO public.menu_items (menu_type, label_th, label_en, link_url, display_order)
VALUES
('header', 'หน้าแรก', 'Home', '/home', 1),
('header', 'เกี่ยวกับเรา', 'About Us', '/about', 2),
('header', 'สินค้า', 'Products', '/products', 3),
('header', 'ประกาศ', 'Notice', '/notice', 4),
('header', 'FAQ', 'FAQ', '/faq', 5),
('header', 'ติดต่อเรา', 'Contact', '/contact', 6),

('footer', 'นโยบายความเป็นส่วนตัว', 'Privacy Policy', '/privacy', 1),
('footer', 'เงื่อนไขการใช้งาน', 'Terms of Service', '/terms', 2),
('footer', 'นโยบายการคืนสินค้า', 'Return Policy', '/returns', 3)

ON CONFLICT (menu_type, label_en) DO UPDATE
SET label_th = EXCLUDED.label_th,
    link_url = EXCLUDED.link_url,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order,
    is_active = true,
    updated_at = TIMEZONE('utc'::text, NOW());

-- FAQ 샘플 데이터
INSERT INTO public.faqs (question_th, question_en, answer_th, answer_en, category, display_order)
VALUES
('บาธบอมใช้ได้นานแค่ไหน?', 'How long do bath bombs last?', 'บาธบอมของเรามีอายุการเก็บรักษา 12 เดือน เมื่อเก็บในที่แห้งและเย็น', 'Our bath bombs have a shelf life of 12 months when stored in a cool, dry place.', 'product', 1),

('บาธบอมปลอดภัยสำหรับผิวแพ้ง่ายไหม?', 'Are your bath bombs safe for sensitive skin?', 'ใช่! บาธบอมของเราทำจากส่วนผสมธรรมชาติ 100% อ่อนโยนต่อทุกประเภทผิว', 'Yes! Our bath bombs are made with 100% natural ingredients and are gentle on all skin types.', 'product', 2),

('ใช้บาธบอมอย่างไร?', 'How do I use a bath bomb?', 'เติมน้ำอุ่นในอ่างอาบน้ำ แล้วหย่อนบาธบอมลงไป ดูฟองฟู่สีสวยและกลิ่นหอม!', 'Fill your bathtub with warm water and drop the bath bomb in. Watch it fizz and release beautiful colors and fragrances!', 'usage', 3),

('มีการจัดส่งระหว่างประเทศไหม?', 'Do you offer international shipping?', 'ปัจจุบันเราจัดส่งเฉพาะในประเทศไทย การจัดส่งระหว่างประเทศจะเปิดให้บริการเร็วๆ นี้', 'Currently, we ship within Thailand only. International shipping will be available soon.', 'shipping', 4),

('สามารถคืนสินค้าได้ไหมถ้าไม่พอใจ?', 'Can I return a product if I am not satisfied?', 'ได้ครับ เรามีนโยบายคืนสินค้าภายใน 30 วัน สำหรับสินค้าที่ยังไม่เปิด กรุณาติดต่อฝ่ายบริการลูกค้า', 'Yes, we offer a 30-day return policy for unopened products. Please contact our customer service for assistance.', 'policy', 5)

ON CONFLICT (question_en) DO UPDATE
SET question_th = EXCLUDED.question_th,
    answer_th = EXCLUDED.answer_th,
    answer_en = EXCLUDED.answer_en,
    category = EXCLUDED.category,
    display_order = EXCLUDED.display_order,
    is_published = true,
    updated_at = TIMEZONE('utc'::text, NOW());

-- How to Use 단계 데이터
INSERT INTO public.how_to_steps (step_number, title_th, title_en, description_th, description_en, icon, tips_th, tips_en)
VALUES
(1, 'เติมน้ำในอ่าง', 'Fill Your Bathtub', 'เติมน้ำอุ่นในอ่างอาบน้ำ (ไม่ร้อนเกินไปเพื่อรักษาน้ำมันธรรมชาติ)', 'Fill your bathtub with warm water (not too hot to preserve the natural oils)', '🛁', 'อุณหภูมิน้ำที่เหมาะสมคือ 37-40°C', 'Ideal water temperature is between 37-40°C'),

(2, 'หย่อนบาธบอม', 'Drop the Bath Bomb', 'วางบาธบอมลงในน้ำเบาๆ และดูฟองฟู่ที่สวยงาม', 'Gently place the bath bomb into the water and watch it fizz', '💧', 'หย่อนตรงกลางเพื่อผลลัพธ์ที่ดีที่สุด', 'Drop it in the center for the best fizzing effect'),

(3, 'เพลิดเพลินกับสีสัน', 'Enjoy the Colors', 'ชมสีสันสวยงามและกลิ่นหอมที่กระจายในน้ำ', 'Watch as beautiful colors and fragrances fill your bath', '🌈', 'ถ่ายรูปสีสวยๆ เพื่อโพสต์โซเชียล!', 'Take photos of the beautiful colors for social media!'),

(4, 'ผ่อนคลายและแช่', 'Relax and Soak', 'แช่ในน้ำเป็นเวลา 15-20 นาที ให้ส่วนผสมธรรมชาติบำรุงผิว', 'Soak for 15-20 minutes and let the natural ingredients nourish your skin', '😌', 'ใช้เวลานี้ในการทำสมาธิหรืออ่านหนังสือ', 'Use this time for meditation or reading'),

(5, 'ล้างออก', 'Rinse Off', 'ล้างตัวด้วยน้ำสะอาดหลังแช่เสร็จ เพื่อล้างตะกอนที่อาจเหลืออยู่', 'Rinse with clean water after soaking to remove any residue', '🚿', 'เช็ดตัวเบาๆ ด้วยผ้าขนหนูนุ่ม', 'Pat dry gently with a soft towel')

ON CONFLICT (step_number) DO UPDATE
SET title_th = EXCLUDED.title_th,
    title_en = EXCLUDED.title_en,
    description_th = EXCLUDED.description_th,
    description_en = EXCLUDED.description_en,
    icon = EXCLUDED.icon,
    tips_th = EXCLUDED.tips_th,
    tips_en = EXCLUDED.tips_en,
    is_published = true,
    updated_at = TIMEZONE('utc'::text, NOW());

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_page_banners_page_section ON public.page_banners(page_name, section_name, display_order);
CREATE INDEX IF NOT EXISTS idx_site_content_page_section ON public.site_content(page_name, section_name, content_key);
CREATE INDEX IF NOT EXISTS idx_menu_items_type_order ON public.menu_items(menu_type, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_category_order ON public.faqs(category, display_order);
CREATE INDEX IF NOT EXISTS idx_how_to_steps_number ON public.how_to_steps(step_number);
