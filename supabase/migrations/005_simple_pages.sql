-- 간소화된 페이지 및 공지사항 기능
-- PostgreSQL 호환성 문제 해결 버전

-- 1. 공지사항 테이블
CREATE TABLE public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  is_important BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. FAQ 테이블
CREATE TABLE public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. 히어로 슬라이더 이미지 테이블
CREATE TABLE public.hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. 슬라이더 설정 테이블
CREATE TABLE public.slider_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_duration INTEGER DEFAULT 5000,
  auto_play BOOLEAN DEFAULT true,
  show_indicators BOOLEAN DEFAULT true,
  show_arrows BOOLEAN DEFAULT true,
  fade_effect BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. 연락처 정보 테이블
CREATE TABLE public.contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. 인덱스 생성
CREATE INDEX idx_notices_active_important ON public.notices(is_active, is_important, created_at DESC);
CREATE INDEX idx_faqs_category_order ON public.faqs(category, order_index);
CREATE INDEX idx_hero_slides_order ON public.hero_slides(order_index, is_active);
CREATE INDEX idx_contact_info_order ON public.contact_info(order_index, is_active);

-- 7. RLS 정책 설정
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slider_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- 공지사항 정책
CREATE POLICY "Everyone can view active notices" ON public.notices
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage notices" ON public.notices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- FAQ 정책
CREATE POLICY "Everyone can view active faqs" ON public.faqs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage faqs" ON public.faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 히어로 슬라이드 정책
CREATE POLICY "Everyone can view active hero slides" ON public.hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage hero slides" ON public.hero_slides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 슬라이더 설정 정책
CREATE POLICY "Everyone can view slider settings" ON public.slider_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage slider settings" ON public.slider_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 연락처 정보 정책
CREATE POLICY "Everyone can view active contact info" ON public.contact_info
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage contact info" ON public.contact_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. 기본 데이터 삽입

-- 기본 슬라이더 설정
INSERT INTO public.slider_settings (slide_duration, auto_play, show_indicators, show_arrows, fade_effect)
VALUES (5000, true, true, true, true);

-- 샘플 히어로 슬라이드
INSERT INTO public.hero_slides (title, subtitle, description, image_url, button_text, button_link, order_index, is_active) VALUES
('Premium Bath Bombs', 'ธรรมชาติ 100%', 'สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop', 'ดูสินค้า', '/products', 1, true),
('Luxury Spa Experience', 'ผ่อนคลายที่บ้าน', 'เปลี่ยนห้องน้ำของคุณให้เป็นสปาส่วนตัว', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=800&fit=crop', 'เริ่มช้อปปิ้ง', '/products', 2, true),
('Natural Ingredients', 'ปลอดภัยสำหรับทุกคน', 'ผลิตจากวัตถุดิบธรรมชาติคุณภาพสูง', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=800&fit=crop', 'เรียนรู้เพิ่มเติม', '/about', 3, true);

-- 샘플 공지사항
INSERT INTO public.notices (title, content, summary, is_important, is_active) VALUES
('ยินดีต้อนรับสู่ Daddy Bath Bomb', '<p>ยินดีต้อนรับสู่ร้านบาธบอมออนไลน์ชั้นนำของไทย! เรามีบาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ 100%</p><p>🛁 บาธบอมหลากหลายกลิ่น<br/>🚚 ส่งฟรีทั่วไทย<br/>💬 ปรึกษาผ่าน LINE Chat</p>', 'ยินดีต้อนรับสู่ร้านบาธบอมออนไลน์ชั้นนำของไทย!', true, true),
('โปรโมชั่นเปิดร้าน', '<p>🎉 <strong>โปรโมชั่นพิเศษเปิดร้าน!</strong></p><p>✨ ซื้อ 2 ชิ้น ลด 10%<br/>✨ ซื้อ 3 ชิ้น ลด 15%<br/>✨ ซื้อ 5 ชิ้น ลด 20%</p><p>*โปรโมชั่นนี้ใช้ได้ถึงสิ้นเดือน</p>', '🎉 โปรโมชั่นพิเศษเปิดร้าน! ซื้อมากลดมาก', false, true);

-- 샘플 FAQ
INSERT INTO public.faqs (question, answer, category, order_index, is_active) VALUES
('บาธบอมของคุณทำจากอะไร?', 'บาธบอมของเราทำจากวัตถุดิบธรรมชาติ 100% ได้แก่ เบกกิ้งโซดา กรดซิตริก น้ำมันหอมระเหยธรรมชาติ และส่วนผสมบำรุงผิว ปลอดภัยสำหรับทุกคนในครอบครัว', 'product', 1, true),
('ใช้บาธบอมอย่างไร?', 'เติมน้ำอุ่นในอ่างอาบน้ำ หยอดบาธบอม 1 ลูกลงไป รอให้ละลายและฟองฟู่ประมาณ 2-3 นาที จากนั้นแช่ตัวและเพลิดเพลินกับกลิ่นหอมและความนุ่มนวลของผิว', 'product', 2, true),
('จัดส่งใช้เวลานานแค่ไหน?', 'เราจัดส่งภายใน 1-2 วันทำการหลังได้รับการชำระเงิน สำหรับกรุงเทพและปริมณฑล ส่วนต่างจังหวัดใช้เวลา 2-3 วันทำการ', 'shipping', 3, true),
('สามารถคืนสินค้าได้หรือไม่?', 'เราให้การรับประกันความพึงพอใจ หากไม่พอใจสามารถคืนสินค้าได้ภายใน 7 วัน โดยสินค้าต้องอยู่ในสภาพเดิมและไม่ได้ใช้งาน', 'general', 4, true);

-- 샘플 연락처 정보
INSERT INTO public.contact_info (type, label, value, icon, order_index, is_active) VALUES
('line', 'LINE Official', '@daddybathbomb', '💬', 1, true),
('email', 'อีเมล', 'hello@daddybathbomb.com', '📧', 2, true),
('phone', 'เบอร์โทรศัพท์', '+66 XX XXX XXXX', '📞', 3, true),
('hours', 'เวลาทำการ', 'จันทร์-ศุกร์ 9:00-18:00 น.', '🕒', 4, true),
('address', 'ที่อยู่', 'กรุงเทพมหานคร ประเทศไทย', '📍', 5, true);

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Notice, FAQ, Contact, Hero Slider 기능이 성공적으로 추가되었습니다!';
END $$;
