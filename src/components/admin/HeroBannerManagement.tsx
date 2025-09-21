import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import ImageUpload from '../ImageUpload';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AdminService } from '../../lib/adminService';

interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface HeroBannerFormData {
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
}

const defaultBanners: HeroBanner[] = [
  {
    id: "banner-1",
    title: "DADDY",
    subtitle: "BATH BOMB",
    description: "ฮีโร่อ่างอาบน้ำ",
    tagline: "สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ",
    primaryButtonText: "ช้อปบาธบอม",
    secondaryButtonText: "ดูเรื่องราวสีสัน",
    imageUrl: "",
    isActive: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-2",
    title: "FUN",
    subtitle: "BATH TIME",
    description: "Make every bath an adventure!",
    tagline: "Fun & Fizzy Adventures",
    primaryButtonText: "Shop Now",
    secondaryButtonText: "Learn More",
    imageUrl: "",
    isActive: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-3",
    title: "COLORS",
    subtitle: "GALORE",
    description: "Rainbow of fun awaits you!",
    tagline: "Colorful Bath Experience",
    primaryButtonText: "Explore",
    secondaryButtonText: "Gallery",
    imageUrl: "",
    isActive: true,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-4",
    title: "SPARKLE",
    subtitle: "MAGIC",
    description: "Add sparkle to your day!",
    tagline: "Magical Bath Moments",
    primaryButtonText: "Discover",
    secondaryButtonText: "Stories",
    imageUrl: "",
    isActive: true,
    displayOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-5",
    title: "RELAX",
    subtitle: "REVIVE",
    description: "Perfect relaxation time!",
    tagline: "Relaxing Bath Therapy",
    primaryButtonText: "Shop",
    secondaryButtonText: "About",
    imageUrl: "",
    isActive: true,
    displayOrder: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "banner-6",
    title: "FAMILY",
    subtitle: "FUN",
    description: "Fun for the whole family!",
    tagline: "Family Bath Time",
    primaryButtonText: "Products",
    secondaryButtonText: "Contact",
    imageUrl: "",
    isActive: true,
    displayOrder: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function HeroBannerManagement() {
  const [banners, setBanners] = useState<HeroBanner[]>(defaultBanners);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [formData, setFormData] = useState<HeroBannerFormData>({
    title: '',
    subtitle: '',
    description: '',
    tagline: '',
    primaryButtonText: '',
    secondaryButtonText: '',
    imageUrl: '',
    isActive: true,
    displayOrder: 1,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const bannerData = await AdminService.getHeroBanners();
      setBanners(bannerData);
    } catch (error) {
      console.error('Error loading banners:', error);
      setErrorMessage('Failed to load banners');
      setBanners(defaultBanners);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (banner?: HeroBanner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        tagline: banner.tagline,
        primaryButtonText: banner.primaryButtonText,
        secondaryButtonText: banner.secondaryButtonText,
        imageUrl: banner.imageUrl,
        isActive: banner.isActive,
        displayOrder: banner.displayOrder,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        tagline: '',
        primaryButtonText: '',
        secondaryButtonText: '',
        imageUrl: '',
        isActive: true,
        displayOrder: banners.length + 1,
      });
    }
    setDialogOpen(true);
    setErrorMessage(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      tagline: '',
      primaryButtonText: '',
      secondaryButtonText: '',
      imageUrl: '',
      isActive: true,
      displayOrder: 1,
    });
    setErrorMessage(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.subtitle) {
      setErrorMessage('Title and subtitle are required');
      return;
    }

    try {
      setLoading(true);
      
      if (editingBanner) {
        // Update existing banner
        const success = await AdminService.updateHeroBanner(editingBanner.id, formData);
        if (!success) {
          throw new Error('Failed to update banner');
        }
      } else {
        // Create new banner
        const newBanner = await AdminService.createHeroBanner(formData);
        if (!newBanner) {
          throw new Error('Failed to create banner');
        }
      }
      
      await loadBanners(); // Reload banners from server
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving banner:', error);
      setErrorMessage('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (banner: HeroBanner) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      setLoading(true);
      const success = await AdminService.deleteHeroBanner(banner.id);
      if (!success) {
        throw new Error('Failed to delete banner');
      }
      await loadBanners(); // Reload banners from server
    } catch (error) {
      console.error('Error deleting banner:', error);
      setErrorMessage('Failed to delete banner');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (banner: HeroBanner) => {
    try {
      const success = await AdminService.updateHeroBanner(banner.id, {
        isActive: !banner.isActive
      });
      
      if (!success) {
        throw new Error('Failed to update banner status');
      }
      
      await loadBanners(); // Reload banners from server
    } catch (error) {
      console.error('Error toggling banner status:', error);
      setErrorMessage('Failed to update banner status');
    }
  };

  const moveBanner = async (banner: HeroBanner, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    try {
      const targetBanner = banners[newIndex];
      
      // Swap display orders
      await Promise.all([
        AdminService.updateHeroBanner(banner.id, { displayOrder: targetBanner.displayOrder }),
        AdminService.updateHeroBanner(targetBanner.id, { displayOrder: banner.displayOrder })
      ]);
      
      await loadBanners(); // Reload banners from server
    } catch (error) {
      console.error('Error moving banner:', error);
      setErrorMessage('Failed to reorder banners');
    }
  };

  const sortedBanners = [...banners].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Hero Banner Management</h2>
          <p className="text-gray-400">Manage the 6 main banners displayed on the homepage</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Banner
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedBanners.map((banner, index) => (
          <Card key={banner.id} className="bg-[#11162A] border-gray-600 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500 text-white">
                    #{banner.displayOrder}
                  </Badge>
                  <Badge className={banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveBanner(banner, 'up')}
                    disabled={index === 0}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 p-1"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveBanner(banner, 'down')}
                    disabled={index === banners.length - 1}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 p-1"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Banner Preview */}
              <div className="aspect-video bg-gradient-to-br from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-lg flex items-center justify-center relative overflow-hidden">
                {banner.imageUrl ? (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-white">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">No Image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="font-bold text-lg">{banner.title}</h3>
                    <p className="text-sm">{banner.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Banner Info */}
              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold text-white text-sm">Title</h4>
                  <p className="text-gray-300 text-sm truncate">{banner.title}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Subtitle</h4>
                  <p className="text-gray-300 text-sm truncate">{banner.subtitle}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Tagline</h4>
                  <p className="text-gray-300 text-sm truncate">{banner.tagline}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleToggleActive(banner)}
                  className={`flex-1 ${banner.isActive 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-green-500 hover:bg-green-600'
                  } text-white text-xs`}
                >
                  {banner.isActive ? (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenDialog(banner)}
                  className="flex-1 bg-[#007AFF] hover:bg-[#0051D5] text-white text-xs"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(banner)}
                  variant="destructive"
                  className="text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-[#11162A] border-[#1f2a44] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingBanner ? 'Edit Hero Banner' : 'Add New Hero Banner'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-[#0F1424] border-gray-600 text-white"
                  placeholder="Main title"
                />
              </div>
              <div>
                <Label className="text-gray-300">Subtitle *</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="bg-[#0F1424] border-gray-600 text-white"
                  placeholder="Subtitle"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="Description text"
              />
            </div>

            <div>
              <Label className="text-gray-300">Tagline</Label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="Tagline text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Primary Button Text</Label>
                <Input
                  value={formData.primaryButtonText}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryButtonText: e.target.value }))}
                  className="bg-[#0F1424] border-gray-600 text-white"
                  placeholder="Primary button text"
                />
              </div>
              <div>
                <Label className="text-gray-300">Secondary Button Text</Label>
                <Input
                  value={formData.secondaryButtonText}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryButtonText: e.target.value }))}
                  className="bg-[#0F1424] border-gray-600 text-white"
                  placeholder="Secondary button text"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Banner Image</Label>
              <ImageUpload
                currentImage={formData.imageUrl}
                onImageUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                label="Upload banner image"
                storageFolder="hero-banners"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <span className="text-sm text-gray-300">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-gray-300 text-sm">Display Order</Label>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))}
                  className="w-20 bg-[#0F1424] border-gray-600 text-white"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-400 text-sm">{errorMessage}</div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="border-gray-600 text-gray-300"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#007AFF] hover:bg-[#0051D5]"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Banner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
