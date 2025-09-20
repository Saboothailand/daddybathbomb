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
      {/* Left column: banner list */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-fredoka drop-shadow-lg">
            🎨 Banner Management
          </h1>
          <div className="flex gap-2 flex-wrap">
            {(['hero', 'middle', 'bottom', 'sidebar'] as BannerPosition[]).map((type) => (
              <Button
                key={type}
                onClick={() => startCreate(type)}
                size="sm"
                className={`font-semibold text-sm px-4 py-2 ${
                  type === 'hero' ? 'bg-[#00FF88] hover:bg-[#00CC6A] text-black shadow-lg border border-green-300' :
                  type === 'middle' ? 'bg-[#FF9F1C] hover:bg-[#E6890F] text-black shadow-lg border border-orange-300' :
                  type === 'bottom' ? 'bg-[#AF52DE] hover:bg-[#9333EA] text-white shadow-lg border border-purple-300' :
                  'bg-[#22D3EE] hover:bg-[#0EA5E9] text-black shadow-lg border border-cyan-300'
                } transition-all duration-200 hover:scale-105`}
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">
                  {type === 'hero' ? '🎯 Hero' : type === 'middle' ? '📍 Middle' : type === 'bottom' ? '📍 Bottom' : '🧱 Sidebar'}
                </span>
                <span className="sm:hidden">
                  {type === 'hero' ? '🎯' : type === 'middle' ? '📍' : type === 'bottom' ? '📍' : '🧱'}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Hero Banners */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center drop-shadow-md">
            🎯 Hero Banners 
            <span className="text-sm font-medium text-gray-300 ml-3 bg-gray-700/80 px-3 py-1 rounded-full border border-gray-600">
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
          <h3 className="text-xl font-bold text-white mb-4 flex items-center drop-shadow-md">
            📍 Middle Banners 
            <span className="text-sm font-medium text-gray-300 ml-3 bg-gray-700/80 px-3 py-1 rounded-full border border-gray-600">
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
          <h3 className="text-xl font-bold text-white mb-4 flex items-center drop-shadow-md">
            📍 Bottom Banners 
            <span className="text-sm font-medium text-gray-300 ml-3 bg-gray-700/80 px-3 py-1 rounded-full border border-gray-600">
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
          <h3 className="text-xl font-bold text-white mb-4 flex items-center drop-shadow-md">
            🧱 Sidebar Banners 
            <span className="text-sm font-medium text-gray-300 ml-3 bg-gray-700/80 px-3 py-1 rounded-full border border-gray-600">
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

      {/* Right column: banner edit form */}
      <div className="w-96 flex-shrink-0">
        {showForm ? (
          <Card className="bg-[#11162A] border-gray-600 h-full">
            <CardHeader className="border-b border-gray-600 bg-gray-800/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg font-bold drop-shadow-sm">
                  {editingBanner ? '✏️ Edit Banner' : `➕ Add ${formData.position.toUpperCase()} Banner`}
                </CardTitle>
                <Button 
                  onClick={resetForm} 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {/* Banner position selector */}
              <div>
                <Label className="text-white text-sm font-semibold mb-3 block">📍 Banner Position</Label>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {(['hero', 'middle', 'bottom', 'sidebar'] as BannerPosition[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, position: type })}
                      size="sm"
                      className={`font-medium px-3 py-2 border transition-all ${
                        formData.position === type
                          ? 'bg-[#007AFF] text-white border-blue-400 shadow-lg'
                          : 'bg-[#1E293B] text-gray-300 hover:text-white border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                      }`}
                    >
                      {type === 'hero' ? '🎯' : type === 'middle' ? '📍' : type === 'bottom' ? '📍' : '🧱'}
                      <span className="ml-1">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div>
                <Label className="text-white text-sm font-semibold mb-3 block">🖼️ Banner Image</Label>
                <div className="mt-3">
                  <ImageUpload
                    currentImage={formData.image_url}
                    onImageUpload={(url) => setFormData({ ...formData, image_url: url })}
                    label=""
                    storageFolder="banners"
                  />
                </div>
              </div>

              {/* Text fields */}
              <div className="space-y-5">
                <div>
                  <Label className="text-white text-sm font-semibold mb-2 block">✏️ Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Enter banner title..."
                    required
                  />
                </div>

                <div>
                  <Label className="text-white text-sm font-semibold mb-2 block">📝 Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    rows={3}
                    placeholder="Enter banner description..."
                  />
                </div>

                <div>
                  <Label className="text-white text-sm font-semibold mb-2 block">🔗 Link URL</Label>
                  <Input
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="/products or https://example.com"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4 bg-gray-800/30 p-4 rounded-lg border border-gray-600">
                <Label className="text-white text-sm font-semibold block">⚙️ Settings</Label>
                
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-sm font-medium">Active Status</Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${formData.is_active ? 'text-green-400' : 'text-gray-500'}`}>
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-sm font-medium">Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                    className="bg-[#0F1424] border-gray-600 text-white w-20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    min="1"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-600">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-[#64748B] hover:bg-[#475569] text-white font-semibold transition-all hover:scale-[1.02]"
                >
                  ❌ Cancel
                </Button>
                <Button
                  onClick={saveBanner}
                  className="flex-1 bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold shadow-lg transition-all hover:scale-[1.02]"
                  disabled={!formData.title || !formData.image_url}
                >
                  <Save className="w-4 h-4 mr-2" />
                  💾 Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#11162A] border-gray-600 h-full">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <ImageIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-sm">🎨 Banner Editor</h3>
              <p className="text-gray-300 text-base mb-8 leading-relaxed">
                Select a banner from the left<br />
                or create a new one to get started
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {(['hero', 'middle', 'bottom', 'sidebar'] as BannerPosition[]).map((type) => (
                  <Button
                    key={type}
                    onClick={() => startCreate(type)}
                    size="sm"
                    className={`font-semibold px-4 py-2 transition-all hover:scale-105 ${
                      type === 'hero' ? 'bg-[#00FF88] hover:bg-[#00CC6A] text-black shadow-lg' :
                      type === 'middle' ? 'bg-[#FF9F1C] hover:bg-[#E6890F] text-black shadow-lg' :
                      type === 'bottom' ? 'bg-[#AF52DE] hover:bg-[#9333EA] text-white shadow-lg' :
                      'bg-[#22D3EE] hover:bg-[#0EA5E9] text-black shadow-lg'
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {type === 'hero' ? '🎯 Hero' : type === 'middle' ? '📍 Middle' : type === 'bottom' ? '📍 Bottom' : '🧱 Sidebar'}
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

// Banner list item component
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
    <div className="bg-[#1E293B] border border-gray-600 rounded-lg p-4 hover:border-[#007AFF] hover:shadow-lg transition-all group">
      <div className="flex items-center gap-4">
        {/* Banner thumbnail */}
        <div className="w-20 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-700 border border-gray-500">
          <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Banner information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${getBannerTypeColor(banner.position)} text-xs px-3 py-1 font-semibold border`}>
              {getBannerTypeIcon(banner.position)} {banner.position.toUpperCase()}
            </Badge>
            <Badge className="bg-gray-700 text-white text-xs px-2 py-1 border border-gray-500">
              #{banner.display_order}
            </Badge>
            <Badge className={banner.is_active ? "bg-green-600 text-white border-green-400" : "bg-gray-600 text-white border-gray-400"}>
              {banner.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <h4 className="text-white font-semibold text-base truncate mb-1 drop-shadow-sm">{banner.title}</h4>
          {banner.description && (
            <p className="text-gray-300 text-sm line-clamp-1 leading-relaxed">{banner.description}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => onToggleStatus(!banner.is_active)}
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-gray-500 transition-all"
            title={banner.is_active ? 'Hide Banner' : 'Show Banner'}
          >
            {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            onClick={onEdit}
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 border border-transparent hover:border-blue-500 transition-all"
            title="Edit Banner"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            onClick={onDelete}
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-transparent hover:border-red-500 transition-all"
            title="Delete Banner"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Individual banner card component (unused sample)
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
      {/* Banner image */}
      <div className="relative aspect-video">
        <img
          src={banner.image_url}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay information */}
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

          {/* Text preview */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-lg line-clamp-1">{banner.title}</h3>
          </div>
        </div>
      </div>
      
      {/* Banner details */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-white text-lg">{banner.title}</h4>
            {banner.link_url && (
              <p className="text-[#007AFF] text-xs break-all">Link: {banner.link_url}</p>
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
            Edit
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
