import { useState, useEffect } from "react";
import { AuthProvider } from "./hooks/useAuth.js";
import { CartProvider } from "./hooks/useCart.js";
import { I18nProvider } from "./hooks/useI18n.js";
import SEOHead from "./components/SEOHead";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HeroSlider from "./components/HeroSlider";
import ProductGrid from "./components/ProductGrid";
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setCurrentPage(event.detail);
    };

    window.addEventListener('navigate', handleNavigation as EventListener);
    return () => window.removeEventListener('navigate', handleNavigation as EventListener);
  }, []);

  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-[#0B0F1A] font-nunito">
            <SEOHead />
            <SmoothScroll />
            <SparkleEffect />
            
            {currentPage === 'admin' ? (
              <AdminDashboard />
            ) : (
              <>
                <Header />
                
                {currentPage === 'home' ? (
                  <main>
                    <HeroSlider />
                    <ProductGrid />
                    <FunFeatures />
                    <InstagramGallery />
                    <HowToUse />
                  </main>
                ) : currentPage === 'about' ? (
                  <AboutPage />
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
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
