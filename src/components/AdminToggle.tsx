import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';

export default function AdminToggle() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // 관리자 모드 상태 확인
    const checkAdminMode = () => {
      const adminMode = localStorage.getItem('adminMode') === 'true' || 
                       window.location.hash === '#admin';
      setIsAdminMode(adminMode);
    };

    checkAdminMode();
    
    // 해시 변경 감지
    const handleHashChange = () => {
      checkAdminMode();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleAdminMode = () => {
    const newAdminMode = !isAdminMode;
    setIsAdminMode(newAdminMode);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('adminMode', newAdminMode.toString());
    
    // 해시 업데이트
    if (newAdminMode) {
      window.location.hash = '#admin';
    } else {
      window.location.hash = '';
    }
    
    // 전역 이벤트 발생
    window.dispatchEvent(new CustomEvent('adminModeChanged', {
      detail: { isAdminMode: newAdminMode }
    }));
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={toggleAdminMode}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
          isAdminMode 
            ? 'bg-[#007AFF] hover:bg-[#0051D5] text-white shadow-lg' 
            : 'bg-gray-800 hover:bg-gray-700 text-white shadow-md'
        }`}
      >
        {isAdminMode ? (
          <>
            <EyeOff className="w-4 h-4" />
            Exit Admin
          </>
        ) : (
          <>
            <Settings className="w-4 h-4" />
            Admin Mode
          </>
        )}
      </Button>
    </div>
  );
}
