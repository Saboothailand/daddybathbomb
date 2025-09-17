# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com)에서 계정 생성/로그인
2. "New Project" 클릭
3. 프로젝트 이름: `daddy-bath-bomb`
4. 데이터베이스 비밀번호 설정 (안전한 곳에 저장!)
5. 리전 선택 (아시아-태평양 권장)
6. "Create new project" 클릭

## 2. 데이터베이스 스키마 생성

### Step 1: SQL Editor 접속
1. Supabase 대시보드 왼쪽 메뉴에서 "SQL Editor" 클릭
2. "New query" 버튼 클릭

### Step 2: 스키마 SQL 실행
아래 SQL을 복사해서 SQL Editor에 붙여넣고 "Run" 버튼을 클릭하세요:

```sql
-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Content management table (브랜드소개, 제품소개 등)
CREATE TABLE public.content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL, -- 'brand_intro', 'product_intro', 'how_to_use', etc.
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  images TEXT[], -- Array of image URLs
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  category TEXT,
  ingredients TEXT,
  weight TEXT,
  scent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  
  -- Customer shipping info (Thailand address)
  shipping_name TEXT NOT NULL,
  shipping_email TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_province TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'Thailand',
  
  -- Payment info
  payment_method TEXT, -- 'qr_pay' or 'bank_transfer'
  payment_status TEXT DEFAULT 'pending',
  payment_proof_url TEXT,
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Instagram gallery table
CREATE TABLE public.instagram_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  instagram_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;
```

### Step 3: RLS 정책 설정
새 쿼리를 만들어서 아래 SQL을 실행하세요:

```sql
-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for content table
CREATE POLICY "Everyone can view active content" ON public.content
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage content" ON public.content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for products table
CREATE POLICY "Everyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for orders table
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pending orders" ON public.orders
  FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for order_items table
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for instagram_posts table
CREATE POLICY "Everyone can view active instagram posts" ON public.instagram_posts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage instagram posts" ON public.instagram_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Step 4: 트리거 및 함수 설정
새 쿼리를 만들어서 아래 SQL을 실행하세요:

```sql
-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON public.content
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_instagram_posts_updated_at BEFORE UPDATE ON public.instagram_posts
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, nickname, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN NEW.email = 'admin@daddybathbomb.com' THEN 'admin'::user_role
      ELSE 'customer'::user_role
    END
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 3. Storage 버킷 생성

1. 왼쪽 메뉴에서 "Storage" 클릭
2. "Create a new bucket" 클릭
3. 버킷 이름: `images`
4. "Public bucket" 체크
5. "Create bucket" 클릭

### Storage 정책 설정
Storage > images 버킷 > "Policies" 탭에서:

```sql
-- 모든 사용자가 이미지 조회 가능
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- 인증된 사용자가 이미지 업로드 가능
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- 관리자가 이미지 삭제 가능
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
```

## 4. 샘플 데이터 삽입 (선택사항)

새 쿼리를 만들어서 아래 SQL을 실행하세요:

```sql
-- Insert sample content
INSERT INTO public.content (title, description, content_type, image_url, order_index, is_active) VALUES
('브랜드 소개', 'Daddy Bath Bomb은 프리미엄 배스밤 브랜드입니다.', 'brand_intro', 'https://example.com/brand-intro.jpg', 1, true),
('제품 소개', '천연 재료로 만든 최고품질의 배스밤을 만나보세요.', 'product_intro', 'https://example.com/product-intro.jpg', 2, true),
('사용법', '따뜻한 물에 배스밤을 넣고 향긋한 목욕을 즐기세요.', 'how_to_use', 'https://example.com/how-to-use.jpg', 3, true);

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, stock_quantity, is_active, category, ingredients, weight, scent) VALUES
('라벤더 배스밤', '진정 효과가 뛰어난 라벤더 향의 배스밤', 150.00, 'https://example.com/lavender-bath-bomb.jpg', 50, true, '릴렉싱', '라벤더 오일, 베이킹소다, 구연산', '100g', '라벤더'),
('로즈 배스밤', '로맨틱한 장미 향의 프리미엄 배스밤', 180.00, 'https://example.com/rose-bath-bomb.jpg', 30, true, '로맨틱', '장미 오일, 베이킹소다, 구연산', '100g', '로즈'),
('유칼립투스 배스밤', '상쾌한 유칼립투스 향의 배스밤', 160.00, 'https://example.com/eucalyptus-bath-bomb.jpg', 40, true, '상쾌함', '유칼립투스 오일, 베이킹소다, 구연산', '100g', '유칼립투스'),
('바닐라 배스밤', '달콤한 바닐라 향의 배스밤', 170.00, 'https://example.com/vanilla-bath-bomb.jpg', 35, true, '달콤함', '바닐라 오일, 베이킹소다, 구연산', '100g', '바닐라');

-- Insert sample Instagram posts
INSERT INTO public.instagram_posts (image_url, caption, instagram_url, order_index, is_active) VALUES
('https://example.com/insta1.jpg', '새로운 라벤더 배스밤 출시! 🛁✨', 'https://instagram.com/p/example1', 1, true),
('https://example.com/insta2.jpg', '로즈 배스밤으로 로맨틱한 하루 🌹', 'https://instagram.com/p/example2', 2, true),
('https://example.com/insta3.jpg', '유칼립투스로 상쾌한 목욕시간 🌿', 'https://instagram.com/p/example3', 3, true),
('https://example.com/insta4.jpg', '바닐라 향으로 달콤한 휴식 🍦', 'https://instagram.com/p/example4', 4, true);
```

## 5. API 키 확인

1. 왼쪽 메뉴에서 "Settings" > "API" 클릭
2. "Project URL"과 "anon public" 키를 복사
3. `.env` 파일에 붙여넣기:

```env
VITE_SUPABASE_URL=여기에_Project_URL_붙여넣기
VITE_SUPABASE_ANON_KEY=여기에_anon_public_키_붙여넣기
VITE_ADMIN_EMAIL=admin@daddybathbomb.com
```

### Step 5: 성능 및 안정성 개선사항 적용 (권장)
기본 스키마가 성공적으로 생성된 후, 추가 개선사항을 적용하려면 새 쿼리를 만들어서 `supabase/migrations/002_improvements.sql` 파일의 내용을 실행하세요.

이 개선사항에는 다음이 포함됩니다:
- 🚀 **성능 인덱스**: 자주 조회되는 컬럼에 인덱스 추가
- 🔒 **데이터 무결성**: 가격, 수량, 이메일 형식 검증
- 📦 **자동 재고 관리**: 주문 시 자동 재고 차감/복구
- 📋 **주문 상태 로깅**: 주문 상태 변경 히스토리 추적
- ⚙️ **설정 관리**: 관리자 이메일 등 설정을 DB에서 관리
- 📊 **유용한 뷰**: 주문 상세, 판매 통계 뷰

## 6. 관리자 이메일 설정 변경 (선택사항)

기본적으로 `admin@daddybathbomb.com`이 관리자로 설정되어 있습니다. 
다른 이메일을 관리자로 추가하려면:

```sql
UPDATE public.app_settings 
SET value = 'admin@daddybathbomb.com,your-email@example.com' 
WHERE key = 'admin_emails';
```

## ✅ 완료!

이제 `npm install && npm run dev`로 프로젝트를 실행하고 관리자 이메일로 회원가입하면 관리자 권한을 받을 수 있습니다!
