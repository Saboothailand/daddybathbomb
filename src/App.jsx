import { useState, useEffect } from "react";
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('th');

  // 전역 네비게이션 함수
  const navigateTo = (page) => {
    console.log('Navigating to:', page);
    setCurrentPage(page);
  };

  // 언어 변경 함수
  const changeLanguage = (lang) => {
    console.log('Language changed to:', lang);
    setLanguage(lang);
  };

  useEffect(() => {
    // 전역 함수들을 window에 등록
    window.navigateTo = navigateTo;
    window.changeLanguage = changeLanguage;
    window.currentPage = currentPage;
    window.currentLanguage = language;

    // URL 해시 체크 (관리자 접근용)
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        console.log('Admin access via URL hash');
        setCurrentPage('admin');
      }
    };

    // 키보드 단축키 (Ctrl+Shift+A = 관리자)
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        console.log('Admin access via keyboard shortcut');
        setCurrentPage('admin');
        window.location.hash = '#admin';
      }
    };

    const handleNavigation = (event) => {
      console.log('Navigation event received:', event.detail);
      setCurrentPage(event.detail);
    };

    // 초기 해시 체크
    checkHash();

    window.addEventListener('navigate', handleNavigation);
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('navigate', handleNavigation);
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentPage, language]);

  return (
    <div className="min-h-screen bg-dark-theme font-nunito">
      <SmoothScroll />
      <SparkleEffect />
      
      {currentPage === 'admin' ? (
        <AdminDashboard navigateTo={navigateTo} />
      ) : (
        <>
          <Header navigateTo={navigateTo} language={language} changeLanguage={changeLanguage} />
          
              {currentPage === 'home' ? (
                <main>
                  <Hero navigateTo={navigateTo} language={language} />
                  <ProductGrid language={language} />
                  <FunFeatures language={language} />
                  <MiddleBanner language={language} />
                  <InstagramGallery language={language} />
                  <HowToUse language={language} />
                </main>
          ) : currentPage === 'about' ? (
            <AboutPage navigateTo={navigateTo} language={language} />
          ) : currentPage === 'products' ? (
            <ProductListing language={language} />
          ) : currentPage === 'notice' ? (
            <NoticePage navigateTo={navigateTo} language={language} />
          ) : currentPage === 'faq' ? (
            <FAQPage navigateTo={navigateTo} language={language} />
          ) : currentPage === 'contact' ? (
            <ContactPage navigateTo={navigateTo} language={language} />
          ) : null}
          
          <Footer navigateTo={navigateTo} language={language} />
        </>
      )}
    </div>
  );
}