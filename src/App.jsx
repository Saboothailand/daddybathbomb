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

    const handleNavigation = (event) => {
      console.log('Navigation event received:', event.detail);
      setCurrentPage(event.detail);
    };

    window.addEventListener('navigate', handleNavigation);
    
    return () => {
      window.removeEventListener('navigate', handleNavigation);
    };
  }, [currentPage, language]);

  return (
    <div className="min-h-screen bg-dark-theme font-nunito">
      {/* Debug Info */}
      <div className="fixed top-20 right-4 z-50 bg-black/50 text-white p-2 rounded text-xs">
        Page: {currentPage} | Lang: {language}
      </div>
      
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