import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import FunFeatures from "./components/FunFeatures";
import HowToUse from "./components/HowToUse";
import InstagramGallery from "./components/InstagramGallery";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import SparkleEffect from "./components/SparkleEffect";
import AboutPage from "./components/AboutPage";
import ProductListing from "./components/ProductListing";
import NoticePage from "./components/NoticePage";
import FAQPage from "./components/FAQPage";
import ContactPage from "./components/ContactPage";
import AdminDashboard from "./components/AdminDashboard";
import MiddleBanner from "./components/MiddleBanner";
import CheckoutForm from "./components/CheckoutForm";
import EditableContent from "./components/EditableContent";

const NAVIGATION_EVENT_NAME = "navigate";

export type PageKey =
  | "home"
  | "about"
  | "products"
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
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

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

  useEffect(() => {
    const handleOpenCheckout = () => setShowCheckoutForm(true);
    window.addEventListener('openCheckoutForm', handleOpenCheckout);
    
    return () => {
      window.removeEventListener('openCheckoutForm', handleOpenCheckout);
    };
  }, []);

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
              <ProductGrid language={language} navigateTo={navigateTo} />
              <FunFeatures language={language} />
              <MiddleBanner language={language} navigateTo={navigateTo} />
              <InstagramGallery language={language} />
              <HowToUse language={language} />
            </main>
          )}

          {currentPage === "about" && (
            <AboutPage navigateTo={navigateTo} language={language} />
          )}

          {currentPage === "products" && (
            <ProductListing language={language} navigateTo={navigateTo} />
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

          {showCheckoutForm && (
            <CheckoutForm
              onOrderComplete={() => {
                setShowCheckoutForm(false);
                // 장바구니 업데이트
                window.dispatchEvent(new CustomEvent('cartUpdated'));
              }}
              onClose={() => setShowCheckoutForm(false)}
              language={language}
            />
          )}

          <Footer navigateTo={navigateTo} language={language} />
        </>
      )}
    </div>
  );
}
