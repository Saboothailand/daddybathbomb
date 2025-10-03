# 🔐 관리자 전용 로그인 설정 가이드

## ✅ 완료된 작업

1. **✅ .env 파일 생성됨**
2. **✅ 관리자 계정 설정 완료**
3. **✅ 일반 사용자 회원가입 비활성화** (관리자만 로그인)
4. **✅ Footer © 클릭으로 숨겨진 로그인**

---

## 📝 .env 파일 설정

### 위치
```
/Users/kimhwan/Desktop/Daddy Bath Bomb/.env
```

### 관리자 계정 설정

`.env` 파일을 열어서 다음 부분을 수정하세요:

```env
# Admin Configuration (관리자 계정)
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
VITE_ADMIN_PASSWORD=admin123
```

### 비밀번호 변경 방법

**방법 1: 텍스트 에디터로 수정**
```bash
# VS Code로 열기
code .env

# 또는 다른 에디터
open .env
```

**방법 2: 터미널로 수정**
```bash
# 이메일 변경
sed -i '' 's/VITE_ADMIN_EMAIL=.*/VITE_ADMIN_EMAIL=your_email@example.com/' .env

# 비밀번호 변경
sed -i '' 's/VITE_ADMIN_PASSWORD=.*/VITE_ADMIN_PASSWORD=your_new_password/' .env
```

---

## 🔒 보안 권장사항

### Development (개발 환경)
```env
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
VITE_ADMIN_PASSWORD=admin123
```
✅ 간단한 비밀번호 OK

### Production (운영 환경)
```env
VITE_ADMIN_EMAIL=your_real_email@domain.com
VITE_ADMIN_PASSWORD=SuperSecure#Pass123!
```

**강력한 비밀번호 조건:**
- 최소 12자 이상
- 대문자 포함
- 소문자 포함
- 숫자 포함
- 특수문자 포함

---

## 🚀 로그인 방법

### 1단계: Footer © 클릭
페이지 맨 아래 Footer에서:
```
© 2024 Daddy Bath Bomb...
↑ 여기 클릭!
```

### 2단계: 로그인 정보 입력
```
Email: .env 파일의 VITE_ADMIN_EMAIL 값
Password: .env 파일의 VITE_ADMIN_PASSWORD 값
```

### 3단계: Admin 페이지 접근
로그인 후:
```
http://localhost:3000/#admin
```

---

## 🔧 환경 변수 작동 원리

### 시스템 흐름

```
1. .env 파일
   ↓
2. Vite가 환경 변수 로드
   ↓
3. src/utils/auth.tsx에서 읽기
   ↓
4. 로그인 시 검증
```

### 코드 확인 (src/utils/auth.tsx)

```typescript
const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim();
const configuredAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? '';

export const ADMIN_EMAIL = (configuredAdminEmail || 'admin@daddybathbomb.com').toLowerCase();
const ADMIN_PASSWORD = configuredAdminPassword || 'admin123';
```

---

## 🎯 일반 사용자 회원가입 비활성화

현재 시스템은 **관리자만 로그인** 가능합니다:

### 특징:
1. **회원가입 불가능** - 일반 사용자 회원가입 없음
2. **로그인만 가능** - .env에 설정된 계정만
3. **단일 관리자** - 한 명의 관리자만 존재

### 장점:
- ✅ 간단한 관리
- ✅ 보안 강화
- ✅ 복잡한 사용자 관리 불필요
- ✅ 빠른 접근

---

## 🔄 변경 후 재시작

`.env` 파일을 수정한 후 **반드시 개발 서버 재시작**:

```bash
# 1. 기존 서버 중지 (Ctrl+C)

# 2. 서버 재시작
npm run dev
```

---

## ✅ 테스트 체크리스트

### 1. .env 파일 확인
```bash
cat .env | grep ADMIN
```

출력 예시:
```
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
VITE_ADMIN_PASSWORD=admin123
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 로그인 테스트
1. http://localhost:3000 접속
2. Footer로 스크롤
3. © 클릭
4. 로그인 정보 입력:
   ```
   Email: admin@daddybathbomb.com
   Password: admin123
   ```
5. 로그인 성공 확인

### 4. Admin 페이지 접근
로그인 후 주소창에 입력:
```
http://localhost:3000/#admin
```

---

## 🛡️ 보안 팁

### 1. .env 파일 보호
```bash
# .gitignore에 이미 추가되어 있음
echo ".env" >> .gitignore

# 파일 권한 제한 (Mac/Linux)
chmod 600 .env
```

### 2. GitHub에 업로드 금지
```bash
# .env 파일이 .gitignore에 있는지 확인
cat .gitignore | grep .env
```

출력되어야 함:
```
.env
.env.local
.env.*.local
```

### 3. Production 배포 시
- Vercel/Netlify 등에서 환경 변수 별도 설정
- 절대 `.env` 파일을 배포 서버에 업로드하지 마세요
- 대신 호스팅 플랫폼의 Environment Variables 사용

---

## 📱 다중 계정 (선택사항)

만약 여러 관리자가 필요하다면 나중에 Supabase 사용자 테이블 활용 가능:

```sql
-- users 테이블에 관리자 추가
INSERT INTO users (email, role) 
VALUES ('admin2@example.com', 'admin');
```

하지만 **현재는 .env 방식으로 충분합니다!**

---

## 🎉 완료!

이제 관리자 로그인 시스템이 완벽하게 작동합니다:

### ✅ 체크리스트
- [x] .env 파일 생성됨
- [x] 관리자 이메일 설정됨
- [x] 관리자 비밀번호 설정됨
- [x] Footer © 클릭으로 로그인
- [x] 일반 사용자 회원가입 없음
- [x] 보안 강화됨

### 📍 로그인 정보
```
이메일: .env의 VITE_ADMIN_EMAIL
비밀번호: .env의 VITE_ADMIN_PASSWORD
접근 방법: Footer © 클릭
Admin URL: #admin
```

**모든 준비 완료!** 🎊

---

## 🆘 문제 해결

### "로그인이 안 돼요"

**1. .env 파일 확인**
```bash
cat .env | grep ADMIN
```

**2. 개발 서버 재시작**
```bash
# Ctrl+C로 중지 후
npm run dev
```

**3. 브라우저 캐시 삭제**
```
Ctrl+Shift+R (Mac: Cmd+Shift+R)
```

### ".env 파일이 없어요"

다시 생성:
```bash
cp env.example .env
```

그리고 내용 수정:
```bash
code .env
```

### "Footer © 가 안 보여요"

페이지 맨 아래로 스크롤하세요:
```
End 키 누르기
또는
마우스로 스크롤
```

---

## 📚 관련 파일

| 파일 | 역할 |
|------|------|
| `.env` | 관리자 계정 설정 |
| `env.example` | 환경 변수 템플릿 |
| `src/utils/auth.tsx` | 인증 로직 |
| `src/components/Footer.tsx` | © 클릭 기능 |
| `src/components/AuthModal.tsx` | 로그인 모달 |

---

**완벽한 관리자 전용 로그인 시스템!** 🔐✨



