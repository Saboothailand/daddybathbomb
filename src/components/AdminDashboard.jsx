import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { featuresService, galleryService, settingsService, cmsService, brandingService } from '../lib/supabase';

export default function AdminDashboard({ navigateTo }) {
  const [activeTab, setActiveTab] = useState('features');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [features, setFeatures] = useState([]);
  const [editingFeature, setEditingFeature] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com/daddybathbomb',
    facebook: 'https://facebook.com/daddybathbomb'
  });
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [faqs, setFAQs] = useState([]);
  const [howToSteps, setHowToSteps] = useState([]);
  const [banners, setBanners] = useState([]);
  const [editingPage, setEditingPage] = useState(null);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'features') {
        const featuresData = await featuresService.getActiveFeatures();
        setFeatures(featuresData);
      } else if (activeTab === 'gallery') {
        const galleryData = await galleryService.getActiveGalleryImages();
        setGalleryImages(galleryData);
        const settings = await settingsService.getSettings();
        setSocialLinks({
          instagram: settings.instagram_url || 'https://instagram.com/daddybathbomb',
          facebook: settings.facebook_url || 'https://facebook.com/daddybathbomb'
        });
      } else if (activeTab === 'pages') {
        const pagesData = await cmsService.getPages();
        setPages(pagesData);
      } else if (activeTab === 'faqs') {
        const faqsData = await cmsService.getFAQs();
        setFAQs(faqsData);
      } else if (activeTab === 'how-to') {
        const stepsData = await cmsService.getHowToSteps();
        setHowToSteps(stepsData);
      } else if (activeTab === 'banners') {
        const bannersData = await cmsService.getBanners();
        setBanners(bannersData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data
  const sampleFeatures = [
    {
      id: 1,
      title: 'Natural Ingredients',
      description: 'Made from 100% natural ingredients, safe for the whole family',
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=400&fit=crop',
      isActive: true
    },
    {
      id: 2,
      title: 'Beautiful Fizzy Colors',
      description: 'Beautiful colorful fizz with relaxing aromatherapy scents',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
      isActive: true
    },
    {
      id: 3,
      title: 'Skin Nourishing',
      description: 'Moisturizes and nourishes skin for smooth, soft feeling after bath',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=400&fit=crop',
      isActive: true
    },
    {
      id: 4,
      title: 'Perfect Gift',
      description: 'Perfect gift for special people on any occasion',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&sig=gift',
      isActive: true
    }
  ];

  const sampleGallery = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      caption: 'Relaxing bath time with our premium bath bombs',
      isActive: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      caption: 'Natural ingredients for healthy skin',
      isActive: true
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      caption: 'Luxury spa experience at home',
      isActive: true
    }
  ];

  const menuItems = [
    { id: 'pages', label: 'Pages', icon: '📄', desc: 'Manage all website pages' },
    { id: 'banners', label: 'Banners', icon: '🖼️', desc: 'Hero, middle & bottom banners' },
    { id: 'branding', label: 'Branding', icon: '🎨', desc: 'Logo, colors, site identity' },
    { id: 'features', label: 'Features', icon: '⭐', desc: 'Manage feature highlights' },
    { id: 'gallery', label: 'Gallery', icon: '📸', desc: 'Instagram gallery management' },
    { id: 'products', label: 'Products', icon: '📦', desc: 'Product catalog' },
    { id: 'faqs', label: 'FAQs', icon: '❓', desc: 'Manage FAQ content' },
    { id: 'how-to', label: 'How To Use', icon: '📋', desc: 'Usage instructions' },
    { id: 'orders', label: 'Orders', icon: '🛒', desc: 'Customer orders' },
    { id: 'settings', label: 'Settings', icon: '⚙️', desc: 'Site configuration' }
  ];

  const handleFeatureSave = async (feature) => {
    try {
      setLoading(true);
      if (feature.id && features.find(f => f.id === feature.id)) {
        // 업데이트
        await featuresService.updateFeature(feature.id, {
          title: feature.title,
          description: feature.description,
          image_url: feature.image_url || feature.image,
          is_active: feature.isActive
        });
        alert('Feature updated successfully!');
      } else {
        // 새로 생성
        await featuresService.createFeature({
          title: feature.title,
          description: feature.description,
          image_url: feature.image_url || feature.image,
          is_active: feature.isActive,
          display_order: features.length + 1
        });
        alert('New feature added successfully!');
      }
      setEditingFeature(null);
      loadData(); // 데이터 다시 로드
    } catch (error) {
      console.error('Error saving feature:', error);
      alert('Failed to save feature. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureDelete = async (featureId) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      try {
        setLoading(true);
        await featuresService.deleteFeature(featureId);
        alert('Feature deleted successfully!');
        loadData(); // 데이터 다시 로드
      } catch (error) {
        console.error('Error deleting feature:', error);
        alert('Failed to delete feature. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSocialLinksSave = async () => {
    try {
      setLoading(true);
      console.log('Saving social links:', socialLinks);
      
      // 소셜 링크 저장
      await settingsService.updateSetting('instagram_url', socialLinks.instagram);
      await settingsService.updateSetting('facebook_url', socialLinks.facebook);
      
      console.log('Social links saved successfully');
      alert('Social media links updated successfully!');
      
      // 데이터 다시 로드
      loadData();
    } catch (error) {
      console.error('Error saving social links:', error);
      alert(`Failed to save social links: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-xl transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col`}>
        
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  🛁 Admin Panel
                </h1>
                <p className="text-sm text-gray-500 mt-1">Daddy Bath Bomb</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.desc}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 mb-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">Administrator</div>
                <div className="text-xs text-gray-500">admin@daddybathbomb.com</div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => navigateTo('home')}
            className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              sidebarCollapsed ? 'px-2' : ''
            }`}
          >
            {sidebarCollapsed ? '🏠' : '← Back to Website'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {activeTab} Management
              </h2>
              <p className="text-gray-600 mt-1">
                {menuItems.find(item => item.id === activeTab)?.desc}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'pages' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Page Management</h3>
                  <p className="text-gray-600">Create and manage all website pages dynamically</p>
                </div>
                <button 
                  onClick={() => setEditingPage({ 
                    slug: '', 
                    title: '', 
                    page_type: 'page', 
                    is_published: true, 
                    is_featured: true, 
                    menu_order: pages.length + 1 
                  })}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                >
                  + Create New Page
                </button>
              </div>

              {/* Page List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pages.map((page) => (
                  <div key={page.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 mb-1">{page.title}</h4>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        page.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.is_published ? 'published' : 'draft'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        📄 {page.type}
                      </span>
                      <span className="flex items-center gap-1">
                        🧩 {page.blocks} blocks
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 transition-colors font-medium">
                        Edit Content
                      </button>
                      <button className="bg-gray-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-600 transition-colors font-medium">
                        View
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Pages</p>
                      <p className="text-2xl font-bold text-gray-800">12</p>
                    </div>
                    <div className="text-3xl">📄</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Published</p>
                      <p className="text-2xl font-bold text-green-600">10</p>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Drafts</p>
                      <p className="text-2xl font-bold text-yellow-600">2</p>
                    </div>
                    <div className="text-3xl">📝</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Content Blocks</p>
                      <p className="text-2xl font-bold text-blue-600">45</p>
                    </div>
                    <div className="text-3xl">🧩</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Banner Management</h3>
                  <p className="text-gray-600">Manage hero, middle, and bottom section banners</p>
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                  + Add New Banner
                </button>
              </div>

              {/* Banner Sections */}
              {['hero', 'middle', 'bottom'].map((position) => (
                <div key={position} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 capitalize flex items-center gap-2">
                      {position === 'hero' && '🎯'}
                      {position === 'middle' && '📍'}
                      {position === 'bottom' && '⬇️'}
                      {position} Banners
                    </h4>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      Add {position} Banner
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2].map((banner) => (
                      <div key={banner} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="relative h-32">
                          <img
                            src={`https://images.unsplash.com/photo-157101961345${banner}?w=400&h=200&fit=crop`}
                            alt={`${position} banner ${banner}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-medium text-gray-800 mb-2">Banner Title {banner}</h5>
                          <p className="text-gray-600 text-sm mb-3">Banner description here...</p>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                              Edit
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">FAQ Management</h3>
                  <p className="text-gray-600">Manage frequently asked questions</p>
                </div>
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                  + Add New FAQ
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, question: 'How long do bath bombs last?', answer: 'Our bath bombs have a shelf life of 12 months...', category: 'product' },
                  { id: 2, question: 'Are your bath bombs safe for sensitive skin?', answer: 'Yes! Our bath bombs are made with 100% natural ingredients...', category: 'product' },
                  { id: 3, question: 'How do I use a bath bomb?', answer: 'Simply fill your bathtub with warm water and drop...', category: 'usage' }
                ].map((faq) => (
                  <div key={faq.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium ml-4">
                        {faq.category}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors font-medium">
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'how-to' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">How To Use Steps</h3>
                  <p className="text-gray-600">Manage step-by-step usage instructions</p>
                </div>
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                  + Add New Step
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { step: 1, title: 'Fill Your Bathtub', icon: '🛁', description: 'Fill your bathtub with warm water...' },
                  { step: 2, title: 'Drop the Bath Bomb', icon: '💧', description: 'Gently place the bath bomb...' },
                  { step: 3, title: 'Enjoy the Colors', icon: '🌈', description: 'Watch as beautiful colors...' },
                  { step: 4, title: 'Relax and Soak', icon: '😌', description: 'Soak for 15-20 minutes...' },
                  { step: 5, title: 'Rinse Off', icon: '🚿', description: 'Rinse with clean water...' }
                ].map((step) => (
                  <div key={step.step} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      <div className="text-2xl">{step.icon}</div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">{step.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors font-medium">
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Branding & Logo Management</h3>
                  <p className="text-gray-600">Manage your site logo, colors, and brand identity</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Logo Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🖼️</span>
                    Logo Settings
                  </h4>
                  
                  <div className="space-y-6">
                    {/* Main Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Logo
                      </label>
                      <ImageUpload
                        currentImage=""
                        onImageUpload={(url) => console.log('Logo updated:', url)}
                        label="Upload Logo"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: PNG format, 200x60px, transparent background
                      </p>
                    </div>

                    {/* Dark Mode Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dark Mode Logo (Optional)
                      </label>
                      <ImageUpload
                        currentImage=""
                        onImageUpload={(url) => console.log('Dark logo updated:', url)}
                        label="Upload Dark Logo"
                      />
                    </div>

                    {/* Favicon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon
                      </label>
                      <ImageUpload
                        currentImage=""
                        onImageUpload={(url) => console.log('Favicon updated:', url)}
                        label="Upload Favicon"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: ICO or PNG format, 32x32px
                      </p>
                    </div>
                  </div>
                </div>

                {/* Site Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Site Information
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Title
                      </label>
                      <input
                        type="text"
                        defaultValue="Daddy Bath Bomb"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Your site title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="Premium natural bath bombs for ultimate relaxation experience"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Brief description of your site"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tagline
                      </label>
                      <input
                        type="text"
                        defaultValue="Premium Bath Experience"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Your brand tagline"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    Color Scheme
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            defaultValue="#ec4899"
                            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            defaultValue="#ec4899"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            defaultValue="#8b5cf6"
                            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            defaultValue="#8b5cf6"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          defaultValue="#06b6d4"
                          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          defaultValue="#06b6d4"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    Live Preview
                  </h4>
                  
                  <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-2xl">
                        🛁
                      </div>
                      <div>
                        <div className="font-bold">Daddy Bath Bomb</div>
                        <div className="text-sm opacity-75">Premium Bath Experience</div>
                      </div>
                    </div>
                    <p className="text-sm opacity-90">
                      This is how your brand will appear on the website.
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                  onClick={() => alert('Branding settings saved!')}
                >
                  Save Branding Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Feature Highlights</h3>
                  <p className="text-gray-600">Manage the "Why Choose Us?" section content</p>
                </div>
                <button 
                  onClick={() => setEditingFeature({ 
                    id: Date.now(), 
                    title: '', 
                    description: '', 
                    image: '', 
                    isActive: true 
                  })}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                >
                  + Add New Feature
                </button>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <div key={feature.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={feature.image_url || feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          feature.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {feature.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg">{feature.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{feature.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          console.log('Editing feature:', feature);
                          setEditingFeature(feature);
                        }}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          console.log('Deleting feature:', feature.id);
                          handleFeatureDelete(feature.id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Instagram Gallery</h3>
                  <p className="text-gray-600">Manage gallery images and social media links</p>
                </div>
                <button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                >
                  + Add Gallery Image
                </button>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Social Media Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📸 Instagram URL
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📘 Facebook URL
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook}
                      onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSocialLinksSave}
                  disabled={loading}
                  className="mt-4 bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Links'}
                </button>
              </div>

              {/* Gallery Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="relative h-64">
                      <img
                        src={item.image_url}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                          Gallery #{item.id}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-3">{item.caption}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                          Edit
                        </button>
                        <button className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {!['features', 'gallery'].includes(activeTab) && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">
                {menuItems.find(item => item.id === activeTab)?.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize">
                {activeTab} Management
              </h3>
              <p className="text-gray-600 mb-8">
                {menuItems.find(item => item.id === activeTab)?.desc}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-blue-800 font-medium">Coming Soon!</p>
                <p className="text-blue-600 text-sm mt-2">
                  This feature is under development and will be available soon.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Feature Edit Modal */}
      {editingFeature && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingFeature?.id && features.find(f => f.id === editingFeature.id) ? 'Edit Feature' : 'Add New Feature'}
                </h3>
                <button
                  onClick={() => setEditingFeature(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature Title</label>
                        <input
                          type="text"
                          value={editingFeature?.title || ''}
                          onChange={(e) => setEditingFeature({...editingFeature, title: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800 bg-white"
                          placeholder="Enter feature title"
                        />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                          value={editingFeature?.description || ''}
                          onChange={(e) => setEditingFeature({...editingFeature, description: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800 bg-white"
                          placeholder="Enter feature description"
                        />
                </div>
                
                <ImageUpload
                  currentImage={editingFeature?.image_url || editingFeature?.image || ''}
                  onImageUpload={(url) => setEditingFeature({...editingFeature, image_url: url, image: url})}
                  label="Feature Image"
                />
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingFeature?.is_active || editingFeature?.isActive || false}
                    onChange={(e) => setEditingFeature({...editingFeature, is_active: e.target.checked, isActive: e.target.checked})}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (show on website)
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditingFeature(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleFeatureSave(editingFeature)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-medium"
                  >
                    {editingFeature?.id && features.find(f => f.id === editingFeature.id) ? 'Update Feature' : 'Add Feature'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}