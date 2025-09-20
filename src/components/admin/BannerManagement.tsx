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
      alert('Banner has been saved successfully!');
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('An error occurred while saving the banner. Please try again.');
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner? This action cannot be undone.')) return;
    
    try {
      await cmsService.deleteBanner(bannerId);
      await loadBanners();
      alert('Banner has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('An error occurred while deleting the banner. Please try again.');
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
    <div className="flex gap-6 h-screen">
      {/* 좌측: 배너 목록 */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white font-fredoka">
            🎨 Banner Management
          </h1>
          <div className="flex gap-2">
            {(['hero', 'middle', 'bottom', 'sidebar'] as BannerPosition[]).map((type) => (
              <Button
                key={type}
                onClick={() => startCreate(type)}
                size="sm"
                className={`${
                  type === 'hero' ? 'bg-[#00FF88] hover:bg-[#00CC6A] text-black' :
                  type === 'middle' ? 'bg-[#FF9F1C] hover:bg-[#E6890F] text-black' :
                  type === 'bottom' ? 'bg-[#AF52DE] hover:bg-[#9333EA] text-white' :
                  'bg-[#22D3EE] hover:bg-[#0EA5E9] text-black'
                }`}
              >
                <Plus className="w-3 h-3 mr-1" />
                {type === 'hero' ? '🎯' : type === 'middle' ? '📍' : type === 'bottom' ? '📍' : '🧱'}
              </Button>
            ))}
          </div>
        </div>

        {/* Hero Banners */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            🎯 Hero Banners 
            <span className="text-sm text-gray-400 ml-2 bg-gray-800 px-2 py-1 rounded">
              {groupedBanners.hero.length}
            </span>
          </h3>
          <div className="space-y-3">
            {groupedBanners.hero.map((banner) => (
              <BannerListItem
                key={banner.id}
                banner={banner}
                onEdit={() => startEdit(banner)}
                onDelete={() => deleteBanner(banner.id)}
                onToggleStatus={(isActive) => toggleBannerStatus(banner.id, isActive)}
              />
            ))}
            {groupedBanners.hero.length === 0 && (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/20">
                <p className="text-sm">No Hero banners available</p>
                <p className="text-xs text-gray-600 mt-1">Click the + button above to add one</p>
              </div>
            )}
          </div>
        </div>

        {/* Middle Banners */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            📍 Middle Banners 
            <span className="text-sm text-gray-400 ml-2 bg-gray-800 px-2 py-1 rounded">
              {groupedBanners.middle.length}
            </span>
          </h3>
          <div className="space-y-3">
            {groupedBanners.middle.map((banner) => (
              <BannerListItem
                key={banner.id}
                banner={banner}
                onEdit={() => startEdit(banner)}
                onDelete={() => deleteBanner(banner.id)}
                onToggleStatus={(isActive) => toggleBannerStatus(banner.id, isActive)}
              />
            ))}
            {groupedBanners.middle.length === 0 && (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/20">
                <p className="text-sm">No Middle banners available</p>
                <p className="text-xs text-gray-600 mt-1">Click the + button above to add one</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Banners */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            📍 Bottom Banners 
            <span className="text-sm text-gray-400 ml-2 bg-gray-800 px-2 py-1 rounded">
              {groupedBanners.bottom.length}
            </span>
          </h3>
          <div className="space-y-3">
            {groupedBanners.bottom.map((banner) => (
              <BannerListItem
                key={banner.id}
                banner={banner}
                onEdit={() => startEdit(banner)}
                onDelete={() => deleteBanner(banner.id)}
                onToggleStatus={(isActive) => toggleBannerStatus(banner.id, isActive)}
              />
            ))}
            {groupedBanners.bottom.length === 0 && (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/20">
                <p className="text-sm">No Bottom banners available</p>
                <p className="text-xs text-gray-600 mt-1">Click the + button above to add one</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Banners */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            🧱 Sidebar Banners 
            <span className="text-sm text-gray-400 ml-2 bg-gray-800 px-2 py-1 rounded">
              {groupedBanners.sidebar.length}
            </span>
          </h3>
          <div className="space-y-3">
            {groupedBanners.sidebar.map((banner) => (
              <BannerListItem
                key={banner.id}
                banner={banner}
                onEdit={() => startEdit(banner)}
                onDelete={() => deleteBanner(banner.id)}
                onToggleStatus={(isActive) => toggleBannerStatus(banner.id, isActive)}
              />
            ))}
            {groupedBanners.sidebar.length === 0 && (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/20">
                <p className="text-sm">No Sidebar banners available</p>
                <p className="text-xs text-gray-600 mt-1">Click the + button above to add one</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 우측: 배너 편집 폼 */}
      <div className="w-96 flex-shrink-0">
        {showForm ? (
          <Card className="bg-[#11162A] border-gray-600 h-full">
            <CardHeader className="border-b border-gray-600">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {editingBanner ? 'Edit Banner' : `Add ${formData.position.toUpperCase()} Banner`}
                </CardTitle>
                <Button onClick={resetForm} variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {/* 배너 타입 */}
              <div>
                <Label className="text-gray-400 text-sm font-medium">Banner Position</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {(['hero', 'middle', 'bottom', 'sidebar'] as BannerPosition[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, position: type })}
                      size="sm"
                      className={`${
                        formData.position === type
                          ? 'bg-[#007AFF] text-white'
                          : 'bg-[#1E293B] text-gray-300 hover:text-white'
                      }`}
                    >
                      {type === 'hero' ? '🎯' : type === 'middle' ? '📍' : type === 'bottom' ? '📍' : '🧱'}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <Label className="text-gray-400 text-sm font-medium">Banner Image</Label>
                <div className="mt-2">
                  <ImageUpload
                    currentImage={formData.image_url}
                    onImageUpload={(url) => setFormData({ ...formData, image_url: url })}
                    label=""
                  />
                </div>
              </div>

              {/* 텍스트 내용 */}
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm font-medium">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2"
                    placeholder="Banner title"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-400 text-sm font-medium">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2"
                    rows={2}
                    placeholder="Banner description"
                  />
                </div>

                <div>
                  <Label className="text-gray-400 text-sm font-medium">Link URL</Label>
                  <Input
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2"
                    placeholder="/products"
                  />
                </div>
              </div>

              {/* 설정 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-400 text-sm">Active</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-gray-400 text-sm">Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                    className="bg-[#0F1424] border-gray-600 text-white w-20"
                    min="1"
                  />
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3 pt-4 border-t border-gray-600">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-[#64748B] hover:bg-[#475569] text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveBanner}
                  className="flex-1 bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold"
                  disabled={!formData.title || !formData.image_url}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#11162A] border-gray-600 h-full">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
              <ImageIcon className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Banner Editor</h3>
              <p className="text-gray-400 text-sm mb-6">
                Select a banner from the left<br />
                or create a new one
              </p>
              <div className="flex flex-wrap gap-2">
                {(['hero', 'middle', 'bottom', 'sidebar'] as BannerPosition[]).map((type) => (
                  <Button
                    key={type}
                    onClick={() => startCreate(type)}
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:text-white"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {type === 'hero' ? '🎯' : type === 'middle' ? '📍' : type === 'bottom' ? '📍' : '🧱'}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// 배너 목록 아이템 컴포넌트
interface BannerListItemProps {
  banner: Banner;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: (isActive: boolean) => void;
}

function BannerListItem({ banner, onEdit, onDelete, onToggleStatus }: BannerListItemProps) {
  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-[#00FF88] text-black';
      case 'middle': return 'bg-[#FF9F1C] text-black';
      case 'bottom': return 'bg-[#AF52DE] text-white';
      case 'sidebar': return 'bg-[#22D3EE] text-black';
      default: return 'bg-[#64748B] text-white';
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
    <div className="bg-[#1E293B] border border-gray-600 rounded-lg p-3 hover:border-[#007AFF] transition-all group">
      <div className="flex items-center gap-3">
        {/* 배너 이미지 (작은 크기) */}
        <div className="w-16 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-700">
          <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* 배너 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`${getBannerTypeColor(banner.position)} text-xs px-2 py-0.5`}>
              {getBannerTypeIcon(banner.position)} {banner.position.toUpperCase()}
            </Badge>
            <Badge className="bg-gray-700 text-white text-xs px-2 py-0.5">
              #{banner.display_order}
            </Badge>
            <Badge className={banner.is_active ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
              {banner.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <h4 className="text-white font-medium text-sm truncate mb-1">{banner.title}</h4>
          {banner.description && (
            <p className="text-gray-400 text-xs line-clamp-1">{banner.description}</p>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => onToggleStatus(!banner.is_active)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          >
            {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            onClick={onEdit}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            onClick={onDelete}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// 개별 배너 카드 컴포넌트 (사용하지 않음 - 참고용)
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
            <h3 className="text-white font-bold text-lg line-clamp-1">{banner.title}</h3>
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
