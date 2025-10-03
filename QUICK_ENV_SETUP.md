# ⚡ .env 파일 빠른 설정

## 📝 지금 열린 파일: `.env`

VS Code(또는 텍스트 에디터)에서 `.env` 파일이 열렸습니다!

---

## ✏️ 수정해야 할 부분

### 1. 관리자 이메일 (선택사항)
```env
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
```
→ 원하는 이메일로 변경 (또는 그대로 사용)

### 2. 관리자 비밀번호 (필수 변경 권장)
```env
VITE_ADMIN_PASSWORD=your_secure_admin_password
```
→ **이 부분을 강력한 비밀번호로 변경하세요!**

예시:
```env
VITE_ADMIN_PASSWORD=MySecure#Pass123!
```

---

## 🎯 추천 설정

### 개발 환경 (로컬 테스트)
```env
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
VITE_ADMIN_PASSWORD=admin123
```
간단하게 사용 가능

### 운영 환경 (실제 서비스)
```env
VITE_ADMIN_EMAIL=your_real_email@gmail.com
VITE_ADMIN_PASSWORD=SuperSecure#2024!Daddy
```
강력한 비밀번호 필수!

---

## 💾 저장 및 적용

### 1. 파일 저장
- **VS Code**: `Cmd + S` (Mac) / `Ctrl + S` (Windows)
- **TextEdit**: `Cmd + S`

### 2. 개발 서버 재시작
터미널에서:
```bash
# 1. 현재 서버 중지
Ctrl + C

# 2. 다시 시작
npm run dev
```

---

## 🔐 로그인 정보

수정 후, 다음 정보로 로그인:

```
1. 페이지 맨 아래 Footer로 스크롤
2. © 기호 클릭
3. 입력:
   - Email: (위에서 설정한 VITE_ADMIN_EMAIL)
   - Password: (위에서 설정한 VITE_ADMIN_PASSWORD)
```

---

## ⚠️ 주의사항

1. **절대 GitHub에 업로드 금지**
   - `.env` 파일은 `.gitignore`에 포함되어 있음
   - Git이 자동으로 무시함

2. **비밀번호는 안전하게**
   - 다른 사람과 공유하지 마세요
   - 정기적으로 변경하세요

3. **백업하세요**
   - `.env` 파일을 안전한 곳에 백업
   - 비밀번호를 잊지 않도록 기록

---

## ✅ 완료!

`.env` 파일 수정 후:
1. 저장 (`Cmd + S`)
2. 서버 재시작 (`Ctrl + C` → `npm run dev`)
3. Footer © 클릭으로 로그인

**모든 준비 완료!** 🎉



