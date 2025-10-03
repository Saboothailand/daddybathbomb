# 🛡️ 관리자 페이지 접근 가이드

## 📍 관리자 페이지 접근 방법

### 방법 1: Header의 Admin 버튼 사용 (로그인 후)

1. **로그인하기**
   - 우측 상단의 **User 아이콘** (👤) 클릭
   - 관리자 계정으로 로그인

2. **Admin 버튼 클릭**
   - 로그인 후 Header에 **빨간색 방패 아이콘** (🛡️) 표시됨
   - 클릭하면 Admin Dashboard로 이동

### 방법 2: URL로 직접 접근

```
http://localhost:3000/#admin
```

- 브라우저 주소창에 직접 입력
- 로그인되지 않았다면 자동으로 로그인 모달 표시

---

## 🔐 기본 관리자 계정

### 개발 환경 (Development)

**이메일**: `admin@daddybathbomb.com`  
**비밀번호**: `admin123`

> ⚠️ **주의**: 프로덕션 배포 시 반드시 비밀번호를 변경하세요!

---

## 🎨 Admin 버튼 디자인

### 데스크톱
- Header 우측 상단에 빨간색 방패 아이콘 (🛡️)
- 빨간색 테두리와 호버 효과
- 로그인한 관리자에게만 표시

### 모바일
- 햄버거 메뉴 (☰) 클릭
- 메뉴 하단에 "🛡️ Admin" 항목 표시
- 로그인한 관리자에게만 표시

---

## 🚀 로그인 프로세스

### 1단계: 로그인 모달 열기
- User 아이콘 (👤) 클릭
- 또는 Admin 버튼 클릭 (미로그인 시)

### 2단계: 관리자 계정 입력
```
Email: admin@daddybathbomb.com
Password: admin123
```

### 3단계: 로그인 성공
- User 아이콘 옆에 Admin 버튼 (🛡️) 나타남
- Admin 버튼 클릭하여 대시보드 접근

---

## 📦 환경 변수 설정

`.env` 파일에 관리자 계정 설정:

```env
# Admin Configuration
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
VITE_ADMIN_PASSWORD=your_secure_password_here
```

### 변경 방법

1. `.env` 파일 열기
2. `VITE_ADMIN_EMAIL` 수정
3. `VITE_ADMIN_PASSWORD` 수정
4. 개발 서버 재시작
   ```bash
   npm run dev
   ```

---

## 🔧 Admin Dashboard 기능

### 배너 관리
- **Banner Management** 탭
- Hero, Middle, Bottom 배너 추가/수정/삭제
- 이미지 업로드, 순서 변경

### 사용 방법:
1. Admin Dashboard 접속
2. 좌측 메뉴에서 **Banner Studio** 클릭
3. **📍 Middle** 또는 **📍 Bottom** 버튼 클릭
4. 배너 정보 입력:
   - 🖼️ 이미지 업로드
   - ✏️ 제목 입력
   - 📝 설명 입력 (선택)
   - 🔗 링크 URL 입력 (선택)
5. **💾 Save** 클릭

---

## 🎯 배너 추가 Quick Guide

### Middle 배너 추가 (FunFeatures 아래)

1. Admin 로그인
2. Banner Management → **📍 Middle** 버튼
3. 정보 입력 후 저장

### Bottom 배너 추가 (HowToUse 아래)

1. Admin 로그인
2. Banner Management → **📍 Bottom** 버튼
3. 정보 입력 후 저장

---

## 🐛 문제 해결

### Admin 버튼이 안 보일 때

**원인 1: 로그인하지 않음**
- User 아이콘 (👤) 클릭하여 로그인

**원인 2: 관리자 계정이 아님**
- 관리자 이메일로 로그인했는지 확인
- 기본 계정: `admin@daddybathbomb.com`

**원인 3: 브라우저 캐시 문제**
- 하드 새로고침: `Ctrl + Shift + R` (Mac: `Cmd + Shift + R`)
- 또는 브라우저 개발자 도구 → Application → Clear storage

### 로그인 후 Admin 페이지로 자동 이동 안 됨

URL로 직접 접근:
```
http://localhost:3000/#admin
```

---

## 📱 스크린샷 가이드

### Desktop Header (로그인 전)
```
[Logo] DADDY BATH BOMB    [Home] [Products] [About] [Contact]    [🌐 TH] [👤]
```

### Desktop Header (관리자 로그인 후)
```
[Logo] DADDY BATH BOMB    [Home] [Products] [About] [Contact]    [🌐 TH] [🛡️] [👤]
                                                                          ↑
                                                                    Admin 버튼!
```

### Mobile Menu (관리자 로그인 후)
```
☰ Menu
├─ Home
├─ Products
├─ About
├─ Contact
├─ Notice
├─ FAQ
└─ 🛡️ Admin  ← 여기!
```

---

## 🔒 보안 권장사항

### Development (개발 환경)
- 기본 비밀번호 `admin123` 사용 가능

### Production (운영 환경)
1. **강력한 비밀번호 사용**
   - 최소 12자 이상
   - 대소문자, 숫자, 특수문자 조합

2. **.env 파일 보호**
   - `.gitignore`에 `.env` 추가됨
   - 절대 GitHub에 업로드하지 마세요

3. **Supabase RLS 정책 확인**
   - 관리자만 배너 수정 가능하도록 설정됨

---

## 📞 추가 도움

### 로그인 문제
1. 브라우저 Console 확인 (F12)
2. Network 탭에서 인증 요청 확인
3. Supabase 연결 상태 확인

### 배너가 안 보이는 문제
1. `add_middle_banner.sql` 실행
2. Supabase에서 데이터 확인
3. `BANNER_TROUBLESHOOTING.md` 참조

---

## 🎉 성공!

관리자 페이지 접근이 이제 쉬워졌습니다!

1. ✅ Header에 Admin 버튼 추가됨
2. ✅ 로그인 후 자동으로 Admin 버튼 표시
3. ✅ 모바일 메뉴에도 Admin 옵션 추가됨
4. ✅ URL로 직접 접근 가능

**다음 단계**: 배너 추가하기! 📸



