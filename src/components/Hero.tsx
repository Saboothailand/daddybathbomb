import { useI18n } from '../hooks/useI18n'

export default function Hero() {
  const { language, t } = useI18n()

  return (
    <section className="relative h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-blue-500 rounded-full blur-xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
          {language === 'th' ? (
            <>
              <span className="gradient-text">Daddy Bath Bomb</span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">บาธบอมพรีเมียม</span>
            </>
          ) : (
            <>
              <span className="gradient-text">Daddy Bath Bomb</span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">Premium Bath Bombs</span>
            </>
          )}
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
          {language === 'th' 
            ? 'สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ 100%'
            : 'Experience extraordinary bathing with 100% natural bath bombs'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'products' }))}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            {language === 'th' ? 'ช้อปเลย!' : 'Shop Now!'}
          </button>
          
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'about' }))}
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-md border border-white/30"
          >
            {language === 'th' ? 'เรียนรู้เพิ่มเติม' : 'Learn More'}
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in-up animation-delay-600">
          <div className="text-center">
            <div className="text-4xl mb-2">🌿</div>
            <h3 className="font-semibold mb-1">
              {language === 'th' ? 'ธรรมชาติ 100%' : '100% Natural'}
            </h3>
            <p className="text-blue-100 text-sm">
              {language === 'th' ? 'วัตถุดิบธรรมชาติ' : 'Natural ingredients'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-2">🚚</div>
            <h3 className="font-semibold mb-1">
              {language === 'th' ? 'ส่งฟรี' : 'Free Shipping'}
            </h3>
            <p className="text-blue-100 text-sm">
              {language === 'th' ? 'ทั่วประเทศไทย' : 'Across Thailand'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-semibold mb-1">
              {language === 'th' ? 'LINE Chat' : 'LINE Support'}
            </h3>
            <p className="text-blue-100 text-sm">
              {language === 'th' ? 'ปรึกษาได้ตลอด' : '24/7 Support'}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
