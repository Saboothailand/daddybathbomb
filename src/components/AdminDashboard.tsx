import React, { useState, useEffect } from "react";
import { 
  Home, ExternalLink, Menu, X, 
  BarChart3, ShoppingCart, Package, Image, 
  Star, Camera, Palette, Settings, Users,
  ChevronRight, ChevronDown
} from "lucide-react";
import type { PageKey } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "./ui/utils";
import { AdminService } from "../lib/adminService";
import { supabase } from "../lib/supabase";

// 실제 관리 컴포넌트들 import
import ProductDetailManager from "./admin/ProductDetailManager";
import BannerManagement from "./admin/BannerManagement";
import OrderManagement from "./admin/OrderManagement";
import LogoManagement from "./admin/LogoManagement";
import ImprovedLogoManagement from "./admin/ImprovedLogoManagement";

const DASHBOARD_BACKGROUND = "bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a2f3e]";
const GRADIENT_BUTTON = "bg-gradient-to-r from-[#FF2D55] via-[#AF52DE] to-[#5C4BFF] text-white";

type DashboardTab = "overview" | "orders" | "products" | "banners" | "features" | "gallery" | "branding" | "settings";

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
    description: "Hero, Middle, Bottom Banners"
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
      {/* 상단 헤더 */}
      <header className="border-b border-gray-600 bg-[#11162A] sticky top-0 z-50 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* 왼쪽: 메뉴 토글 + Go to Site + 로고 */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={() => navigateTo?.("home")}
              className="bg-[#007AFF] hover:bg-[#0051D5] text-white px-4 py-2 rounded-lg font-semibold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Go to Site
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">DB</span>
            </div>
              <div>
                <h1 className="text-lg font-bold text-white font-fredoka">Admin Panel</h1>
                <p className="text-xs text-gray-300">Daddy Bath Bomb</p>
              </div>
        </div>
      </div>

          {/* 오른쪽: 현재 탭 표시 */}
          <div className="text-sm text-gray-300">
            {menuItems.find(item => item.id === activeTab)?.label || "Dashboard"}
            </div>
          </div>
        </header>

      <div className="flex">
        {/* 사이드바 */}
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

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
                </div>
              </div>
  );
}


// Overview 섹션
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
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
              Active Banners
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-white">
              6
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
            자주 사용하는 기능들에 빠르게 접근하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button 
            onClick={() => onSelectTab("products")}
            className="bg-[#007AFF] hover:bg-[#0051D5] text-white p-6 h-auto flex flex-col items-center gap-2"
          >
            <span className="text-2xl">📦</span>
            <span>Add New Product</span>
          </Button>
          <Button 
            onClick={() => onSelectTab("banners")}
            className="bg-[#00FF88] hover:bg-[#00CC6A] text-black p-6 h-auto flex flex-col items-center gap-2"
          >
            <span className="text-2xl">🖼️</span>
            <span>Manage Banners</span>
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

// Features 관리 컴포넌트
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
      setErrorMessage('피처 데이터를 불러오지 못했습니다.');
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
};

// Gallery 관리 컴포넌트
function GalleryManagement() {
  const [images, setImages] = useState<GalleryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
                    try {
                      setLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages((data as GalleryRecord[] | null) ?? []);
                    } catch (error) {
      console.error('Error loading gallery images:', error);
      setErrorMessage('Failed to load gallery images.');
                    } finally {
                      setLoading(false);
                    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Instagram Gallery Management</h2>
                    <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={loadImages}
          >
            Reload
          </Button>
          <Button className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold">
            Add New Image
          </Button>
                    </div>
                    </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-300">
          Loading gallery images...
                </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          {errorMessage}
              </div>
      ) : images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-600 p-8 text-center text-gray-300">
          No gallery images registered yet.
                  </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="bg-[#11162A] border-gray-600 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={image.image_url || 'https://placehold.co/400x400?text=Gallery'}
                  alt={image.caption || 'Gallery image'}
                        className="w-full h-full object-cover"
                      />
                <div className="absolute top-2 right-2">
                  <Badge className={image.is_active ? "bg-[#00FF88] text-black" : "bg-[#64748B] text-white"}>
                    {image.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                      </div>
                    </div>
              <CardContent className="p-3 space-y-2">
                <p className="text-white text-sm font-medium line-clamp-2">
                  {image.caption || 'No Caption'}
                </p>
                <div className="flex gap-1">
                  <Button size="sm" className="flex-1 bg-[#007AFF] hover:bg-[#0051D5] text-xs">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="text-xs">
                    Del
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
