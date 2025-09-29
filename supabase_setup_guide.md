# Supabase 테이블 설정 가이드

## 문제 상황
현재 Supabase 테이블에 데이터가 입력되지 않는 문제가 있습니다. 이는 테이블이 생성되지 않았거나 RLS(Row Level Security) 정책이 올바르게 설정되지 않았기 때문일 수 있습니다.

## 해결 방법

### 1. Supabase 웹 대시보드 접속
1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 "SQL Editor" 클릭

### 2. 필요한 테이블 생성 SQL 실행

#### A. Hero Banners 테이블 생성
```sql
-- Hero Banners table for managing main page banners
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT,
    tagline TEXT,
    primary_button_text TEXT,
    secondary_button_text TEXT,
    image_url TEXT,
    icon_name TEXT DEFAULT 'Heart',
    icon_color TEXT DEFAULT '#FF2D55',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Allow read access to hero banners" ON public.hero_banners
    FOR SELECT USING (true);

-- 관리자만 모든 작업 가능 (임시로 모든 사용자 허용)
CREATE POLICY "Allow admin to manage hero banners" ON public.hero_banners
    FOR ALL USING (true);

-- 샘플 데이터 삽입
INSERT INTO public.hero_banners (
    title, subtitle, description, tagline, 
    primary_button_text, secondary_button_text, 
    image_url, icon_name, icon_color, is_active, display_order
) VALUES 
(
    'DADDY',
    'BATH BOMB',
    'ฮีโร่อ่างอาบน้ำ',
    'สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ',
    'ช้อปบาธบอม',
    'ดูเรื่องราวสีสัน',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=600&fit=crop',
    'Heart',
    '#FF2D55',
    true,
    1
),
(
    'FUN',
    'BATH TIME',
    'Make every bath an adventure!',
    'Fun & Fizzy Adventures',
    'Shop Now',
    'Learn More',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
    'Zap',
    '#007AFF',
    true,
    2
),
(
    'COLORS',
    'GALORE',
    'Rainbow of fun awaits you!',
    'Colorful Bath Experience',
    'Explore',
    'Gallery',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop',
    'Palette',
    '#00FF88',
    true,
    3
);
```

#### B. Banner Images 테이블 생성
```sql
-- 배너 이미지 테이블 (상단/중간/하단 배너 관리)
CREATE TABLE IF NOT EXISTS public.banner_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    position TEXT NOT NULL CHECK (position IN ('hero', 'middle', 'bottom', 'sidebar')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS 정책 설정
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성 배너 읽기 가능
CREATE POLICY "Public read access for active banners" ON public.banner_images
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

-- 관리자만 배너 관리 가능 (임시로 모든 사용자 허용)
CREATE POLICY "Admin full access for banner_images" ON public.banner_images
    FOR ALL USING (true);

-- 샘플 배너 데이터 삽입
INSERT INTO public.banner_images (title, description, image_url, position, display_order) VALUES
('Welcome to Daddy Bath Bomb', 'Premium natural bath bombs for ultimate relaxation', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'hero', 1),
('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=400&fit=crop', 'middle', 1),
('Follow Us on Social Media', 'Stay updated with our latest products and offers', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=300&fit=crop', 'bottom', 1);
```

### 3. 환경 변수 확인
`.env` 파일에 다음이 설정되어 있는지 확인:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 테이블 생성 확인
SQL Editor에서 다음 쿼리로 테이블이 생성되었는지 확인:
```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('hero_banners', 'banner_images');

-- 데이터 확인
SELECT * FROM public.hero_banners LIMIT 5;
SELECT * FROM public.banner_images LIMIT 5;
```

### 5. 애플리케이션에서 테스트
1. 관리자 페이지 접속
2. Banner Management 섹션에서 데이터가 표시되는지 확인
3. 새 배너 추가/수정 기능 테스트

## 문제 해결 체크리스트
- [ ] Supabase 프로젝트가 활성화되어 있는가?
- [ ] 환경 변수가 올바르게 설정되어 있는가?
- [ ] 테이블이 생성되었는가?
- [ ] RLS 정책이 올바르게 설정되어 있는가?
- [ ] 샘플 데이터가 삽입되었는가?
- [ ] 애플리케이션에서 데이터를 읽을 수 있는가?
