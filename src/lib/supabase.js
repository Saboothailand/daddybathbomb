// Supabase 클라이언트 설정
import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정을 가져옵니다
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Using mock data.');
  console.warn('Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file');
}

// Supabase 클라이언트 초기화
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

// 환경 변수가 없을 때 사용할 모킹 클라이언트
function createMockSupabaseClient() {
  return {
    // Features 관련
    from: (table) => ({
      select: (columns = '*') => ({
        eq: (column, value) => Promise.resolve({ 
          data: getMockData(table, { [column]: value }), 
          error: null 
        }),
        order: (column, options) => Promise.resolve({ 
          data: getMockData(table), 
          error: null 
        }),
        data: getMockData(table),
        error: null
      }),
      insert: (data) => Promise.resolve({ 
        data: Array.isArray(data) ? data : [data], 
        error: null 
      }),
      update: (data) => ({
        eq: (column, value) => Promise.resolve({ 
          data: [{ ...data, id: value }], 
          error: null 
        })
      }),
      delete: () => ({
        eq: (column, value) => Promise.resolve({ 
          data: [], 
          error: null 
        })
      }),
      upsert: (data) => Promise.resolve({ 
        data: Array.isArray(data) ? data : [data], 
        error: null 
      })
    }),
    
    // Storage 관련
    storage: {
      from: (bucket) => ({
        upload: (path, file) => Promise.resolve({ 
          data: { path: `mock-storage/${path}` }, 
          error: null 
        }),
        getPublicUrl: (path) => ({
          data: { publicUrl: `https://mock-storage.example.com/${path}` }
        })
      })
    },

    // Auth 관련
    auth: {
      signUp: (credentials) => Promise.resolve({ 
        data: { user: { id: '1', email: credentials.email } }, 
        error: null 
      }),
      signInWithPassword: (credentials) => Promise.resolve({ 
        data: { user: { id: '1', email: credentials.email } }, 
        error: null 
      }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null })
    }
  };
}

// 모킹 데이터 제공 함수
function getMockData(table, filter = {}) {
  const mockData = {
    features: [
      {
        id: 1,
        title: 'Natural Ingredients',
        description: 'Made from 100% natural ingredients, safe for the whole family',
        image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=400&fit=crop',
        icon: '🌿',
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Beautiful Fizzy Colors',
        description: 'Beautiful colorful fizz with relaxing aromatherapy scents',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
        icon: '✨',
        is_active: true,
        display_order: 2,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Skin Nourishing',
        description: 'Moisturizes and nourishes skin for smooth, soft feeling after bath',
        image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=400&fit=crop',
        icon: '💧',
        is_active: true,
        display_order: 3,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Perfect Gift',
        description: 'Perfect gift for special people on any occasion',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&sig=gift',
        icon: '🎁',
        is_active: true,
        display_order: 4,
        created_at: new Date().toISOString()
      }
    ],
    gallery_images: [
      {
        id: 1,
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        caption: 'Relaxing bath time with our premium bath bombs',
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
        caption: 'Natural ingredients for healthy skin',
        is_active: true,
        display_order: 2,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
        caption: 'Luxury spa experience at home',
        is_active: true,
        display_order: 3,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&sig=2',
        caption: 'Beautiful fizzy colors and scents',
        is_active: true,
        display_order: 4,
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&sig=3',
        caption: 'Perfect for family relaxation time',
        is_active: true,
        display_order: 5,
        created_at: new Date().toISOString()
      },
      {
        id: 6,
        image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&sig=4',
        caption: 'Premium quality bath products',
        is_active: true,
        display_order: 6,
        created_at: new Date().toISOString()
      }
    ],
    hero_slides: [
      {
        id: 1,
        title: 'Premium Bath Bombs',
        subtitle: '100% Natural',
        description: 'Experience the ultimate bathing experience with natural bath bombs',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop',
        button_text: 'View Products',
        button_action: 'products',
        display_order: 1,
        is_active: true
      },
      {
        id: 2,
        title: 'Luxury Spa Experience',
        subtitle: 'Relax at Home',
        description: 'Transform your home into a luxury spa with aromatherapy scents',
        image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=800&fit=crop',
        button_text: 'About Us',
        button_action: 'about',
        display_order: 2,
        is_active: true
      },
      {
        id: 3,
        title: 'Perfect Gift for Loved Ones',
        subtitle: 'Special Gift',
        description: 'Give happiness and relaxation to your loved ones with Daddy Bath Bomb',
        image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=800&fit=crop',
        button_text: 'Contact Us',
        button_action: 'contact',
        display_order: 3,
        is_active: true
      }
    ],
    social_links: [
      {
        id: 1,
        platform: 'instagram',
        url: 'https://instagram.com/daddybathbomb',
        icon: '📸',
        is_active: true,
        display_order: 1
      },
      {
        id: 2,
        platform: 'facebook',
        url: 'https://facebook.com/daddybathbomb',
        icon: '📘',
        is_active: true,
        display_order: 2
      }
    ],
    app_settings: [
      { key: 'instagram_url', value: 'https://instagram.com/daddybathbomb' },
      { key: 'facebook_url', value: 'https://facebook.com/daddybathbomb' },
      { key: 'hero_slider_interval', value: '5000' }
    ],
    orders: [],
    products: [
      {
        id: 1,
        name: 'Romantic Rose Bath Bomb',
        price: 180,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
        is_active: true
      }
    ]
  };

  let data = mockData[table] || [];
  
  // 필터 적용
  if (Object.keys(filter).length > 0) {
    data = data.filter(item => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    });
  }
  
  return data;
}

// Features 테이블 관련 함수들
export const featuresService = {
  // 모든 활성 features 가져오기
  async getActiveFeatures() {
    try {
      // 실제 Supabase 연결 시도
      if (supabaseUrl && supabaseAnonKey) {
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
      } else {
        // 로컬 스토리지 사용
        const stored = localStorage.getItem('daddy_features');
        if (stored) {
          return JSON.parse(stored).filter(f => f.is_active);
        } else {
          // 초기 데이터 설정
          const initialFeatures = getMockData('features');
          localStorage.setItem('daddy_features', JSON.stringify(initialFeatures));
          return initialFeatures.filter(f => f.is_active);
        }
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      // 로컬 스토리지 폴백
      const stored = localStorage.getItem('daddy_features');
      if (stored) {
        return JSON.parse(stored).filter(f => f.is_active);
      }
      return getMockData('features').filter(f => f.is_active);
    }
  },

  // 새 feature 추가
  async createFeature(featureData) {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { data, error } = await supabase
          .from('features')
          .insert([featureData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // 로컬 스토리지 사용
        const stored = localStorage.getItem('daddy_features');
        const features = stored ? JSON.parse(stored) : getMockData('features');
        
        const newFeature = {
          ...featureData,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        features.push(newFeature);
        localStorage.setItem('daddy_features', JSON.stringify(features));
        return newFeature;
      }
    } catch (error) {
      console.error('Error creating feature:', error);
      throw error;
    }
  },

  // Feature 업데이트
  async updateFeature(id, updateData) {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { data, error } = await supabase
          .from('features')
          .update({...updateData, updated_at: new Date().toISOString()})
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // 로컬 스토리지 사용
        const stored = localStorage.getItem('daddy_features');
        const features = stored ? JSON.parse(stored) : getMockData('features');
        
        const index = features.findIndex(f => f.id == id);
        if (index !== -1) {
          features[index] = {
            ...features[index],
            ...updateData,
            updated_at: new Date().toISOString()
          };
          localStorage.setItem('daddy_features', JSON.stringify(features));
          return features[index];
        }
        throw new Error('Feature not found');
      }
    } catch (error) {
      console.error('Error updating feature:', error);
      throw error;
    }
  },

  // Feature 삭제
  async deleteFeature(id) {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { error } = await supabase
          .from('features')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } else {
        // 로컬 스토리지 사용
        const stored = localStorage.getItem('daddy_features');
        const features = stored ? JSON.parse(stored) : getMockData('features');
        
        const filteredFeatures = features.filter(f => f.id != id);
        localStorage.setItem('daddy_features', JSON.stringify(filteredFeatures));
        return true;
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      throw error;
    }
  }
};

// Gallery 테이블 관련 함수들
export const galleryService = {
  // 모든 활성 갤러리 이미지 가져오기
  async getActiveGalleryImages() {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      // 임시 샘플 데이터 반환
      return [
        {
          id: 1,
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
          caption: 'Relaxing bath time with our premium bath bombs',
          is_active: true
        },
        {
          id: 2,
          image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
          caption: 'Natural ingredients for healthy skin',
          is_active: true
        }
      ];
    }
  },

  // 새 갤러리 이미지 추가
  async createGalleryImage(imageData) {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([imageData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating gallery image:', error);
      throw error;
    }
  }
};

// Orders 테이블 관련 함수들
export const ordersService = {
  // 모든 주문 가져오기 (관리자용)
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (name, image)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // 새 주문 생성
  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // 주문 상태 업데이트
  async updateOrderStatus(orderId, status, adminNotes = '') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

// Settings 테이블 관련 함수들
export const settingsService = {
  // 설정 가져오기
  async getSettings() {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*');

        if (error) throw error;
        
        // 배열을 객체로 변환
        const settings = {};
        data?.forEach(setting => {
          settings[setting.key] = setting.value;
        });
        
        return settings;
      } else {
        // 로컬 스토리지 사용
        const stored = localStorage.getItem('daddy_settings');
        if (stored) {
          return JSON.parse(stored);
        } else {
          const defaultSettings = {
            instagram_url: 'https://instagram.com/daddybathbomb',
            facebook_url: 'https://facebook.com/daddybathbomb',
            hero_slider_interval: '5000'
          };
          localStorage.setItem('daddy_settings', JSON.stringify(defaultSettings));
          return defaultSettings;
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {
        instagram_url: 'https://instagram.com/daddybathbomb',
        facebook_url: 'https://facebook.com/daddybathbomb',
        hero_slider_interval: '5000'
      };
    }
  },

  // 설정 업데이트
  async updateSetting(key, value) {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { data, error } = await supabase
          .from('app_settings')
          .upsert([{ key, value }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // 로컬 스토리지 사용
        const stored = localStorage.getItem('daddy_settings');
        const settings = stored ? JSON.parse(stored) : {};
        settings[key] = value;
        localStorage.setItem('daddy_settings', JSON.stringify(settings));
        return { key, value };
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }
};

// 브랜딩 관련 함수들
export const brandingService = {
  // 브랜딩 설정 가져오기
  async getBrandingSettings() {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { data, error } = await supabase
          .from('branding_settings')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return data || this.getDefaultBranding();
      } else {
        // 로컬 스토리지 사용
        const stored = localStorage.getItem('daddy_branding');
        if (stored) {
          return JSON.parse(stored);
        } else {
          const defaultBranding = this.getDefaultBranding();
          localStorage.setItem('daddy_branding', JSON.stringify(defaultBranding));
          return defaultBranding;
        }
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
      return this.getDefaultBranding();
    }
  },

  // 기본 브랜딩 설정
  getDefaultBranding() {
    return {
      logo_url: '',
      logo_dark_url: '',
      favicon_url: '',
      site_title: 'Daddy Bath Bomb',
      site_description: 'Premium natural bath bombs for ultimate relaxation experience',
      primary_color: '#ec4899',
      secondary_color: '#8b5cf6',
      accent_color: '#06b6d4'
    };
  },

  // 브랜딩 설정 업데이트
  async updateBrandingSettings(brandingData) {
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { data, error } = await supabase
          .from('branding_settings')
          .upsert([{
            ...brandingData,
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // 로컬 스토리지 사용
        const updatedBranding = {
          ...brandingData,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('daddy_branding', JSON.stringify(updatedBranding));
        return updatedBranding;
      }
    } catch (error) {
      console.error('Error updating branding settings:', error);
      throw error;
    }
  }
};
