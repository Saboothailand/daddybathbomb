import { useState, useEffect, useCallback } from "react";
import CMSHeader from "./components/CMSHeader";
import Hero from "./components/Hero";
import FunFeatures from "./components/FunFeatures";
import HowToUse from "./components/HowToUse";
import InstagramGallery from "./components/InstagramGallery";
import ProductsPage from "./components/ProductsPage";
import GalleryPage from "./components/GalleryPage";
import NoticePage from "./components/NoticePage";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import SparkleEffect from "./components/SparkleEffect";
import AboutPage from "./components/AboutPage";
import FAQPage from "./components/FAQPage";
import ContactPage from "./components/ContactPage";
import CMSAdminDashboard from "./components/CMSAdminDashboard";
import MiddleBanner from "./components/MiddleBanner";
import EditableContent from "./components/EditableContent";

const NAVIGATION_EVENT_NAME = "navigate";

export type PageKey =
  | "home"
  | "products"
  | "about"
  | "gallery"
  | "board"
  | "notice"
  | "faq"
  | "contact"
  | "admin";

export type LanguageKey = "th" | "en";

declare global {
  interface Window {
    navigateTo?: (page: PageKey) => void;
    changeLanguage?: (language: LanguageKey) => void;
    currentPage?: PageKey;
    currentLanguage?: LanguageKey;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [language, setLanguage] = useState<LanguageKey>("th");

  const navigateTo = useCallback((page: PageKey) => {
    setCurrentPage(page);
    if (page === "admin") {
      window.location.hash = "#admin";
    } else if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  const changeLanguage = useCallback((lang: LanguageKey) => {
    setLanguage(lang);
  }, []);

  useEffect(() => {
    window.navigateTo = navigateTo;
    window.changeLanguage = changeLanguage;
    window.currentPage = currentPage;
    window.currentLanguage = language;

    return () => {
      window.navigateTo = undefined;
      window.changeLanguage = undefined;
      window.currentPage = undefined;
      window.currentLanguage = undefined;
    };
  }, [navigateTo, changeLanguage, currentPage, language]);

  useEffect(() => {
    const handleNavigation = (event: Event) => {
      const customEvent = event as CustomEvent<PageKey>;
      if (customEvent.detail) {
        navigateTo(customEvent.detail);
      }
    };

    const handleHashNavigation = () => {
      if (window.location.hash === "#admin") {
        navigateTo("admin");
        // 관리자 모드 활성화
        localStorage.setItem('admin_mode', 'true');
      } else {
        // 관리자 모드 비활성화
        localStorage.setItem('admin_mode', 'false');
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        navigateTo("admin");
        window.location.hash = "#admin";
        localStorage.setItem('admin_mode', 'true');
      }
    };

    window.addEventListener(NAVIGATION_EVENT_NAME, handleNavigation as EventListener);
    window.addEventListener("hashchange", handleHashNavigation);
    window.addEventListener("keydown", handleKeyPress);

    handleHashNavigation();

    return () => {
      window.removeEventListener(NAVIGATION_EVENT_NAME, handleNavigation as EventListener);
      window.removeEventListener("hashchange", handleHashNavigation);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigateTo]);

  // 체크아웃 관련 코드 제거됨

  return (
    <div className="min-h-screen bg-[#0B0F1A] font-nunito">
      <SmoothScroll />
      <SparkleEffect />

      {currentPage === "admin" ? (
        <CMSAdminDashboard navigateTo={navigateTo} />
      ) : (
        <>
          <CMSHeader
            currentPage={currentPage}
            language={language}
            navigateTo={navigateTo}
            changeLanguage={changeLanguage}
          />

          {currentPage === "home" && (
            <main>
              <Hero navigateTo={navigateTo} language={language} />
              <FunFeatures language={language} />
              <MiddleBanner language={language} navigateTo={navigateTo} />
              <InstagramGallery language={language} />
              <HowToUse language={language} />
            </main>
          )}

          {currentPage === "products" && (
            <ProductsPage navigateTo={navigateTo} language={language} />
          )}

          {currentPage === "about" && (
            <AboutPage navigateTo={navigateTo} language={language} />
          )}

          {currentPage === "gallery" && (
            <GalleryPage navigateTo={navigateTo} language={language} />
          )}

          {currentPage === "board" && (
            <NoticePage navigateTo={navigateTo} language={language} />
          )}

          {currentPage === "notice" && (
            <NoticePage navigateTo={navigateTo} language={language} />
          )}

          {currentPage === "faq" && (
            <FAQPage navigateTo={navigateTo} language={language} />
          )}

          {currentPage === "contact" && (
            <ContactPage navigateTo={navigateTo} language={language} />
          )}

          <Footer navigateTo={navigateTo} language={language} />
        </>
      )}
    </div>
  );
}
