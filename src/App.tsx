import { useState, useEffect } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
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
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#0B0F1A] font-nunito">
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
              ) : null}
              
              <Footer />
            </>
          )}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
