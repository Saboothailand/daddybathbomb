-- Initial data for Daddy Bath Bomb

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

-- Create admin user (this will be handled by the trigger when admin signs up)
-- The admin email is set in the handle_new_user function
