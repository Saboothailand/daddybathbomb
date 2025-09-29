import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Twitter, 
  Facebook, 
  Link, 
  FileText, 
  Save, 
  RefreshCw,
  Eye,
  ExternalLink,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { AdminService, type SEOSettings } from '../../lib/adminService';
import ImageUpload from '../ImageUpload';

export default function SEOManagement() {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    robotsTxt: '',
    sitemapUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const settings = await AdminService.getSEOSettings();
      setSeoSettings(settings);
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      setErrorMessage('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const success = await AdminService.updateSEOSettings(seoSettings);
      if (success) {
        setSuccessMessage('SEO settings saved successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage('Failed to save SEO settings');
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      setErrorMessage('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SEOSettings, value: string) => {
    setSeoSettings(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#007AFF]" />
          <p className="text-gray-300">Loading SEO settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6" />
            SEO & Meta Tags Management
          </h2>
          <p className="text-gray-400 mt-1">Manage your site's SEO settings and meta tags</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadSEOSettings}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#007AFF] hover:bg-[#0051D5] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic SEO Settings */}
        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Basic SEO Settings
            </CardTitle>
            <CardDescription className="text-gray-400">
              Core SEO elements for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Site Title *</Label>
              <div className="flex gap-2">
                <Input
                  value={seoSettings.siteTitle}
                  onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                  className="bg-[#0F1424] border-gray-600 text-white flex-1"
                  placeholder="Your site title (50-60 characters)"
                  maxLength={60}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(seoSettings.siteTitle)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-3"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400">
                  {seoSettings.siteTitle.length}/60 characters
                </span>
                <span className="text-xs text-gray-500">
                  Click edit icon to copy
                </span>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Meta Description *</Label>
              <div className="space-y-2">
                <Textarea
                  value={seoSettings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  className="bg-[#0F1424] border-gray-600 text-white"
                  placeholder="Your site description (150-160 characters)"
                  rows={3}
                  maxLength={160}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {seoSettings.siteDescription.length}/160 characters
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(seoSettings.siteDescription)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-3"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Keywords</Label>
              <Input
                value={seoSettings.siteKeywords}
                onChange={(e) => handleInputChange('siteKeywords', e.target.value)}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate keywords with commas
              </p>
            </div>

            <div>
              <Label className="text-gray-300">Canonical URL</Label>
              <Input
                value={seoSettings.canonicalUrl}
                onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="https://yourdomain.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Meta Tags */}
        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Facebook className="w-5 h-5" />
              Social Media Meta Tags
            </CardTitle>
            <CardDescription className="text-gray-400">
              Open Graph and Twitter Card settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Open Graph Title</Label>
              <Input
                value={seoSettings.ogTitle}
                onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="Title for social media sharing"
                maxLength={60}
              />
            </div>

            <div>
              <Label className="text-gray-300">Open Graph Description</Label>
              <Textarea
                value={seoSettings.ogDescription}
                onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="Description for social media sharing"
                rows={3}
                maxLength={160}
              />
            </div>

            <div>
              <Label className="text-gray-300">Open Graph Image</Label>
              <ImageUpload
                currentImage={seoSettings.ogImage}
                onImageUpload={(url) => handleInputChange('ogImage', url)}
                label="Upload OG Image (1200x630px recommended)"
                storageFolder="seo"
              />
            </div>

            <div>
              <Label className="text-gray-300">Twitter Title</Label>
              <Input
                value={seoSettings.twitterTitle}
                onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="Title for Twitter sharing"
                maxLength={60}
              />
            </div>

            <div>
              <Label className="text-gray-300">Twitter Description</Label>
              <Textarea
                value={seoSettings.twitterDescription}
                onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="Description for Twitter sharing"
                rows={3}
                maxLength={160}
              />
            </div>

            <div>
              <Label className="text-gray-300">Twitter Image</Label>
              <ImageUpload
                currentImage={seoSettings.twitterImage}
                onImageUpload={(url) => handleInputChange('twitterImage', url)}
                label="Upload Twitter Image (1200x630px recommended)"
                storageFolder="seo"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical SEO */}
      <Card className="bg-[#11162A] border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Technical SEO
          </CardTitle>
          <CardDescription className="text-gray-400">
            Robots.txt and sitemap configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Robots.txt Content</Label>
            <Textarea
              value={seoSettings.robotsTxt}
              onChange={(e) => handleInputChange('robotsTxt', e.target.value)}
              className="bg-[#0F1424] border-gray-600 text-white font-mono text-sm"
              placeholder="User-agent: *&#10;Allow: /&#10;Sitemap: https://yourdomain.com/sitemap.xml"
              rows={6}
            />
            <p className="text-xs text-gray-400 mt-1">
              This will be available at /robots.txt
            </p>
          </div>

          <div>
            <Label className="text-gray-300">Sitemap URL</Label>
            <Input
              value={seoSettings.sitemapUrl}
              onChange={(e) => handleInputChange('sitemapUrl', e.target.value)}
              className="bg-[#0F1424] border-gray-600 text-white"
              placeholder="https://yourdomain.com/sitemap.xml"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="bg-[#11162A] border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            SEO Preview
          </CardTitle>
          <CardDescription className="text-gray-400">
            How your site will appear in search results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-600 rounded-lg p-4 bg-[#0F1424]">
            <div className="flex items-start gap-3">
              {seoSettings.ogImage && (
                <img
                  src={seoSettings.ogImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                  {seoSettings.siteTitle || 'Your Site Title'}
                </h3>
                <p className="text-green-700 text-sm">
                  {seoSettings.canonicalUrl || 'https://yourdomain.com'}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {seoSettings.siteDescription || 'Your site description will appear here...'}
                </p>
                <div className="flex gap-2 mt-2">
                  {seoSettings.siteKeywords && (
                    <Badge variant="outline" className="text-xs">
                      {seoSettings.siteKeywords.split(',')[0]?.trim()}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    SEO Ready
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
