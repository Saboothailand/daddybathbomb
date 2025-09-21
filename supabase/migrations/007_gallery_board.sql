-- 갤러리 및 게시판 기능 (그누보드 스타일)
-- PostgreSQL 호환성 문제 해결 버전

-- 1. 갤러리 테이블
CREATE TABLE public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  author_name TEXT NOT NULL DEFAULT '익명',
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_notice BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. 게시판 테이블
CREATE TABLE public.board (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT '익명',
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_notice BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  board_category TEXT DEFAULT 'general', -- 'general', 'qna', 'review', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. 댓글 테이블 (갤러리와 게시판 공용)
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES public.gallery(id) ON DELETE CASCADE,
  board_id UUID REFERENCES public.board(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '익명',
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT check_parent_type CHECK (
    (gallery_id IS NOT NULL AND board_id IS NULL) OR 
    (gallery_id IS NULL AND board_id IS NOT NULL)
  )
);

-- 4. 좋아요 테이블 (갤러리와 게시판 공용)
CREATE TABLE public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES public.gallery(id) ON DELETE CASCADE,
  board_id UUID REFERENCES public.board(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL, -- IP 기반 좋아요 (로그인 없이도 가능)
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT check_like_type CHECK (
    (gallery_id IS NOT NULL AND board_id IS NULL) OR 
    (gallery_id IS NULL AND board_id IS NOT NULL)
  ),
  CONSTRAINT unique_like_per_user_per_item UNIQUE (
    gallery_id, COALESCE(user_id, gen_random_uuid()::text::uuid), user_ip
  )
);

-- 5. 인덱스 생성
CREATE INDEX idx_gallery_active_notice_created ON public.gallery(is_active, is_notice, created_at DESC);
CREATE INDEX idx_board_active_notice_created ON public.board(is_active, is_notice, created_at DESC);
CREATE INDEX idx_comments_gallery_id ON public.comments(gallery_id, created_at);
CREATE INDEX idx_comments_board_id ON public.comments(board_id, created_at);
CREATE INDEX idx_likes_gallery_id ON public.likes(gallery_id);
CREATE INDEX idx_likes_board_id ON public.likes(board_id);

-- 6. RLS 정책 설정
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- 갤러리 정책
CREATE POLICY "Everyone can view active gallery" ON public.gallery
  FOR SELECT USING (is_active = true);

CREATE POLICY "Everyone can insert gallery" ON public.gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage gallery" ON public.gallery
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 게시판 정책
CREATE POLICY "Everyone can view active board" ON public.board
  FOR SELECT USING (is_active = true);

CREATE POLICY "Everyone can insert board" ON public.board
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage board" ON public.board
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 댓글 정책
CREATE POLICY "Everyone can view active comments" ON public.comments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Everyone can insert comments" ON public.comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage comments" ON public.comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 좋아요 정책
CREATE POLICY "Everyone can view likes" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Everyone can insert likes" ON public.likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage likes" ON public.likes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.gallery_id IS NOT NULL THEN
      UPDATE public.gallery 
      SET comment_count = comment_count + 1 
      WHERE id = NEW.gallery_id;
    END IF;
    IF NEW.board_id IS NOT NULL THEN
      UPDATE public.board 
      SET comment_count = comment_count + 1 
      WHERE id = NEW.board_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.gallery_id IS NOT NULL THEN
      UPDATE public.gallery 
      SET comment_count = comment_count - 1 
      WHERE id = OLD.gallery_id;
    END IF;
    IF OLD.board_id IS NOT NULL THEN
      UPDATE public.board 
      SET comment_count = comment_count - 1 
      WHERE id = OLD.board_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.gallery_id IS NOT NULL THEN
      UPDATE public.gallery 
      SET like_count = like_count + 1 
      WHERE id = NEW.gallery_id;
    END IF;
    IF NEW.board_id IS NOT NULL THEN
      UPDATE public.board 
      SET like_count = like_count + 1 
      WHERE id = NEW.board_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.gallery_id IS NOT NULL THEN
      UPDATE public.gallery 
      SET like_count = like_count - 1 
      WHERE id = OLD.gallery_id;
    END IF;
    IF OLD.board_id IS NOT NULL THEN
      UPDATE public.board 
      SET like_count = like_count - 1 
      WHERE id = OLD.board_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 8. 트리거 생성
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_updated_at
  BEFORE UPDATE ON public.board
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comment_count_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_count();

CREATE TRIGGER update_like_count_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- 9. 샘플 데이터 삽입

-- 샘플 갤러리 데이터
INSERT INTO public.gallery (title, content, image_url, thumbnail_url, author_name, view_count, like_count, comment_count, is_notice, is_active) VALUES
('프리미엄 바스밤 컬렉션', '자연 재료로 만든 프리미엄 바스밤들을 소개합니다!', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', '관리자', 156, 23, 8, true, true),
('아로마 테라피 바스밤', '편안한 라벤더 향의 바스밤으로 스트레스를 날려보세요', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop', '김바스밤', 89, 15, 4, false, true),
('자연스러운 색감의 바스밤', '화학 색소 없는 자연스러운 색감으로 만든 바스밤', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop', '이자연', 67, 12, 2, false, true),
('가족 모두가 즐기는 바스밤', '아이부터 어른까지 모두 안전하게 사용할 수 있는 바스밤', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&sig=family', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&sig=family', '박가족', 134, 28, 6, false, true),
('럭셔리 스파 경험', '집에서 즐기는 5성급 호텔 스파 경험', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop&sig=spa', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop&sig=spa', '최럭셔리', 92, 19, 3, false, true);

-- 샘플 게시판 데이터
INSERT INTO public.board (title, content, author_name, view_count, like_count, comment_count, is_notice, is_active, board_category) VALUES
('Daddy Bath Bomb 오픈 안내', '<h2>안녕하세요! Daddy Bath Bomb입니다.</h2><p>저희 쇼핑몰이 오픈했습니다!</p><ul><li>자연 재료 100% 사용</li><li>무료배송 서비스</li><li>24시간 고객상담</li></ul><p>많은 이용 부탁드립니다!</p>', '관리자', 245, 45, 12, true, true, 'general'),
('바스밤 사용법 문의', '바스밤을 어떻게 사용해야 하는지 궁금합니다. 온도나 시간에 특별한 주의사항이 있나요?', '김궁금', 78, 8, 5, false, true, 'qna'),
('배송 문의드립니다', '주문 후 언제쯤 배송이 시작되나요? 급하게 필요해서 문의드립니다.', '이급함', 56, 3, 2, false, true, 'qna'),
('정말 좋아요!', '친구가 추천해줘서 샀는데 정말 좋네요. 향도 좋고 피부에도 부드러워요. 재구매 의사 100%입니다!', '박만족', 123, 22, 8, false, true, 'review'),
('선물로 주문했는데', '생일 선물로 주문했는데 포장이 정말 예뻐요. 받는 사람이 정말 좋아할 것 같아요. 감사합니다!', '최선물', 89, 15, 4, false, true, 'review');

-- 샘플 댓글 데이터
INSERT INTO public.comments (gallery_id, author_name, content, is_active) VALUES
((SELECT id FROM public.gallery WHERE title = '프리미엄 바스밤 컬렉션' LIMIT 1), '댓글러1', '정말 예쁘네요! 색깔이 환상적이에요', true),
((SELECT id FROM public.gallery WHERE title = '프리미엄 바스밤 컬렉션' LIMIT 1), '댓글러2', '향이 어떤가요? 너무 강하지 않나요?', true),
((SELECT id FROM public.gallery WHERE title = '아로마 테라피 바스밤' LIMIT 1), '댓글러3', '라벤더 향 좋아하는데 이거 괜찮을까요?', true);

INSERT INTO public.comments (board_id, author_name, content, is_active) VALUES
((SELECT id FROM public.board WHERE title = '바스밤 사용법 문의' LIMIT 1), '관리자', '안녕하세요! 바스밤은 미지근한 물에 사용하시면 됩니다. 너무 뜨거운 물은 피해주세요.', true),
((SELECT id FROM public.board WHERE title = '바스밤 사용법 문의' LIMIT 1), '베테랑', '저는 보통 38-40도 정도로 맞춰서 사용해요. 너무 뜨거우면 피부에 안좋을 수 있어요.', true);

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Gallery and Board 기능이 성공적으로 추가되었습니다!';
END $$;
