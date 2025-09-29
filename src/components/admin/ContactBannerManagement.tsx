import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { supabase } from '../../lib/supabase';

interface ContactBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  overlay_opacity: number;
  text_color: string;
  created_at: string;
  updated_at: string;
}

export default function ContactBannerManagement() {
  const [banners, setBanners] = useState<ContactBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<ContactBanner | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    display_order: 0,
    overlay_opacity: 0.4,
    text_color: '#FFFFFF'
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_contact_banners');
      if (error) {
        console.error('Error loading banners:', error);
      } else {
        setBanners(data || []);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'overlay_opacity' || name === 'display_order' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `contact-banner-${Date.now()}.${fileExt}`;
      const filePath = `contact-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingBanner) {
        // 업데이트
        const { error } = await supabase.rpc('update_contact_banner', {
          p_id: editingBanner.id,
          p_title: formData.title,
          p_subtitle: formData.subtitle,
          p_image_url: formData.image_url,
          p_display_order: formData.display_order,
          p_overlay_opacity: formData.overlay_opacity,
          p_text_color: formData.text_color
        });

        if (error) {
          console.error('Error updating banner:', error);
          return;
        }
      } else {
        // 새로 추가
        const { error } = await supabase.rpc('add_contact_banner', {
          p_title: formData.title,
          p_subtitle: formData.subtitle,
          p_image_url: formData.image_url,
          p_display_order: formData.display_order,
          p_overlay_opacity: formData.overlay_opacity,
          p_text_color: formData.text_color
        });

        if (error) {
          console.error('Error adding banner:', error);
          return;
        }
      }

      await loadBanners();
      resetForm();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner: ContactBanner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      display_order: banner.display_order,
      overlay_opacity: banner.overlay_opacity,
      text_color: banner.text_color
    });
    setIsAddingNew(false);
  };

  const handleToggleActive = async (banner: ContactBanner) => {
    try {
      const { error } = await supabase.rpc('update_contact_banner', {
        p_id: banner.id,
        p_is_active: !banner.is_active
      });

      if (error) {
        console.error('Error toggling banner:', error);
        return;
      }

      await loadBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  const handleDelete = async (banner: ContactBanner) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error } = await supabase.rpc('delete_contact_banner', {
        p_id: banner.id
      });

      if (error) {
        console.error('Error deleting banner:', error);
        return;
      }

      await loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      display_order: 0,
      overlay_opacity: 0.4,
      text_color: '#FFFFFF'
    });
    setEditingBanner(null);
    setIsAddingNew(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2D55]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contact Banner Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setIsAddingNew(true);
          }}
          className="bg-[#FF2D55] hover:bg-[#FF1744] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Banner
        </Button>
      </div>

      {/* Form */}
      {(isAddingNew || editingBanner) && (
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Banner title"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <Input
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <Textarea
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Banner subtitle"
                rows={3}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <div className="flex gap-2">
                <Input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="flex-1"
                />
                <label className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overlay Opacity (0.0 - 1.0)
                </label>
                <Input
                  name="overlay_opacity"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.overlay_opacity}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <Input
                  name="text_color"
                  type="color"
                  value={formData.text_color}
                  onChange={handleInputChange}
                  className="w-full h-10"
                />
              </div>
            </div>

            {/* Preview */}
            {formData.image_url && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(0, 0, 0, ${formData.overlay_opacity})` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 
                        className="text-2xl font-bold mb-2"
                        style={{ color: formData.text_color }}
                      >
                        {formData.title}
                      </h3>
                      {formData.subtitle && (
                        <p 
                          className="text-lg"
                          style={{ color: formData.text_color }}
                        >
                          {formData.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={!formData.title || !formData.image_url || uploading}
                className="bg-[#FF2D55] hover:bg-[#FF1744] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Save'}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="bg-white border border-gray-200 shadow-lg">
            <div className="relative h-48 rounded-t-lg overflow-hidden">
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: `rgba(0, 0, 0, ${banner.overlay_opacity})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{ color: banner.text_color }}
                  >
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p 
                      className="text-sm"
                      style={{ color: banner.text_color }}
                    >
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  banner.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {banner.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Order: {banner.display_order}
                </p>
                <p className="text-sm text-gray-600">
                  Opacity: {banner.overlay_opacity}
                </p>
                <p className="text-sm text-gray-600">
                  Color: {banner.text_color}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleEdit(banner)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleToggleActive(banner)}
                  size="sm"
                  variant="outline"
                  className={banner.is_active ? 'text-orange-600' : 'text-green-600'}
                >
                  {banner.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  onClick={() => handleDelete(banner)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No banners found. Add your first banner to get started.
        </div>
      )}
    </div>
  );
}
