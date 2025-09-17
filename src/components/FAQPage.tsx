import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { supabase } from '../lib/supabase'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order_index: number
  is_active: boolean
}

const categoryIcons: { [key: string]: string } = {
  general: '❓',
  product: '🛁',
  shipping: '🚚',
  payment: '💳'
}

const categoryNames = {
  th: {
    general: 'ทั่วไป',
    product: 'สินค้า',
    shipping: 'การจัดส่ง',
    payment: 'การชำระเงิน'
  },
  en: {
    general: 'General',
    product: 'Products',
    shipping: 'Shipping',
    payment: 'Payment'
  }
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { language, t } = useI18n()

  useEffect(() => {
    fetchFaqs()
  }, [])

  useEffect(() => {
    filterFaqs()
  }, [faqs, selectedCategory, searchQuery])

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true })

      if (error) throw error
      setFaqs(data || [])
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterFaqs = () => {
    let filtered = faqs

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredFaqs(filtered)
  }

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'th' ? 'คำถามที่พบบ่อย' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {language === 'th' 
              ? 'คำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด'
              : 'Answers to the most commonly asked questions'
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'th' ? 'ค้นหาคำถาม...' : 'Search questions...'}
              className="w-full px-4 py-3 pl-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {language === 'th' ? 'ทั้งหมด' : 'All'}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span>{categoryIcons[category]}</span>
                {categoryNames[language][category as keyof typeof categoryNames.th] || category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {language === 'th' ? 'ไม่พบคำถามที่ตรงกับการค้นหา' : 'No questions found'}
              </h3>
              <p className="text-blue-100">
                {language === 'th' 
                  ? 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'
                  : 'Try different search terms or categories'
                }
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/20"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {categoryIcons[faq.category]}
                    </span>
                    <h3 className="text-white font-semibold">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`transform transition-transform duration-300 ${
                    openItems.has(faq.id) ? 'rotate-180' : 'rotate-0'
                  }`}>
                    <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openItems.has(faq.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="pl-12">
                      <div 
                        className="text-white/90 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              {language === 'th' ? 'ยังมีคำถาม?' : 'Still have questions?'}
            </h3>
            <p className="text-white/80 mb-6">
              {language === 'th' 
                ? 'ติดต่อทีมงานของเราผ่าน LINE Chat เพื่อความช่วยเหลือแบบเรียลไทม์'
                : 'Contact our team via LINE Chat for real-time assistance'
              }
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'contact' }))}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {language === 'th' ? 'ติดต่อเรา' : 'Contact Us'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
