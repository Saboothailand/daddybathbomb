import React, { useState, useEffect } from 'react';

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // 샘플 공지사항 (추후 관리자가 작성/수정할 수 있도록)
  const sampleNotices = [
    {
      id: 1,
      title: 'ยินดีต้อนรับสู่ Daddy Bath Bomb',
      content: `
        <p>ยินดีต้อนรับสู่ร้านบาธบอมออนไลน์ชั้นนำของไทย! เรามีบาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ 100%</p>
        <br>
        <p><strong>สิ่งที่เราให้:</strong></p>
        <ul>
          <li>🛁 บาธบอมหลากหลายกลิ่น</li>
          <li>🚚 ส่งฟรีทั่วไทย</li>
          <li>💬 ปรึกษาผ่าน LINE Chat</li>
          <li>✨ คุณภาพพรีเมียม</li>
        </ul>
      `,
      summary: 'ยินดีต้อนรับสู่ร้านบาธบอมออนไลน์ชั้นนำของไทย!',
      isImportant: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'โปรโมชั่นเปิดร้าน',
      content: `
        <p>🎉 <strong>โปรโมชั่นพิเศษเปิดร้าน!</strong></p>
        <br>
        <p><strong>ส่วนลดพิเศษ:</strong></p>
        <ul>
          <li>✨ ซื้อ 2 ชิ้น ลด 10%</li>
          <li>✨ ซื้อ 3 ชิ้น ลด 15%</li>
          <li>✨ ซื้อ 5 ชิ้น ลด 20%</li>
        </ul>
        <br>
        <p><em>*โปรโมชั่นนี้ใช้ได้ถึงสิ้นเดือน</em></p>
      `,
      summary: '🎉 โปรโมชั่นพิเศษเปิดร้าน! ซื้อมากลดมาก',
      isImportant: false,
      createdAt: '2024-01-10'
    }
  ];

  useEffect(() => {
    setNotices(sampleNotices);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ประกาศ & ข่าวสาร
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            ข่าวสารและประกาศสำคัญจากร้าน Daddy Bath Bomb
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
              กลับไปหน้ารายการ
            </button>

            <div className="flex items-start gap-4 mb-6">
              {selectedNotice.isImportant && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  สำคัญ
                </span>
              )}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedNotice.title}
                </h2>
                <p className="text-white/70 text-sm">
                  {formatDate(selectedNotice.createdAt)}
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
                <h3 className="text-2xl font-bold text-white mb-4">ยังไม่มีประกาศ</h3>
                <p className="text-blue-100">กรุณากลับมาดูใหม่ในภายหลัง</p>
              </div>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <div className="flex items-start gap-4">
                    {notice.isImportant && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                        สำคัญ
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
                          {formatDate(notice.createdAt)}
                        </p>
                        <span className="text-pink-300 text-sm group-hover:translate-x-2 transition-transform">
                          อ่านเพิ่มเติม →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">มีคำถาม?</h3>
            <p className="text-white/80 mb-6">
              ติดต่อทีมงานของเราผ่าน LINE Chat เพื่อความช่วยเหลือแบบเรียลไทม์
            </p>
            <button
              onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              💬 ติดต่อเรา
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
