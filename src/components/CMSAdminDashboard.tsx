import React, { useState } from "react";
import { 
  Home, Menu, X, 
  Image, Camera, Palette, FileText, Bell, Settings
} from "lucide-react";
import type { PageKey } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "./ui/utils";

// CMS 관리 컴포넌트들
import BannerManagement from "./admin/BannerManagement";
import SimpleBrandManagement from "./admin/SimpleBrandManagement";

const DASHBOARD_BACKGROUND = "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800";
const CARD_BACKGROUND = "bg-slate-800/50 backdrop-blur-sm border-slate-700/50";
const SIDEBAR_BACKGROUND = "bg-slate-800/80 backdrop-blur-md border-slate-700/50";

type CMSTab = "overview" | "banners" | "gallery" | "notices" | "branding" | "pages";

interface CMSAdminProps {
  navigateTo?: (page: PageKey) => void;
}

interface MenuItem {
  id: CMSTab;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "Dashboard",
    icon: Home,
    description: "Overview & Quick Actions",
    color: "text-blue-400"
  },
  {
    id: "banners",
    label: "Banner Management",
    icon: Image,
    description: "Hero & Content Banners",
    color: "text-orange-400"
  },
  {
    id: "gallery",
    label: "Gallery Management",
    icon: Camera,
    description: "Instagram Gallery",
    color: "text-pink-400"
  },
  {
    id: "notices",
    label: "Notice Management",
    icon: Bell,
    description: "Announcements & News",
    color: "text-yellow-400"
  },
  {
    id: "branding",
    label: "Brand Management",
    icon: Palette,
    description: "Logo & Brand Identity",
    color: "text-indigo-400"
  },
  {
    id: "pages",
    label: "Page Content",
    icon: FileText,
    description: "About, FAQ, Contact Pages",
    color: "text-green-400"
  }
];

export default function CMSAdminDashboard({ navigateTo }: CMSAdminProps) {
  const [activeTab, setActiveTab] = useState<CMSTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <CMSOverviewSection onSelectTab={setActiveTab} />;
      case "banners":
        return <BannerManagement />;
      case "gallery":
        return <CMSGalleryManagement />;
      case "notices":
        return <CMSNoticeManagement />;
      case "branding":
        return <SimpleBrandManagement />;
      case "pages":
        return <CMSPageManagement />;
      default:
        return <CMSOverviewSection onSelectTab={setActiveTab} />;
    }
  };

  return (
    <div className={cn("min-h-screen text-white", DASHBOARD_BACKGROUND)}>
      {/* Modern Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-md sticky top-0 z-50 shadow-xl">
        <div className="mx-auto flex max-w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-slate-700/50 rounded-xl transition-all"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <Button
              onClick={() => navigateTo?.("home")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Go to Site</span>
            </Button>
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">DB</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white font-inter truncate">CMS Admin</h1>
                <p className="text-sm text-slate-400 truncate">Content Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-sm text-slate-300">
              <div className="bg-slate-700/50 px-4 py-2 rounded-xl backdrop-blur-sm">
                {menuItems.find(item => item.id === activeTab)?.label || "Dashboard"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Modern Sidebar */}
        <aside className={cn(
          SIDEBAR_BACKGROUND,
          "transition-all duration-300 z-50 shadow-2xl",
          "lg:relative lg:translate-x-0",
          sidebarOpen 
            ? "fixed inset-y-0 left-0 w-80 translate-x-0 lg:flex-shrink-0"
            : "fixed -translate-x-full lg:w-0 lg:overflow-hidden"
        )}>
          <nav className="p-6 space-y-2 w-80 h-full overflow-y-auto">
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-2">CMS Management</h2>
              <p className="text-sm text-slate-400">Manage your site content and settings</p>
            </div>
            
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700/30 hover:text-white"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-all",
                  activeTab === item.id
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-slate-700/50 group-hover:bg-slate-600/50"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-slate-400 truncate">{item.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="p-6 lg:p-8 h-full overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// CMS Overview Section
function CMSOverviewSection({ onSelectTab }: { onSelectTab: (tab: CMSTab) => void }) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to CMS Dashboard
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Manage your Daddy Bath Bomb website content with ease
        </p>
      </div>

      {/* Quick Actions */}
      <Card className={cn(CARD_BACKGROUND, "border-slate-600/50")}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            Jump to the most common content management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Button 
            onClick={() => onSelectTab("banners")}
            className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white p-8 h-auto flex flex-col items-center gap-4 rounded-2xl shadow-xl hover:scale-105 transition-all group"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Image className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">Manage Banners</div>
              <div className="text-sm opacity-80">Update hero and promotional banners</div>
            </div>
          </Button>

          <Button 
            onClick={() => onSelectTab("gallery")}
            className="bg-gradient-to-br from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white p-8 h-auto flex flex-col items-center gap-4 rounded-2xl shadow-xl hover:scale-105 transition-all group"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Camera className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">Manage Gallery</div>
              <div className="text-sm opacity-80">Update Instagram gallery images</div>
            </div>
          </Button>

          <Button 
            onClick={() => onSelectTab("notices")}
            className="bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white p-8 h-auto flex flex-col items-center gap-4 rounded-2xl shadow-xl hover:scale-105 transition-all group"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Bell className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">Manage Notices</div>
              <div className="text-sm opacity-80">Create and edit announcements</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Content Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className={cn(CARD_BACKGROUND, "border-orange-500/20 hover:border-orange-400/40 transition-all group")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Active Banners
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-white mt-2">
                  6
                </CardDescription>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-all">
                <Image className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className={cn(CARD_BACKGROUND, "border-pink-500/20 hover:border-pink-400/40 transition-all group")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Gallery Images
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-white mt-2">
                  18
                </CardDescription>
              </div>
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-pink-500/30 transition-all">
                <Camera className="w-6 h-6 text-pink-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className={cn(CARD_BACKGROUND, "border-yellow-500/20 hover:border-yellow-400/40 transition-all group")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Active Notices
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-white mt-2">
                  3
                </CardDescription>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-all">
                <Bell className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className={cn(CARD_BACKGROUND, "border-green-500/20 hover:border-green-400/40 transition-all group")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Pages
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-white mt-2">
                  5
                </CardDescription>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-all">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

// Placeholder CMS Management Components
function CMSGalleryManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Gallery Management</h2>
        <p className="text-slate-400">Manage Instagram gallery images and captions</p>
      </div>
    </div>
  );
}

function CMSNoticeManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Notice Management</h2>
        <p className="text-slate-400">Create and manage announcements and news</p>
      </div>
    </div>
  );
}

function CMSPageManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Page Content Management</h2>
        <p className="text-slate-400">Edit About, FAQ, Contact and other page content</p>
      </div>
    </div>
  );
}

