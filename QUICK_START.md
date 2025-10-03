# 🚀 빠른 시작 가이드

## 1️⃣ 관리자 로그인

### 방법 A: Header 버튼 사용
1. 웹사이트 우측 상단 **User 아이콘 (👤)** 클릭
2. 로그인 정보 입력:
   ```
   Email: admin@daddybathbomb.com
   Password: admin123
   ```
3. 로그인 성공!
4. **빨간색 방패 아이콘 (🛡️)** 클릭 → Admin Dashboard

### 방법 B: URL 직접 접근
```
http://localhost:3000/#admin
```

---

## 2️⃣ Middle 배너 추가 (지금 안 보이는 배너)

### SQL로 빠르게 추가 (추천)

1. **Supabase 접속**
   - https://supabase.com 로그인
   - SQL Editor 열기

2. **SQL 실행**
   ```sql
   INSERT INTO public.banner_images (
       title, description, image_url, link_url,
       position, display_order, is_active
   ) VALUES (
       'Special Promotion',
       'Limited time offer - Buy 2 Get 1 Free! 🎁',
       'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop',
       '/products',
       'middle',
       1,
       true
   );
   ```

3. **새로고침**
   - 브라우저에서 `Ctrl + Shift + R` (Mac: `Cmd + Shift + R`)

### Admin Dashboard로 추가

1. Admin 로그인 (🛡️)
2. **Banner Management** 클릭
3. **Promotional Banners** 탭
4. **📍 Middle** 버튼 클릭
5. 정보 입력:
   - 🖼️ 이미지 업로드
   - ✏️ 제목: `Special Promotion`
   - 📝 설명: `Limited time offer - Buy 2 Get 1 Free! 🎁`
   - 🔗 링크: `/products`
6. **💾 Save**

---

## 3️⃣ Bottom 배너 확인

Bottom 배너는 이미 코드에 추가되어 있습니다.  
데이터만 추가하면 됩니다:

```sql
INSERT INTO public.banner_images (
    title, description, image_url, link_url,
    position, display_order, is_active
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

---

## 📍 배너 위치

```
┌──────────────────┐
│   Hero Section   │
├──────────────────┤
│ Instagram Gallery│
├──────────────────┤
│   FunFeatures    │
├──────────────────┤
│ [MIDDLE 배너] 👈  │ ← 여기가 안 보임!
├──────────────────┤
│   HowToUse       │
├──────────────────┤
│ [BOTTOM 배너] 👈  │ ← 여기도 데이터 필요
├──────────────────┤
│     Footer       │
└──────────────────┘
```

---

## 🔍 확인 방법

### 1. Middle 배너 확인
- Home 페이지 스크롤
- **FunFeatures** 섹션 다음에 배너 보임

### 2. Bottom 배너 확인
- 더 아래로 스크롤
- **HowToUse (วิธีใช้)** 섹션 다음에 배너 보임

### 3. Admin 버튼 확인
- 우측 상단에 🛡️ 빨간색 방패 아이콘
- 로그인 후에만 표시됨

---

## 📦 파일 목록

| 파일 | 용도 |
|------|------|
| `add_middle_banner.sql` | Middle 배너 추가 SQL |
| `add_bottom_banner.sql` | Bottom 배너 추가 SQL |
| `ADMIN_ACCESS_GUIDE.md` | 관리자 접근 상세 가이드 |
| `BANNER_TROUBLESHOOTING.md` | 배너 문제 해결 |
| `QUICK_START.md` | 이 파일 (빠른 시작) |

---

## ⚡ 한 번에 해결하기

### 1. SQL 한 번에 실행

```sql
-- Middle + Bottom 배너 한 번에 추가
INSERT INTO public.banner_images (title, description, image_url, link_url, position, display_order, is_active) 
VALUES
-- Middle 배너
('Special Promotion', 'Limited time offer - Buy 2 Get 1 Free! 🎁', 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1200&h=500&fit=crop', '/products', 'middle', 1, true),
('Gift Sets Available', 'Perfect gifts for your loved ones! 🎀', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=500&fit=crop', '/products', 'middle', 2, true),

-- Bottom 배너
('Ready for Super Fun?', 'Get your superhero bath bombs now! 🎉', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop', '/products', 'bottom', 1, true),
('Follow Us', 'Stay updated with our latest products! 📱', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=500&fit=crop', 'https://instagram.com', 'bottom', 2, true)
ON CONFLICT DO NOTHING;
```

### 2. 새로고침
```
Ctrl + Shift + R (Mac: Cmd + Shift + R)
```

### 3. 완료! 🎉

---

## 🆘 문제 발생 시

### "배너가 안 보여요"
→ `BANNER_TROUBLESHOOTING.md` 참조

### "Admin 버튼이 안 보여요"
→ `ADMIN_ACCESS_GUIDE.md` 참조

### "로그인이 안 돼요"
기본 계정 확인:
```
Email: admin@daddybathbomb.com
Password: admin123
```

---

## ✅ 체크리스트

- [ ] 개발 서버 실행 중 (`npm run dev`)
- [ ] Supabase 프로젝트 설정됨
- [ ] `.env` 파일에 Supabase 키 입력됨
- [ ] 관리자 로그인 성공
- [ ] Admin 버튼 (🛡️) 보임
- [ ] Middle 배너 SQL 실행
- [ ] Bottom 배너 SQL 실행
- [ ] 배너가 화면에 표시됨

---

**모든 단계 완료!** 🎊

이제 Middle 배너와 Bottom 배너가 모두 정상적으로 표시되고,  
관리자 페이지 접근도 쉬워졌습니다!



