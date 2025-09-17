-- 다국어, SEO, 보안 기능 추가
-- 이 파일은 003_advanced_improvements.sql 실행 후 추가로 실행하세요

-- 1. 다국어 지원 테이블 구조

-- 언어 설정 테이블
CREATE TABLE IF NOT EXISTS public.languages (
  code TEXT PRIMARY KEY, -- 'ko', 'th', 'en'
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 기본 언어 데이터 삽입 (태국어가 기본)
INSERT INTO public.languages (code, name, native_name, is_active, is_default) VALUES
('th', 'Thai', 'ไทย', true, true),
('en', 'English', 'English', true, false),
('ko', 'Korean', '한국어', false, false)
ON CONFLICT (code) DO NOTHING;

-- 제품 번역 테이블
CREATE TABLE IF NOT EXISTS public.product_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  meta_title TEXT,
  meta_description TEXT,
  slug TEXT, -- SEO용 URL 슬러그
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(product_id, language_code)
);

-- 콘텐츠 번역 테이블
CREATE TABLE IF NOT EXISTS public.content_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(content_id, language_code)
);

-- 2. 통화 설정 테이블
CREATE TABLE IF NOT EXISTS public.currencies (
  code TEXT PRIMARY KEY, -- 'THB', 'KRW', 'USD'
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  exchange_rate DECIMAL(10,4) DEFAULT 1.0, -- THB 기준 환율
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 기본 통화 데이터
INSERT INTO public.currencies (code, name, symbol, exchange_rate, is_active, is_default) VALUES
('THB', 'Thai Baht', '฿', 1.0, true, true),
('KRW', 'Korean Won', '₩', 35.0, true, false), -- 1 THB = 35 KRW (예시)
('USD', 'US Dollar', '$', 0.028, true, false) -- 1 THB = 0.028 USD (예시)
ON CONFLICT (code) DO NOTHING;

-- 3. SEO 메타데이터 테이블
CREATE TABLE IF NOT EXISTS public.seo_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL, -- 'product', 'category', 'page', 'home'
  reference_id UUID, -- 제품 ID, 콘텐츠 ID 등
  language_code TEXT REFERENCES public.languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  structured_data JSONB, -- JSON-LD 구조화된 데이터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(page_type, reference_id, language_code)
);

-- 4. 보안 관련 테이블

-- Rate Limiting 테이블
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP 주소 또는 사용자 ID
  action_type TEXT NOT NULL, -- 'login', 'register', 'order', 'upload'
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(identifier, action_type)
);

-- CSRF 토큰 테이블
CREATE TABLE IF NOT EXISTS public.csrf_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 파일 업로드 로그 테이블 (보안 모니터링)
CREATE TABLE IF NOT EXISTS public.file_upload_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  upload_path TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL, -- 'success', 'rejected', 'failed'
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_product_translations_product_lang ON public.product_translations(product_id, language_code);
CREATE INDEX IF NOT EXISTS idx_content_translations_content_lang ON public.content_translations(content_id, language_code);
CREATE INDEX IF NOT EXISTS idx_seo_metadata_page_ref_lang ON public.seo_metadata(page_type, reference_id, language_code);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_csrf_tokens_token ON public.csrf_tokens(token);
CREATE INDEX IF NOT EXISTS idx_csrf_tokens_expires ON public.csrf_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_file_upload_logs_user_date ON public.file_upload_logs(user_id, created_at DESC);

-- 6. RLS 정책 설정
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csrf_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_upload_logs ENABLE ROW LEVEL SECURITY;

-- 언어 및 통화는 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view languages" ON public.languages FOR SELECT USING (is_active = true);
CREATE POLICY "Everyone can view currencies" ON public.currencies FOR SELECT USING (is_active = true);

-- 번역 데이터는 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view product translations" ON public.product_translations FOR SELECT USING (true);
CREATE POLICY "Everyone can view content translations" ON public.content_translations FOR SELECT USING (true);

-- SEO 메타데이터는 모든 사용자가 조회 가능
CREATE POLICY "Everyone can view seo metadata" ON public.seo_metadata FOR SELECT USING (true);

-- 관리자만 번역, 언어, 통화, SEO 데이터 관리 가능
CREATE POLICY "Admins can manage languages" ON public.languages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage product translations" ON public.product_translations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage content translations" ON public.content_translations
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

-- Rate limiting은 시스템에서만 관리
CREATE POLICY "System can manage rate limits" ON public.rate_limits FOR ALL USING (true);

-- CSRF 토큰은 사용자 본인만 조회 가능
CREATE POLICY "Users can view own csrf tokens" ON public.csrf_tokens
  FOR SELECT USING (user_id = auth.uid());

-- 관리자만 업로드 로그 조회 가능
CREATE POLICY "Admins can view upload logs" ON public.file_upload_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. 유용한 함수들

-- Rate Limiting 체크 함수
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15,
  p_block_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN AS $$
DECLARE
  current_attempts INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
  blocked_until_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 현재 상태 확인
  SELECT attempt_count, window_start, blocked_until
  INTO current_attempts, window_start_time, blocked_until_time
  FROM public.rate_limits
  WHERE identifier = p_identifier AND action_type = p_action_type;

  -- 차단 상태 확인
  IF blocked_until_time IS NOT NULL AND blocked_until_time > NOW() THEN
    RETURN false; -- 차단됨
  END IF;

  -- 기록이 없거나 윈도우가 만료된 경우
  IF current_attempts IS NULL OR window_start_time < NOW() - (p_window_minutes || ' minutes')::INTERVAL THEN
    INSERT INTO public.rate_limits (identifier, action_type, attempt_count, window_start)
    VALUES (p_identifier, p_action_type, 1, NOW())
    ON CONFLICT (identifier, action_type)
    DO UPDATE SET 
      attempt_count = 1,
      window_start = NOW(),
      blocked_until = NULL;
    RETURN true; -- 허용
  END IF;

  -- 시도 횟수 증가
  current_attempts := current_attempts + 1;
  
  IF current_attempts > p_max_attempts THEN
    -- 차단 설정
    UPDATE public.rate_limits
    SET 
      attempt_count = current_attempts,
      blocked_until = NOW() + (p_block_minutes || ' minutes')::INTERVAL
    WHERE identifier = p_identifier AND action_type = p_action_type;
    RETURN false; -- 차단
  ELSE
    -- 시도 횟수만 증가
    UPDATE public.rate_limits
    SET attempt_count = current_attempts
    WHERE identifier = p_identifier AND action_type = p_action_type;
    RETURN true; -- 허용
  END IF;
END;
$$ LANGUAGE plpgsql;

-- CSRF 토큰 생성 함수
CREATE OR REPLACE FUNCTION generate_csrf_token(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  new_token TEXT;
BEGIN
  -- 기존 토큰 정리
  DELETE FROM public.csrf_tokens 
  WHERE user_id = p_user_id OR expires_at < NOW();
  
  -- 새 토큰 생성
  new_token := encode(gen_random_bytes(32), 'base64');
  
  INSERT INTO public.csrf_tokens (token, user_id, expires_at)
  VALUES (new_token, p_user_id, NOW() + INTERVAL '1 hour');
  
  RETURN new_token;
END;
$$ LANGUAGE plpgsql;

-- CSRF 토큰 검증 함수
CREATE OR REPLACE FUNCTION verify_csrf_token(p_token TEXT, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  token_valid BOOLEAN := false;
BEGIN
  -- 토큰 확인 및 사용 처리
  UPDATE public.csrf_tokens
  SET used = true
  WHERE token = p_token 
    AND user_id = p_user_id 
    AND expires_at > NOW() 
    AND used = false;
  
  GET DIAGNOSTICS token_valid = FOUND;
  
  RETURN token_valid;
END;
$$ LANGUAGE plpgsql;

-- 통화 변환 함수
CREATE OR REPLACE FUNCTION convert_currency(
  p_amount DECIMAL,
  p_from_currency TEXT DEFAULT 'THB',
  p_to_currency TEXT DEFAULT 'THB'
) RETURNS DECIMAL AS $$
DECLARE
  from_rate DECIMAL;
  to_rate DECIMAL;
  result DECIMAL;
BEGIN
  IF p_from_currency = p_to_currency THEN
    RETURN p_amount;
  END IF;

  -- 환율 가져오기
  SELECT exchange_rate INTO from_rate FROM public.currencies WHERE code = p_from_currency;
  SELECT exchange_rate INTO to_rate FROM public.currencies WHERE code = p_to_currency;

  IF from_rate IS NULL OR to_rate IS NULL THEN
    RAISE EXCEPTION '지원하지 않는 통화입니다: % -> %', p_from_currency, p_to_currency;
  END IF;

  -- THB 기준으로 변환 후 목표 통화로 변환
  result := (p_amount / from_rate) * to_rate;
  
  RETURN ROUND(result, 2);
END;
$$ LANGUAGE plpgsql;

-- 8. 트리거 함수들

-- 번역 테이블 updated_at 트리거
CREATE TRIGGER update_product_translations_updated_at 
  BEFORE UPDATE ON public.product_translations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_content_translations_updated_at 
  BEFORE UPDATE ON public.content_translations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_seo_metadata_updated_at 
  BEFORE UPDATE ON public.seo_metadata
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_currencies_updated_at 
  BEFORE UPDATE ON public.currencies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 9. 파일 업로드 보안 함수
CREATE OR REPLACE FUNCTION validate_file_upload(
  p_filename TEXT,
  p_file_size INTEGER,
  p_file_type TEXT,
  p_user_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  allowed_types TEXT[] := ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  max_size INTEGER := 5242880; -- 5MB
  file_extension TEXT;
  is_valid BOOLEAN := true;
  rejection_reason TEXT := '';
BEGIN
  -- 파일 타입 검증
  IF NOT (p_file_type = ANY(allowed_types)) THEN
    is_valid := false;
    rejection_reason := '허용되지 않는 파일 형식: ' || p_file_type;
  END IF;

  -- 파일 크기 검증
  IF p_file_size > max_size THEN
    is_valid := false;
    rejection_reason := rejection_reason || ' 파일 크기 초과: ' || p_file_size || ' > ' || max_size;
  END IF;

  -- 파일 확장자 검증
  file_extension := lower(split_part(p_filename, '.', -1));
  IF NOT (file_extension IN ('jpg', 'jpeg', 'png', 'gif', 'webp')) THEN
    is_valid := false;
    rejection_reason := rejection_reason || ' 허용되지 않는 확장자: ' || file_extension;
  END IF;

  -- 로그 기록
  INSERT INTO public.file_upload_logs (
    user_id, filename, file_size, file_type, upload_path, 
    status, rejection_reason, ip_address, user_agent
  ) VALUES (
    p_user_id, p_filename, p_file_size, p_file_type, 'storage/images',
    CASE WHEN is_valid THEN 'success' ELSE 'rejected' END,
    CASE WHEN is_valid THEN NULL ELSE rejection_reason END,
    inet_client_addr(), -- 클라이언트 IP
    current_setting('request.headers', true)::json->>'user-agent' -- User Agent
  );

  RETURN is_valid;
END;
$$ LANGUAGE plpgsql;

-- 10. 기본 SEO 데이터 생성 (태국어 우선)
INSERT INTO public.seo_metadata (page_type, language_code, title, description, keywords, og_title, og_description) VALUES
('home', 'th', 'Daddy Bath Bomb - ร้านบาธบอมพรีเมียม', 'พบกับบาธบอมคุณภาพสูงที่ทำจากวัตถุดิบธรรมชาติ เพื่อเวลาอาบน้ำที่หอมหวานและนุ่มนวล', 'บาธบอม, อุปกรณ์อาบน้ำ, ธรรมชาติ, พรีเมียม', 'Daddy Bath Bomb - บาธบอมพรีเมียม', 'ร้านบาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ'),
('home', 'en', 'Daddy Bath Bomb - Premium Bath Bomb Store', 'Discover premium bath bombs made from natural ingredients for a fragrant and luxurious bathing experience.', 'bath bomb, bath products, natural, premium, thailand', 'Daddy Bath Bomb - Premium Bath Bombs', 'Premium bath bomb store with natural ingredients')
ON CONFLICT (page_type, reference_id, language_code) DO NOTHING;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '다국어, SEO, 보안 기능이 성공적으로 추가되었습니다!';
  RAISE NOTICE '- 다국어 지원 (한국어/태국어/영어)';
  RAISE NOTICE '- 통화 변환 시스템';
  RAISE NOTICE '- SEO 메타데이터 관리';
  RAISE NOTICE '- Rate Limiting 보안';
  RAISE NOTICE '- CSRF 토큰 보안';
  RAISE NOTICE '- 파일 업로드 보안 검증';
END $$;
