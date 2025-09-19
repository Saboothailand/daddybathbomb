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

const DASHBOARD_BACKGROUND = "bg-white";
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
    label: "대시보드",
    icon: BarChart3,
    description: "전체 현황 및 통계"
  },
  {
    id: "orders",
    label: "주문 관리",
    icon: ShoppingCart,
    description: "고객 주문 현황",
    badge: "3"
  },
  {
    id: "products",
    label: "상품 관리",
    icon: Package,
    description: "상품 카탈로그 관리"
  },
  {
    id: "banners",
    label: "배너 관리",
    icon: Image,
    description: "헤로, 중간, 하단 배너"
  },
  {
    id: "features",
    label: "특징 관리",
    icon: Star,
    description: "사이트 특징 하이라이트"
  },
  {
    id: "gallery",
    label: "갤러리 관리",
    icon: Camera,
    description: "인스타그램 갤러리"
  },
  {
    id: "branding",
    label: "브랜딩 관리",
    icon: Palette,
    description: "로고, 컬러, 브랜드 아이덴티티"
  },
  {
    id: "settings",
    label: "설정",
    icon: Settings,
    description: "사이트 설정 및 관리"
  }
];

export default function AdminDashboard({ navigateTo }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  return (
    <div className={cn("min-h-screen text-gray-900", DASHBOARD_BACKGROUND)}>
      {/* 상단 헤더 - Go to Site 버튼 포함 */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* 왼쪽: Go to Site + 로고 */}
          <div className="flex items-center gap-6">
            <Button
              onClick={() => navigateTo?.("home")}
              className="bg-[#007AFF] hover:bg-[#0051D5] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Go to Site
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">DB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-fredoka">Admin Panel</h1>
                <p className="text-sm text-gray-600">Daddy Bath Bomb</p>
              </div>
            </div>
          </div>
          
          {/* 오른쪽: 저장 버튼 */}
          <Button
            className={cn("rounded-2xl px-5 py-3 font-semibold shadow-lg", GRADIENT_BUTTON)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DashboardTab)}>
          <TabsList className="flex flex-wrap gap-2 bg-gray-50 border border-gray-200 p-2 mb-8 rounded-xl shadow-sm">
            <DashboardTabTrigger value="overview" label="📊 Dashboard" />
            <DashboardTabTrigger value="orders" label="🛒 Orders" />
            <DashboardTabTrigger value="products" label="📦 Products" />
            <DashboardTabTrigger value="banners" label="🖼️ Banners" />
            <DashboardTabTrigger value="features" label="⭐ Features" />
            <DashboardTabTrigger value="gallery" label="📸 Gallery" />
            <DashboardTabTrigger value="branding" label="🎨 Branding" />
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8">
            <OverviewSection onSelectTab={setActiveTab} />
          </TabsContent>

          {/* Orders Tab - 실제 주문 관리 컴포넌트 */}
          <TabsContent value="orders" className="mt-8">
            <OrderManagement />
          </TabsContent>

          {/* Products Tab - 실제 제품 관리 컴포넌트 */}
          <TabsContent value="products" className="mt-8">
            <ProductDetailManager />
          </TabsContent>

          {/* Banners Tab - 실제 배너 관리 컴포넌트 */}
          <TabsContent value="banners" className="mt-8">
            <BannerManagement />
          </TabsContent>

          {/* Features Tab - 특징 관리 */}
          <TabsContent value="features" className="mt-8">
            <FeaturesManagement />
          </TabsContent>

          {/* Gallery Tab - 갤러리 관리 */}
          <TabsContent value="gallery" className="mt-8">
            <GalleryManagement />
          </TabsContent>

          {/* Branding Tab - 개선된 로고 관리 컴포넌트 */}
          <TabsContent value="branding" className="mt-8">
            <ImprovedLogoManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// 탭 트리거 컴포넌트
function DashboardTabTrigger({ value, label }: { value: DashboardTab; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-[#007AFF] data-[state=active]:text-white rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
    >
      {label}
    </TabsTrigger>
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
        <Card className="border-gray-200 bg-white text-gray-900 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-500">
              Total Products
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-gray-900">
              {loading ? "..." : stats.totalProducts}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-gray-200 bg-white text-gray-900 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-500">
              Active Orders
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-gray-900">
              12
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-gray-200 bg-white text-gray-900 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-500">
              Active Banners
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-gray-900">
              6
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-gray-200 bg-white text-gray-900 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider text-gray-500">
              Gallery Images
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-gray-900">
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
        <h2 className="text-2xl font-bold text-gray-900">Features Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700"
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
        <div className="flex items-center justify-center py-12 text-gray-600">
          Loading features...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          {errorMessage}
        </div>
      ) : features.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
          등록된 Feature가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
                <h3 className="text-gray-900 font-bold text-lg">
                  {feature.title || '제목 없음'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description || '설명이 없습니다.'}
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
      setErrorMessage('갤러리 이미지를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Instagram Gallery Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700"
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
        <div className="flex items-center justify-center py-12 text-gray-600">
          Loading gallery images...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          {errorMessage}
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
          등록된 갤러리 이미지가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="bg-white border-gray-200 overflow-hidden">
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
                <p className="text-gray-900 text-sm font-medium line-clamp-2">
                  {image.caption || '캡션 없음'}
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
