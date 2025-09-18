// @ts-nocheck
// React 기반 인증 및 보호 유틸리티
// Next.js middleware 대신 React에서 사용

// 환경 변수 체크
const isPublicMode = import.meta.env.VITE_PUBLIC_MODE === 'true';
const isDevelopment = import.meta.env.DEV;

// 관리자 이메일 목록
const ADMIN_EMAILS = [
  'admin@daddybathbomb.com',
  'owner@daddybathbomb.com'
];

// 현재 사용자 정보 (임시)
let currentUser = null;

export const authService = {
  // 현재 사용자 가져오기
  getCurrentUser() {
    if (!currentUser) {
      const stored = localStorage.getItem('daddy_current_user');
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    }
    return currentUser;
  },

  // 사용자 설정
  setCurrentUser(user) {
    currentUser = user;
    if (user) {
      localStorage.setItem('daddy_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('daddy_current_user');
    }
  },

  // 관리자 권한 체크
  isAdmin(user = null) {
    const checkUser = user || this.getCurrentUser();
    if (!checkUser) return false;
    
    // 개발 모드에서는 항상 관리자 허용
    if (isDevelopment) return true;
    
    // 공개 모드에서는 관리자 기능 비활성화
    if (isPublicMode) return false;
    
    return ADMIN_EMAILS.includes(checkUser.email);
  },

  // 로그인 (임시)
  async login(email, password) {
    try {
      // 실제로는 Supabase auth 사용
      if (email === 'admin@daddybathbomb.com' && password === 'admin123') {
        const user = {
          id: '1',
          email: email,
          role: 'admin',
          loginAt: new Date().toISOString()
        };
        this.setCurrentUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 로그아웃
  logout() {
    this.setCurrentUser(null);
    return { success: true };
  },

  // 보호된 액션 실행
  async protectedAction(action, errorMessage = 'Admin access required') {
    if (!this.isAdmin()) {
      throw new Error(errorMessage);
    }
    return await action();
  }
};

// 페이지 접근 제어
export const pageGuard = {
  // 관리자 페이지 접근 체크
  canAccessAdmin() {
    // 개발 모드에서는 항상 허용
    if (isDevelopment) return true;
    
    // 공개 모드에서는 차단
    if (isPublicMode) return false;
    
    return authService.isAdmin();
  },

  // 페이지 보호 래퍼
  withAuth(component, requiredRole = 'admin') {
    return (props) => {
      const user = authService.getCurrentUser();
      
      if (requiredRole === 'admin' && !authService.isAdmin(user)) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
              <p className="text-gray-300 mb-6">Administrator privileges required.</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        );
      }
      
      return component(props);
    };
  }
};

// 환경별 설정
export const envConfig = {
  // 공개 모드 여부
  isPublicMode,
  
  // 개발 모드 여부
  isDevelopment,
  
  // 관리자 기능 활성화 여부
  adminEnabled: !isPublicMode,
  
  // 디버그 정보 표시 여부
  showDebugInfo: isDevelopment && !isPublicMode,
  
  // 로그 레벨
  logLevel: isDevelopment ? 'debug' : 'error'
};

// 조건부 로깅
export const logger = {
  debug: (...args) => {
    if (envConfig.logLevel === 'debug') {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args) => {
    if (['debug', 'info'].includes(envConfig.logLevel)) {
      console.info('[INFO]', ...args);
    }
  },
  
  error: (...args) => {
    console.error('[ERROR]', ...args);
  }
};
