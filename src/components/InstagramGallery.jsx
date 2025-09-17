import React, { useState, useEffect } from 'react';

export default function InstagramGallery() {
  const [posts, setPosts] = useState([]);

  // 샘플 Instagram 포스트 (추후 관리자가 업로드할 수 있도록)
  const samplePosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      caption: 'บาธบอมลาเวนเดอร์ใหม่! 🛁✨',
      url: 'https://instagram.com/p/example1'
    },
    {
      id: 2, 
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      caption: 'บาธบอมโรสสำหรับวันโรแมนติก 🌹',
      url: 'https://instagram.com/p/example2'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      caption: 'ยูคาลิปตัสสำหรับความสดชื่น 🌿',
      url: 'https://instagram.com/p/example3'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&sig=1',
      caption: 'บาธบอมวานิลลาหอมหวาน 🍦',
      url: 'https://instagram.com/p/example4'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&sig=2',
      caption: 'คอลเลคชั่นใหม่มาแล้ว! 💖',
      url: 'https://instagram.com/p/example5'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&sig=3',
      caption: 'ของขวัญสุดพิเศษ 🎁',
      url: 'https://instagram.com/p/example6'
    }
  ];

  useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handlePostClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">แกลลอรี่ Instagram</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
            ติดตามความสวยงามและแรงบันดาลใจจาก Instagram ของเรา
          </p>
          <a
            href="https://www.instagram.com/daddybathbomb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <span>📸</span>
            <span>ติดตามเรา</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handlePostClick(post.url)}
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm font-medium">ดูใน Instagram</p>
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm line-clamp-2">
                  {post.caption}
                </p>
              </div>

              {/* Instagram Icon */}
              <div className="absolute top-3 right-3 text-white/80 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 mb-4">
            แชร์ภาพการใช้งานของคุณกับแฮชแท็ก #DaddyBathBomb
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
  );
}
