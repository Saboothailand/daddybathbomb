import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface Notice {
  id: string
  title: string
  content: string
  summary?: string
  is_important: boolean
  is_active: boolean
  author_id?: string
  created_at: string
  updated_at: string
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)
  const { language, t } = useI18n()
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('is_important', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotices(data || [])
    } catch (error) {
      console.error('Error fetching notices:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return language === 'th' 
      ? date.toLocaleDateString('th-TH', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
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
            {language === 'th' ? 'ประกาศ & ข่าวสาร' : 'Notices & News'}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {language === 'th' 
              ? 'ข่าวสารและประกาศสำคัญจากร้าน Daddy Bath Bomb'
              : 'Important news and announcements from Daddy Bath Bomb'
            }
          </p>
        </div>

        {selectedNotice ? (
          /* Notice Detail View */
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <button
              onClick={() => setSelectedNotice(null)}
              className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'th' ? 'กลับไปหน้ารายการ' : 'Back to list'}
            </button>

            <div className="flex items-start gap-4 mb-6">
              {selectedNotice.is_important && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {language === 'th' ? 'สำคัญ' : 'Important'}
                </span>
              )}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedNotice.title}
                </h2>
                <p className="text-white/70 text-sm">
                  {formatDate(selectedNotice.created_at)}
                </p>
              </div>
            </div>

            <div 
              className="prose prose-invert max-w-none text-white/90"
              dangerouslySetInnerHTML={{ __html: selectedNotice.content }}
            />
          </div>
        ) : (
          /* Notice List View */
          <div className="grid gap-6">
            {notices.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {language === 'th' ? 'ยังไม่มีประกาศ' : 'No notices yet'}
                </h3>
                <p className="text-blue-100">
                  {language === 'th' 
                    ? 'กรุณากลับมาดูใหม่ในภายหลัง'
                    : 'Please check back later'
                  }
                </p>
              </div>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <div className="flex items-start gap-4">
                    {notice.is_important && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                        {language === 'th' ? 'สำคัญ' : 'Important'}
                      </span>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                        {notice.title}
                      </h3>
                      {notice.summary && (
                        <p className="text-white/80 mb-3 line-clamp-2">
                          {notice.summary}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-white/60 text-sm">
                          {formatDate(notice.created_at)}
                        </p>
                        <span className="text-pink-300 text-sm group-hover:translate-x-2 transition-transform">
                          {language === 'th' ? 'อ่านเพิ่มเติม →' : 'Read more →'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Admin Quick Actions */}
        {isAdmin && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'admin' }))}
              className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
