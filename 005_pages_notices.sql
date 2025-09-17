-- Notice, FAQ, Contact, Hero 슬라이더 기능 추가

-- 1. 공지사항 테이블
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT, -- 메인 페이지에 표시될 요약
  is_important BOOLEAN DEFAULT false, -- 중요 공지사항 여부
  is_active BOOLEAN DEFAULT true,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. FAQ 테이블
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'general', 'shipping', 'payment', 'product'
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. 히어로 슬라이더 이미지 테이블
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. 슬라이더 설정 테이블
CREATE TABLE IF NOT EXISTS public.slider_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_duration INTEGER DEFAULT 5000, -- 밀리초 (5초)
  auto_play BOOLEAN DEFAULT true,
  show_indicators BOOLEAN DEFAULT true,
  show_arrows BOOLEAN DEFAULT true,
  fade_effect BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. 연락처 정보 테이블 (관리자가 수정 가능)
CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'email', 'phone', 'line', 'address', 'hours'
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT, -- 아이콘 클래스명
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notices_active_important ON public.notices(is_active, is_important, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_category_order ON public.faqs(category, order_index);
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON public.hero_slides(order_index, is_active);
CREATE INDEX IF NOT EXISTS idx_contact_info_order ON public.contact_info(order_index, is_active);

-- 7. RLS 정책 설정
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slider_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- 공지사항: 활성화된 것만 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view active notices" ON public.notices
  FOR SELECT USING (is_active = true);

-- 관리자만 공지사항 관리 가능
CREATE POLICY "Admins can manage notices" ON public.notices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- FAQ: 활성화된 것만 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view active faqs" ON public.faqs
  FOR SELECT USING (is_active = true);

-- 관리자만 FAQ 관리 가능
CREATE POLICY "Admins can manage faqs" ON public.faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 히어로 슬라이드: 활성화된 것만 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view active hero slides" ON public.hero_slides
  FOR SELECT USING (is_active = true);

-- 관리자만 히어로 슬라이드 관리 가능
CREATE POLICY "Admins can manage hero slides" ON public.hero_slides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 슬라이더 설정: 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view slider settings" ON public.slider_settings
  FOR SELECT USING (true);

-- 관리자만 슬라이더 설정 관리 가능
CREATE POLICY "Admins can manage slider settings" ON public.slider_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 연락처 정보: 활성화된 것만 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view active contact info" ON public.contact_info
  FOR SELECT USING (is_active = true);

-- 관리자만 연락처 정보 관리 가능
CREATE POLICY "Admins can manage contact info" ON public.contact_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. 트리거 추가
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_slider_settings_updated_at BEFORE UPDATE ON public.slider_settings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 9. 기본 데이터 삽입

-- 기본 슬라이더 설정
INSERT INTO public.slider_settings (slide_duration, auto_play, show_indicators, show_arrows, fade_effect)
VALUES (5000, true, true, true, true)
ON CONFLICT DO NOTHING;

-- 샘플 히어로 슬라이드
INSERT INTO public.hero_slides (title, subtitle, description, image_url, button_text, button_link, order_index, is_active) VALUES
('Premium Bath Bombs', 'ธรรมชาติ 100%', 'สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ', 'https://example.com/hero1.jpg', 'ดูสินค้า', '/products', 1, true),
('Luxury Spa Experience', 'ผ่อนคลายที่บ้าน', 'เปลี่ยนห้องน้ำของคุณให้เป็นสปาส่วนตัว', 'https://example.com/hero2.jpg', 'เริ่มช้อปปิ้ง', '/products', 2, true),
('Natural Ingredients', 'ปลอดภัยสำหรับทุกคน', 'ผลิตจากวัตถุดิบธรรมชาติคุณภาพสูง', 'https://example.com/hero3.jpg', 'เรียนรู้เพิ่มเติม', '/about', 3, true)
ON CONFLICT DO NOTHING;

-- 샘플 공지사항
INSERT INTO public.notices (title, content, summary, is_important, is_active) VALUES
('ยินดีต้อนรับสู่ Daddy Bath Bomb', '<p>ยินดีต้อนรับสู่ร้านบาธบอมออนไลน์ชั้นนำของไทย! เรามีบาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ 100%</p><p>🛁 บาธบอมหลากหลายกลิ่น<br/>🚚 ส่งฟรีทั่วไทย<br/>💬 ปรึกษาผ่าน LINE Chat</p>', 'ยินดีต้อนรับสู่ร้านบาธบอมออนไลน์ชั้นนำของไทย!', true, true),
('โปรโมชั่นเปิดร้าน', '<p>🎉 <strong>โปรโมชั่นพิเศษเปิดร้าน!</strong></p><p>✨ ซื้อ 2 ชิ้น ลด 10%<br/>✨ ซื้อ 3 ชิ้น ลด 15%<br/>✨ ซื้อ 5 ชิ้น ลด 20%</p><p>*โปรโมชั่นนี้ใช้ได้ถึงสิ้นเดือน</p>', '🎉 โปรโมชั่นพิเศษเปิดร้าน! ซื้อมากลดมาก', false, true)
ON CONFLICT DO NOTHING;

-- 샘플 FAQ
INSERT INTO public.faqs (question, answer, category, order_index, is_active) VALUES
('บาธบอมของคุณทำจากอะไร?', 'บาธบอมของเราทำจากวัตถุดิบธรรมชาติ 100% ได้แก่ เบกกิ้งโซดา กรดซิตริก น้ำมันหอมระเหยธรรมชาติ และส่วนผสมบำรุงผิว ปลอดภัยสำหรับทุกคนในครอบครัว', 'product', 1, true),
('ใช้บาธบอมอย่างไร?', 'เติมน้ำอุ่นในอ่างอาบน้ำ หยอดบาธบอม 1 ลูกลงไป รอให้ละลายและฟองฟู่ประมาณ 2-3 นาที จากนั้นแช่ตัวและเพลิดเพลินกับกลิ่นหอมและความนุ่มนวลของผิว', 'product', 2, true),
('จัดส่งใช้เวลานานแค่ไหน?', 'เราจัดส่งภายใน 1-2 วันทำการหลังได้รับการชำระเงิน สำหรับกรุงเทพและปริมณฑล ส่วนต่างจังหวัดใช้เวลา 2-3 วันทำการ', 'shipping', 3, true),
('สามารถคืนสินค้าได้หรือไม่?', 'เราให้การรับประกันความพึงพอใจ หากไม่พอใจสามารถคืนสินค้าได้ภายใน 7 วัน โดยสินค้าต้องอยู่ในสภาพเดิมและไม่ได้ใช้งาน', 'general', 4, true),
('มีส่วนลดสำหรับลูกค้าประจำหรือไม่?', 'มีค่ะ! เรามีโปรแกรมสมาชิก VIP สำหรับลูกค้าที่ซื้อสินค้าเป็นประจำ และมีโปรโมชั่นพิเศษทุกเดือน ติดตาม LINE Official ของเราเพื่อรับข้อมูลโปรโมชั่นล่าสุด', 'general', 5, true)
ON CONFLICT DO NOTHING;

-- 샘플 연락처 정보
INSERT INTO public.contact_info (type, label, value, icon, order_index, is_active) VALUES
('line', 'LINE Official', '@daddybathbomb', '💬', 1, true),
('email', 'อีเมล', 'hello@daddybathbomb.com', '📧', 2, true),
('phone', 'เบอร์โทรศัพท์', '+66 XX XXX XXXX', '📞', 3, true),
('hours', 'เวลาทำการ', 'จันทร์-ศุกร์ 9:00-18:00 น.', '🕒', 4, true),
('address', 'ที่อยู่', 'กรุงเทพมหานคร ประเทศไทย', '📍', 5, true)
ON CONFLICT DO NOTHING;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Notice, FAQ, Contact, Hero Slider 기능이 성공적으로 추가되었습니다!';
  RAISE NOTICE '- 공지사항 관리 시스템';
  RAISE NOTICE '- FAQ 관리 시스템'; 
  RAISE NOTICE '- 히어로 슬라이더 (3개 이미지 자동 전환)';
  RAISE NOTICE '- 슬라이더 시간 조정 기능';
  RAISE NOTICE '- 연락처 정보 관리';
END $$;
