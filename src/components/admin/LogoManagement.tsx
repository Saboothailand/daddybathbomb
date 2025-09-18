import React, { useEffect, useMemo, useState } from 'react';
import {
  Eye,
  Home,
  Image as ImageIcon,
  Menu,
  Palette,
  RefreshCw,
  Save,
  Settings,
  Type,
  Upload,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { cn } from '../ui/utils';
import { AdminService, LogoSettingsResponse } from '../../lib/adminService';
import { supabase } from '../../lib/supabase';

type SectionId = 'logo' | 'identity' | 'dimensions' | 'brand';

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

const DEFAULT_SETTINGS: LogoSettings = {
  logo_url: '',
  site_title: 'Daddy Bath Bomb',
  logo_width: 48,
  logo_height: 48,
  logo_alt_text: 'Daddy Bath Bomb Logo',
  logo_enabled: true,
  logo_style: 'rounded',
  brand_color: '#FF2D55',
  brand_sub_color: '#007AFF'
};

const NAV_SECTIONS: Array<{
  id: SectionId;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'logo',
    label: '로고 이미지',
    description: '로고 파일과 노출 설정',
    icon: ImageIcon
  },
  {
    id: 'identity',
    label: '사이트 정보',
    description: '사이트 타이틀과 대체 텍스트',
    icon: Type
  },
  {
    id: 'dimensions',
    label: '사이즈 & 스타일',
    description: '로고 크기와 모양 조정',
    icon: Settings
  },
  {
    id: 'brand',
    label: '브랜드 컬러',
    description: '대표 색상과 서브 색상',
    icon: Palette
  }
];

function parseLogoSettings(response: LogoSettingsResponse | null): LogoSettings {
  const parsed: LogoSettings = { ...DEFAULT_SETTINGS };

  if (!response) return parsed;

  const toNumber = (value: string | undefined, fallback: number) => {
    const numeric = parseInt(value ?? '', 10);
    return Number.isNaN(numeric) ? fallback : numeric;
  };

  if (response.logo_url?.value !== undefined) parsed.logo_url = response.logo_url.value ?? '';
  if (response.site_title?.value !== undefined) parsed.site_title = response.site_title.value ?? DEFAULT_SETTINGS.site_title;
  if (response.logo_width?.value !== undefined) parsed.logo_width = toNumber(response.logo_width.value, DEFAULT_SETTINGS.logo_width);
  if (response.logo_height?.value !== undefined) parsed.logo_height = toNumber(response.logo_height.value, DEFAULT_SETTINGS.logo_height);
  if (response.logo_alt_text?.value !== undefined) parsed.logo_alt_text = response.logo_alt_text.value ?? DEFAULT_SETTINGS.logo_alt_text;
  if (response.logo_enabled?.value !== undefined) parsed.logo_enabled = response.logo_enabled.value === 'true';
  if (response.logo_style?.value !== undefined && ['rounded', 'square', 'circle'].includes(response.logo_style.value)) {
    parsed.logo_style = response.logo_style.value as LogoSettings['logo_style'];
  }
  if (response.brand_color?.value !== undefined) parsed.brand_color = response.brand_color.value ?? DEFAULT_SETTINGS.brand_color;
  if (response.brand_sub_color?.value !== undefined) parsed.brand_sub_color = response.brand_sub_color.value ?? DEFAULT_SETTINGS.brand_sub_color;

  return parsed;
}

interface LogoManagementProps {
  onSave?: () => void;
}

export default function LogoManagement({ onSave }: LogoManagementProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('logo');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<LogoSettings>(DEFAULT_SETTINGS);
  const [initialSettings, setInitialSettings] = useState<LogoSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await AdminService.getLogoSettings();
        const parsed = parseLogoSettings(data);
        setSettings(parsed);
        setInitialSettings(parsed);
      } catch (error) {
        console.error('로고 설정 로드 실패:', error);
        setMessage({ type: 'error', text: '로고 설정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      setMessage(null);
    }
  }, [loading]);

  const hasChanges = useMemo(() => JSON.stringify(settings) !== JSON.stringify(initialSettings), [settings, initialSettings]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드할 수 있습니다.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '파일 크기는 5MB 이하여야 합니다.' });
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(filePath);

      setSettings(prev => ({ ...prev, logo_url: publicUrl }));
      setMessage({ type: 'success', text: '이미지가 업로드되었습니다.' });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      setMessage({ type: 'error', text: '이미지 업로드에 실패했습니다.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const updated = await AdminService.updateLogoSettings({
        logo_url: settings.logo_url,
        site_title: settings.site_title,
        logo_width: settings.logo_width,
        logo_height: settings.logo_height,
        logo_alt_text: settings.logo_alt_text,
        logo_enabled: settings.logo_enabled,
        logo_style: settings.logo_style,
        brand_color: settings.brand_color,
        brand_sub_color: settings.brand_sub_color
      });

      const parsed = parseLogoSettings(updated);
      setSettings(parsed);
      setInitialSettings(parsed);

      window.dispatchEvent(new CustomEvent('brandingUpdated'));
      setMessage({ type: 'success', text: '로고 설정이 저장되었습니다.' });
      onSave?.();
    } catch (error: any) {
      console.error('로고 설정 저장 실패:', error);
      const errorText = error?.message ?? '로고 설정 저장 중 오류가 발생했습니다.';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!hasChanges) return;
    if (confirm('변경사항을 초기화하시겠습니까?')) {
      setSettings(initialSettings);
      setMessage({ type: 'success', text: '변경사항이 초기화되었습니다.' });
    }
  };

  const PreviewLogo = () => (
    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 shadow-xl">
      <div className="flex items-center gap-4">
        <div
          className={cn('flex items-center justify-center overflow-hidden border border-white/10 shadow-inner transition-all duration-300', {
            'rounded-full': settings.logo_style === 'circle',
            'rounded-none': settings.logo_style === 'square',
            'rounded-xl': settings.logo_style === 'rounded'
          })}
          style={{
            width: `${settings.logo_width}px`,
            height: `${settings.logo_height}px`,
            background: `linear-gradient(135deg, ${settings.brand_color}, ${settings.brand_sub_color})`,
            opacity: settings.logo_enabled ? 1 : 0.4
          }}
        >
          {settings.logo_enabled && settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.logo_alt_text} className="h-full w-full object-cover" />
          ) : (
            <span className="text-white text-lg font-semibold">
              {settings.site_title.charAt(0) || 'D'}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">프리뷰</p>
          <h2 className="text-2xl font-bold text-white">{settings.site_title}</h2>
          <p className="text-sm text-slate-400">{settings.logo_alt_text}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          <span>로고 표시</span>
          <span className={cn('rounded-full px-3 py-1 font-semibold', settings.logo_enabled ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-700 text-slate-300')}>
            {settings.logo_enabled ? 'ON' : 'OFF'}
          </span>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-4">
          <p className="text-xs text-slate-400">브랜드 그래디언트</p>
          <div
            className="mt-2 h-3 rounded-full"
            style={{ background: `linear-gradient(90deg, ${settings.brand_color}, ${settings.brand_sub_color})` }}
          />
          <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
            <span>{settings.brand_color}</span>
            <span>{settings.brand_sub_color}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const SectionContent = () => {
    switch (activeSection) {
      case 'logo':
        return (
          <Card className="border border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <ImageIcon className="h-4 w-4" />
                </div>
                로고 이미지
              </CardTitle>
              <CardDescription>Supabase Storage에 업로드하거나 외부 URL을 직접 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
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
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? '업로드 중...' : '이미지 선택'}
                  </Label>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Switch
                    id="logo-enabled"
                    checked={settings.logo_enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, logo_enabled: checked }))}
                  />
                  <Label htmlFor="logo-enabled">로고 표시</Label>
                </div>
              </div>

              <Input
                value={settings.logo_url}
                onChange={(event) => setSettings(prev => ({ ...prev, logo_url: event.target.value }))}
                placeholder="https://example.com/logo.png"
              />

              <p className="text-xs text-slate-500">
                * 투명한 PNG 또는 SVG 파일을 권장합니다. 업로드한 파일은 공개 버킷(public)에 저장됩니다.
              </p>
            </CardContent>
          </Card>
        );
      case 'identity':
        return (
          <Card className="border border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <Type className="h-4 w-4" />
                </div>
                사이트 아이덴티티
              </CardTitle>
              <CardDescription>사이트 상단에 표시되는 이름과 접근성 텍스트를 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site-title" className="text-sm font-semibold text-slate-700">
                  사이트 타이틀
                </Label>
                <Input
                  id="site-title"
                  value={settings.site_title}
                  onChange={(event) => setSettings(prev => ({ ...prev, site_title: event.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="logo-alt" className="text-sm font-semibold text-slate-700">
                  로고 대체 텍스트
                </Label>
                <Input
                  id="logo-alt"
                  value={settings.logo_alt_text}
                  onChange={(event) => setSettings(prev => ({ ...prev, logo_alt_text: event.target.value }))}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-slate-500">화면 읽기 도구를 위한 설명을 입력하면 접근성이 향상됩니다.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'dimensions':
        return (
          <Card className="border border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Settings className="h-4 w-4" />
                </div>
                크기 & 스타일
              </CardTitle>
              <CardDescription>헤더에 맞는 적절한 로고 크기와 모양을 선택하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="logo-width" className="text-sm font-semibold text-slate-700">
                    너비 (px)
                  </Label>
                  <Input
                    id="logo-width"
                    type="number"
                    min={16}
                    max={240}
                    value={settings.logo_width}
                    onChange={(event) => {
                      const value = parseInt(event.target.value, 10);
                      setSettings(prev => ({ ...prev, logo_width: Number.isNaN(value) ? prev.logo_width : value }));
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="logo-height" className="text-sm font-semibold text-slate-700">
                    높이 (px)
                  </Label>
                  <Input
                    id="logo-height"
                    type="number"
                    min={16}
                    max={240}
                    value={settings.logo_height}
                    onChange={(event) => {
                      const value = parseInt(event.target.value, 10);
                      setSettings(prev => ({ ...prev, logo_height: Number.isNaN(value) ? prev.logo_height : value }));
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="logo-style" className="text-sm font-semibold text-slate-700">
                  로고 스타일
                </Label>
                <Select
                  value={settings.logo_style}
                  onValueChange={(value: LogoSettings['logo_style']) =>
                    setSettings(prev => ({ ...prev, logo_style: value }))
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
        );
      case 'brand':
        return (
          <Card className="border border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                  <Palette className="h-4 w-4" />
                </div>
                브랜드 컬러 시스템
              </CardTitle>
              <CardDescription>헤더와 버튼에 사용되는 브랜드 컬러를 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="brand-color" className="text-sm font-semibold text-slate-700">
                    메인 컬러
                  </Label>
                  <div className="mt-1 flex items-center gap-3">
                    <Input
                      id="brand-color"
                      type="color"
                      value={settings.brand_color}
                      onChange={(event) => setSettings(prev => ({ ...prev, brand_color: event.target.value }))}
                      className="h-12 w-14 cursor-pointer rounded-xl border border-slate-200"
                    />
                    <Input
                      value={settings.brand_color}
                      onChange={(event) => setSettings(prev => ({ ...prev, brand_color: event.target.value }))}
                      placeholder="#FF2D55"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="brand-sub-color" className="text-sm font-semibold text-slate-700">
                    서브 컬러
                  </Label>
                  <div className="mt-1 flex items-center gap-3">
                    <Input
                      id="brand-sub-color"
                      type="color"
                      value={settings.brand_sub_color}
                      onChange={(event) => setSettings(prev => ({ ...prev, brand_sub_color: event.target.value }))}
                      className="h-12 w-14 cursor-pointer rounded-xl border border-slate-200"
                    />
                    <Input
                      value={settings.brand_sub_color}
                      onChange={(event) => setSettings(prev => ({ ...prev, brand_sub_color: event.target.value }))}
                      placeholder="#007AFF"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-700">디자인 팁</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>두 색상은 대비를 유지하면서도 조화를 이뤄야 합니다.</li>
                  <li>서브 컬러는 버튼 호버나 강조 요소에 사용할 수 있습니다.</li>
                  <li>필요 시 시즌별 테마 색상으로 업데이트하세요.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="rounded-full lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-blue-500 text-white shadow-md">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">브랜딩 & 로고 관리</h1>
                <p className="text-xs text-slate-500">왼쪽 메뉴에서 영역을 선택해 세부 설정을 변경하세요.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges}
              className="hidden items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 sm:flex"
            >
              <RefreshCw className="h-4 w-4" />
              초기화
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              {saving ? '저장 중...' : '변경사항 저장'}
            </Button>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 lg:hidden">
          <span className="text-sm font-semibold text-slate-900">설정 메뉴</span>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex h-full flex-col gap-2 overflow-y-auto px-4 py-6">
          {NAV_SECTIONS.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveSection(id);
                setSidebarOpen(false);
              }}
              className={cn(
                'flex w-full flex-col gap-1 rounded-2xl border border-transparent px-4 py-3 text-left transition-all',
                activeSection === id
                  ? 'border-blue-100 bg-blue-50 shadow-md'
                  : 'hover:border-slate-200 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold',
                    activeSection === id
                      ? 'border-blue-200 bg-blue-100 text-blue-600'
                      : 'border-slate-200 bg-white text-slate-500'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
              </div>
            </button>
          ))}
          <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">TIP</p>
            <p className="mt-2 leading-relaxed">
              모든 설정은 실시간으로 미리보기에 반영됩니다. 저장해야 실제 사이트에 적용됩니다.
            </p>
          </div>
        </nav>
      </aside>

      <main className="flex-1 lg:ml-72">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
          {message && (
            <div
              className={cn(
                'mb-6 rounded-2xl border px-4 py-3 text-sm',
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              )}
            >
              {message.text}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              {loading ? (
                <Card className="border border-slate-200 shadow-lg">
                  <CardContent className="flex h-48 items-center justify-center text-sm text-slate-500">
                    로고 설정을 불러오는 중입니다...
                  </CardContent>
                </Card>
              ) : (
                <SectionContent />
              )}

              <div className="sm:hidden">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className="w-full gap-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  <RefreshCw className="h-4 w-4" />
                  모든 변경 초기화
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <PreviewLogo />

              <Card className="border border-slate-200 bg-white/80 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Eye className="h-4 w-4 text-blue-600" />
                    현재 적용 상태
                  </CardTitle>
                  <CardDescription>
                    저장을 완료해야 실제 사이트 헤더에 반영됩니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>변경 사항</span>
                    <span className={cn('font-semibold', hasChanges ? 'text-blue-600' : 'text-slate-400')}>
                      {hasChanges ? '미저장' : '저장됨'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>로고 표시</span>
                    <span>{settings.logo_enabled ? '표시' : '숨김'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>로고 크기</span>
                    <span>
                      {settings.logo_width}px × {settings.logo_height}px
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>로고 스타일</span>
                    <span>
                      {
                        {
                          rounded: '둥근 모서리',
                          square: '사각형',
                          circle: '원형'
                        }[settings.logo_style]
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
