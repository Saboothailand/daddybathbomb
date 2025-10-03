-- Products 테이블에 bath bomb과 bath gel 샘플 데이터 추가

-- 기존 샘플 데이터 삭제 (선택사항)
DELETE FROM products WHERE category ILIKE '%bath bomb%' OR category ILIKE '%bath gel%';

-- Bath Bomb 카테고리 제품들 (4개)
INSERT INTO products (name, description, price, image_url, stock_quantity, is_active, category, ingredients, weight, scent) VALUES
('Lavender Dreams Bath Bomb', 'Relaxing lavender bath bomb for peaceful sleep', 150.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&fit=crop', 50, true, 'bath bomb', 'Lavender oil, Baking soda, Citric acid', '100g', 'Lavender'),
('Rose Romance Bath Bomb', 'Romantic rose bath bomb for special moments', 180.00, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&fit=crop', 30, true, 'bath bomb', 'Rose oil, Baking soda, Citric acid', '100g', 'Rose'),
('Eucalyptus Fresh Bath Bomb', 'Refreshing eucalyptus bath bomb for energy', 160.00, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&fit=crop', 40, true, 'bath bomb', 'Eucalyptus oil, Baking soda, Citric acid', '100g', 'Eucalyptus'),
('Vanilla Sweet Bath Bomb', 'Sweet vanilla bath bomb for comfort', 170.00, 'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=600&fit=crop', 35, true, 'bath bomb', 'Vanilla oil, Baking soda, Citric acid', '100g', 'Vanilla');

-- Bath Gel 카테고리 제품들 (4개)
INSERT INTO products (name, description, price, image_url, stock_quantity, is_active, category, ingredients, weight, scent) VALUES
('Lavender Dreams Bath Gel', 'Gentle lavender bath gel for daily use', 120.00, 'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=600&fit=crop', 60, true, 'bath gel', 'Lavender extract, Glycerin, Natural surfactants', '250ml', 'Lavender'),
('Rose Romance Bath Gel', 'Luxurious rose bath gel for pampering', 130.00, 'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=600&fit=crop', 45, true, 'bath gel', 'Rose extract, Glycerin, Natural surfactants', '250ml', 'Rose'),
('Eucalyptus Fresh Bath Gel', 'Invigorating eucalyptus bath gel for morning', 125.00, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&fit=crop', 55, true, 'bath gel', 'Eucalyptus extract, Glycerin, Natural surfactants', '250ml', 'Eucalyptus'),
('Vanilla Sweet Bath Gel', 'Creamy vanilla bath gel for soft skin', 135.00, 'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=600&fit=crop', 50, true, 'bath gel', 'Vanilla extract, Glycerin, Natural surfactants', '250ml', 'Vanilla');

-- 결과 확인
SELECT category, COUNT(*) as count FROM products WHERE category ILIKE '%bath%' GROUP BY category;


