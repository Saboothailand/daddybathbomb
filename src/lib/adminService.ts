// 관리자 서비스 - 실제 Supabase 연동
import { supabase } from './supabase';

export interface SiteSettings {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  long_description?: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  sku?: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  color?: string;
  scent?: string;
  weight?: string;
  ingredients?: string;
  rating: number;
  review_count: number;
  colors?: string[];
  tags?: string[];
  benefits?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  position: 'hero' | 'middle' | 'bottom' | 'sidebar';
  display_order: number;
  is_active: boolean;
  link_url?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export class AdminService {
  // 사이트 설정 관리
  static async getSiteSettings(): Promise<SiteSettings> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .eq('is_public', true);

      if (error) throw error;

      const settings: SiteSettings = {};
      data?.forEach(item => {
        settings[item.setting_key] = item.setting_value;
      });

      return settings;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return {};
    }
  }

  static async updateSiteSetting(key: string, value: string, type: string = 'text'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          setting_type: type,
          category: 'content',
          is_public: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating site setting:', error);
      return false;
    }
  }

  // 제품 관리
  static async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  static async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // 배너 관리
  static async getBanners(): Promise<Banner[]> {
    try {
      const { data, error } = await supabase
        .from('banner_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      const sortOrder = ['hero', 'middle', 'bottom', 'sidebar'];
      const banners = data || [];
      return banners.sort((a, b) => {
        const indexA = sortOrder.indexOf(a.position ?? 'hero');
        const indexB = sortOrder.indexOf(b.position ?? 'hero');
        const positionDiff = (indexA === -1 ? sortOrder.length : indexA) - (indexB === -1 ? sortOrder.length : indexB);
        if (positionDiff !== 0) return positionDiff;
        return (a.display_order ?? 0) - (b.display_order ?? 0);
      });
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  }

  static async createBanner(banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Promise<Banner | null> {
    try {
      const { data, error } = await supabase
        .from('banner_images')
        .insert(banner)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating banner:', error);
      return null;
    }
  }

  static async updateBanner(id: string, updates: Partial<Banner>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('banner_images')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating banner:', error);
      return false;
    }
  }

  static async deleteBanner(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('banner_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting banner:', error);
      return false;
    }
  }

  // 주문 관리
  static async getOrders(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // 제품 이미지 관리
  static async getProductImages(productId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching product images:', error);
      return [];
    }
  }

  static async addProductImage(productId: string, imageUrl: string, altText: string = '', displayOrder: number = 0): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: imageUrl,
          alt_text: altText,
          display_order: displayOrder
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding product image:', error);
      return false;
    }
  }

  // 대시보드 통계
  static async getDashboardStats(): Promise<any> {
    try {
      const [productsResult, ordersResult, activeOrdersResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }).neq('status', 'delivered')
      ]);

      return {
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        activeOrders: activeOrdersResult.count || 0,
        totalRevenue: 0 // 실제로는 주문 총액 계산 필요
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalProducts: 0,
        totalOrders: 0,
        activeOrders: 0,
        totalRevenue: 0
      };
    }
  }
}
