import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useI18n, LanguageSelector } from '../hooks/useI18n'
import AuthModal from './AuthModal'
import Cart from './Cart'
import SearchBar from './SearchBar'

export default function Header() {
  const [showAuth, setShowAuth] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const { totalItems } = useCart()
  const { language, t } = useI18n()

  const handleNavigation = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }))
  }

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-white/10 backdrop-blur-md border-b border-white/20">
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

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar className="w-full" />
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('home')}
                className="text-white hover:text-pink-300 transition-colors"
              >
                {t('home')}
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className="text-white hover:text-pink-300 transition-colors"
              >
                {t('about')}
              </button>
              <button
                onClick={() => handleNavigation('notice')}
                className="text-white hover:text-pink-300 transition-colors"
              >
                {language === 'th' ? 'ประกาศ' : 'Notice'}
              </button>
              <button
                onClick={() => handleNavigation('faq')}
                className="text-white hover:text-pink-300 transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => handleNavigation('contact')}
                className="text-white hover:text-pink-300 transition-colors"
              >
                {t('contact')}
              </button>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative text-white hover:text-pink-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h12" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white hover:text-pink-300 transition-colors">
                    <span className="hidden sm:inline">{user.nickname}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {isAdmin && (
                        <button
                          onClick={() => handleNavigation('admin')}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          {t('admin')}
                        </button>
                      )}
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  {t('login')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <SearchBar className="w-full" />
        </div>
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />

      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </>
  )
}
