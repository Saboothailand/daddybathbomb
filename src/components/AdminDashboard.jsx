import React, { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');

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
              { id: 'products', label: '제품 관리', icon: '📦' },
              { id: 'notices', label: '공지사항 관리', icon: '📢' },
              { id: 'slider', label: '슬라이더 관리', icon: '🖼️' },
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
