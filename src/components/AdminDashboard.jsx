import React, { useState } from 'react';

export default function AdminDashboard({ navigateTo }) {
  const [activeTab, setActiveTab] = useState('features');
  const [features, setFeatures] = useState([]);
  const [editingFeature, setEditingFeature] = useState(null);

  // 임시 관리자 체크 (추후 실제 인증 시스템으로 교체)
  const isAdmin = true; // 추후 실제 로그인 체크로 변경

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">안녕하세요, 관리자님</span>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                사이트로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'features', label: '특징 관리', icon: '⭐' },
              { id: 'slider', label: '슬라이더 관리', icon: '🖼️' },
              { id: 'products', label: '제품 관리', icon: '📦' },
              { id: 'notices', label: '공지사항 관리', icon: '📢' },
              { id: 'orders', label: '주문 관리', icon: '🛒' },
              { id: 'instagram', label: 'Instagram 관리', icon: '📸' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {activeTab === 'features' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">특징 섹션 관리 (ทำไมต้องเลือกเรา?)</h2>
                <button 
                  onClick={() => setEditingFeature({ id: Date.now(), title: '', description: '', image: '', isActive: true })}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  새 특징 추가
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: 1,
                    title: 'วัตถุดิบธรรมชาติ',
                    description: 'ผลิตจากส่วนผสมธรรมชาติ 100% ปลอดภัยสำหรับทุกสมาชิกในครอบครัว',
                    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=400&fit=crop',
                    isActive: true
                  },
                  {
                    id: 2,
                    title: 'ฟองฟู่สีสวย',
                    description: 'ฟองฟู่สีสันสวยงาม พร้อมกลิ่นหอมที่ผ่อนคลาย',
                    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
                    isActive: true
                  },
                  {
                    id: 3,
                    title: 'บำรุงผิว',
                    description: 'เติมความชุ่มชื้นและบำรุงผิวให้นุ่มเนียนหลังอาบน้ำ',
                    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=400&fit=crop',
                    isActive: true
                  },
                  {
                    id: 4,
                    title: 'ของขวัญสุดพิเศษ',
                    description: 'ของขวัญที่เหมาะสำหรับคนพิเศษในทุกโอกาส',
                    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&sig=gift',
                    isActive: true
                  }
                ].map((feature) => (
                  <div key={feature.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative h-32">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                        미리보기
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{feature.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingFeature(feature)}
                          className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('정말 삭제하시겠습니까?')) {
                              // 삭제 로직 (추후 Supabase 연결)
                              alert('삭제되었습니다.');
                            }
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Edit Modal */}
              {editingFeature && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">특징 편집</h3>
                      <button
                        onClick={() => setEditingFeature(null)}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                        <input
                          type="text"
                          value={editingFeature.title}
                          onChange={(e) => setEditingFeature({...editingFeature, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="특징 제목을 입력하세요"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                        <textarea
                          value={editingFeature.description}
                          onChange={(e) => setEditingFeature({...editingFeature, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="특징 설명을 입력하세요"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                        <input
                          type="url"
                          value={editingFeature.image}
                          onChange={(e) => setEditingFeature({...editingFeature, image: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        {editingFeature.image && (
                          <div className="mt-2">
                            <img
                              src={editingFeature.image}
                              alt="미리보기"
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditingFeature(null)}
                          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => {
                            // 저장 로직 (추후 Supabase 연결)
                            alert('저장되었습니다!');
                            setEditingFeature(null);
                          }}
                          className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">제품 관리</h2>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                  새 제품 추가
                </button>
              </div>
              <div className="text-gray-600">
                제품 관리 기능은 Supabase 연결 후 구현됩니다.
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">공지사항 관리</h2>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                  새 공지사항 작성
                </button>
              </div>
              <div className="text-gray-600">
                공지사항 관리 기능은 Supabase 연결 후 구현됩니다.
              </div>
            </div>
          )}

          {activeTab === 'slider' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">히어로 슬라이더 관리</h2>
              
              <div className="grid gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-4">슬라이더 설정</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        자동 전환 시간 (초)
                      </label>
                      <input
                        type="number"
                        defaultValue={5}
                        min={1}
                        max={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                        설정 저장
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-4">슬라이드 이미지 (3개)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-gray-600 mb-2">슬라이드 {num}</p>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors">
                          이미지 업로드
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">주문 관리</h2>
              <div className="text-gray-600">
                주문 관리 기능은 Supabase 연결 후 구현됩니다.
              </div>
            </div>
          )}

          {activeTab === 'instagram' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Instagram 갤러리 관리</h2>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                  새 포스트 추가
                </button>
              </div>
              <div className="text-gray-600">
                Instagram 갤러리 관리 기능은 Supabase 연결 후 구현됩니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
