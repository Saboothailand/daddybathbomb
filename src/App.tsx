import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FunFeatures from "./components/FunFeatures";
import HowToUse from "./components/HowToUse";
import InstagramGallery from "./components/InstagramGallery";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import SparkleEffect from "./components/SparkleEffect";
import AboutPage from "./components/AboutPage";
import NoticePage from "./components/NoticePage";
import FAQPage from "./components/FAQPage";
import ContactPage from "./components/ContactPage";
import AdminDashboard from "./components/AdminDashboard";
import MiddleBanner from "./components/MiddleBanner";
import EditableContent from "./components/EditableContent";
import GalleryPage from "./components/GalleryPage";
import TextWithBackground from "./components/TextWithBackground";
import TextWithBackgroundDemo from "./components/TextWithBackgroundDemo";
import ProductsPage from "./components/ProductsPage";
import { authService } from "./utils/auth";

const NAVIGATION_EVENT_NAME = "navigate";

export type PageKey =
  | "home"
  | "about"
  | "products"
  | "gallery"
  | "board"
  | "notice"
  | "faq"
  | "contact"
  | "admin"
  | "textbg";

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
  const [isAdmin, setIsAdmin] = useState(authService.isAdmin());

  const navigateTo = useCallback((page: PageKey) => {
    if (page === "admin" && !authService.isAdmin()) {
      window.dispatchEvent(new CustomEvent('auth:open-modal'));
      return;
    }

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
    authService.initialize();

    const unsubscribe = authService.subscribe(() => {
      setIsAdmin(authService.isAdmin());
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const handleNavigation = (event: Event) => {
      const customEvent = event as CustomEvent<PageKey>;
      if (customEvent.detail) {
        navigateTo(customEvent.detail);
      }
    };

    const handleHashNavigation = () => {
      if (window.location.hash === "#admin") {
        if (authService.isAdmin()) {
          setCurrentPage("admin");
        } else {
          window.dispatchEvent(new CustomEvent('auth:open-modal'));
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
      } else {
        if (currentPage === "admin") {
          setCurrentPage("home");
        }
      }
    };

    window.addEventListener(NAVIGATION_EVENT_NAME, handleNavigation as EventListener);
    window.addEventListener("hashchange", handleHashNavigation);

    handleHashNavigation();

    return () => {
      window.removeEventListener(NAVIGATION_EVENT_NAME, handleNavigation as EventListener);
      window.removeEventListener("hashchange", handleHashNavigation);
    };
  }, [navigateTo, currentPage]);

  useEffect(() => {
    if (!isAdmin && currentPage === "admin") {
      setCurrentPage("home");
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, [isAdmin, currentPage]);


  return (
    <div className="min-h-screen bg-[#0B0F1A] font-nunito">
      <SmoothScroll />
      <SparkleEffect />

      {currentPage === "admin" ? (
        <AdminDashboard navigateTo={navigateTo} />
      ) : (
        <>
          <Header
            currentPage={currentPage}
            language={language}
            navigateTo={navigateTo}
            changeLanguage={changeLanguage}
          />

          {currentPage === "home" && (
            <main>
              <Hero navigateTo={navigateTo} language={language} />
              <InstagramGallery language={language} />
              <FunFeatures language={language} />
              <MiddleBanner language={language} navigateTo={navigateTo} />
              <HowToUse language={language} />
            </main>
          )}

          {currentPage === "about" && (
            <AboutPage navigateTo={navigateTo} language={language} />
          )}

          {currentPage === "products" && (
            <ProductsPage navigateTo={navigateTo} language={language} />
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

          {currentPage === "textbg" && (
            <TextWithBackgroundDemo navigateTo={navigateTo} language={language} />
          )}


          <Footer navigateTo={navigateTo} language={language} />
        </>
      )}
    </div>
  );
}
