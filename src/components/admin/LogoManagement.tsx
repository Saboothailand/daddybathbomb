import React, { useState, useEffect } from 'react';
import { Upload, Save, RotateCcw, Eye, EyeOff, Palette, Type, Image as ImageIcon, Settings, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { AdminService } from '../../lib/adminService';
import { supabase } from '../../lib/supabase';

interface LogoSettings {
  logo_url: string;
  site_title: string;
  logo_width: number;
  logo_height: number;
  logo_alt_text: string;
  logo_enabled: boolean;
  logo_style: 'rounded' | 'square' | 'circle';
  brand_color: string;
  brand_sub_color: string;
}

interface LogoManagementProps {
  onSave?: () => void;
}

export default function LogoManagement({ onSave }: LogoManagementProps) {
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    logo_url: '',
    site_title: 'Daddy Bath Bomb',
    logo_width: 48,
    logo_height: 48,
    logo_alt_text: 'Daddy Bath Bomb Logo',
    logo_enabled: true,
    logo_style: 'rounded',
    brand_color: '#FF2D55',
    brand_sub_color: '#007AFF'
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 로고 설정 로드
  const loadLogoSettings = async () => {
    try {
      setLoading(true);
      const settings = await AdminService.getSiteSettings();
      
      // 로고 관련 설정만 추출
      const logoData: Partial<LogoSettings> = {};
      settings.forEach(setting => {
        const key = setting.setting_key as keyof LogoSettings;
        if (key in logoSettings) {
          if (key === 'logo_width' || key === 'logo_height') {
            logoData[key] = parseInt(setting.setting_value) || logoSettings[key];
          } else if (key === 'logo_enabled') {
            logoData[key] = setting.setting_value === 'true';
          } else {
            (logoData as any)[key] = setting.setting_value;
          }
        }
      });

      setLogoSettings(prev => ({ ...prev, ...logoData }));
    } catch (error) {
      console.error('로고 설정 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 설정 로드
  useEffect(() => {
    loadLogoSettings();
  }, []);

  // 이미지 업로드 처리
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하로 제한됩니다.');
      return;
    }

    try {
      setUploading(true);
      
      // Supabase Storage에 업로드
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 업로드된 파일의 공개 URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      setLogoSettings(prev => ({ ...prev, logo_url: publicUrl }));
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 로고 설정 저장
  const handleSave = async () => {
    try {
      setLoading(true);

      // 각 설정을 개별적으로 업데이트
      const updates = [
        { key: 'logo_url', value: logoSettings.logo_url, type: 'image_url' },
        { key: 'site_title', value: logoSettings.site_title, type: 'text' },
        { key: 'logo_width', value: logoSettings.logo_width.toString(), type: 'number' },
        { key: 'logo_height', value: logoSettings.logo_height.toString(), type: 'number' },
        { key: 'logo_alt_text', value: logoSettings.logo_alt_text, type: 'text' },
        { key: 'logo_enabled', value: logoSettings.logo_enabled.toString(), type: 'boolean' },
        { key: 'logo_style', value: logoSettings.logo_style, type: 'select' },
        { key: 'brand_color', value: logoSettings.brand_color, type: 'color' },
        { key: 'brand_sub_color', value: logoSettings.brand_sub_color, type: 'color' }
      ];

      // 병렬로 모든 설정 업데이트
      await Promise.all(
        updates.map(update => 
          AdminService.updateSiteSetting(update.key, update.value, update.type)
        )
      );

      // 프론트엔드에 변경사항 알림
      window.dispatchEvent(new CustomEvent('brandingUpdated'));
      
      alert('로고 설정이 저장되었습니다!');
      onSave?.();
    } catch (error) {
      console.error('로고 설정 저장 실패:', error);
      alert('로고 설정 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 설정 초기화
  const handleReset = () => {
    if (confirm('모든 로고 설정을 초기화하시겠습니까?')) {
      setLogoSettings({
        logo_url: '',
        site_title: 'Daddy Bath Bomb',
        logo_width: 48,
        logo_height: 48,
        logo_alt_text: 'Daddy Bath Bomb Logo',
        logo_enabled: true,
        logo_style: 'rounded',
        brand_color: '#FF2D55',
        brand_sub_color: '#007AFF'
      });
    }
  };

  // 로고 스타일 클래스 생성
  const getLogoStyleClass = () => {
    switch (logoSettings.logo_style) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      default:
        return 'rounded-xl';
    }
  };

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
              <h1 className="text-xl font-bold text-gray-900">로고 관리</h1>
              <p className="text-sm text-gray-600">사이트 로고와 브랜딩을 관리합니다</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4" />
              {loading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 설정 폼 - 2/3 너비 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 로고 이미지 */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  로고 이미지
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label
                      htmlFor="logo-upload"
                      className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? '업로드 중...' : '이미지 선택'}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="logo-enabled"
                      checked={logoSettings.logo_enabled}
                      onCheckedChange={(checked) => 
                        setLogoSettings(prev => ({ ...prev, logo_enabled: checked }))
                      }
                    />
                    <Label htmlFor="logo-enabled" className="text-sm">로고 표시</Label>
                  </div>
                </div>
                <Input
                  value={logoSettings.logo_url}
                  onChange={(e) => setLogoSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="또는 직접 URL 입력"
                  className="text-sm"
                />
              </CardContent>
            </Card>

            {/* 사이트 정보 */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Type className="w-5 h-5 text-blue-600" />
                  사이트 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="site-title" className="text-sm font-medium">사이트 타이틀</Label>
                  <Input
                    id="site-title"
                    value={logoSettings.site_title}
                    onChange={(e) => setLogoSettings(prev => ({ ...prev, site_title: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="logo-alt" className="text-sm font-medium">로고 설명</Label>
                  <Input
                    id="logo-alt"
                    value={logoSettings.logo_alt_text}
                    onChange={(e) => setLogoSettings(prev => ({ ...prev, logo_alt_text: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 로고 설정 */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  로고 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="logo-width" className="text-sm font-medium">너비 (px)</Label>
                    <Input
                      id="logo-width"
                      type="number"
                      min="16"
                      max="200"
                      value={logoSettings.logo_width}
                      onChange={(e) => setLogoSettings(prev => ({ ...prev, logo_width: parseInt(e.target.value) || 48 }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo-height" className="text-sm font-medium">높이 (px)</Label>
                    <Input
                      id="logo-height"
                      type="number"
                      min="16"
                      max="200"
                      value={logoSettings.logo_height}
                      onChange={(e) => setLogoSettings(prev => ({ ...prev, logo_height: parseInt(e.target.value) || 48 }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="logo-style" className="text-sm font-medium">로고 스타일</Label>
                  <Select
                    value={logoSettings.logo_style}
                    onValueChange={(value: 'rounded' | 'square' | 'circle') => 
                      setLogoSettings(prev => ({ ...prev, logo_style: value }))
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
              </CardContent>
            </Card>

            {/* 브랜드 컬러 */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  브랜드 컬러
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="brand-color" className="text-sm font-medium">메인 컬러</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="brand-color"
                        type="color"
                        value={logoSettings.brand_color}
                        onChange={(e) => setLogoSettings(prev => ({ ...prev, brand_color: e.target.value }))}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={logoSettings.brand_color}
                        onChange={(e) => setLogoSettings(prev => ({ ...prev, brand_color: e.target.value }))}
                        placeholder="#FF2D55"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="brand-sub-color" className="text-sm font-medium">서브 컬러</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="brand-sub-color"
                        type="color"
                        value={logoSettings.brand_sub_color}
                        onChange={(e) => setLogoSettings(prev => ({ ...prev, brand_sub_color: e.target.value }))}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={logoSettings.brand_sub_color}
                        onChange={(e) => setLogoSettings(prev => ({ ...prev, brand_sub_color: e.target.value }))}
                        placeholder="#007AFF"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 미리보기 - 1/3 너비 */}
          <div className="space-y-4">
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  미리보기
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {logoSettings.logo_enabled && logoSettings.logo_url ? (
                      <div 
                        className="bg-gradient-to-br flex items-center justify-center overflow-hidden"
                        style={{
                          width: `${logoSettings.logo_width}px`,
                          height: `${logoSettings.logo_height}px`,
                          background: `linear-gradient(45deg, ${logoSettings.brand_color}, ${logoSettings.brand_sub_color})`,
                          borderRadius: logoSettings.logo_style === 'circle' ? '50%' : 
                                       logoSettings.logo_style === 'square' ? '0' : '8px'
                        }}
                      >
                        <img
                          src={logoSettings.logo_url}
                          alt={logoSettings.logo_alt_text}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div 
                        className="bg-gradient-to-br flex items-center justify-center"
                        style={{
                          width: `${logoSettings.logo_width}px`,
                          height: `${logoSettings.logo_height}px`,
                          background: `linear-gradient(45deg, ${logoSettings.brand_color}, ${logoSettings.brand_sub_color})`,
                          borderRadius: logoSettings.logo_style === 'circle' ? '50%' : 
                                       logoSettings.logo_style === 'square' ? '0' : '8px'
                        }}
                      >
                        <span className="text-white font-bold text-xs">
                          {logoSettings.site_title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h1 className="text-white font-bold text-lg">
                      {logoSettings.site_title}
                    </h1>
                  </div>
                </div>
                
                {/* 컬러 팔레트 */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">컬러 팔레트</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: logoSettings.brand_color }}
                      />
                      <span className="text-xs text-gray-600">{logoSettings.brand_color}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: logoSettings.brand_sub_color }}
                      />
                      <span className="text-xs text-gray-600">{logoSettings.brand_sub_color}</span>
                    </div>
                    <div className="h-3 rounded overflow-hidden">
                      <div 
                        className="h-full w-full"
                        style={{ 
                          background: `linear-gradient(90deg, ${logoSettings.brand_color}, ${logoSettings.brand_sub_color})`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}