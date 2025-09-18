// 제품 데이터 API - 실제 Supabase 연동
import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  description: string;
  short_description?: string;
  long_description?: string;
  category: string;
  sku?: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  color: string;
  scent?: string;
  weight?: string;
  ingredients?: string;
  rating: number;
  review_count: number;
  gallery?: string[];
  colors?: string[];
  tags?: string[];
  benefits?: string[];
  created_at?: string;
  updated_at?: string;
}

export class ProductAPI {
  // 모든 제품 조회 (갤러리 이미지 포함)
  static async getAllProducts(): Promise<Product[]> {
    try {
      // 제품 기본 정보 조회
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      if (!products || products.length === 0) {
        return this.getMockProducts();
      }

      // 각 제품의 갤러리 이미지 조회
      const productsWithGallery = await Promise.all(
        products.map(async (product) => {
          const { data: images } = await supabase
            .from('product_images')
            .select('image_url, alt_text, display_order')
            .eq('product_id', product.id)
            .order('display_order', { ascending: true });

          return {
            ...product,
            gallery: images?.map(img => img.image_url) || [product.image_url],
          };
        })
      );

      return productsWithGallery;
    } catch (error) {
      console.error('Error fetching products:', error);
      return this.getMockProducts();
    }
  }

  // 카테고리별 제품 조회
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 갤러리 이미지 추가
      const productsWithGallery = await Promise.all(
        (products || []).map(async (product) => {
          const { data: images } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', product.id)
            .order('display_order', { ascending: true });

          return {
            ...product,
            gallery: images?.map(img => img.image_url) || [product.image_url],
          };
        })
      );

      return productsWithGallery;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // 특정 제품 상세 조회
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // 갤러리 이미지 조회
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url, alt_text')
        .eq('product_id', id)
        .order('display_order', { ascending: true });

      return {
        ...product,
        gallery: images?.map(img => img.image_url) || [product.image_url],
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Mock 데이터 (Supabase 연결 실패 시 대체용)
  private static getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Super Hero Fizz Bomb',
        price: 15.99,
        original_price: 19.99,
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        description: '슈퍼 히어로가 된 기분을 느낄 수 있는 특별한 바스 밤',
        short_description: '파워풀한 거품과 상쾌한 향',
        category: 'Super Heroes',
        stock_quantity: 25,
        is_featured: true,
        is_active: true,
        color: '#FF6B6B',
        scent: 'Fresh Citrus',
        weight: '150g',
        rating: 4.8,
        review_count: 124,
        gallery: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
        ],
        colors: ['#FF6B6B', '#4ECDC4'],
        tags: ['superhero', 'citrus', 'energizing'],
        benefits: ['피부 진정', '활력 충전', '스트레스 해소']
      },
      {
        id: '2',
        name: 'Mystic Ocean Bubble',
        price: 18.50,
        image_url: 'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400&h=400&fit=crop',
        description: '신비로운 바다의 향이 가득한 릴렉싱 바스 밤',
        short_description: '바다향과 미네랄 성분',
        category: 'Ocean Dreams',
        stock_quantity: 30,
        is_featured: true,
        is_active: true,
        color: '#4ECDC4',
        scent: 'Ocean Breeze',
        weight: '140g',
        rating: 4.7,
        review_count: 89,
        gallery: [
          'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400&h=400&fit=crop'
        ],
        colors: ['#4ECDC4', '#45B7D1'],
        tags: ['ocean', 'relaxing', 'mineral'],
        benefits: ['깊은 보습', '마음의 평화', '피부 재생']
      }
    ];
  }

  // 제품 검색
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}

