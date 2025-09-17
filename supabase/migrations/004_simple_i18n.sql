-- 간소화된 다국어 및 보안 기능
-- PostgreSQL 호환성 문제 해결 버전

-- 1. 언어 설정 테이블
CREATE TABLE public.languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 기본 언어 데이터 (태국어 기본)
INSERT INTO public.languages (code, name, native_name, is_active, is_default) VALUES
('th', 'Thai', 'ไทย', true, true),
('en', 'English', 'English', true, false)
ON CONFLICT (code) DO NOTHING;

-- 2. 통화 설정 테이블
CREATE TABLE public.currencies (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  exchange_rate DECIMAL(10,4) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 기본 통화 데이터
INSERT INTO public.currencies (code, name, symbol, exchange_rate, is_active, is_default) VALUES
('THB', 'Thai Baht', '฿', 1.0, true, true),
('USD', 'US Dollar', '$', 0.028, true, false)
ON CONFLICT (code) DO NOTHING;

-- 3. SEO 메타데이터 테이블
CREATE TABLE public.seo_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL,
  reference_id UUID,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  structured_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(page_type, reference_id, language_code)
);

-- 4. Rate Limiting 테이블 (간소화)
CREATE TABLE public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  action_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(identifier, action_type)
);

-- 5. 인덱스 추가
CREATE INDEX idx_seo_metadata_page_ref_lang ON public.seo_metadata(page_type, reference_id, language_code);
CREATE INDEX idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);

-- 6. RLS 정책 설정
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- 언어 및 통화는 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view languages" ON public.languages FOR SELECT USING (is_active = true);
CREATE POLICY "Everyone can view currencies" ON public.currencies FOR SELECT USING (is_active = true);
CREATE POLICY "Everyone can view seo metadata" ON public.seo_metadata FOR SELECT USING (true);

-- 관리자만 관리 가능
CREATE POLICY "Admins can manage languages" ON public.languages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage currencies" ON public.currencies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage seo metadata" ON public.seo_metadata
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. 기본 SEO 데이터 (태국어 우선)
INSERT INTO public.seo_metadata (page_type, language_code, title, description, keywords, og_title, og_description) VALUES
('home', 'th', 'Daddy Bath Bomb - ร้านบาธบอมพรีเมียม', 'พบกับบาธบอมคุณภาพสูงที่ทำจากวัตถุดิบธรรมชาติ เพื่อเวลาอาบน้ำที่หอมหวานและนุ่มนวล', 'บาธบอม, อุปกรณ์อาบน้ำ, ธรรมชาติ, พรีเมียม', 'Daddy Bath Bomb - บาธบอมพรีเมียม', 'ร้านบาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ'),
('home', 'en', 'Daddy Bath Bomb - Premium Bath Bomb Store', 'Discover premium bath bombs made from natural ingredients for a fragrant and luxurious bathing experience.', 'bath bomb, bath products, natural, premium, thailand', 'Daddy Bath Bomb - Premium Bath Bombs', 'Premium bath bomb store with natural ingredients')
ON CONFLICT (page_type, reference_id, language_code) DO NOTHING;

-- 8. 간단한 Rate Limiting 함수
CREATE OR REPLACE FUNCTION simple_rate_limit_check(
  p_identifier TEXT,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 5
) RETURNS BOOLEAN AS $$
DECLARE
  current_attempts INTEGER;
BEGIN
  -- 현재 시도 횟수 확인
  SELECT attempt_count INTO current_attempts
  FROM public.rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND window_start > NOW() - INTERVAL '15 minutes';

  -- 기록이 없으면 새로 생성
  IF current_attempts IS NULL THEN
    INSERT INTO public.rate_limits (identifier, action_type, attempt_count, window_start)
    VALUES (p_identifier, p_action_type, 1, NOW())
    ON CONFLICT (identifier, action_type)
    DO UPDATE SET 
      attempt_count = 1,
      window_start = NOW(),
      blocked_until = NULL;
    RETURN true;
  END IF;

  -- 최대 시도 횟수 초과 확인
  IF current_attempts >= p_max_attempts THEN
    RETURN false;
  ELSE
    -- 시도 횟수 증가
    UPDATE public.rate_limits
    SET attempt_count = attempt_count + 1
    WHERE identifier = p_identifier AND action_type = p_action_type;
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '간소화된 다국어 및 보안 기능이 성공적으로 추가되었습니다!';
END $$;
