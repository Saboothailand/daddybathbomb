import React, { useState, useEffect, useCallback } from 'react';
import { 
  Upload, Save, RotateCcw, Eye, Palette, Type, Image as ImageIcon, 
  Settings, Home, History, Smartphone, Globe, Monitor, CheckCircle, 
  AlertCircle, Trash2, Download, RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { supabase } from '../../lib/supabase';

interface BrandingSettings {
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

interface LogoHistory {
  id: string;
  changed_field: string;
  old_value: string;
  new_value: string;
  changed_at: string;
  changed_by: string;
  change_reason: string;
}

interface ImprovedLogoManagementProps {
  onSave?: () => void;
}

export default function ImprovedLogoManagement({ onSave }: ImprovedLogoManagementProps) {
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [history, setHistory] = useState<LogoHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  // 브랜딩 설정 로드
  const loadBranding = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_current_branding');
      if (error) throw error;
      if (data && data.length > 0) {
        setBranding(data[0]);
      }
    } catch (error) {
      console.error('브랜딩 설정 로드 실패:', error);
      setErrors({ general: '브랜딩 설정을 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  }, []);

  // 변경 이력 로드
  const loadHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_logo_history', { limit_count: 10 });
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('변경 이력 로드 실패:', error);
    }
  }, []);

  useEffect(() => {
    loadBranding();
    loadHistory();
  }, [loadBranding, loadHistory]);

  // 유효성 검증
  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'logo_url':
      case 'logo_mobile_url':
      case 'logo_favicon_url':
        if (value && !/^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|webp)$/i.test(value)) {
          return '올바른 이미지 URL을 입력해주세요. (http/https로 시작하고 이미지 확장자여야 함)';
        }
        return null;
      
      case 'logo_width':
      case 'logo_height':
        if (value < 16 || value > 500) {
          return '크기는 16px ~ 500px 사이여야 합니다.';
        }
        return null;
      
      case 'brand_primary_color':
      case 'brand_secondary_color':
      case 'brand_accent_color':
        if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
          return '올바른 HEX 컬러 코드를 입력해주세요. (예: #FF2D55)';
        }
        return null;
      
      default:
        return null;
    }
  };

  // 필드 업데이트
  const updateField = (field: keyof BrandingSettings, value: any) => {
    if (!branding) return;

    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    setBranding(prev => prev ? { ...prev, [field]: value } : null);
  };

  // 이미지 업로드 (드래그 앤 드롭 지원)
  const uploadImage = async (file: File, type: 'logo' | 'mobile' | 'favicon' = 'logo') => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [type]: '이미지 파일만 업로드 가능합니다.' }));
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: '파일 크기는 5MB 이하로 제한됩니다.' }));
      return null;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      setErrors(prev => ({ ...prev, [type]: '이미지 업로드에 실패했습니다.' }));
      return null;
    } finally {
      setUploading(false);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, type: 'logo' | 'mobile' | 'favicon' = 'logo') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = await uploadImage(file, type);
      if (url) {
        const fieldMap = {
          logo: 'logo_url' as keyof BrandingSettings,
          mobile: 'logo_mobile_url' as keyof BrandingSettings,
          favicon: 'logo_favicon_url' as keyof BrandingSettings
        };
        updateField(fieldMap[type], url);
      }
    }
  };

  // 설정 저장
  const handleSave = async () => {
    if (!branding) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('update_branding_settings', {
        p_site_title: branding.site_title,
        p_site_title_en: branding.site_title_en,
        p_site_description: branding.site_description,
        p_site_tagline: branding.site_tagline,
        p_logo_url: branding.logo_url,
        p_logo_mobile_url: branding.logo_mobile_url,
        p_logo_favicon_url: branding.logo_favicon_url,
        p_logo_alt_text: branding.logo_alt_text,
        p_logo_alt_text_en: branding.logo_alt_text_en,
        p_logo_width: branding.logo_width,
        p_logo_height: branding.logo_height,
        p_logo_style: branding.logo_style,
        p_logo_enabled: branding.logo_enabled,
        p_brand_primary_color: branding.brand_primary_color,
        p_brand_secondary_color: branding.brand_secondary_color,
        p_brand_accent_color: branding.brand_accent_color
      });

      if (error) throw error;

      // 프론트엔드에 변경사항 알림
      window.dispatchEvent(new CustomEvent('brandingUpdated'));
      
      // 변경 이력 새로고침
      await loadHistory();
      
      onSave?.();
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setErrors({ general: '설정 저장에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  // 설정 초기화
  const handleReset = () => {
    if (confirm('모든 설정을 초기값으로 되돌리시겠습니까?')) {
      loadBranding();
    }
  };

  if (loading && !branding) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">브랜딩 설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!branding) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            브랜딩 설정을 불러올 수 없습니다. 새로고침을 시도해주세요.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 헤더 */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">로고 & 브랜딩 관리</h1>
              <p className="text-sm text-gray-600">사이트 로고와 브랜딩을 체계적으로 관리합니다</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              v{branding.logo_cache_version}
            </Badge>
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              초기화
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4" />
              {loading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>

      {/* 에러 알림 */}
      {errors.general && (
        <div className="mx-6 mt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="preview">미리보기</TabsTrigger>
            <TabsTrigger value="upload">업로드</TabsTrigger>
            <TabsTrigger value="branding">브랜딩</TabsTrigger>
            <TabsTrigger value="history">변경 이력</TabsTrigger>
          </TabsList>

          {/* 미리보기 탭 */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 데스크톱 미리보기 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    데스크톱 미리보기
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {branding.logo_enabled && branding.logo_url ? (
                        <div 
                          className="flex items-center justify-center overflow-hidden"
                          style={{
                            width: `${branding.logo_width}px`,
                            height: `${branding.logo_height}px`,
                            background: `linear-gradient(45deg, ${branding.brand_primary_color}, ${branding.brand_secondary_color})`,
                            borderRadius: branding.logo_style === 'circle' ? '50%' : 
                                         branding.logo_style === 'square' ? '0' : '8px'
                          }}
                        >
                          <img
                            src={branding.logo_url}
                            alt={branding.logo_alt_text}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div 
                          className="flex items-center justify-center"
                          style={{
                            width: `${branding.logo_width}px`,
                            height: `${branding.logo_height}px`,
                            background: `linear-gradient(45deg, ${branding.brand_primary_color}, ${branding.brand_secondary_color})`,
                            borderRadius: branding.logo_style === 'circle' ? '50%' : 
                                         branding.logo_style === 'square' ? '0' : '8px'
                          }}
                        >
                          <span className="text-white font-bold text-xs">
                            {branding.site_title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <h1 className="text-white font-bold text-lg">
                        {branding.site_title}
                      </h1>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 모바일 미리보기 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    모바일 미리보기
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 p-3 rounded-lg max-w-xs mx-auto">
                    <div className="flex items-center space-x-2">
                      {branding.logo_enabled && (branding.logo_mobile_url || branding.logo_url) ? (
                        <div 
                          className="flex items-center justify-center overflow-hidden"
                          style={{
                            width: `${Math.min(branding.logo_width, 32)}px`,
                            height: `${Math.min(branding.logo_height, 32)}px`,
                            background: `linear-gradient(45deg, ${branding.brand_primary_color}, ${branding.brand_secondary_color})`,
                            borderRadius: branding.logo_style === 'circle' ? '50%' : 
                                         branding.logo_style === 'square' ? '0' : '6px'
                          }}
                        >
                          <img
                            src={branding.logo_mobile_url || branding.logo_url}
                            alt={branding.logo_alt_text}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div 
                          className="flex items-center justify-center"
                          style={{
                            width: `${Math.min(branding.logo_width, 32)}px`,
                            height: `${Math.min(branding.logo_height, 32)}px`,
                            background: `linear-gradient(45deg, ${branding.brand_primary_color}, ${branding.brand_secondary_color})`,
                            borderRadius: branding.logo_style === 'circle' ? '50%' : 
                                         branding.logo_style === 'square' ? '0' : '6px'
                          }}
                        >
                          <span className="text-white font-bold text-xs">
                            {branding.site_title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <h1 className="text-white font-bold text-sm">
                        {branding.site_title}
                      </h1>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 컬러 팔레트 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  브랜드 컬러 팔레트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-200"
                      style={{ backgroundColor: branding.brand_primary_color }}
                    />
                    <p className="text-sm font-medium">Primary</p>
                    <p className="text-xs text-gray-600">{branding.brand_primary_color}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-200"
                      style={{ backgroundColor: branding.brand_secondary_color }}
                    />
                    <p className="text-sm font-medium">Secondary</p>
                    <p className="text-xs text-gray-600">{branding.brand_secondary_color}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-200"
                      style={{ backgroundColor: branding.brand_accent_color }}
                    />
                    <p className="text-sm font-medium">Accent</p>
                    <p className="text-xs text-gray-600">{branding.brand_accent_color}</p>
                  </div>
                </div>
                <div className="mt-4 h-8 rounded-lg overflow-hidden">
                  <div 
                    className="h-full w-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${branding.brand_primary_color}, ${branding.brand_secondary_color}, ${branding.brand_accent_color})`
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 업로드 탭 */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 메인 로고 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    메인 로고
                  </CardTitle>
                  <CardDescription>데스크톱용 메인 로고 이미지</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 'logo')}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      드래그 앤 드롭 또는 클릭하여 업로드
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, SVG (최대 5MB)</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file, 'logo').then(url => {
                          if (url) updateField('logo_url', url);
                        });
                      }}
                      className="mt-2"
                    />
                  </div>
                  <Input
                    value={branding.logo_url}
                    onChange={(e) => updateField('logo_url', e.target.value)}
                    placeholder="또는 URL 직접 입력"
                    className={errors.logo_url ? 'border-red-500' : ''}
                  />
                  {errors.logo_url && <p className="text-xs text-red-500">{errors.logo_url}</p>}
                </CardContent>
              </Card>

              {/* 모바일 로고 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    모바일 로고
                  </CardTitle>
                  <CardDescription>모바일용 작은 로고 이미지</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 'mobile')}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600">모바일용 로고</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file, 'mobile').then(url => {
                          if (url) updateField('logo_mobile_url', url);
                        });
                      }}
                      className="mt-2 text-xs"
                    />
                  </div>
                  <Input
                    value={branding.logo_mobile_url}
                    onChange={(e) => updateField('logo_mobile_url', e.target.value)}
                    placeholder="모바일 로고 URL (선택사항)"
                    className={errors.logo_mobile_url ? 'border-red-500' : ''}
                  />
                  {errors.logo_mobile_url && <p className="text-xs text-red-500">{errors.logo_mobile_url}</p>}
                </CardContent>
              </Card>

              {/* 파비콘 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    파비콘
                  </CardTitle>
                  <CardDescription>브라우저 탭 아이콘</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 'favicon')}
                  >
                    <Globe className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600">파비콘 (32x32px 권장)</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file, 'favicon').then(url => {
                          if (url) updateField('logo_favicon_url', url);
                        });
                      }}
                      className="mt-2 text-xs"
                    />
                  </div>
                  <Input
                    value={branding.logo_favicon_url}
                    onChange={(e) => updateField('logo_favicon_url', e.target.value)}
                    placeholder="파비콘 URL (선택사항)"
                    className={errors.logo_favicon_url ? 'border-red-500' : ''}
                  />
                  {errors.logo_favicon_url && <p className="text-xs text-red-500">{errors.logo_favicon_url}</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 브랜딩 탭 */}
          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 사이트 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="w-5 h-5 text-blue-600" />
                    사이트 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site-title">사이트 타이틀 (한국어)</Label>
                    <Input
                      id="site-title"
                      value={branding.site_title}
                      onChange={(e) => updateField('site_title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site-title-en">사이트 타이틀 (영어)</Label>
                    <Input
                      id="site-title-en"
                      value={branding.site_title_en}
                      onChange={(e) => updateField('site_title_en', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site-description">사이트 설명</Label>
                    <Input
                      id="site-description"
                      value={branding.site_description}
                      onChange={(e) => updateField('site_description', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site-tagline">태그라인</Label>
                    <Input
                      id="site-tagline"
                      value={branding.site_tagline}
                      onChange={(e) => updateField('site_tagline', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 로고 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-green-600" />
                    로고 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="logo-width">너비 (px)</Label>
                      <Input
                        id="logo-width"
                        type="number"
                        min="16"
                        max="500"
                        value={branding.logo_width}
                        onChange={(e) => updateField('logo_width', parseInt(e.target.value) || 48)}
                        className="mt-1"
                      />
                      {errors.logo_width && <p className="text-xs text-red-500">{errors.logo_width}</p>}
                    </div>
                    <div>
                      <Label htmlFor="logo-height">높이 (px)</Label>
                      <Input
                        id="logo-height"
                        type="number"
                        min="16"
                        max="500"
                        value={branding.logo_height}
                        onChange={(e) => updateField('logo_height', parseInt(e.target.value) || 48)}
                        className="mt-1"
                      />
                      {errors.logo_height && <p className="text-xs text-red-500">{errors.logo_height}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="logo-style">로고 스타일</Label>
                    <Select
                      value={branding.logo_style}
                      onValueChange={(value: 'rounded' | 'square' | 'circle') => 
                        updateField('logo_style', value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rounded">둥근 모서리</SelectItem>
                        <SelectItem value="square">사각형</SelectItem>
                        <SelectItem value="circle">원형</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="logo-enabled"
                      checked={branding.logo_enabled}
                      onCheckedChange={(checked) => updateField('logo_enabled', checked)}
                    />
                    <Label htmlFor="logo-enabled">로고 표시</Label>
                  </div>
                </CardContent>
              </Card>

              {/* 브랜드 컬러 */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    브랜드 컬러
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="brand-primary">메인 컬러</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="brand-primary"
                          type="color"
                          value={branding.brand_primary_color}
                          onChange={(e) => updateField('brand_primary_color', e.target.value)}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={branding.brand_primary_color}
                          onChange={(e) => updateField('brand_primary_color', e.target.value)}
                          placeholder="#FF2D55"
                          className="flex-1"
                        />
                      </div>
                      {errors.brand_primary_color && <p className="text-xs text-red-500">{errors.brand_primary_color}</p>}
                    </div>
                    <div>
                      <Label htmlFor="brand-secondary">서브 컬러</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="brand-secondary"
                          type="color"
                          value={branding.brand_secondary_color}
                          onChange={(e) => updateField('brand_secondary_color', e.target.value)}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={branding.brand_secondary_color}
                          onChange={(e) => updateField('brand_secondary_color', e.target.value)}
                          placeholder="#007AFF"
                          className="flex-1"
                        />
                      </div>
                      {errors.brand_secondary_color && <p className="text-xs text-red-500">{errors.brand_secondary_color}</p>}
                    </div>
                    <div>
                      <Label htmlFor="brand-accent">액센트 컬러</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="brand-accent"
                          type="color"
                          value={branding.brand_accent_color}
                          onChange={(e) => updateField('brand_accent_color', e.target.value)}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={branding.brand_accent_color}
                          onChange={(e) => updateField('brand_accent_color', e.target.value)}
                          placeholder="#FFD700"
                          className="flex-1"
                        />
                      </div>
                      {errors.brand_accent_color && <p className="text-xs text-red-500">{errors.brand_accent_color}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 변경 이력 탭 */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-orange-600" />
                  변경 이력
                </CardTitle>
                <CardDescription>최근 로고 및 브랜딩 변경 내역</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">변경 이력이 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.changed_field}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(item.changed_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-1 text-sm">
                            <span className="text-gray-500">이전:</span> {item.old_value || '없음'} → 
                            <span className="text-gray-500 ml-2">새값:</span> {item.new_value || '없음'}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
