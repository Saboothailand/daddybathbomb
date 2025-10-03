# 🔒 보안 가이드 - 환경 변수 보호

## ⚠️ 절대 GitHub에 푸시하면 안 되는 파일들

```
.env
.env.local
.env.production
```

**이 파일들에는 비밀번호와 API 키가 포함되어 있습니다!**

---

## ✅ 현재 보안 상태

### 1. .gitignore 설정 완료
```bash
✅ .env
✅ .env.local
✅ .env.production
```

### 2. Git 추적 상태
```
✅ 모든 .env 파일이 Git에서 무시되고 있습니다
✅ GitHub에 푸시되지 않습니다
```

---

## 🛡️ 보안 체크리스트

### 매번 커밋 전 확인하세요!

```bash
# 1. Git 상태 확인
git status

# 2. .env 파일이 없는지 확인
git status | grep .env

# 3. 출력이 없으면 안전! ✅
```

---

## ⚠️ 실수로 .env를 커밋했다면?

### 즉시 조치 방법:

**1. 아직 푸시하지 않았다면:**
```bash
# 마지막 커밋 취소
git reset --soft HEAD~1

# .env를 staging에서 제거
git restore --staged .env
```

**2. 이미 GitHub에 푸시했다면:**
```bash
# ⚠️ 위험: 비밀번호가 이미 노출되었습니다!
# 즉시 다음 조치를 하세요:

# 1) .env의 모든 비밀번호 변경
# 2) Supabase API 키 재발급
# 3) GitHub에서 커밋 히스토리 삭제 (복잡함)
```

**가장 좋은 방법: 절대 푸시하지 않기!**

---

## 🔐 안전한 배포 방법

### Vercel 배포 시

**절대 하지 마세요:**
```bash
❌ .env 파일을 프로젝트에 포함
❌ .env를 GitHub에 푸시
```

**올바른 방법:**
```bash
✅ Vercel Dashboard → Settings → Environment Variables
✅ 각 변수를 개별적으로 입력
```

예시:
```
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
VITE_ADMIN_PASSWORD=your_secure_password
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Netlify 배포 시

```bash
✅ Netlify Dashboard → Site settings → Environment variables
✅ 각 변수를 하나씩 추가
```

---

## 📋 .env 파일 백업 방법

### 안전한 백업:

**1. 로컬 안전한 위치에 복사**
```bash
# 예: 외장 하드드라이브
cp .env /Volumes/MyBackup/daddy-bath-bomb-env-backup.txt
```

**2. 비밀번호 관리자 사용**
- 1Password
- LastPass
- Bitwarden

에 환경 변수 저장

**3. 암호화된 노트**
- Apple Notes (암호 보호)
- Notion (Private)
- 개인 안전한 클라우드

---

## 🚨 긴급 상황 대응

### .env가 GitHub에 노출되었을 때:

**즉시 체크리스트:**
- [ ] 1. GitHub 저장소를 Private으로 변경
- [ ] 2. .env의 모든 비밀번호 즉시 변경
- [ ] 3. Supabase API 키 재발급
- [ ] 4. 문제 커밋 히스토리에서 삭제
- [ ] 5. 팀원들에게 알림

**Supabase API 키 재발급:**
```bash
1. Supabase Dashboard 접속
2. Settings → API
3. "Generate new anon key" 클릭
4. .env 파일 업데이트
5. 개발 서버 재시작
```

---

## ✅ 안전 확인 명령어

### 커밋 전 매번 실행하세요:

```bash
# .env 파일 확인
git status | grep .env
# 출력이 없어야 안전! ✅

# 또는
git diff --cached | grep -i "password\|key\|secret"
# 출력이 없어야 안전! ✅
```

### Git Hook 설정 (선택사항)

`.git/hooks/pre-commit` 파일 생성:
```bash
#!/bin/sh
if git diff --cached --name-only | grep -q "\.env"; then
  echo "❌ ERROR: .env 파일을 커밋하려고 합니다!"
  echo "❌ .env 파일은 절대 커밋하면 안 됩니다!"
  exit 1
fi
```

실행 권한 부여:
```bash
chmod +x .git/hooks/pre-commit
```

---

## 📝 .gitignore 완전 설정

**현재 설정 (확인됨):**
```
.env
.env.local
.env.production
```

**추가 권장 설정:**
```
# 환경 변수
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production
.env*.local

# 백업 파일
*.env.backup
.env.backup
.env.old

# 비밀번호 파일
passwords.txt
secrets.txt
keys.txt
```

---

## 🎯 요약

### ✅ 안전한 것:
- `.env`가 `.gitignore`에 포함됨
- Git이 `.env`를 추적하지 않음
- `env.example`만 GitHub에 푸시 가능

### ❌ 절대 하면 안 되는 것:
- `.env`를 GitHub에 푸시
- `.env` 파일을 공개 저장소에 업로드
- 비밀번호를 코드에 하드코딩
- `.env` 내용을 Discord/Slack에 공유

### ✅ 해야 하는 것:
- 정기적으로 비밀번호 변경
- 강력한 비밀번호 사용
- `.env` 파일 백업
- 배포 시 환경 변수 별도 설정

---

## 📞 문제 발생 시

만약 실수로 .env가 노출되었다면:

1. **즉시 비밀번호 변경**
2. **API 키 재발급**
3. **GitHub에서 커밋 삭제**
4. **저장소를 Private으로 변경**

---

## 🎉 현재 상태: 안전함! ✅

```
✅ .env가 .gitignore에 포함되어 있습니다
✅ Git이 .env를 추적하지 않습니다
✅ GitHub에 푸시되지 않습니다
✅ 보안 설정 완료!
```

**계속 안전하게 개발하세요!** 🔒



