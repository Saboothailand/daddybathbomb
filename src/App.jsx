import React from 'react';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 40,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            🛁 Daddy Bath Bomb
          </div>
          <nav style={{ display: 'flex', gap: '30px' }}>
            <a href="#home" style={{ color: 'white', textDecoration: 'none' }}>หน้าแรก</a>
            <a href="#products" style={{ color: 'white', textDecoration: 'none' }}>สินค้า</a>
            <a href="#about" style={{ color: 'white', textDecoration: 'none' }}>เกี่ยวกับเรา</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>ติดต่อเรา</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        paddingTop: '64px'
      }}>
        <div style={{ maxWidth: '800px', padding: '0 20px' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Daddy Bath Bomb
          </h1>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '30px',
            opacity: 0.9
          }}>
            บาธบอมพรีเมียมจากวัตถุดิบธรรมชาติ
          </h2>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '40px',
            opacity: 0.8
          }}>
            สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ 100%
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              ช้อปเลย!
            </button>
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}>
              เรียนรู้เพิ่มเติม
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
              สินค้าของเรา
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              บาธบอมคุณภาพสูงหลากหลายกลิ่น
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {[
              {
                name: 'บาธบอมลาเวนเดอร์',
                price: '150',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
                category: 'ผ่อนคลาย'
              },
              {
                name: 'บาธบอมโรส',
                price: '180',
                image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
                category: 'โรแมนติก'
              },
              {
                name: 'บาธบอมยูคาลิปตัส',
                price: '160',
                image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
                category: 'สดชื่น'
              },
              {
                name: 'บาธบอมวานิลลา',
                price: '170',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
                category: 'หวานหอม'
              }
            ].map((product, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(236, 72, 153, 0.8)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '0.8rem'
                  }}>
                    {product.category}
                  </div>
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '10px'
                  }}>
                    {product.name}
                  </h3>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    marginBottom: '20px'
                  }}>
                    ฿{product.price}
                  </div>
                  <button style={{
                    width: '100%',
                    background: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '15px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    ใส่ตะกร้า
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '40px' }}>
            ติดต่อเรา
          </h2>
          
          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '40px'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
              สั่งซื้อผ่าน LINE Chat
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '30px' }}>
              เพิ่มเพื่อนและส่งข้อความเพื่อสั่งซื้อสินค้า รับคำปรึกษาแบบเรียลไทม์
            </p>
            <button 
              onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}
              style={{
                background: '#22c55e',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.3s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              💬 เปิด LINE Chat
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📧</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>อีเมล</h4>
              <p style={{ opacity: 0.8 }}>hello@daddybathbomb.com</p>
            </div>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🕒</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>เวลาทำการ</h4>
              <p style={{ opacity: 0.8 }}>จันทร์-ศุกร์ 9:00-18:00</p>
            </div>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📍</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>ที่อยู่</h4>
              <p style={{ opacity: 0.8 }}>กรุงเทพมหานคร ประเทศไทย</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
            🛁 Daddy Bath Bomb
          </div>
          <p style={{ marginBottom: '30px', opacity: 0.8 }}>
            บาธบอมพรีเมียมจากวัตถุดิบธรรมชาติ 100% เพื่อประสบการณ์อาบน้ำสุดพิเศษ
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' }}>
            <a href="https://www.facebook.com/daddybathbomb" target="_blank" rel="noopener noreferrer" 
               style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
              Facebook
            </a>
            <a href="https://www.instagram.com/daddybathbomb" target="_blank" rel="noopener noreferrer"
               style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
              Instagram
            </a>
            <a href="https://line.me/ti/p/@daddybathbomb" target="_blank" rel="noopener noreferrer"
               style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
              LINE
            </a>
          </div>
          <div style={{
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
              © 2024 Daddy Bath Bomb. สงวนลิขสิทธิ์
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}