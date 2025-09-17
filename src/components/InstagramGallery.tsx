import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { supabase } from '../lib/supabase'

interface InstagramPost {
  id: string
  image_url: string
  caption?: string
  instagram_url?: string
  order_index: number
  is_active: boolean
}

export default function InstagramGallery() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useI18n()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(6)

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching Instagram posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Sample posts if no data from database
  const samplePosts = [
    {
      id: '1',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      caption: language === 'th' ? 'บาธบอมลาเวนเดอร์ใหม่! 🛁✨' : 'New Lavender Bath Bomb! 🛁✨',
      instagram_url: 'https://instagram.com/p/example1',
      order_index: 1,
      is_active: true
    },
    {
      id: '2', 
      image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      caption: language === 'th' ? 'บาธบอมโรสสำหรับวันโรแมนติก 🌹' : 'Rose Bath Bomb for romantic day 🌹',
      instagram_url: 'https://instagram.com/p/example2',
      order_index: 2,
      is_active: true
    },
    {
      id: '3',
      image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      caption: language === 'th' ? 'ยูคาลิปตัสสำหรับความสดชื่น 🌿' : 'Eucalyptus for freshness 🌿',
      instagram_url: 'https://instagram.com/p/example3',
      order_index: 3,
      is_active: true
    },
    {
      id: '4',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      caption: language === 'th' ? 'บาธบอมวานิลลาหอมหวาน 🍦' : 'Sweet Vanilla Bath Bomb 🍦',
      instagram_url: 'https://instagram.com/p/example4',
      order_index: 4,
      is_active: true
    }
  ]

  const displayPosts = posts.length > 0 ? posts : samplePosts

  return (
    <section className="py-20 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {language === 'th' ? 'แกลลอรี่ Instagram' : 'Instagram Gallery'}
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
            {language === 'th' 
              ? 'ติดตามความสวยงามและแรงบันดาลใจจาก Instagram ของเรา'
              : 'Follow our Instagram for beautiful inspirations and updates'
            }
          </p>
          <a
            href="https://www.instagram.com/daddybathbomb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <span>📸</span>
            <span>{language === 'th' ? 'ติดตามเรา' : 'Follow Us'}</span>
          </a>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-white">{language === 'th' ? 'กำลังโหลด...' : 'Loading...'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayPosts.map((post, index) => (
              <div
                key={post.id}
                className="group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handlePostClick(post.instagram_url)}
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.caption || `Instagram post ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback image if original fails to load
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&sig=${index}`
                    }}
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-sm font-medium">
                      {language === 'th' ? 'ดูใน Instagram' : 'View on Instagram'}
                    </p>
                  </div>
                </div>

                {/* Caption */}
                {post.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm line-clamp-2">
                      {post.caption}
                    </p>
                  </div>
                )}

                {/* Instagram Icon */}
                <div className="absolute top-3 right-3 text-white/80 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 mb-4">
            {language === 'th' 
              ? 'แชร์ภาพการใช้งานของคุณกับแฮชแท็ก #DaddyBathBomb'
              : 'Share your bath bomb moments with #DaddyBathBomb'
            }
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.instagram.com/daddybathbomb"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-md"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/daddybathbomb"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-md"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
