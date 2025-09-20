import React, { useState, useEffect } from 'react';
import { Save, Upload, Palette, Type, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import ImageUpload from '../ImageUpload';
import { supabase } from '../../lib/supabase';

interface BrandSettings {
  logo_url: string;
  site_title: string;
  site_description: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

export default function SimpleBrandManagement() {
  const [settings, setSettings] = useState<BrandSettings>({
    logo_url: '',
    site_title: 'Daddy Bath Bomb',
    site_description: 'Premium natural bath bombs for ultimate relaxation',
    primary_color: '#007AFF',
    secondary_color: '#00FF88',
    accent_color: '#FFD700'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // 로컬 스토리지에서 설정 로드
      const stored = localStorage.getItem('brand_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('brand_settings', JSON.stringify(settings));
      
      // Supabase에도 저장 시도 (실패해도 괜찮음)
      try {
        const settingsArray = Object.entries(settings).map(([key, value]) => ({
          setting_key: key,
          setting_value: value,
          category: 'branding',
          setting_type: key.includes('color') ? 'color' : key.includes('url') ? 'image' : 'text',
          is_public: true,
          updated_at: new Date().toISOString()
        }));

        for (const setting of settingsArray) {
          await supabase
            .from('site_settings')
            .upsert(setting, { onConflict: 'setting_key' });
        }
      } catch (supabaseError) {
        console.warn('Supabase save failed, but local storage succeeded:', supabaseError);
      }
      
      alert('Brand settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof BrandSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-white text-lg">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading brand settings...
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-screen">
      {/* 좌측: 미리보기 */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-fredoka drop-shadow-lg">
            🎨 Brand Management
          </h1>
          <p className="text-gray-300 mt-2">
            Manage your brand identity and visual elements
          </p>
        </div>

        {/* 로고 미리보기 */}
        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Logo Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 다양한 배경에서의 로고 미리보기 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 어두운 배경 */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-600">
                <p className="text-gray-400 text-sm mb-3">Dark Background</p>
                {settings.logo_url ? (
                  <img 
                    src={settings.logo_url} 
                    alt={settings.site_title}
                    className="h-12 object-contain"
                  />
                ) : (
                  <div className="h-12 flex items-center text-white font-bold text-xl">
                    {settings.site_title}
                  </div>
                )}
              </div>

              {/* 밝은 배경 */}
              <div className="bg-white p-6 rounded-lg border border-gray-300">
                <p className="text-gray-600 text-sm mb-3">Light Background</p>
                {settings.logo_url ? (
                  <img 
                    src={settings.logo_url} 
                    alt={settings.site_title}
                    className="h-12 object-contain"
                  />
                ) : (
                  <div className="h-12 flex items-center text-gray-900 font-bold text-xl">
                    {settings.site_title}
                  </div>
                )}
              </div>
            </div>

            {/* 색상 팔레트 미리보기 */}
            <div>
              <h4 className="text-white font-semibold mb-3">Color Palette</h4>
              <div className="flex gap-4">
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-lg border border-gray-500"
                    style={{ backgroundColor: settings.primary_color }}
                  ></div>
                  <p className="text-gray-300 text-xs mt-2">Primary</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-lg border border-gray-500"
                    style={{ backgroundColor: settings.secondary_color }}
                  ></div>
                  <p className="text-gray-300 text-xs mt-2">Secondary</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-lg border border-gray-500"
                    style={{ backgroundColor: settings.accent_color }}
                  ></div>
                  <p className="text-gray-300 text-xs mt-2">Accent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 우측: 편집 폼 */}
      <div className="w-96 flex-shrink-0">
        <Card className="bg-[#11162A] border-gray-600 h-full">
          <CardHeader className="border-b border-gray-600 bg-gray-800/50">
            <CardTitle className="text-white text-lg font-bold drop-shadow-sm">
              🎨 Brand Editor
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {/* 로고 업로드 */}
            <div>
              <Label className="text-white text-sm font-semibold mb-3 block">🖼️ Logo Image</Label>
              <ImageUpload
                currentImage={settings.logo_url}
                onImageUpload={(url) => updateSetting('logo_url', url)}
                label=""
                storageFolder="branding"
              />
            </div>

            {/* 사이트 정보 */}
            <div>
              <Label className="text-white text-sm font-semibold mb-3 block">📝 Site Information</Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 text-sm font-medium">Site Title</Label>
                  <Input
                    value={settings.site_title}
                    onChange={(e) => updateSetting('site_title', e.target.value)}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Enter site title..."
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm font-medium">Site Description</Label>
                  <Input
                    value={settings.site_description}
                    onChange={(e) => updateSetting('site_description', e.target.value)}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Enter site description..."
                  />
                </div>
              </div>
            </div>

            {/* 색상 설정 */}
            <div>
              <Label className="text-white text-sm font-semibold mb-3 block">🎨 Brand Colors</Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 text-sm font-medium">Primary Color</Label>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-600 bg-[#0F1424]"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      className="bg-[#0F1424] border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="#007AFF"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm font-medium">Secondary Color</Label>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-600 bg-[#0F1424]"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      className="bg-[#0F1424] border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="#00FF88"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm font-medium">Accent Color</Label>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="color"
                      value={settings.accent_color}
                      onChange={(e) => updateSetting('accent_color', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-600 bg-[#0F1424]"
                    />
                    <Input
                      value={settings.accent_color}
                      onChange={(e) => updateSetting('accent_color', e.target.value)}
                      className="bg-[#0F1424] border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="#FFD700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="pt-6 border-t border-gray-600">
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="w-full bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold py-3 shadow-lg transition-all hover:scale-[1.02]"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    💾 Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
