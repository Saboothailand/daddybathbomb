# 🚀 빠른 설정 가이드

## 1. Supabase SQL 실행 순서

### Step 1: 기본 스키마
```sql
-- 001_initial_schema.sql 내용을 복사해서 실행
```

### Step 2: 개선사항
```sql
-- 002_improvements.sql 내용을 복사해서 실행
```

### Step 3: 고급 기능 (권장)
```sql
-- 003_advanced_improvements.sql 내용을 복사해서 실행
```

### Step 4: 다국어/SEO/보안 기능 (권장)
```sql
-- 004_i18n_seo_security.sql 내용을 복사해서 실행
```

## 2. Storage 버킷 생성

1. Storage > "Create bucket"
2. 이름: `images`
3. Public: ✅ 체크
4. 생성 후 Policies 설정:

```sql
-- 모든 사용자 조회 가능
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

-- 인증된 사용자 업로드 가능
CREATE POLICY "Authenticated Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- 관리자 삭제 가능
CREATE POLICY "Admin Delete" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
```

## 3. 환경 변수 설정

`.env` 파일 생성:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
```

## 4. 프로젝트 실행

```bash
npm install
npm run dev
```

## 5. LINE 공식 계정 설정

1. **LINE Business Account** 생성
2. **QR 코드 생성**: LINE Official Account Manager에서 QR 코드 다운로드
3. **코드 수정**: `src/components/PaymentInfo.tsx`에서 LINE 정보 업데이트
   ```typescript
   const lineInfo = {
     lineId: "@your-line-id",
     qrCodeUrl: "실제_QR코드_URL",
     displayName: "Your Business Name"
   }
   ```

## 6. 초기 설정

1. **관리자 계정**: `admin@daddybathbomb.com`으로 회원가입
2. **관리자 대시보드**: `/admin` 접속
3. **콘텐츠 업로드**: 이미지와 텍스트 수정
4. **언어 설정**: 태국어가 기본, 영어 옵션 제공
5. **LINE 정보**: 실제 LINE 공식 계정 정보로 업데이트

## 7. 유용한 SQL 명령어들

### 재고 부족 제품 확인
```sql
SELECT * FROM check_low_stock();
```

### 일일 매출 확인
```sql
SELECT * FROM daily_sales_report LIMIT 30;
```

### 고객 분석
```sql
SELECT * FROM customer_analytics WHERE customer_status = 'Active';
```

### 데이터 정리 (관리자용)
```sql
SELECT cleanup_old_data();
```

### 테이블 크기 확인
```sql
SELECT * FROM get_table_stats();
```

## 7. 배포 (Vercel)

1. GitHub에 코드 푸시
2. Vercel에서 Import
3. 환경 변수 설정
4. 배포 완료! 🎉

---

## 🆘 문제 해결

### 자주 발생하는 에러들

**재고 부족 에러**:
```sql
-- 재고 수동 조정
UPDATE public.products SET stock_quantity = 100 WHERE name = '제품명';
```

**관리자 권한 없음**:
```sql
-- 관리자 추가
UPDATE public.app_settings 
SET value = 'admin@daddybathbomb.com,new-admin@example.com' 
WHERE key = 'admin_emails';
```

**이미지 업로드 안됨**:
- Storage 버킷이 Public인지 확인
- Policies가 올바르게 설정되었는지 확인

---

## ✅ 완료 체크리스트

- [ ] 기본 스키마 실행
- [ ] 개선사항 적용
- [ ] 고급 기능 적용 (선택)
- [ ] Storage 버킷 생성
- [ ] 환경 변수 설정
- [ ] 관리자 계정 생성
- [ ] 제품 이미지 업로드
- [ ] 결제 정보 수정
- [ ] 테스트 주문 진행
- [ ] 배포 완료

🎉 **축하합니다!** 이제 완전한 기능을 갖춘 배스밤 쇼핑몰이 준비되었습니다!
