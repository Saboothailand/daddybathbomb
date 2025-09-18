import React, { useState, useEffect } from "react";
import { Home, ExternalLink } from "lucide-react";
import type { PageKey } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "./ui/utils";
import { AdminService } from "../lib/adminService";

// 실제 관리 컴포넌트들 import
import ProductDetailManager from "./admin/ProductDetailManager";
import BannerManagement from "./admin/BannerManagement";
import OrderManagement from "./admin/OrderManagement";
import LogoManagement from "./admin/LogoManagement";

const DASHBOARD_BACKGROUND = "bg-white";
const GRADIENT_BUTTON = "bg-gradient-to-r from-[#FF2D55] via-[#AF52DE] to-[#5C4BFF] text-white";

type DashboardTab = "overview" | "orders" | "products" | "banners" | "features" | "gallery" | "branding";

type AdminDashboardProps = {
  navigateTo?: (page: PageKey) => void;
};

export default function AdminDashboard({ navigateTo }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

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

          {/* Branding Tab - 실제 로고 관리 컴포넌트 */}
          <TabsContent value="branding" className="mt-8">
            <LogoManagement />
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
function FeaturesManagement() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      // Features 테이블이 없으므로 임시 데이터 사용
      const mockFeatures = [
        {
          id: '1',
      title: 'Natural Ingredients',
      description: 'Made from 100% natural ingredients, safe for the whole family',
          image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop',
          is_active: true,
          display_order: 1
    },
    {
          id: '2', 
      title: 'Beautiful Fizzy Colors',
      description: 'Beautiful colorful fizz with relaxing aromatherapy scents',
          image_url: 'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400&h=300&fit=crop',
          is_active: true,
          display_order: 2
        }
      ];
      setFeatures(mockFeatures);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
          <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Features Management</h2>
        <Button className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold">
          Add New Feature
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
            <Card key={feature.id} className="bg-gray-50 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video relative">
              <img
                src={feature.image_url}
                alt={feature.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-[#B8C4DB] text-sm mb-4">{feature.description}</p>
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
            </div>
  );
}

// Gallery 관리 컴포넌트
function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      // Gallery 테이블이 없으므로 임시 데이터 사용
      const mockImages = [
        {
          id: '1',
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
          caption: 'Super Hero Bath Bomb in action',
          is_active: true,
          display_order: 1
        },
        {
          id: '2',
          image_url: 'https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=300&h=300&fit=crop',
          caption: 'Ocean Dreams collection',
          is_active: true,
          display_order: 2
        }
      ];
      setImages(mockImages);
                    } catch (error) {
      console.error('Error loading gallery images:', error);
                    } finally {
                      setLoading(false);
                    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Instagram Gallery Management</h2>
        <Button className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold">
          Add New Image
        </Button>
              </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="bg-[#151B2E] border-[#334155] overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={image.image_url}
                alt={image.caption}
                        className="w-full h-full object-cover"
                      />
              <div className="absolute top-2 right-2">
                <Badge className={image.is_active ? "bg-[#00FF88] text-black" : "bg-[#64748B] text-white"}>
                  {image.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-gray-900 text-sm font-medium line-clamp-2">{image.caption}</p>
              <div className="flex gap-1 mt-2">
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
    </div>
  );
}
