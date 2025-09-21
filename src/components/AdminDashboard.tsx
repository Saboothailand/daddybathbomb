import React, { useState, useEffect, useCallback } from "react";
import { 
  Home, ExternalLink, Menu, X, 
  BarChart3, ShoppingCart, Package, Image, 
  Star, Camera, Palette, Settings, Users,
  ChevronRight, ChevronDown, Plus, Edit3, Trash2, RefreshCw
} from "lucide-react";
import type { PageKey } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "./ui/utils";
import { AdminService } from "../lib/adminService";
import { supabase, galleryAdminService } from "../lib/supabase";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import ImageUpload from "./ImageUpload";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

// Import actual admin modules
import ProductDetailManager from "./admin/ProductDetailManager";
import BannerManagement from "./admin/BannerManagement";
import HeroBannerManagement from "./admin/HeroBannerManagement";
import OrderManagement from "./admin/OrderManagement";
import LogoManagement from "./admin/LogoManagement";
import ImprovedLogoManagement from "./admin/ImprovedLogoManagement";

const DASHBOARD_BACKGROUND = "bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a2f3e]";
const GRADIENT_BUTTON = "bg-gradient-to-r from-[#FF2D55] via-[#AF52DE] to-[#5C4BFF] text-white";

type DashboardTab = "overview" | "orders" | "products" | "banners" | "hero-banners" | "features" | "gallery" | "branding" | "settings";

type AdminDashboardProps = {
  navigateTo?: (page: PageKey) => void;
};

interface MenuItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "Dashboard",
    icon: BarChart3,
    description: "Overview & Analytics"
  },
  {
    id: "orders",
    label: "Order Management",
    icon: ShoppingCart,
    description: "Customer Orders Status",
    badge: "3"
  },
  {
    id: "products",
    label: "Product Management",
    icon: Package,
    description: "Product Catalog Management"
  },
  {
    id: "banners",
    label: "Banner Management",
    icon: Image,
    description: "Middle, Bottom Banners"
  },
  {
    id: "hero-banners",
    label: "Hero Banners",
    icon: Star,
    description: "Main Page Hero Banners"
  },
  {
    id: "features",
    label: "Features Management",
    icon: Star,
    description: "Site Feature Highlights"
  },
  {
    id: "gallery",
    label: "Gallery Management",
    icon: Camera,
    description: "Instagram Gallery"
  },
  {
    id: "branding",
    label: "Brand Management",
    icon: Palette,
    description: "Logo, Colors, Brand Identity"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Site Settings & Configuration"
  }
];

export default function AdminDashboard({ navigateTo }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
      } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSection onSelectTab={setActiveTab} />;
      case "orders":
        return <OrderManagement />;
      case "products":
        return <ProductDetailManager />;
      case "banners":
        return <BannerManagement />;
      case "hero-banners":
        return <HeroBannerManagement />;
      case "features":
        return <FeaturesManagement />;
      case "gallery":
        return <GalleryManagement />;
      case "branding":
        return <ImprovedLogoManagement />;
      default:
        return <OverviewSection onSelectTab={setActiveTab} />;
    }
  };

  return (
    <div className={cn("min-h-screen text-white", DASHBOARD_BACKGROUND)}>
      {/* Top header */}
      <header className="border-b border-gray-600 bg-[#11162A] sticky top-0 z-50 shadow-lg">
        <div className="mx-auto flex max-w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Left side: sidebar toggle + Go to Site button + brand */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-700 flex-shrink-0"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={() => navigateTo?.("home")}
              className="bg-[#007AFF] hover:bg-[#0051D5] text-white px-3 py-2 rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all hover:brightness-110 flex-shrink-0"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Go to Site</span>
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">DB</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-white font-fredoka truncate">Admin Panel</h1>
                <p className="text-xs text-gray-300 truncate">Daddy Bath Bomb</p>
              </div>
            </div>
          </div>

          {/* Right side: current tab indicator */}
          <div className="text-sm text-gray-300 flex-shrink-0 ml-4 hidden md:block">
            <div className="bg-gray-800 px-3 py-1 rounded-full">
              {menuItems.find(item => item.id === activeTab)?.label || "Dashboard"}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-[#11162A] border-r border-gray-600 min-h-screen">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.id}>
                <button 
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200",
                      activeTab === item.id
                        ? "bg-[#007AFF] text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-[#FF2D55] text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                </div>
                    {item.children && (
                <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(item.id);
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        {expandedMenus.has(item.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </button>
                  
                  {item.children && expandedMenus.has(item.id) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                                <button
                          key={child.id}
                          onClick={() => setActiveTab(child.id as DashboardTab)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200",
                            activeTab === child.id
                              ? "bg-[#007AFF] text-white"
                              : "text-gray-400 hover:bg-gray-700 hover:text-white"
                          )}
                        >
                          <child.icon className="w-3 h-3" />
                          {child.label}
                                </button>
                        ))}
                      </div>
                    )}
                  </div>
              ))}
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
                </div>
              </div>
  );
}


// Overview section
function OverviewSection({ onSelectTab }: { onSelectTab: (tab: DashboardTab) => void }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await AdminService.getDashboardStats();
      setStats(data);
                          } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <Card className="border-gray-600 bg-[#11162A] text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-300">
              Total Products
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-white">
              {loading ? "..." : stats.totalProducts}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-gray-600 bg-[#11162A] text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-300">
              Active Orders
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-white">
              12
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-gray-600 bg-[#11162A] text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-300">
              Hero Banners
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-white">
              6
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-gray-600 bg-[#11162A] text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-300">
              Other Banners
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-white">
              4
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-gray-600 bg-[#11162A] text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-300">
              Gallery Images
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-white">
              18
            </CardDescription>
          </CardHeader>
        </Card>
                    </div>

      <Card className="border-white/10 bg-[#11162A] text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-[#94A3C4]">
            Quick shortcuts to the most common tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <Button 
            onClick={() => onSelectTab("products")}
            className="bg-[#007AFF] hover:bg-[#0051D5] text-white p-6 h-auto flex flex-col items-center gap-2"
          >
            <span className="text-2xl">📦</span>
            <span>Add New Product</span>
          </Button>
          <Button 
            onClick={() => onSelectTab("hero-banners")}
            className="bg-[#FFD700] hover:bg-[#FFC107] text-black p-6 h-auto flex flex-col items-center gap-2"
          >
            <span className="text-2xl">🌟</span>
            <span>Hero Banners</span>
          </Button>
          <Button 
            onClick={() => onSelectTab("banners")}
            className="bg-[#00FF88] hover:bg-[#00CC6A] text-black p-6 h-auto flex flex-col items-center gap-2"
          >
            <span className="text-2xl">🖼️</span>
            <span>Other Banners</span>
          </Button>
          <Button 
            onClick={() => onSelectTab("orders")}
            className="bg-[#FF2D55] hover:bg-[#FF1744] text-white p-6 h-auto flex flex-col items-center gap-2"
          >
            <span className="text-2xl">🛒</span>
            <span>Check Orders</span>
          </Button>
        </CardContent>
      </Card>
                    </div>
  );
}

// Features management component
type FeatureRecord = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean | null;
};

function FeaturesManagement() {
  const [features, setFeatures] = useState<FeatureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFeatures((data as FeatureRecord[] | null) ?? []);
    } catch (error) {
      console.error('Error loading features:', error);
      setErrorMessage('Failed to load feature data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Features Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={loadFeatures}
          >
            Reload
          </Button>
          <Button className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold">
            Add New Feature
          </Button>
                        </div>
                      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-300">
          Loading features...
                        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          {errorMessage}
                      </div>
      ) : features.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-600 p-8 text-center text-gray-300">
          No features registered yet.
                    </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-[#11162A] border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={feature.image_url || 'https://placehold.co/800x450?text=Feature'}
                  alt={feature.title || 'Feature image'}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                {feature.is_active === false && (
                  <Badge className="absolute top-2 left-2 bg-[#64748B] text-white">Inactive</Badge>
                )}
                      </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-white font-bold text-lg">
                  {feature.title || 'No Title'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {feature.description || 'No description available.'}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#007AFF] hover:bg-[#0051D5]">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive">
                    Delete
                  </Button>
                    </div>
              </CardContent>
            </Card>
          ))}
                  </div>
      )}
                </div>
  );
}

type GalleryRecord = {
  id: string;
  image_url: string | null;
  caption: string | null;
  is_active: boolean | null;
  display_order: number | null;
};

// Gallery management component
function GalleryManagement() {
  const [images, setImages] = useState<GalleryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    id: null as string | null,
    image_url: '',
    caption: '',
    is_active: true,
    display_order: 1,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const computeNextOrder = useCallback(() => {
    if (images.length === 0) return 1;
    const maxOrder = Math.max(...images.map((img) => img.display_order ?? 0));
    return maxOrder + 1;
  }, [images]);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await galleryAdminService.list(true);
      setImages((data as GalleryRecord[] | null) ?? []);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      setErrorMessage('Failed to load gallery images.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleDialogToggle = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormError(null);
      setFormState({
        id: null,
        image_url: '',
        caption: '',
        is_active: true,
        display_order: computeNextOrder(),
      });
    }
  };

  const openCreateDialog = () => {
    setFormState({
      id: null,
      image_url: '',
      caption: '',
      is_active: true,
      display_order: computeNextOrder(),
    });
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditDialog = (image: GalleryRecord) => {
    setFormState({
      id: image.id,
      image_url: image.image_url ?? '',
      caption: image.caption ?? '',
      is_active: image.is_active ?? true,
      display_order: image.display_order ?? computeNextOrder(),
    });
    setFormError(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formState.image_url) {
      setFormError('Please upload an image.');
      return;
    }

    setSaving(true);
    try {
      await galleryAdminService.save({
        id: formState.id,
        image_url: formState.image_url,
        caption: formState.caption?.trim() || null,
        is_active: formState.is_active,
        display_order: Number.isFinite(formState.display_order)
          ? Number(formState.display_order)
          : computeNextOrder(),
      });
      setDialogOpen(false);
      await loadImages();
    } catch (error: any) {
      console.error('Error saving gallery image:', error);
      setFormError(error?.message ?? 'Failed to save gallery image.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (image: GalleryRecord) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) {
      return;
    }

    try {
      await galleryAdminService.delete(image.id);
      await loadImages();
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      alert('Failed to delete gallery image.');
    }
  };

  const sortedImages = [...images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Instagram Gallery Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={loadImages}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
          <Button
            className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold flex items-center gap-2"
            onClick={openCreateDialog}
          >
            <Plus className="w-4 h-4" />
            Add New Image
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-300">
          Loading gallery images...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50/20 p-6 text-center text-red-300">
          {errorMessage}
        </div>
      ) : sortedImages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-600 p-8 text-center text-gray-300">
          No gallery images registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedImages.map((image) => (
            <Card key={image.id} className="bg-[#11162A] border-gray-600 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={image.image_url || 'https://placehold.co/400x400?text=Gallery'}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className="bg-black/70 text-white">
                    #{image.display_order ?? 0}
                  </Badge>
                  <Badge className={image.is_active ? 'bg-[#00FF88] text-black' : 'bg-[#64748B] text-white'}>
                    {image.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3 space-y-3">
                <p className="text-white text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                  {image.caption || 'No Caption'}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#007AFF] hover:bg-[#0051D5] text-xs flex items-center justify-center gap-1"
                    onClick={() => openEditDialog(image)}
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 text-xs flex items-center justify-center gap-1"
                    onClick={() => handleDelete(image)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogToggle}>
        <DialogContent className="bg-[#11162A] border-[#1f2a44] text-white space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {formState.id ? 'Edit Gallery Image' : 'Add Gallery Image'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Image</Label>
              <ImageUpload
                currentImage={formState.image_url}
                onImageUpload={(url) => {
                  setFormState((prev) => ({ ...prev, image_url: url }));
                  setFormError(null);
                }}
                label=""
                storageFolder="gallery"
              />
              {formError && !formState.image_url && (
                <p className="text-sm text-red-400 mt-2">{formError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Caption</Label>
              <Textarea
                value={formState.caption ?? ''}
                onChange={(event) => setFormState((prev) => ({ ...prev, caption: event.target.value }))}
                rows={3}
                className="bg-[#0F1424] border-gray-600 text-white"
                placeholder="Enter an optional caption"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formState.is_active}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, is_active: checked }))}
                />
                <span className="text-sm text-gray-300">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="gallery-order" className="text-gray-300 text-sm">
                  Display Order
                </Label>
                <Input
                  id="gallery-order"
                  type="number"
                  min={0}
                  value={formState.display_order ?? 0}
                  onChange={(event) => {
                    const value = Number.parseInt(event.target.value, 10);
                    setFormState((prev) => ({ ...prev, display_order: Number.isNaN(value) ? 0 : value }));
                  }}
                  className="w-24 bg-[#0F1424] border-gray-600 text-white"
                />
              </div>
            </div>

            {formError && formState.image_url && (
              <p className="text-sm text-red-400">{formError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={() => handleDialogToggle(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#007AFF] hover:bg-[#0051D5]"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}