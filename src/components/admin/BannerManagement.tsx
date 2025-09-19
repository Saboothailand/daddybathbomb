import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import ImageUpload from '../ImageUpload';
import { cmsService } from '../../lib/supabase';

type BannerPosition = 'hero' | 'middle' | 'bottom' | 'sidebar';

interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
  position: BannerPosition;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface BannerFormData {
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  position: BannerPosition;
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    display_order: 1,
    is_active: true,
    position: 'hero'
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getBanners(null, { activeOnly: false });
      const sortOrder: BannerPosition[] = ['hero', 'middle', 'bottom', 'sidebar'];
      const sorted = (data || []).sort((a: Banner, b: Banner) => {
        const indexA = sortOrder.indexOf(a.position);
        const indexB = sortOrder.indexOf(b.position);
        const positionDiff = (indexA === -1 ? sortOrder.length : indexA) - (indexB === -1 ? sortOrder.length : indexB);
        if (positionDiff !== 0) return positionDiff;
        return (a.display_order ?? 0) - (b.display_order ?? 0);
      });
      setBanners(sorted);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async () => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url,
        link_url: formData.link_url || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
        position: formData.position,
      };

      if (editingBanner) {
        await cmsService.updateBanner(editingBanner.id, payload);
      } else {
        await cmsService.createBanner(payload);
      }
      
      await loadBanners();
      resetForm();
      alert('배너가 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('배너 저장 중 오류가 발생했습니다.');
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (!confirm('정말 이 배너를 삭제하시겠습니까?')) return;
    
    try {
      await cmsService.deleteBanner(bannerId);
      await loadBanners();
      alert('배너가 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('배너 삭제 중 오류가 발생했습니다.');
    }
  };

  const toggleBannerStatus = async (bannerId: string, isActive: boolean) => {
    try {
      await cmsService.updateBanner(bannerId, { is_active: isActive });
      await loadBanners();
    } catch (error) {
      console.error('Error updating banner status:', error);
    }
  };

  const startEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      display_order: banner.display_order ?? 1,
      is_active: banner.is_active,
      position: banner.position
    });
    setShowForm(true);
  };

  const startCreate = (bannerPosition: BannerPosition) => {
    setEditingBanner(null);
    const existingOrders = banners
      .filter(b => b.position === bannerPosition)
      .map(b => b.display_order ?? 0);
    const nextOrder = Math.max(0, ...existingOrders) + 1;
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      display_order: nextOrder,
      is_active: true,
      position: bannerPosition
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingBanner(null);
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      display_order: 1,
      is_active: true,
      position: 'hero'
    });
  };

  const groupedBanners = {
    hero: banners.filter(b => b.position === 'hero'),
    middle: banners.filter(b => b.position === 'middle'),
    bottom: banners.filter(b => b.position === 'bottom'),
    sidebar: banners.filter(b => b.position === 'sidebar'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading banners...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Banners Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              🎯 Hero Banners
            </h2>
            <p className="text-[#B8C4DB] text-sm">메인 페이지 상단 슬라이더 (3개 권장)</p>
          </div>
          <Button
            onClick={() => startCreate('hero')}
            className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Hero Banner 추가
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {groupedBanners.hero.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={() => startEdit(banner)}
              onDelete={() => deleteBanner(banner.id)}
              onToggleStatus={(isActive) => toggleBannerStatus(banner.id, isActive)}
            />
          ))}
          
          {/* 빈 슬롯 표시 (3개 미만일 때) */}
          {groupedBanners.hero.length < 3 && (
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
              <ImageIcon className="w-12 h-12 text-[#64748B] mb-4" />
              <p className="text-[#64748B] text-sm mb-4">Hero Banner Slot {groupedBanners.hero.length + 1}</p>
              <Button
                onClick={() => startCreate('hero')}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                추가하기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Middle Banners Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              📍 Middle Banners
            </h2>
            <p className="text-[#B8C4DB] text-sm">페이지 중간 프로모션 배너</p>
          </div>
          <Button
            onClick={() => startCreate('middle')}
            className="bg-[#FF9F1C] hover:bg-[#E6890F] text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Middle Banner 추가
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupedBanners.middle.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={() => startEdit(banner)}
              onDelete={() => deleteBanner(banner.id)}
              onToggleStatus={(isActive) => toggleBannerStatus(banner.id, isActive)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Banners Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              📍 Bottom Banners
            </h2>
            <p className="text-[#B8C4DB] text-sm">페이지 하단 CTA 배너</p>
          </div>
          <Button
            onClick={() => startCreate('bottom')}
            className="bg-[#AF52DE] hover:bg-[#9333EA] text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Bottom Banner 추가
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupedBanners.bottom.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={() => startEdit(banner)}
              onDelete={() => deleteBanner(banner.id)}
              onToggleStatus={(isActive) => toggleBannerStatus(banner.id, isActive)}
            />
          ))}
        </div>
      </div>

      {/* Sidebar Banners Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              🧱 Sidebar Banners
            </h2>
            <p className="text-[#B8C4DB] text-sm">사이드바/추가 영역 배너</p>
          </div>
          <Button
            onClick={() => startCreate('sidebar')}
            className="bg-[#22D3EE] hover:bg-[#0EA5E9] text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Sidebar Banner 추가
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupedBanners.sidebar.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={() => startEdit(banner)}
              onDelete={() => deleteBanner(banner.id)}
              onToggleStatus={(isActive) => toggleBannerStatus(banner.id, isActive)}
            />
          ))}

          {groupedBanners.sidebar.length === 0 && (
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[220px]">
              <ImageIcon className="w-12 h-12 text-[#64748B] mb-4" />
              <p className="text-[#64748B] text-sm mb-4">Sidebar Banner Slot</p>
              <Button
                onClick={() => startCreate('sidebar')}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                추가하기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Banner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11162A] rounded-2xl border border-gray-600 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-600 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingBanner ? '배너 수정' : `${formData.position.toUpperCase()} 배너 추가`}
              </h3>
              <Button onClick={resetForm} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 배너 타입 */}
              <div>
                <Label className="text-gray-400 text-sm font-medium">배너 위치</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {(['hero', 'middle', 'bottom', 'sidebar'] as BannerPosition[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, position: type })}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        formData.position === type
                          ? 'bg-[#007AFF] text-white'
                          : 'bg-[#1E293B] text-gray-300 hover:text-white'
                      }`}
                    >
                      {type === 'hero'
                        ? '🎯 Hero'
                        : type === 'middle'
                          ? '📍 Middle'
                          : type === 'bottom'
                            ? '📍 Bottom'
                            : '🧱 Sidebar'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <Label className="text-gray-400 text-sm font-medium">배너 이미지</Label>
                <div className="mt-2 max-w-lg">
                  <ImageUpload
                    currentImage={formData.image_url}
                    onImageUpload={(url) => setFormData({ ...formData, image_url: url })}
                    label=""
                  />
                </div>
              </div>

              {/* 텍스트 내용 */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-gray-400 text-sm font-medium">대제목 (Main Title)</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2"
                    placeholder="예: Premium Bath Bombs"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-400 text-sm font-medium">조제목 (Description)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2"
                    rows={3}
                    placeholder="예: Experience the ultimate bathing adventure with our superhero-themed natural bath bombs"
                  />
                </div>

                <div>
                  <Label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    링크 URL (선택)
                    <span className="text-xs text-[#64748B]">버튼 클릭 시 이동할 주소</span>
                  </Label>
                  <Input
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2"
                    placeholder="예: /products 또는 https://example.com"
                  />
                </div>
              </div>

              {/* 설정 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label className="text-gray-400 text-sm">활성화</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label className="text-gray-400 text-sm">순서:</Label>
                    <Input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                      className="bg-[#0F1424] border-gray-600 text-white w-20"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3 pt-4 border-t border-gray-600">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-[#64748B] hover:bg-[#475569] text-white"
                >
                  취소
                </Button>
                <Button
                  onClick={saveBanner}
                  className="flex-1 bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold"
                  disabled={!formData.title || !formData.image_url}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingBanner ? '수정 완료' : '배너 생성'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 개별 배너 카드 컴포넌트
interface BannerCardProps {
  banner: Banner;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: (isActive: boolean) => void;
}

function BannerCard({ banner, onEdit, onDelete, onToggleStatus }: BannerCardProps) {
  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-[#007AFF]';
      case 'middle': return 'bg-[#FF9F1C]';
      case 'bottom': return 'bg-[#AF52DE]';
      case 'sidebar': return 'bg-[#22D3EE]';
      default: return 'bg-[#64748B]';
    }
  };

  const getBannerTypeIcon = (type: string) => {
    switch (type) {
      case 'hero': return '🎯';
      case 'middle': return '📍';
      case 'bottom': return '📍';
      case 'sidebar': return '🧱';
      default: return '🖼️';
    }
  };

  return (
    <Card className="bg-[#11162A] border-gray-600 overflow-hidden hover:border-[#007AFF] transition-all duration-300">
      {/* 배너 이미지 */}
      <div className="relative aspect-video">
        <img
          src={banner.image_url}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
        
        {/* 오버레이 정보 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${getBannerTypeColor(banner.position)} text-white`}>
              {getBannerTypeIcon(banner.position)} {banner.position.toUpperCase()}
            </Badge>
            <Badge className="bg-[#1E293B] text-white">
              Order #{banner.display_order}
            </Badge>
          </div>
          
          <div className="absolute top-3 right-3">
            <Button
              onClick={() => onToggleStatus(!banner.is_active)}
              size="sm"
              className={banner.is_active ? "bg-[#00FF88] text-black" : "bg-[#64748B] text-white"}
            >
              {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>

          {/* 텍스트 미리보기 */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{banner.title}</h3>
            {banner.description && (
              <p className="text-[#94A3B8] text-xs line-clamp-2">{banner.description}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* 배너 정보 */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-white text-lg">{banner.title}</h4>
            {banner.link_url && (
              <p className="text-[#007AFF] text-xs break-all">링크: {banner.link_url}</p>
            )}
          </div>
          <Badge className={banner.is_active ? "bg-[#00FF88] text-black" : "bg-[#64748B] text-white"}>
            {banner.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onEdit}
            size="sm"
            className="flex-1 bg-[#007AFF] hover:bg-[#0051D5] text-gray-900"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            수정
          </Button>
          <Button
            onClick={onDelete}
            size="sm"
            variant="destructive"
            className="bg-[#FF2D55] hover:bg-[#FF1744]"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
