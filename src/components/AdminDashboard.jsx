import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

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
    { id: 'features', label: 'Features', icon: '⭐', desc: 'Manage feature highlights' },
    { id: 'gallery', label: 'Gallery', icon: '📸', desc: 'Instagram gallery management' },
    { id: 'slider', label: 'Hero Slider', icon: '🖼️', desc: 'Homepage slider images' },
    { id: 'products', label: 'Products', icon: '📦', desc: 'Product catalog' },
    { id: 'notices', label: 'Notices', icon: '📢', desc: 'Announcements & news' },
    { id: 'orders', label: 'Orders', icon: '🛒', desc: 'Customer orders' },
    { id: 'settings', label: 'Settings', icon: '⚙️', desc: 'Site configuration' }
  ];

  const handleFeatureSave = (feature) => {
    if (feature.id && sampleFeatures.find(f => f.id === feature.id)) {
      alert('Feature updated successfully!');
    } else {
      alert('New feature added successfully!');
    }
    setEditingFeature(null);
  };

  const handleFeatureDelete = (featureId) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      alert('Feature deleted successfully!');
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleFeatures.map((feature) => (
                  <div key={feature.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          feature.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {feature.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg">{feature.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{feature.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingFeature(feature)}
                          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 transition-colors font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleFeatureDelete(feature.id)}
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
                <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium">
                  Save Links
                </button>
              </div>

              {/* Gallery Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleGallery.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="relative h-64">
                      <img
                        src={item.image}
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
                  {editingFeature.id && sampleFeatures.find(f => f.id === editingFeature.id) ? 'Edit Feature' : 'Add New Feature'}
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
                    value={editingFeature.title}
                    onChange={(e) => setEditingFeature({...editingFeature, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter feature title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingFeature.description}
                    onChange={(e) => setEditingFeature({...editingFeature, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter feature description"
                  />
                </div>
                
                <ImageUpload
                  currentImage={editingFeature.image}
                  onImageUpload={(url) => setEditingFeature({...editingFeature, image: url})}
                  label="Feature Image"
                />
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingFeature.isActive}
                    onChange={(e) => setEditingFeature({...editingFeature, isActive: e.target.checked})}
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
                    {editingFeature.id && sampleFeatures.find(f => f.id === editingFeature.id) ? 'Update Feature' : 'Add Feature'}
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