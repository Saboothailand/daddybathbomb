# 🎨 배너 설정 가이드

HowToUse 섹션 아래에 배너를 추가하는 방법을 안내합니다.

## 📋 테이블 구조

### `banner_images` 테이블
```sql
CREATE TABLE public.banner_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,              -- 배너 제목 (필수)
    description TEXT,                  -- 배너 설명 (선택)
    image_url TEXT NOT NULL,           -- 이미지 URL (필수)
    link_url TEXT,                     -- 클릭 시 이동 URL (선택)
    position TEXT NOT NULL,            -- 배너 위치: 'hero', 'middle', 'bottom', 'sidebar'
    display_order INTEGER DEFAULT 0,   -- 표시 순서
    is_active BOOLEAN DEFAULT true,    -- 활성화 상태
    start_date TIMESTAMP,              -- 시작 날짜 (선택)
    end_date TIMESTAMP,                -- 종료 날짜 (선택)
    created_at TIMESTAMP,              -- 생성 시간
    updated_at TIMESTAMP               -- 수정 시간
);
```

## 🚀 배너 추가 방법

### 방법 1: Supabase SQL Editor 사용 (추천)

1. **Supabase 대시보드 접속**
   - https://supabase.com 로그인
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 왼쪽 메뉴에서 "SQL Editor" 클릭

3. **SQL 실행**
   - `add_bottom_banner.sql` 파일의 내용을 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭

### 방법 2: Admin Dashboard 사용

1. **웹사이트 접속**
   - http://localhost:3000 (로컬)
   - 또는 배포된 사이트 주소

2. **관리자 로그인**
   - 우측 상단 Admin 버튼 클릭
   - 관리자 계정으로 로그인

3. **배너 관리**
   - Admin Dashboard → Banner Management
   - "📍 Bottom" 버튼 클릭
   - 배너 정보 입력 후 저장

## 📝 SQL 삽입 예시

### 기본 배너 삽입
```sql
INSERT INTO public.banner_images (
    title, 
    description, 
    image_url, 
    link_url,
    position, 
    display_order, 
    is_active
) VALUES (
    'Ready for Super Fun?',
    'Get your superhero bath bombs now! 🎉',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop',
    '/products',
    'bottom',
    1,
    true
);
```

### 태국어 배너 삽입
```sql
INSERT INTO public.banner_images (
    title, 
    description, 
    image_url, 
    link_url,
    position, 
    display_order, 
    is_active
) VALUES (
    'พร้อมสำหรับความสนุกแล้วหรือยัง?',
    'หยิบบาธบอมฮีโร่ของคุณได้เลย! 🎉',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop',
    '/products',
    'bottom',
    1,
    true
);
```

### 여러 배너 한번에 삽입
```sql
INSERT INTO public.banner_images (title, description, image_url, link_url, position, display_order, is_active) 
VALUES
('배너 1', '설명 1', '이미지_URL_1', '/products', 'bottom', 1, true),
('배너 2', '설명 2', '이미지_URL_2', 'https://instagram.com', 'bottom', 2, true),
('배너 3', '설명 3', '이미지_URL_3', '/contact', 'bottom', 3, true)
ON CONFLICT DO NOTHING;
```

## 🔍 배너 조회

### 모든 Bottom 배너 조회
```sql
SELECT 
    id,
    title,
    description,
    image_url,
    link_url,
    position,
    display_order,
    is_active,
    created_at
FROM public.banner_images
WHERE position = 'bottom'
ORDER BY display_order;
```

### 활성화된 배너만 조회
```sql
SELECT * FROM public.banner_images
WHERE position = 'bottom' AND is_active = true
ORDER BY display_order;
```

## ✏️ 배너 수정

### 제목 수정
```sql
UPDATE public.banner_images 
SET title = '새로운 제목'
WHERE position = 'bottom' AND display_order = 1;
```

### 이미지 수정
```sql
UPDATE public.banner_images 
SET image_url = '새로운_이미지_URL'
WHERE id = 'YOUR_BANNER_ID';
```

### 배너 비활성화
```sql
UPDATE public.banner_images 
SET is_active = false
WHERE position = 'bottom' AND display_order = 1;
```

### 순서 변경
```sql
-- 배너 1을 순서 3으로 변경
UPDATE public.banner_images 
SET display_order = 3
WHERE position = 'bottom' AND display_order = 1;
```

## 🗑️ 배너 삭제

### 특정 배너 삭제
```sql
DELETE FROM public.banner_images 
WHERE id = 'YOUR_BANNER_ID';
```

### 순서로 삭제
```sql
DELETE FROM public.banner_images 
WHERE position = 'bottom' AND display_order = 1;
```

### 모든 bottom 배너 삭제 (주의!)
```sql
DELETE FROM public.banner_images 
WHERE position = 'bottom';
```

## 🎯 배너 위치 설명

| Position | 위치 | 설명 |
|----------|------|------|
| `hero` | 최상단 | Hero 섹션의 큰 배너 |
| `middle` | 중간 | FunFeatures 와 HowToUse 사이 |
| `bottom` | 하단 | HowToUse 섹션 아래 |
| `sidebar` | 사이드바 | 사이드 영역 (선택) |

## 📸 추천 이미지 사이즈

- **Bottom 배너**: 1200 x 500px 이상
- **형식**: JPG, PNG, WebP
- **권장 URL**: Unsplash, 자체 업로드 (Supabase Storage)

## 🖼️ 무료 이미지 소스

### Unsplash 예시
```
https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop
https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=500&fit=crop
https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop
```

## 🔧 문제 해결

### 배너가 보이지 않을 때
1. `is_active = true` 인지 확인
2. `image_url`이 유효한지 확인
3. 브라우저 캐시 새로고침 (Ctrl + F5)

### 배너 순서가 이상할 때
```sql
-- 순서 재정렬
UPDATE public.banner_images SET display_order = 1 WHERE id = 'ID_1';
UPDATE public.banner_images SET display_order = 2 WHERE id = 'ID_2';
UPDATE public.banner_images SET display_order = 3 WHERE id = 'ID_3';
```

## 📱 확인 방법

배너가 제대로 추가되었는지 확인:

1. 브라우저에서 http://localhost:3000 접속
2. 페이지를 아래로 스크롤
3. "วิธีใช้" (HOW TO USE) 섹션 확인
4. 그 아래에 배너가 표시되는지 확인

## 🎉 완료!

이제 HowToUse 섹션 아래에 아름다운 배너가 표시됩니다!



