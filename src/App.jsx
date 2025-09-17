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

  useEffect(() => {
    const handleNavigation = (event) => {
      console.log('Navigation event received:', event.detail);
      setCurrentPage(event.detail);
    };

    // 네비게이션 이벤트 리스너 등록
    window.addEventListener('navigate', handleNavigation);
    
    // 전역 네비게이션 함수 등록 (디버깅용)
    window.navigateTo = (page) => {
      console.log('Direct navigation to:', page);
      setCurrentPage(page);
    };

    return () => {
      window.removeEventListener('navigate', handleNavigation);
      delete window.navigateTo;
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-theme font-nunito">
      {/* Debug Info */}
      <div className="fixed top-20 right-4 z-50 bg-black/50 text-white p-2 rounded text-xs">
        Page: {currentPage}
      </div>
      
      <SmoothScroll />
      <SparkleEffect />
      
      {currentPage === 'admin' ? (
        <AdminDashboard />
      ) : (
        <>
          <Header />
          
          {currentPage === 'home' ? (
            <main>
              <Hero />
              <ProductGrid />
              <FunFeatures />
              <InstagramGallery />
              <HowToUse />
            </main>
          ) : currentPage === 'about' ? (
            <AboutPage />
          ) : currentPage === 'products' ? (
            <ProductListing />
          ) : currentPage === 'notice' ? (
            <NoticePage />
          ) : currentPage === 'faq' ? (
            <FAQPage />
          ) : currentPage === 'contact' ? (
            <ContactPage />
          ) : null}
          
          <Footer />
        </>
      )}
    </div>
  );
}