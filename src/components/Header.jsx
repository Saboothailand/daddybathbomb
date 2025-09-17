import React, { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            <div className="text-2xl font-bold text-white">
              🛁 Daddy Bath Bomb
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                console.log('Home clicked');
                handleNavigation('home');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              หน้าแรก
            </button>
            <button
              onClick={() => {
                console.log('About clicked');
                handleNavigation('about');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              เกี่ยวกับเรา
            </button>
            <button
              onClick={() => {
                console.log('Notice clicked');
                handleNavigation('notice');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              ประกาศ
            </button>
            <button
              onClick={() => {
                console.log('FAQ clicked');
                handleNavigation('faq');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => {
                console.log('Contact clicked');
                handleNavigation('contact');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              ติดต่อเรา
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
              <option value="th" className="bg-gray-800 text-white">🇹🇭 ไทย</option>
              <option value="en" className="bg-gray-800 text-white">🇺🇸 English</option>
            </select>

            {/* Cart */}
            <button className="relative text-white hover:text-pink-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h12" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Login Button */}
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors">
              เข้าสู่ระบบ
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavigation('home')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                หน้าแรก
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                เกี่ยวกับเรา
              </button>
              <button
                onClick={() => handleNavigation('notice')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                ประกาศ
              </button>
              <button
                onClick={() => handleNavigation('faq')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => handleNavigation('contact')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                ติดต่อเรา
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
