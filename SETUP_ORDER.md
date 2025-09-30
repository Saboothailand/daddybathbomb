# 🚀 Supabase 데이터베이스 설정 순서

Supabase Dashboard > SQL Editor에서 아래 순서대로 실행하세요.

## ✅ 실행 순서 (중요!)

### 1단계: 기본 테이블 생성
**파일:** `final_setup.sql`
- product_categories 테이블 생성 및 컬럼 추가
- gallery_categories 테이블 생성
- gallery 테이블 생성
- 기본 카테고리 2개 생성 (Daddy Bath Bomb, Daddy Bath Gel)

### 2단계: 구매 링크 기능 추가
**파일:** `add_buy_link.sql`
- gallery 테이블에 buy_link 컬럼 추가

### 3단계: 이미지 슬라이더 테이블 생성
**파일:** `add_gallery_images.sql`
- gallery_images 테이블 생성
- RLS 정책 설정

### 4단계: 샘플 제품 20개 생성
**파일:** `add_sample_products.sql`
- Bath Bomb 제품 10개
- Bath Gel 제품 10개
- 슬라이더용 이미지 데이터

---

## 🎯 각 단계별 실행 방법

1. **Supabase Dashboard** 접속
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New Query** 클릭
4. 해당 `.sql` 파일 내용 전체 복사
5. 붙여넣기
6. **Run** 버튼 클릭
7. 성공 메시지 확인 후 다음 단계로

---

## 📝 주의사항

- 반드시 **순서대로** 실행하세요
- 각 단계가 성공적으로 완료된 후 다음 단계 진행
- 에러 발생 시 메시지를 확인하고 해결 후 재실행

---

## 🎉 완료 후

브라우저를 새로고침하면:
- 💣 Bath Bomb 제품 10개
- 🧴 Bath Gel 제품 10개
- 🖼️ 이미지 슬라이더 작동
- 🛒 구매 링크 버튼 표시

모든 기능이 정상 작동합니다!
