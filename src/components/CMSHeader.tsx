import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  User,
  Menu,
  Bell,
  HelpCircle,
  MessagesSquare,
  Camera,
  FileText,
  Image
} from "lucide-react";

import type { LanguageKey, PageKey } from "../App";
import { t } from "../utils/translations";
import AuthModal from "./AuthModal";
import { Button } from "./ui/button";
import SimpleEditable from "./SimpleEditable";
import LogoEditor from "./LogoEditor";
import { AdminService } from "../lib/adminService";

type BrandingState = {
  logo_url?: string;
  site_title?: string;
  primary_color?: string;
};

type HeaderProps = {
  currentPage: PageKey;
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
  changeLanguage: (language: LanguageKey) => void;
};

type NavItem = {
  key: PageKey | "gallery" | "board";
  label: string;
  highlightColor: string;
  icon?: React.ComponentType<any>;
  action?: () => void;
};

const navHighlightMap: Record<PageKey | "gallery" | "board", string> = {
  home: "bg-[#FFD700]",
  products: "bg-[#00FF88]",
  about: "bg-[#007AFF]",
  gallery: "bg-[#FF2D55]",
  board: "bg-[#FF9F1C]",
  notice: "bg-[#AF52DE]",
  faq: "bg-[#00C2FF]",
  contact: "bg-[#FF1744]",
  admin: "bg-[#FF2D55]",
};

export default function CMSHeader({
  currentPage,
  navigateTo,
  language,
  changeLanguage,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [branding, setBranding] = useState<BrandingState>({
    logo_url: "",
    site_title: "Daddy Bath Bomb",
    primary_color: "#FF2D55",
  });

  const loadBranding = useCallback(async () => {
    try {
      const settings = await AdminService.getSiteSettings();
      setBranding((prev) => ({
        ...prev,
        logo_url: settings.logo_url || prev.logo_url || "",
        site_title: settings.site_title || prev.site_title || "Daddy Bath Bomb",
        primary_color: settings.primary_color || prev.primary_color || "#FF2D55",
      }));
    } catch (error) {
      console.error("Error loading branding:", error);
    }
  }, []);

  const updateBranding = async (key: string, value: string) => {
    try {
      await AdminService.updateSiteSetting(key, value, 'text');
      setBranding(prev => ({ ...prev, [key]: value }));
      
      // 브랜딩 업데이트 이벤트 발생
      window.dispatchEvent(new CustomEvent('brandingUpdated', { 
        detail: { key, value } 
      }));
      
      // 로고 변경 시 추가 이벤트
      if (key === 'logo_url') {
        window.dispatchEvent(new CustomEvent('logoChanged', { 
          detail: { logoUrl: value } 
        }));
      }
    } catch (error) {
      console.error('브랜딩 업데이트 실패:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadBranding();
  }, [loadBranding]);

  useEffect(() => {
    const handleBrandingUpdate = (event: any) => {
      console.log('브랜딩 업데이트 감지:', event.detail);
      loadBranding();
    };

    const handleLogoChange = (event: any) => {
      console.log('로고 변경 감지:', event.detail);
      setBranding(prev => ({ ...prev, logo_url: event.detail.logoUrl }));
    };

    window.addEventListener("brandingUpdated", handleBrandingUpdate);
    window.addEventListener("logoChanged", handleLogoChange);

    return () => {
      window.removeEventListener("brandingUpdated", handleBrandingUpdate);
      window.removeEventListener("logoChanged", handleLogoChange);
    };
  }, [loadBranding]);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        key: "home",
        label: t("home", language),
        highlightColor: navHighlightMap.home,
        action: () => navigateTo("home"),
      },
      {
        key: "products",
        label: t("products", language),
        highlightColor: navHighlightMap.products,
        action: () => navigateTo("products"),
      },
      {
        key: "about",
        label: t("about", language),
        highlightColor: navHighlightMap.about,
        action: () => navigateTo("about"),
      },
      {
        key: "gallery",
        label: language === "th" ? "แกลเลอรี่" : "Gallery",
        highlightColor: navHighlightMap.gallery,
        icon: Camera,
        action: () => navigateTo("gallery"),
      },
      {
        key: "board",
        label: language === "th" ? "กระทู้" : "Board",
        highlightColor: navHighlightMap.board,
        icon: FileText,
        action: () => navigateTo("board"),
      },
    ],
    [language, navigateTo],
  );

  const utilityItems: NavItem[] = useMemo(
    () => [
      {
        key: "notice",
        label: t("notice", language),
        highlightColor: navHighlightMap.notice,
        icon: Bell,
        action: () => navigateTo("notice"),
      },
      {
        key: "faq",
        label: t("faq", language),
        highlightColor: navHighlightMap.faq,
        icon: HelpCircle,
        action: () => navigateTo("faq"),
      },
      {
        key: "contact",
        label: t("contact", language),
        highlightColor: navHighlightMap.contact,
        icon: MessagesSquare,
        action: () => navigateTo("contact"),
      },
    ],
    [language, navigateTo],
  );

  const handleLogoClick = () => {
    setAdminClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        alert("관리자 페이지로 이동합니다!");
        navigateTo("admin");
        setTimeout(() => setAdminClicks(0), 0);
        return 0;
      }

      window.setTimeout(() => setAdminClicks(0), 3000);
      return next;
    });
  };

  return (
    <header className="w-full bg-[#0B0F1A] border-b-4 border-[#FF2D55] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-10 w-8 h-8 bg-[#FFD700] rounded-full" />
        <div className="absolute top-6 right-20 w-4 h-4 bg-[#00FF88] rounded-full" />
        <div className="absolute bottom-4 left-1/3 w-6 h-6 bg-[#007AFF] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleLogoClick}
            title={adminClicks > 0 ? `관리자 접근: ${adminClicks}/5` : "홈으로 이동"}
          >
            <LogoEditor
              currentLogoUrl={branding.logo_url}
              onSave={(newLogoUrl) => updateBranding('logo_url', newLogoUrl)}
              className="w-12 h-12 bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full flex items-center justify-center comic-border overflow-hidden"
            />
            <SimpleEditable
              value={branding.site_title || "DADDY BATH BOMB"}
              onSave={(value) => updateBranding('site_title', value)}
              className="font-fredoka text-2xl font-bold text-white comic-shadow"
              placeholder="사이트 타이틀을 입력하세요..."
            >
              <h1 className="font-fredoka text-2xl font-bold text-white comic-shadow flex items-center gap-2">
                <span>{branding.site_title || "DADDY BATH BOMB"}</span>
              </h1>
            </SimpleEditable>
            {adminClicks > 0 && (
              <span className="bg-[#FF2D55] text-white text-xs font-bold px-2 py-1 rounded-full comic-border border-2 border-black">
                {adminClicks}
              </span>
            )}
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={item.action}
                className={`font-nunito text-lg font-bold text-[#B8C4DB] hover:text-white transition-colors relative group flex items-center gap-2`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-1 rounded-full transition-all group-hover:w-full ${item.highlightColor}`}
                  style={{ width: currentPage === item.key ? "100%" : "0%" }}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden xl:flex items-center space-x-4 mr-4">
              {utilityItems.map((item) => (
                <button
                  key={item.key}
                  onClick={item.action}
                  className="font-nunito text-sm font-bold text-[#94A3B8] hover:text-white transition-colors relative group flex items-center gap-1"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all group-hover:w-full ${item.highlightColor}`}
                    style={{ width: currentPage === item.key ? "100%" : "0%" }}
                  />
                </button>
              ))}
            </div>

            <select
              value={language}
              onChange={(event) => changeLanguage(event.target.value as LanguageKey)}
              className="hidden md:block bg-[#151B2E] border border-[#334155] text-[#B8C4DB] text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
            >
              <option value="th">🇹🇭 ไทย</option>
              <option value="en">🇺🇸 English</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              className="p-3 text-[#B8C4DB] hover:text-white hover:bg-[#151B2E] rounded-full comic-button"
              onClick={() => navigateTo("gallery")}
            >
              <Camera className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-3 text-[#B8C4DB] hover:text-white hover:bg-[#151B2E] rounded-full comic-button"
              onClick={() => navigateTo("board")}
            >
              <FileText className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-3 text-[#B8C4DB] hover:text-white hover:bg-[#151B2E] rounded-full comic-button"
              onClick={() => setShowAuth(true)}
            >
              <User className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-3 text-[#B8C4DB] hover:text-white hover:bg-[#151B2E] rounded-full lg:hidden comic-button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-[#0F1424] border-t border-[#1E293B] mt-2 rounded-2xl p-4 space-y-2">
            {[...navItems, ...utilityItems].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  item.action?.();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-[#B8C4DB] hover:text-white text-sm font-semibold py-2 flex items-center gap-2"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </button>
            ))}

            <div className="flex items-center justify-between pt-2">
              <select
                value={language}
                onChange={(event) => changeLanguage(event.target.value as LanguageKey)}
                className="bg-[#151B2E] border border-[#334155] text-[#B8C4DB] text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              >
                <option value="th">🇹🇭 ไทย</option>
                <option value="en">🇺🇸 English</option>
              </select>
              <Button
                size="sm"
                className="bg-[#FF2D55] hover:bg-[#FF1744] text-white rounded-xl"
                onClick={() => {
                  setShowAuth(true);
                  setIsMenuOpen(false);
                }}
              >
                {language === "th" ? "เข้าสู่ระบบ" : "Login"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} language={language} />
    </header>
  );
}

