// 관리자 서비스 - 실제 Supabase 연동
import { supabase, hasSupabaseCredentials } from './supabase';

export interface SiteSettings {
  [key: string]: string;
}

export interface LogoSettingsPayload {
  logo_url?: string | null;
  site_title?: string | null;
  logo_width?: number | null;
  logo_height?: number | null;
  logo_alt_text?: string | null;
  logo_enabled?: boolean | null;
  logo_style?: 'rounded' | 'square' | 'circle' | null;
  brand_color?: string | null;
  brand_sub_color?: string | null;
}

export interface LogoSettingsResponse {
  [key: string]: {
    value: string | null;
    type: string | null;
    description: string | null;
  };
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

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  imageUrl: string;
  iconName?: string; // 아이콘 이름 (lucide-react 아이콘명)
  iconColor?: string; // 아이콘 색상
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
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

const SITE_SETTINGS_STORAGE_KEY = 'daddy_site_settings';
const PRODUCTS_STORAGE_KEY = 'daddy_products';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'sample-1',
    name: 'SUPER RED FIZZ',
    description: 'POW! Cherry explosion with super bubbles and strawberry fun power!',
    short_description: 'Cherry explosion with fizz and fun.',
    long_description: 'Cherry explosion with fizz and fun.',
    price: 390,
    original_price: 450,
    image_url: 'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop',
    category: 'Hero Series',
    sku: 'HERO-RED-001',
    stock_quantity: 25,
    is_featured: true,
    is_active: true,
    color: '#FF2D55',
    scent: 'Cherry',
    weight: '150g',
    ingredients: 'Sodium Bicarbonate, Citric Acid, Essential Oils',
    rating: 4.8,
    review_count: 42,
    colors: ['#FF2D55'],
    tags: ['hero', 'fizzy'],
    benefits: ['Relaxing', 'Colorful'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    name: 'HERO BLUE BLAST',
    description: 'BOOM! Ocean breeze with cooling mint and superhero strength bubbles!',
    short_description: 'Ocean breeze with mint.',
    long_description: 'Ocean breeze with mint and superhero bubbles.',
    price: 420,
    original_price: 480,
    image_url: 'https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&sig=blue',
    category: 'Hero Series',
    sku: 'HERO-BLUE-001',
    stock_quantity: 18,
    is_featured: true,
    is_active: true,
    color: '#007AFF',
    scent: 'Ocean Breeze',
    weight: '150g',
    ingredients: 'Sodium Bicarbonate, Citric Acid, Essential Oils',
    rating: 4.7,
    review_count: 37,
    colors: ['#007AFF'],
    tags: ['hero', 'cooling'],
    benefits: ['Refreshing', 'Cooling'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const isBrowser = typeof window !== 'undefined';

function readLocalStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to read localStorage key:', key, error);
    return fallback;
  }
}

function writeLocalStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to write localStorage key:', key, error);
  }
}

export class AdminService {
  // 사이트 설정 관리
  static async getSiteSettings(): Promise<SiteSettings> {
    if (hasSupabaseCredentials) {
      try {
        const settings: SiteSettings = {};

        // 1) 기존 site_settings 테이블 데이터 로드 (히어로 문구 등 다른 콘텐츠 포함)
        try {
          const { data, error } = await supabase
            .from('site_settings')
            .select('setting_key, setting_value')
            .eq('is_public', true);

          if (error) throw error;

          data?.forEach((item) => {
            settings[item.setting_key] = item.setting_value;
          });
        } catch (error) {
          console.warn('site_settings 로드 실패:', error);
        }

        // 2) 개선된 branding_settings 뷰에서 로고/문구 데이터 가져오기 (우선 적용)
        try {
          const { data: brandingData, error: brandingError } = await supabase.rpc('get_current_branding');

          if (brandingError) throw brandingError;

          if (brandingData && brandingData.length > 0) {
            const branding = brandingData[0];
            const brandingMap: SiteSettings = {
              logo_url: branding.logo_url ?? '',
              logo_mobile_url: branding.logo_mobile_url ?? '',
              logo_favicon_url: branding.logo_favicon_url ?? '',
              site_title: branding.site_title ?? 'Daddy Bath Bomb',
              site_title_en: branding.site_title_en ?? '',
              site_description: branding.site_description ?? '',
              site_tagline: branding.site_tagline ?? '',
              logo_alt_text: branding.logo_alt_text ?? '',
              logo_alt_text_en: branding.logo_alt_text_en ?? '',
              logo_width: branding.logo_width != null ? String(branding.logo_width) : '',
              logo_height: branding.logo_height != null ? String(branding.logo_height) : '',
              logo_style: branding.logo_style ?? '',
              logo_enabled: branding.logo_enabled != null ? String(branding.logo_enabled) : '',
              brand_primary_color: branding.brand_primary_color ?? '',
              brand_secondary_color: branding.brand_secondary_color ?? '',
              brand_accent_color: branding.brand_accent_color ?? '',
              primary_color: branding.brand_primary_color ?? '',
              secondary_color: branding.brand_secondary_color ?? '',
              accent_color: branding.brand_accent_color ?? '',
              logo_cache_version: branding.logo_cache_version != null ? String(branding.logo_cache_version) : '',
              branding_updated_at: branding.updated_at ?? ''
            };

            Object.entries(brandingMap).forEach(([key, val]) => {
              if (val !== undefined && val !== null && val !== '') {
                settings[key] = val;
              }
            });
          }
        } catch (error) {
          console.warn('branding_settings 로드 실패:', error);
        }

        // 캐시 저장
        writeLocalStorage(SITE_SETTINGS_STORAGE_KEY, settings);
        return settings;
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    }

    return readLocalStorage<SiteSettings>(SITE_SETTINGS_STORAGE_KEY, {});
  }

  static async updateSiteSetting(key: string, value: string, type: string = 'text'): Promise<boolean> {
    if (hasSupabaseCredentials) {
      try {
        // 개선된 브랜딩 스키마와 동기화
        const brandingParams: Record<string, any> = {
          p_site_title: null,
          p_site_title_en: null,
          p_site_description: null,
          p_site_tagline: null,
          p_logo_url: null,
          p_logo_mobile_url: null,
          p_logo_favicon_url: null,
          p_logo_alt_text: null,
          p_logo_alt_text_en: null,
          p_logo_width: null,
          p_logo_height: null,
          p_logo_style: null,
          p_logo_enabled: null,
          p_brand_primary_color: null,
          p_brand_secondary_color: null,
          p_brand_accent_color: null,
        };

        const brandingKeyMap: Record<string, keyof typeof brandingParams> = {
          site_title: 'p_site_title',
          site_title_en: 'p_site_title_en',
          site_description: 'p_site_description',
          site_tagline: 'p_site_tagline',
          logo_url: 'p_logo_url',
          logo_mobile_url: 'p_logo_mobile_url',
          logo_favicon_url: 'p_logo_favicon_url',
          logo_alt_text: 'p_logo_alt_text',
          logo_alt_text_en: 'p_logo_alt_text_en',
          logo_width: 'p_logo_width',
          logo_height: 'p_logo_height',
          logo_style: 'p_logo_style',
          logo_enabled: 'p_logo_enabled',
          brand_primary_color: 'p_brand_primary_color',
          brand_secondary_color: 'p_brand_secondary_color',
          brand_accent_color: 'p_brand_accent_color',
          primary_color: 'p_brand_primary_color',
          secondary_color: 'p_brand_secondary_color',
          accent_color: 'p_brand_accent_color',
        };

        const numericKeys = new Set(['logo_width', 'logo_height']);
        const booleanKeys = new Set(['logo_enabled']);

        const brandingParamKey = brandingKeyMap[key];
        if (brandingParamKey) {
          let parsedValue: any = value;

          if (numericKeys.has(key)) {
            const numericValue = Number.parseInt(value, 10);
            parsedValue = Number.isNaN(numericValue) ? null : numericValue;
          } else if (booleanKeys.has(key)) {
            parsedValue = value === 'true' || value === '1' || value === 'on';
          }

          brandingParams[brandingParamKey] = parsedValue;

          try {
            const { error: brandingError } = await supabase.rpc('update_branding_settings', brandingParams);
            if (brandingError) throw brandingError;
          } catch (brandingError) {
            console.error('Branding settings 업데이트 실패:', brandingError);
          }
        }

        const { error } = await supabase
          .from('site_settings')
          .upsert({
            setting_key: key,
            setting_value: value,
            setting_type: type,
            category: 'content',
            is_public: true,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating site setting:', error);
        return false;
      }
    }

    const current = readLocalStorage<SiteSettings>(SITE_SETTINGS_STORAGE_KEY, {});
    current[key] = value;
    writeLocalStorage(SITE_SETTINGS_STORAGE_KEY, current);
    return true;
  }

  static async getLogoSettings(): Promise<LogoSettingsResponse | null> {
    try {
      const { data, error } = await supabase.rpc('get_logo_settings');
      if (error) throw error;
      return data as LogoSettingsResponse;
    } catch (error) {
      console.error('Error fetching logo settings:', error);
      return null;
    }
  }

  static async updateLogoSettings(payload: LogoSettingsPayload): Promise<LogoSettingsResponse | null> {
    try {
      const { data, error } = await supabase.rpc('update_logo_settings', {
        p_logo_url: payload.logo_url ?? null,
        p_site_title: payload.site_title ?? null,
        p_logo_width: payload.logo_width ?? null,
        p_logo_height: payload.logo_height ?? null,
        p_logo_alt_text: payload.logo_alt_text ?? null,
        p_logo_enabled: payload.logo_enabled ?? null,
        p_logo_style: payload.logo_style ?? null,
        p_brand_color: payload.brand_color ?? null,
        p_brand_sub_color: payload.brand_sub_color ?? null
      });

      if (error) throw error;
      return data as LogoSettingsResponse;
    } catch (error) {
      console.error('Error updating logo settings:', error);
      throw error;
    }
  }

  // 제품 관리
  static async getProducts(): Promise<Product[]> {
    if (hasSupabaseCredentials) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        const products = (data || []) as Product[];
        writeLocalStorage(PRODUCTS_STORAGE_KEY, products);
        return products;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    return readLocalStorage<Product[]>(PRODUCTS_STORAGE_KEY, DEFAULT_PRODUCTS);
  }

  static async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const payload = {
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Product;

    if (hasSupabaseCredentials) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(product)
          .select()
          .single();

        if (error) throw error;

        const createdProduct = data as Product;
        const stored = readLocalStorage<Product[]>(PRODUCTS_STORAGE_KEY, DEFAULT_PRODUCTS);
        writeLocalStorage(PRODUCTS_STORAGE_KEY, [createdProduct, ...stored]);
        return createdProduct;
      } catch (error) {
        console.error('Error creating product:', error);
      }
    }

    const stored = readLocalStorage<Product[]>(PRODUCTS_STORAGE_KEY, DEFAULT_PRODUCTS);
    const newProduct: Product = {
      ...payload,
      id: `local-${Date.now()}`,
    };
    writeLocalStorage(PRODUCTS_STORAGE_KEY, [newProduct, ...stored]);
    return newProduct;
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    const timestamped = { ...updates, updated_at: new Date().toISOString() };

    if (hasSupabaseCredentials) {
      try {
        const { error } = await supabase
          .from('products')
          .update(timestamped)
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating product:', error);
        return false;
      }
    }

    const stored = readLocalStorage<Product[]>(PRODUCTS_STORAGE_KEY, DEFAULT_PRODUCTS);
    const updated = stored.map((product) =>
      product.id === id ? { ...product, ...timestamped } : product,
    );
    writeLocalStorage(PRODUCTS_STORAGE_KEY, updated);
    return true;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    if (hasSupabaseCredentials) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting product:', error);
        return false;
      }
    }

    const stored = readLocalStorage<Product[]>(PRODUCTS_STORAGE_KEY, DEFAULT_PRODUCTS);
    const filtered = stored.filter((product) => product.id !== id);
    writeLocalStorage(PRODUCTS_STORAGE_KEY, filtered);
    return true;
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
            product_id,
            quantity,
            unit_price,
            total_price,
            products (
              name,
              image_url
            )
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

  // Hero 배너 관련 메서드들
  static async getHeroBanners(): Promise<HeroBanner[]> {
    try {
      if (!hasSupabaseCredentials()) {
        // Supabase 설정이 없는 경우 기본 데이터 반환
        return this.getDefaultHeroBanners();
      }

      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return this.getDefaultHeroBanners();
      }

      return data.map(banner => ({
        id: banner.id,
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        description: banner.description || '',
        tagline: banner.tagline || '',
        primaryButtonText: banner.primary_button_text || '',
        secondaryButtonText: banner.secondary_button_text || '',
        imageUrl: banner.image_url || '',
        iconName: banner.icon_name || '',
        iconColor: banner.icon_color || '#FF2D55',
        isActive: banner.is_active || false,
        displayOrder: banner.display_order || 1,
        createdAt: banner.created_at || '',
        updatedAt: banner.updated_at || ''
      }));
    } catch (error) {
      console.error('Error fetching hero banners:', error);
      return this.getDefaultHeroBanners();
    }
  }

  static getDefaultHeroBanners(): HeroBanner[] {
    return [
      {
        id: "banner-1",
        title: "DADDY",
        subtitle: "BATH BOMB",
        description: "ฮีโร่อ่างอาบน้ำ",
        tagline: "สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ",
        primaryButtonText: "ช้อปบาธบอม",
        secondaryButtonText: "ดูเรื่องราวสีสัน",
        imageUrl: "",
        iconName: "Heart",
        iconColor: "#FF2D55",
        isActive: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-2",
        title: "FUN",
        subtitle: "BATH TIME",
        description: "Make every bath an adventure!",
        tagline: "Fun & Fizzy Adventures",
        primaryButtonText: "Shop Now",
        secondaryButtonText: "Learn More",
        imageUrl: "",
        iconName: "Zap",
        iconColor: "#007AFF",
        isActive: true,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-3",
        title: "COLORS",
        subtitle: "GALORE",
        description: "Rainbow of fun awaits you!",
        tagline: "Colorful Bath Experience",
        primaryButtonText: "Explore",
        secondaryButtonText: "Gallery",
        imageUrl: "",
        iconName: "Palette",
        iconColor: "#00FF88",
        isActive: true,
        displayOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-4",
        title: "SPARKLE",
        subtitle: "MAGIC",
        description: "Add sparkle to your day!",
        tagline: "Magical Bath Moments",
        primaryButtonText: "Discover",
        secondaryButtonText: "Stories",
        imageUrl: "",
        iconName: "Sparkles",
        iconColor: "#FFD700",
        isActive: true,
        displayOrder: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-5",
        title: "RELAX",
        subtitle: "REVIVE",
        description: "Perfect relaxation time!",
        tagline: "Relaxing Bath Therapy",
        primaryButtonText: "Shop",
        secondaryButtonText: "About",
        imageUrl: "",
        iconName: "Wind",
        iconColor: "#AF52DE",
        isActive: true,
        displayOrder: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-6",
        title: "FAMILY",
        subtitle: "FUN",
        description: "Fun for the whole family!",
        tagline: "Family Bath Time",
        primaryButtonText: "Products",
        secondaryButtonText: "Contact",
        imageUrl: "",
        iconName: "Users",
        iconColor: "#FF9F1C",
        isActive: true,
        displayOrder: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  static async createHeroBanner(bannerData: Omit<HeroBanner, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeroBanner | null> {
    try {
      if (!hasSupabaseCredentials()) {
        console.warn('Supabase not configured - using local storage');
        const newBanner: HeroBanner = {
          ...bannerData,
          id: `banner-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return newBanner;
      }

      const { data, error } = await supabase
        .from('hero_banners')
        .insert({
          title: bannerData.title,
          subtitle: bannerData.subtitle,
          description: bannerData.description,
          tagline: bannerData.tagline,
          primary_button_text: bannerData.primaryButtonText,
          secondary_button_text: bannerData.secondaryButtonText,
          image_url: bannerData.imageUrl,
          icon_name: bannerData.iconName,
          icon_color: bannerData.iconColor,
          is_active: bannerData.isActive,
          display_order: bannerData.displayOrder,
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        tagline: data.tagline,
        primaryButtonText: data.primary_button_text,
        secondaryButtonText: data.secondary_button_text,
        imageUrl: data.image_url,
        iconName: data.icon_name,
        iconColor: data.icon_color,
        isActive: data.is_active,
        displayOrder: data.display_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating hero banner:', error);
      return null;
    }
  }

  static async updateHeroBanner(id: string, bannerData: Partial<HeroBanner>): Promise<boolean> {
    try {
      if (!hasSupabaseCredentials()) {
        console.warn('Supabase not configured - using local storage');
        return true;
      }

      const updateData: any = {};
      if (bannerData.title !== undefined) updateData.title = bannerData.title;
      if (bannerData.subtitle !== undefined) updateData.subtitle = bannerData.subtitle;
      if (bannerData.description !== undefined) updateData.description = bannerData.description;
      if (bannerData.tagline !== undefined) updateData.tagline = bannerData.tagline;
      if (bannerData.primaryButtonText !== undefined) updateData.primary_button_text = bannerData.primaryButtonText;
      if (bannerData.secondaryButtonText !== undefined) updateData.secondary_button_text = bannerData.secondaryButtonText;
      if (bannerData.imageUrl !== undefined) updateData.image_url = bannerData.imageUrl;
      if (bannerData.iconName !== undefined) updateData.icon_name = bannerData.iconName;
      if (bannerData.iconColor !== undefined) updateData.icon_color = bannerData.iconColor;
      if (bannerData.isActive !== undefined) updateData.is_active = bannerData.isActive;
      if (bannerData.displayOrder !== undefined) updateData.display_order = bannerData.displayOrder;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('hero_banners')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating hero banner:', error);
      return false;
    }
  }

  static async deleteHeroBanner(id: string): Promise<boolean> {
    try {
      if (!hasSupabaseCredentials()) {
        console.warn('Supabase not configured - using local storage');
        return true;
      }

      const { error } = await supabase
        .from('hero_banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting hero banner:', error);
      return false;
    }
  }
}
