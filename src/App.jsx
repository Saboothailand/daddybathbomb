import React, { useState, useEffect } from "react";
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
import NoticePage from "./components/NoticePage";
import FAQPage from "./components/FAQPage";
import ContactPage from "./components/ContactPage";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleNavigation = (event) => {
      setCurrentPage(event.detail);
    };

    window.addEventListener('navigate', handleNavigation);
    return () => window.removeEventListener('navigate', handleNavigation);
  }, []);

  return (
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