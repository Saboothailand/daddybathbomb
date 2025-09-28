// 관리자 서비스 - 실제 Supabase 연동
import { supabase, hasSupabaseCredentials } from './supabase';

export interface SiteSettings {
  [key: string]: string;
}

export interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  robotsTxt: string;
  sitemapUrl: string;
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


export interface HeroBanner {
  id: string;
  mainTitle: string;        // 대제목 (예: "DADDY")
  subTitle: string;         // 중제목 (예: "BATH BOMB")
  description: string;      // 세부내용 (예: "ฮีโร่อ่างอาบน้ำ")
  tagline: string;          // 태그라인 (예: "สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ")
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
const HERO_BANNERS_STORAGE_KEY = 'daddy_hero_banners';

// 샘플 제품 데이터
const sampleProducts = [
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
  private static loadHeroBannersFromStorage(): HeroBanner[] {
    const stored = readLocalStorage<HeroBanner[]>(HERO_BANNERS_STORAGE_KEY, []);
    if (!stored || stored.length === 0) {
      const defaults = this.getDefaultHeroBanners();
      writeLocalStorage(HERO_BANNERS_STORAGE_KEY, defaults);
      return [...defaults];
    }
    return stored;
  }

  private static saveHeroBannersToStorage(banners: HeroBanner[]): void {
    writeLocalStorage(HERO_BANNERS_STORAGE_KEY, banners);
  }

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


  // 배너 관리
  static async getBanners(): Promise<Banner[]> {
    try {
      const { data, error } = await supabase
        .from('banners')
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
        .from('banners')
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
        .from('banners')
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
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting banner:', error);
      return false;
    }
  }



  // 대시보드 통계
  static async getDashboardStats(): Promise<any> {
    try {
      const [bannersResult, heroBannersResult, galleryResult, featuresResult] = await Promise.all([
        supabase.from('banners').select('id', { count: 'exact' }),
        supabase.from('hero_banners').select('id', { count: 'exact' }),
        supabase.from('gallery').select('id', { count: 'exact' }),
        supabase.from('features').select('id', { count: 'exact' })
      ]);

      return {
        totalBanners: bannersResult.count || 0,
        totalHeroBanners: heroBannersResult.count || 0,
        totalGalleryImages: galleryResult.count || 0,
        totalFeatures: featuresResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalBanners: 0,
        totalHeroBanners: 0,
        totalGalleryImages: 0,
        totalFeatures: 0
      };
    }
  }

  // Hero 배너 관련 메서드들
  static async getHeroBanners(): Promise<HeroBanner[]> {
    try {
      if (!hasSupabaseCredentials) {
        console.log('📋 Supabase 설정 없음 - 로컬 스토리지 사용');
        const storedBanners = this.loadHeroBannersFromStorage();
        const activeBanners = storedBanners.filter((banner) => banner.isActive);
        return activeBanners.length > 0 ? activeBanners : storedBanners;
      }

      console.log('🔄 Supabase에서 배너 데이터 로드 중...');
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Supabase 배너 조회 오류:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('📋 Supabase에 활성 배너 없음 - 기본 데이터 사용');
        return this.getDefaultHeroBanners();
      }

      console.log('✅ Supabase 배너 데이터 로드 성공:', data.length, '개');
      const defaults = this.getDefaultHeroBanners();
      const sanitizeText = (value?: string | null, fallbackValue = ''): string => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return value.trim();
        }
        return fallbackValue;
      };

      const normalizeIconName = (iconName?: string | null, fallbackIcon?: string): string => {
        if (typeof iconName !== 'string') {
          return fallbackIcon || '';
        }

        const trimmed = iconName.trim();
        if (!trimmed) {
          return fallbackIcon || '';
        }

        // lucide-react 아이콘은 PascalCase 이므로 서버에서 소문자로 넘어와도 보정
        const normalized = trimmed
          .split(/[-_\s]+/)
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join('');

        return normalized || fallbackIcon || '';
      };

      const defaultsByOrder = new Map<number, HeroBanner>();
      defaults.forEach((banner) => {
        defaultsByOrder.set(banner.displayOrder, banner);
      });

      const remoteBanners = (data || [])
        .filter((banner) => banner?.is_active ?? true)
        .map((banner, index) => {
          const displayOrder = banner.display_order ?? defaults[index % defaults.length].displayOrder;
          const fallback = defaultsByOrder.get(displayOrder) ?? defaults[index % defaults.length];

          const normalizedBanner: HeroBanner = {
            id: banner.id ?? fallback.id,
            mainTitle: sanitizeText(banner.main_title || banner.title, fallback.mainTitle),
            subTitle: sanitizeText(banner.sub_title || banner.subtitle, fallback.subTitle),
            description: sanitizeText(banner.description, fallback.description),
            tagline: sanitizeText(banner.tagline, fallback.tagline),
            primaryButtonText: sanitizeText(banner.primary_button_text, fallback.primaryButtonText),
            secondaryButtonText: sanitizeText(banner.secondary_button_text, fallback.secondaryButtonText),
            imageUrl: sanitizeText(banner.image_url, fallback.imageUrl),
            iconName: normalizeIconName(banner.icon_name, fallback.iconName),
            iconColor: sanitizeText(banner.icon_color, fallback.iconColor),
            isActive: true,
            displayOrder,
            createdAt: banner.created_at || fallback.createdAt,
            updatedAt: banner.updated_at || fallback.updatedAt,
          };

          return normalizedBanner;
        });

      const mergedByOrder = new Map<number, HeroBanner>();
      defaults.forEach((banner) => mergedByOrder.set(banner.displayOrder, banner));
      remoteBanners.forEach((banner) => {
        if (banner.imageUrl) {
          mergedByOrder.set(banner.displayOrder, banner);
        }
      });

      const MINIMUM_BANNERS = 5;
      const merged = Array.from(mergedByOrder.values())
        .filter((banner) => banner.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      if (merged.length < MINIMUM_BANNERS) {
        for (const fallback of defaults) {
          if (merged.length >= MINIMUM_BANNERS) break;
          const exists = merged.some((banner) => banner.displayOrder === fallback.displayOrder);
          if (!exists) {
            merged.push(fallback);
          }
        }
      }

      return merged;
    } catch (error) {
      console.error('Error fetching hero banners:', error);
      console.log('📋 오류 발생 - 기본 배너 데이터 사용');
      return this.getDefaultHeroBanners();
    }
  }

  static getDefaultHeroBanners(): HeroBanner[] {
    return [
      {
        id: "banner-1",
        mainTitle: "DADDY",
        subTitle: "BATH BOMB",
        description: "ฮีโร่อ่างอาบน้ำ",
        tagline: "สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ",
        primaryButtonText: "ช้อปบาธบอม",
        secondaryButtonText: "ดูเรื่องราวสีสัน",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Heart",
        iconColor: "#FF2D55",
        isActive: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-2",
        mainTitle: "SUPER",
        subTitle: "RELAXATION",
        description: "Premium spa experience at home",
        tagline: "Luxury Bath Time Awaits",
        primaryButtonText: "Shop Now",
        secondaryButtonText: "Learn More",
        imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Zap",
        iconColor: "#007AFF",
        isActive: true,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-3",
        mainTitle: "RAINBOW",
        subTitle: "MAGIC",
        description: "Colorful fizzing adventure",
        tagline: "Every Color, Every Mood",
        primaryButtonText: "Explore",
        secondaryButtonText: "Gallery",
        imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Palette",
        iconColor: "#00FF88",
        isActive: true,
        displayOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-4",
        mainTitle: "SPARKLE",
        subTitle: "EVERYWHERE",
        description: "Glittering moments of joy",
        tagline: "Shine Bright Like a Star",
        primaryButtonText: "Discover",
        secondaryButtonText: "Stories",
        imageUrl: "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Sparkles",
        iconColor: "#FFD700",
        isActive: true,
        displayOrder: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-5",
        mainTitle: "PEACE",
        subTitle: "MOMENTS",
        description: "Tranquil escape from daily stress",
        tagline: "Find Your Inner Calm",
        primaryButtonText: "Shop",
        secondaryButtonText: "About",
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Wind",
        iconColor: "#AF52DE",
        isActive: true,
        displayOrder: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-6",
        mainTitle: "FAMILY",
        subTitle: "BONDING",
        description: "Create memories together",
        tagline: "Quality Time, Quality Fun",
        primaryButtonText: "Gallery",
        secondaryButtonText: "Contact",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Users",
        iconColor: "#FF9F1C",
        isActive: true,
        displayOrder: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-7",
        mainTitle: "GALAXY",
        subTitle: "DREAM",
        description: "Immerse yourself in cosmic colors",
        tagline: "A Universe in Your Tub",
        primaryButtonText: "Explore Galaxy",
        secondaryButtonText: "View Collection",
        imageUrl: "https://images.unsplash.com/photo-1504370805625-d932428e0c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Star",
        iconColor: "#BF5AF2",
        isActive: true,
        displayOrder: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-8",
        mainTitle: "TROPICAL",
        subTitle: "ESCAPE",
        description: "Bring the island vibes to your bath",
        tagline: "Your Personal Paradise",
        primaryButtonText: "Shop Tropical",
        secondaryButtonText: "Summer Scents",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Wind",
        iconColor: "#34C759",
        isActive: true,
        displayOrder: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-9",
        mainTitle: "SWEET",
        subTitle: "TREAT",
        description: "Indulge in delightful dessert aromas",
        tagline: "Guilt-Free Sweetness",
        primaryButtonText: "Discover Sweets",
        secondaryButtonText: "Gift Sets",
        imageUrl: "https://images.unsplash.com/photo-1558324401-211621121121?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Heart",
        iconColor: "#FF9F0A",
        isActive: true,
        displayOrder: 9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-10",
        mainTitle: "FOREST",
        subTitle: "ADVENTURE",
        description: "Experience the calming scent of nature",
        tagline: "Into the Wild Bath",
        primaryButtonText: "Explore Forest",
        secondaryButtonText: "Eco-Friendly",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Palette",
        iconColor: "#6A8D73",
        isActive: true,
        displayOrder: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-11",
        mainTitle: "OCEAN",
        subTitle: "BREEZE",
        description: "Feel the refreshing touch of the sea",
        tagline: "A Wave of Freshness",
        primaryButtonText: "Dive In",
        secondaryButtonText: "Marine Collection",
        imageUrl: "https://images.unsplash.com/photo-1509479129703-dd775961648a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Zap",
        iconColor: "#007AFF",
        isActive: true,
        displayOrder: 11,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "banner-12",
        mainTitle: "PARTY",
        subTitle: "TIME",
        description: "Turn your bath into a celebration",
        tagline: "Fizz, Fun & Festivities",
        primaryButtonText: "Start the Party",
        secondaryButtonText: "Party Packs",
        imageUrl: "https://images.unsplash.com/photo-1514525253164-ff4ae05c1906?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1200&fit=crop",
        iconName: "Sparkles",
        iconColor: "#FF2D55",
        isActive: true,
        displayOrder: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  static async createHeroBanner(bannerData: Omit<HeroBanner, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeroBanner | null> {
    try {
      if (!hasSupabaseCredentials) {
        console.warn('📋 Supabase not configured - using local storage');
        const newBanner: HeroBanner = {
          ...bannerData,
          id: `banner-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const existingBanners = this.loadHeroBannersFromStorage();
        const filteredBanners = existingBanners.filter((banner) => banner.id !== newBanner.id);
        const updatedBanners = [...filteredBanners, newBanner].sort((a, b) => a.displayOrder - b.displayOrder);
        this.saveHeroBannersToStorage(updatedBanners);
        
        return newBanner;
      }

      const { data, error } = await supabase
        .from('hero_banners')
        .insert({
          main_title: bannerData.mainTitle,
          sub_title: bannerData.subTitle,
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
        mainTitle: data.main_title || data.title || '',
        subTitle: data.sub_title || data.subtitle || '',
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
      if (!hasSupabaseCredentials) {
        console.warn('📋 Supabase not configured - using local storage');
        
        // 로컬 스토리지에서 배너 업데이트
        const existingBanners = this.getDefaultHeroBanners();
        const bannerIndex = existingBanners.findIndex(banner => banner.id === id);
        if (bannerIndex !== -1) {
          existingBanners[bannerIndex] = {
            ...existingBanners[bannerIndex],
            ...bannerData,
            updatedAt: new Date().toISOString(),
          };
          writeLocalStorage('daddy_hero_banners', existingBanners);
        }
        
        // 이벤트 발생
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('bannerUpdated'));
        }
        
        return true;
      }

      const updateData: any = {};
      if (bannerData.mainTitle !== undefined) updateData.main_title = bannerData.mainTitle;
      if (bannerData.subTitle !== undefined) updateData.sub_title = bannerData.subTitle;
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
      
      // 이벤트 발생
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bannerUpdated'));
      }
      
      return true;
    } catch (error) {
      console.error('Error updating hero banner:', error);
      return false;
    }
  }

  static async deleteHeroBanner(id: string): Promise<boolean> {
    try {
      if (!hasSupabaseCredentials) {
        console.warn('📋 Supabase not configured - using local storage');
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

  // SEO 설정 관리
  static async getSEOSettings(): Promise<SEOSettings> {
    const defaultSEOSettings: SEOSettings = {
      siteTitle: 'Daddy Bath Bomb - Premium Natural Bath Bombs',
      siteDescription: 'Experience the ultimate relaxation with our premium natural bath bombs. Safe for the whole family, made with 100% natural ingredients.',
      siteKeywords: 'bath bombs, natural, relaxation, spa, aromatherapy, family safe, premium',
      ogTitle: 'Daddy Bath Bomb - Premium Natural Bath Bombs',
      ogDescription: 'Experience the ultimate relaxation with our premium natural bath bombs. Safe for the whole family, made with 100% natural ingredients.',
      ogImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=630&fit=crop',
      twitterTitle: 'Daddy Bath Bomb - Premium Natural Bath Bombs',
      twitterDescription: 'Experience the ultimate relaxation with our premium natural bath bombs. Safe for the whole family, made with 100% natural ingredients.',
      twitterImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=630&fit=crop',
      canonicalUrl: 'https://daddybathbomb.com',
      robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://daddybathbomb.com/sitemap.xml',
      sitemapUrl: 'https://daddybathbomb.com/sitemap.xml'
    };

    if (hasSupabaseCredentials) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', [
            'seo_site_title',
            'seo_site_description',
            'seo_site_keywords',
            'seo_og_title',
            'seo_og_description',
            'seo_og_image',
            'seo_twitter_title',
            'seo_twitter_description',
            'seo_twitter_image',
            'seo_canonical_url',
            'seo_robots_txt',
            'seo_sitemap_url'
          ]);

        if (error) throw error;

        const settings: SEOSettings = { ...defaultSEOSettings };
        data?.forEach((item) => {
          switch (item.setting_key) {
            case 'seo_site_title':
              settings.siteTitle = item.setting_value || defaultSEOSettings.siteTitle;
              break;
            case 'seo_site_description':
              settings.siteDescription = item.setting_value || defaultSEOSettings.siteDescription;
              break;
            case 'seo_site_keywords':
              settings.siteKeywords = item.setting_value || defaultSEOSettings.siteKeywords;
              break;
            case 'seo_og_title':
              settings.ogTitle = item.setting_value || defaultSEOSettings.ogTitle;
              break;
            case 'seo_og_description':
              settings.ogDescription = item.setting_value || defaultSEOSettings.ogDescription;
              break;
            case 'seo_og_image':
              settings.ogImage = item.setting_value || defaultSEOSettings.ogImage;
              break;
            case 'seo_twitter_title':
              settings.twitterTitle = item.setting_value || defaultSEOSettings.twitterTitle;
              break;
            case 'seo_twitter_description':
              settings.twitterDescription = item.setting_value || defaultSEOSettings.twitterDescription;
              break;
            case 'seo_twitter_image':
              settings.twitterImage = item.setting_value || defaultSEOSettings.twitterImage;
              break;
            case 'seo_canonical_url':
              settings.canonicalUrl = item.setting_value || defaultSEOSettings.canonicalUrl;
              break;
            case 'seo_robots_txt':
              settings.robotsTxt = item.setting_value || defaultSEOSettings.robotsTxt;
              break;
            case 'seo_sitemap_url':
              settings.sitemapUrl = item.setting_value || defaultSEOSettings.sitemapUrl;
              break;
          }
        });

        return settings;
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
      }
    }

    return defaultSEOSettings;
  }

  static async updateSEOSettings(seoSettings: Partial<SEOSettings>): Promise<boolean> {
    if (hasSupabaseCredentials) {
      try {
        const settingsToUpdate = Object.entries(seoSettings).map(([key, value]) => {
          let settingKey = '';
          switch (key) {
            case 'siteTitle':
              settingKey = 'seo_site_title';
              break;
            case 'siteDescription':
              settingKey = 'seo_site_description';
              break;
            case 'siteKeywords':
              settingKey = 'seo_site_keywords';
              break;
            case 'ogTitle':
              settingKey = 'seo_og_title';
              break;
            case 'ogDescription':
              settingKey = 'seo_og_description';
              break;
            case 'ogImage':
              settingKey = 'seo_og_image';
              break;
            case 'twitterTitle':
              settingKey = 'seo_twitter_title';
              break;
            case 'twitterDescription':
              settingKey = 'seo_twitter_description';
              break;
            case 'twitterImage':
              settingKey = 'seo_twitter_image';
              break;
            case 'canonicalUrl':
              settingKey = 'seo_canonical_url';
              break;
            case 'robotsTxt':
              settingKey = 'seo_robots_txt';
              break;
            case 'sitemapUrl':
              settingKey = 'seo_sitemap_url';
              break;
            default:
              return null;
          }

          return {
            setting_key: settingKey,
            setting_value: value || '',
            setting_type: 'text',
            category: 'seo',
            is_public: true,
            updated_at: new Date().toISOString(),
          };
        }).filter(Boolean);

        if (settingsToUpdate.length > 0) {
          const { error } = await supabase
            .from('site_settings')
            .upsert(settingsToUpdate, { onConflict: 'setting_key' });

          if (error) throw error;
        }

        return true;
      } catch (error) {
        console.error('Error updating SEO settings:', error);
        return false;
      }
    }

    return true;
  }
}
