# 🚀 Daddy Bath Bomb 배포 가이드

## 1단계: Supabase 설정 완료

### ✅ 이미 완료한 것들
- [x] Supabase 프로젝트 생성
- [x] 기본 스키마 실행 (`001_initial_schema.sql`)
- [x] 개선사항 적용 (`002_improvements.sql`)
- [x] Storage 버킷 생성 (`images`)

### 📝 확인사항
1. **API 키 확인**: Settings > API에서 URL과 anon key 복사
2. **Storage 정책 확인**: `images` 버킷이 Public으로 설정되어 있는지 확인
3. **샘플 데이터**: 필요하다면 `seed.sql` 실행

## 2단계: GitHub 저장소 준비

### Git 초기화 및 업로드
```bash
cd "Daddy Bath Bomb"

# Git 초기화
git init

# .gitignore 파일 생성
echo "node_modules/
.env
.env.local
dist/
.DS_Store" > .gitignore

# 첫 커밋
git add .
git commit -m "Initial commit: Daddy Bath Bomb e-commerce site"

# GitHub 저장소 생성 후 연결 (GitHub에서 새 저장소 만든 후)
git remote add origin https://github.com/YOUR_USERNAME/daddy-bath-bomb.git
git branch -M main
git push -u origin main
```

## 3단계: Vercel 배포

### 🌐 Vercel에서 배포하기

1. **Vercel 계정 생성**: [vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인

2. **새 프로젝트 생성**:
   - "New Project" 클릭
   - GitHub 저장소 선택: `daddy-bath-bomb`
   - "Import" 클릭

3. **환경 변수 설정**:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_EMAIL=admin@daddybathbomb.com
   VITE_APP_NAME=Daddy Bath Bomb
   ```

4. **배포 설정**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **"Deploy" 클릭** 🚀

## 4단계: 관리자 계정 생성

배포 완료 후:

1. **사이트 접속**: `https://your-project.vercel.app`
2. **회원가입**: `admin@daddybathbomb.com`으로 가입
3. **관리자 확인**: `/admin` 경로로 접속하여 대시보드 확인

## 5단계: 사이트 내에서 콘텐츠 관리

### 🎨 로고 및 이미지 변경 방법

#### A. 관리자 대시보드에서 변경

1. **로그인 후 관리자 대시보드 접속**:
   ```
   https://your-site.vercel.app/admin
   ```

2. **콘텐츠 관리 탭**:
   - 브랜드 소개, 제품 소개 이미지 업로드/변경
   - 텍스트 내용 수정

3. **제품 관리 탭**:
   - 제품 이미지 업로드
   - 가격, 설명, 재고 관리

4. **Instagram 갤러리 탭**:
   - 갤러리 이미지 업로드/관리

#### B. 직접 이미지 업로드 시스템 사용

각 섹션에서 "이미지 업로드" 버튼 클릭:
- ✅ 드래그 앤 드롭 지원
- ✅ 실시간 미리보기
- ✅ 자동 최적화 (5MB 제한)
- ✅ JPG, PNG, GIF 지원

### 📝 초기 설정 체크리스트

#### 필수 콘텐츠 업데이트
- [ ] **로고**: 헤더 로고 이미지 교체
- [ ] **브랜드 소개**: 회사 소개 텍스트 및 이미지
- [ ] **제품 이미지**: 실제 배스밤 제품 사진들
- [ ] **Instagram 갤러리**: 실제 인스타그램 포스트들
- [ ] **연락처 정보**: 실제 이메일, 전화번호 업데이트

#### 설정 업데이트
```sql
-- 관리자 대시보드 > SQL Editor에서 실행
UPDATE public.app_settings SET value = '실제값' WHERE key IN (
  'site_name',      -- 사이트 이름
  'admin_emails',   -- 관리자 이메일들
  'shipping_fee',   -- 배송비
  'free_shipping_threshold' -- 무료배송 기준
);
```

## 6단계: 결제 정보 업데이트

### 💳 실제 결제 정보로 변경

`src/components/PaymentInfo.tsx` 파일에서 실제 정보로 업데이트:

```typescript
const qrPayInfo = {
  name: "실제 수취인 이름",
  phone: "+66 실제 전화번호",
  promptpay: "실제 PromptPay 번호"
}

const bankInfo = {
  bankName: "실제 은행명",
  accountName: "실제 예금주명",
  accountNumber: "실제 계좌번호",
  swiftCode: "실제 SWIFT 코드"
}
```

## 7단계: 도메인 연결 (선택사항)

### 🌐 커스텀 도메인 설정

1. **Vercel 대시보드**에서 프로젝트 선택
2. **Settings > Domains** 클릭
3. 도메인 입력: `daddybathbomb.com`
4. DNS 설정에 CNAME 레코드 추가

## 8단계: SEO 및 성능 최적화

### 📈 추가 최적화 사항

```typescript
// public/robots.txt 생성
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml

// 메타 태그 추가 (index.html)
<meta name="description" content="프리미엄 배스밤 브랜드 Daddy Bath Bomb">
<meta name="keywords" content="배스밤, 목욕용품, 천연, 태국">
<meta property="og:title" content="Daddy Bath Bomb">
<meta property="og:description" content="천연 재료로 만든 프리미엄 배스밤">
```

## 🎯 배포 완료 체크리스트

### 기능 테스트
- [ ] 회원가입/로그인 작동
- [ ] 제품 목록 표시
- [ ] 장바구니 기능
- [ ] 주문 프로세스
- [ ] 관리자 대시보드 접근
- [ ] 이미지 업로드 기능
- [ ] 모바일 반응형 확인

### 콘텐츠 확인
- [ ] 모든 이미지가 실제 제품 이미지로 교체됨
- [ ] 텍스트 내용이 브랜드에 맞게 수정됨
- [ ] 연락처 정보가 실제 정보로 업데이트됨
- [ ] 결제 정보가 실제 계좌로 설정됨

### 보안 확인
- [ ] 환경 변수가 안전하게 설정됨
- [ ] 관리자 계정 비밀번호 강화
- [ ] RLS 정책이 올바르게 작동함

## 🚨 문제 해결

### 자주 발생하는 문제들

1. **이미지가 표시되지 않음**:
   - Supabase Storage 버킷이 Public인지 확인
   - 이미지 URL이 올바른지 확인

2. **관리자 권한이 없음**:
   - `app_settings` 테이블의 `admin_emails` 확인
   - 올바른 이메일로 가입했는지 확인

3. **주문이 생성되지 않음**:
   - RLS 정책 확인
   - 브라우저 콘솔에서 에러 메시지 확인

## 📞 지원

배포 과정에서 문제가 발생하면:
- Supabase 대시보드의 Logs 확인
- Vercel 대시보드의 Function Logs 확인
- 브라우저 개발자 도구의 Network 탭 확인

---

🎉 **축하합니다!** 이제 완전히 작동하는 온라인 배스밤 쇼핑몰이 준비되었습니다!
