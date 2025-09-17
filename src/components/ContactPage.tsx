import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { supabase } from '../lib/supabase'

interface ContactInfo {
  id: string
  type: string
  label: string
  value: string
  icon?: string
  order_index: number
  is_active: boolean
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const { language, t } = useI18n()

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      setContactInfo(data || [])
    } catch (error) {
      console.error('Error fetching contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')

    // 실제 구현에서는 이메일 서비스나 contact form 처리 로직을 추가
    // 여기서는 시뮬레이션으로 처리
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setFormStatus('sent')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setFormStatus('error')
    }
  }

  const getContactAction = (info: ContactInfo) => {
    switch (info.type) {
      case 'email':
        return () => window.open(`mailto:${info.value}`, '_blank')
      case 'phone':
        return () => window.open(`tel:${info.value}`, '_blank')
      case 'line':
        return () => window.open(`https://line.me/ti/p/${info.value}`, '_blank')
      default:
        return undefined
    }
  }

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'th' ? 'ติดต่อเรา' : 'Contact Us'}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {language === 'th' 
              ? 'พร้อมให้บริการและตอบคำถามทุกเรื่องเกี่ยวกับบาธบอมของเรา'
              : 'We\'re here to help and answer any questions about our bath bombs'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">
              {language === 'th' ? 'ช่องทางติดต่อ' : 'Get in Touch'}
            </h2>
            
            <div className="space-y-6">
              {contactInfo.map((info) => {
                const action = getContactAction(info)
                return (
                  <div
                    key={info.id}
                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 ${
                      action ? 'hover:bg-white/20 cursor-pointer' : ''
                    }`}
                    onClick={action}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {info.label}
                        </h3>
                        <p className="text-white/80">
                          {info.value}
                        </p>
                      </div>
                      {action && (
                        <div className="ml-auto">
                          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-2xl">💬</span>
                LINE Chat
              </button>
              
              <button
                onClick={() => window.open('tel:+66XXXXXXXXX', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-2xl">📞</span>
                {language === 'th' ? 'โทรเลย' : 'Call Now'}
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">
              {language === 'th' ? 'ส่งข้อความถึงเรา' : 'Send us a Message'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === 'th' ? 'ชื่อ' : 'Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30"
                  placeholder={language === 'th' ? 'กรอกชื่อของคุณ' : 'Enter your name'}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  {language === 'th' ? 'อีเมล' : 'Email'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30"
                  placeholder={language === 'th' ? 'กรอกอีเมลของคุณ' : 'Enter your email'}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  {language === 'th' ? 'หัวข้อ' : 'Subject'}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30"
                  placeholder={language === 'th' ? 'เรื่องที่ต้องการสอบถาม' : 'What is this about?'}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  {language === 'th' ? 'ข้อความ' : 'Message'}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 resize-none"
                  placeholder={language === 'th' ? 'รายละเอียดที่ต้องการสอบถาม...' : 'Tell us more about your inquiry...'}
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {formStatus === 'sending' 
                  ? (language === 'th' ? 'กำลังส่ง...' : 'Sending...') 
                  : (language === 'th' ? 'ส่งข้อความ' : 'Send Message')
                }
              </button>

              {formStatus === 'sent' && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-100 px-4 py-3 rounded-xl">
                  {language === 'th' 
                    ? '✅ ส่งข้อความเรียบร้อยแล้ว! เราจะตอบกลับโดยเร็วที่สุด'
                    : '✅ Message sent successfully! We\'ll get back to you soon.'
                  }
                </div>
              )}

              {formStatus === 'error' && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl">
                  {language === 'th' 
                    ? '❌ เกิดข้อผิดพลาด กรุณาลองใหม่หรือติดต่อผ่านช่องทางอื่น'
                    : '❌ Something went wrong. Please try again or contact us via other channels.'
                  }
                </div>
              )}
            </form>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              {language === 'th' ? 'ลองดูคำถามที่พบบ่อยก่อน' : 'Check our FAQ first'}
            </h3>
            <p className="text-white/80 mb-6">
              {language === 'th' 
                ? 'คำตอบสำหรับคำถามส่วนใหญ่อาจจะมีอยู่แล้วในหน้า FAQ'
                : 'You might find the answer to your question in our FAQ section'
              }
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'faq' }))}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            >
              {language === 'th' ? 'ดู FAQ' : 'View FAQ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
