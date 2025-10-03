import { supabase } from './supabase';

export interface BrandingSettings {
  id: string;
  site_title: string;
  site_title_en: string;
  site_description: string;
  site_tagline: string;
  logo_url: string;
  logo_mobile_url: string;
  logo_favicon_url: string;
  logo_alt_text: string;
  logo_alt_text_en: string;
  logo_width: number;
  logo_height: number;
  logo_style: 'rounded' | 'square' | 'circle';
  logo_enabled: boolean;
  brand_primary_color: string;
  brand_secondary_color: string;
  brand_accent_color: string;
  logo_cache_version: number;
  updated_at: string;
}

export interface LogoHistory {
  id: string;
  changed_field: string;
  old_value: string;
  new_value: string;
  changed_at: string;
  changed_by: string;
  change_reason: string;
}

export class ImprovedAdminService {
  // 브랜딩 설정 조회
  static async getCurrentBranding(): Promise<BrandingSettings | null> {
    try {
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('브랜딩 설정 조회 실패:', error);
      throw error;
    }
  }

  // 브랜딩 설정 업데이트
  static async updateBrandingSettings(settings: Partial<BrandingSettings>): Promise<BrandingSettings> {
    try {
      const { data, error } = await supabase.rpc('update_branding_settings', {
        p_site_title: settings.site_title,
        p_site_title_en: settings.site_title_en,
        p_site_description: settings.site_description,
        p_site_tagline: settings.site_tagline,
        p_logo_url: settings.logo_url,
        p_logo_mobile_url: settings.logo_mobile_url,
        p_logo_favicon_url: settings.logo_favicon_url,
        p_logo_alt_text: settings.logo_alt_text,
        p_logo_alt_text_en: settings.logo_alt_text_en,
        p_logo_width: settings.logo_width,
        p_logo_height: settings.logo_height,
        p_logo_style: settings.logo_style,
        p_logo_enabled: settings.logo_enabled,
        p_brand_primary_color: settings.brand_primary_color,
        p_brand_secondary_color: settings.brand_secondary_color,
        p_brand_accent_color: settings.brand_accent_color
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('브랜딩 설정 업데이트 실패:', error);
      throw error;
    }
  }

  // 로고 변경 이력 조회
  static async getLogoHistory(limit: number = 20): Promise<LogoHistory[]> {
    try {
      const { data, error } = await supabase.rpc('get_logo_history', { limit_count: limit });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('로고 이력 조회 실패:', error);
      throw error;
    }
  }

  // 이미지 업로드 (Supabase Storage)
  static async uploadImage(file: File, type: 'logo' | 'mobile' | 'favicon' = 'logo'): Promise<string> {
    try {
      // 파일 유효성 검증
      if (!file.type.startsWith('image/')) {
        throw new Error('이미지 파일만 업로드 가능합니다.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('파일 크기는 5MB 이하로 제한됩니다.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;

      // Supabase Storage에 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 공개 URL 반환
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    }
  }

  // 기존 이미지 삭제
  static async deleteImage(url: string): Promise<void> {
    try {
      if (!url) return;

      // URL에서 파일 경로 추출
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `branding/${fileName}`;

      const { error } = await supabase.storage
        .from('public')
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      throw error;
    }
  }

  // 실시간 브랜딩 변경 구독
  static subscribeToBrandingChanges(callback: (payload: any) => void) {
    return supabase
      .channel('branding-settings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'branding_settings'
      }, callback)
      .subscribe();
  }

  // 브랜딩 변경 이력 구독
  static subscribeToLogoHistory(callback: (payload: any) => void) {
    return supabase
      .channel('logo-history')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'logo_history'
      }, callback)
      .subscribe();
  }

  // 유효성 검증 유틸리티
  static validateBrandingSettings(settings: Partial<BrandingSettings>): Record<string, string> {
    const errors: Record<string, string> = {};

    // URL 유효성 검증
    const urlFields = ['logo_url', 'logo_mobile_url', 'logo_favicon_url'];
    urlFields.forEach(field => {
      const value = settings[field as keyof BrandingSettings];
      if (value && !/^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|webp)$/i.test(value)) {
        errors[field] = '올바른 이미지 URL을 입력해주세요.';
      }
    });

    // 크기 유효성 검증
    if (settings.logo_width !== undefined && (settings.logo_width < 16 || settings.logo_width > 500)) {
      errors.logo_width = '로고 너비는 16px ~ 500px 사이여야 합니다.';
    }

    if (settings.logo_height !== undefined && (settings.logo_height < 16 || settings.logo_height > 500)) {
      errors.logo_height = '로고 높이는 16px ~ 500px 사이여야 합니다.';
    }

    // 컬러 유효성 검증
    const colorFields = ['brand_primary_color', 'brand_secondary_color', 'brand_accent_color'];
    colorFields.forEach(field => {
      const value = settings[field as keyof BrandingSettings];
      if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
        errors[field] = '올바른 HEX 컬러 코드를 입력해주세요.';
      }
    });

    return errors;
  }

  // 캐시 무효화를 위한 버전 증가
  static async incrementCacheVersion(): Promise<void> {
    try {
      const { error } = await supabase
        .from('branding_settings')
        .update({ 
          logo_cache_version: supabase.raw('logo_cache_version + 1'),
          updated_at: new Date().toISOString()
        })
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) throw error;
    } catch (error) {
      console.error('캐시 버전 증가 실패:', error);
      throw error;
    }
  }

  // 브랜딩 설정 백업
  static async backupBrandingSettings(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('브랜딩 설정 백업 실패:', error);
      throw error;
    }
  }

  // 브랜딩 설정 복원
  static async restoreBrandingSettings(backup: any): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_branding_settings', {
        p_site_title: backup.site_title,
        p_site_title_en: backup.site_title_en,
        p_site_description: backup.site_description,
        p_site_tagline: backup.site_tagline,
        p_logo_url: backup.logo_url,
        p_logo_mobile_url: backup.logo_mobile_url,
        p_logo_favicon_url: backup.logo_favicon_url,
        p_logo_alt_text: backup.logo_alt_text,
        p_logo_alt_text_en: backup.logo_alt_text_en,
        p_logo_width: backup.logo_width,
        p_logo_height: backup.logo_height,
        p_logo_style: backup.logo_style,
        p_logo_enabled: backup.logo_enabled,
        p_brand_primary_color: backup.brand_primary_color,
        p_brand_secondary_color: backup.brand_secondary_color,
        p_brand_accent_color: backup.brand_accent_color
      });

      if (error) throw error;
    } catch (error) {
      console.error('브랜딩 설정 복원 실패:', error);
      throw error;
    }
  }

  // 관리자 권한 확인
  static async checkAdminAccess(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) return false;
      return data?.role === 'admin';
    } catch (error) {
      console.error('관리자 권한 확인 실패:', error);
      return false;
    }
  }

  // 브랜딩 설정 통계
  static async getBrandingStats(): Promise<{
    totalChanges: number;
    lastUpdate: string;
    cacheVersion: number;
  }> {
    try {
      const [brandingResult, historyResult] = await Promise.all([
        supabase
          .from('branding_settings')
          .select('logo_cache_version, updated_at')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('logo_history')
          .select('id', { count: 'exact' })
      ]);

      return {
        totalChanges: historyResult.count || 0,
        lastUpdate: brandingResult.data?.updated_at || '',
        cacheVersion: brandingResult.data?.logo_cache_version || 1
      };
    } catch (error) {
      console.error('브랜딩 통계 조회 실패:', error);
      throw error;
    }
  }
}
