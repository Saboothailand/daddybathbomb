import React, { useEffect, useState } from 'react';
import { Settings, LogIn, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { authService } from '../utils/auth';

const OPEN_AUTH_MODAL_EVENT = 'auth:open-modal';

export default function AdminToggle() {
  const [isAdminMode, setIsAdminMode] = useState(authService.isAdmin());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const updateAdminState = () => {
      if (!active) return;
      setIsAdminMode(authService.isAdmin());
    };

    authService.initialize().finally(updateAdminState);
    const unsubscribe = authService.subscribe(updateAdminState);

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const openLoginModal = () => {
    window.dispatchEvent(new CustomEvent(OPEN_AUTH_MODAL_EVENT));
  };

  const navigateToAdmin = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'admin' }));
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {isAdminMode ? (
        <>
          <Button
            onClick={navigateToAdmin}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 bg-[#007AFF] hover:bg-[#0051D5] text-white shadow-lg"
          >
            <Settings className="w-4 h-4" />
            Admin Dashboard
          </Button>
          <Button
            onClick={handleLogout}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 border-gray-500 text-gray-100 bg-gray-800/70 hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </>
      ) : (
        <Button
          onClick={openLoginModal}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 bg-gray-800 hover:bg-gray-700 text-white shadow-md"
        >
          <LogIn className="w-4 h-4" />
          Admin Login
        </Button>
      )}
    </div>
  );
}
