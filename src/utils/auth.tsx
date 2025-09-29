// @ts-nocheck
// Supabase 기반 인증 및 보호 유틸리티
// Next.js middleware 대신 React에서 사용

import { supabase, hasSupabaseCredentials } from '../lib/supabase';

const isPublicMode = import.meta.env.VITE_PUBLIC_MODE === 'true';
const isDevelopment = import.meta.env.DEV;
const isBrowser = typeof window !== 'undefined';

const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim();
const configuredAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? '';

export const ADMIN_EMAIL = (configuredAdminEmail || 'admin@daddybathbomb.com').toLowerCase();
export const ADMIN_EMAIL_DISPLAY = configuredAdminEmail || 'admin@daddybathbomb.com';
const ADMIN_PASSWORD = configuredAdminPassword || 'admin123';

const ADMIN_EMAILS = [ADMIN_EMAIL];
const STORAGE_KEY = 'daddy_current_user';
const AUTH_EVENT_NAME = 'authStateChanged';
const ADMIN_EVENT_NAME = 'adminModeChanged';

let currentUser = null;
let initialized = false;
let initPromise = null;
let authSubscription = null;
const listeners = new Set();

function safeLower(value) {
  return (value || '').toLowerCase();
}

function readStoredUser() {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse stored auth user', error);
    return null;
  }
}

function persistUser(user) {
  if (!isBrowser) return;
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function notifyAuthChange() {
  listeners.forEach((listener) => {
    try {
      listener(currentUser);
    } catch (error) {
      console.error('Auth listener error:', error);
    }
  });

  if (isBrowser) {
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: { user: currentUser } }));
    window.dispatchEvent(new CustomEvent(ADMIN_EVENT_NAME, { detail: { isAdminMode: !!currentUser && authService.isAdmin(currentUser) } }));
  }
}

function updateCurrentUser(user, options = {}) {
  const { persist = true, silent = false } = options;
  currentUser = user;

  if (persist) {
    persistUser(user);
  } else if (!user && isBrowser) {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  if (!silent) {
    notifyAuthChange();
  }
}

async function loadUserFromSupabase(user) {
  if (!user) {
    updateCurrentUser(null);
    return null;
  }

  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('id, email, role, nickname')
      .eq('id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('Failed to load Supabase user profile:', error);
    }

    const normalizedEmail = safeLower(user.email);
    const profileRole = safeLower(profile?.role);
    const metadataRole = safeLower(user.app_metadata?.role);
    const userMetadataRole = safeLower(user.user_metadata?.role);

    let resolvedRole = profileRole === 'admin' ? 'admin' : 'customer';
    if (resolvedRole !== 'admin') {
      if (metadataRole === 'admin' || userMetadataRole === 'admin' || ADMIN_EMAILS.includes(normalizedEmail)) {
        resolvedRole = 'admin';
      }
    }

    const normalizedUser = {
      id: user.id,
      email: normalizedEmail,
      role: resolvedRole,
      nickname: profile?.nickname || user.user_metadata?.nickname || '',
      lastSignInAt: user.last_sign_in_at || new Date().toISOString(),
    };

    updateCurrentUser(normalizedUser);
    return normalizedUser;
  } catch (error) {
    console.error('Error loading Supabase user profile:', error);
    const fallbackUser = {
      id: user.id,
      email: safeLower(user.email),
      role: ADMIN_EMAILS.includes(safeLower(user.email)) ? 'admin' : 'customer',
      nickname: user.user_metadata?.nickname || '',
      lastSignInAt: user.last_sign_in_at || new Date().toISOString(),
    };
    updateCurrentUser(fallbackUser);
    return fallbackUser;
  }
}

async function ensureInitialized() {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const stored = readStoredUser();
    if (stored && !currentUser) {
      updateCurrentUser(stored, { persist: false, silent: true });
    }

    if (!hasSupabaseCredentials) {
      initialized = true;
      notifyAuthChange();
      return;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to get Supabase session:', error);
      }

      const sessionUser = data?.session?.user;
      if (sessionUser) {
        await loadUserFromSupabase(sessionUser);
      } else {
        updateCurrentUser(null);
      }

      if (!authSubscription) {
        const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            updateCurrentUser(null);
          } else if (session?.user) {
            await loadUserFromSupabase(session.user);
          }
        });
        authSubscription = subscription;
      }
    } catch (error) {
      console.error('Error during auth initialization:', error);
    } finally {
      initialized = true;
      notifyAuthChange();
    }
  })().finally(() => {
    initPromise = null;
  });

  return initPromise;
}

export const authService = {
  async initialize() {
    await ensureInitialized();
    return currentUser;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getCurrentUser() {
    return currentUser || readStoredUser();
  },

  isAdmin(user = null) {
    const checkUser = user || currentUser || readStoredUser();
    if (!checkUser) return false;

    if (isPublicMode) return false;
    if (!hasSupabaseCredentials && isDevelopment) return true;

    const email = safeLower(checkUser.email);
    const role = safeLower(checkUser.role);

    if (role === 'admin') return true;
    return ADMIN_EMAILS.includes(email);
  },

  async login(email, password) {
    try {
      const normalizedEmail = safeLower(email);
      if (!normalizedEmail || !password) {
        return { success: false, error: '이메일과 비밀번호를 입력해주세요.' };
      }

      await ensureInitialized();

      if (!hasSupabaseCredentials) {
        const isConfiguredAdmin = normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD;
        const isDevBypass = isDevelopment && normalizedEmail === 'admin@daddybathbomb.com' && password === 'admin123';

        if (isConfiguredAdmin || isDevBypass) {
          const user = {
            id: 'local-admin',
            email: normalizedEmail,
            role: 'admin',
            loginAt: new Date().toISOString(),
          };
          updateCurrentUser(user);
          return { success: true, user };
        }

        return { success: false, error: 'Invalid credentials' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error || !data?.user) {
        return { success: false, error: error?.message || '로그인에 실패했습니다.' };
      }

      const user = await loadUserFromSupabase(data.user);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error?.message || '로그인 중 오류가 발생했습니다.' };
    }
  },

  async logout() {
    try {
      if (hasSupabaseCredentials) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Supabase signOut failed:', error);
    } finally {
      updateCurrentUser(null);
    }
    return { success: true };
  },

  async refreshUser() {
    if (!hasSupabaseCredentials) {
      return currentUser;
    }
    await ensureInitialized();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      updateCurrentUser(null);
      return null;
    }
    return await loadUserFromSupabase(data.user);
  },

  async protectedAction(action, errorMessage = 'Admin access required') {
    await ensureInitialized();
    if (!this.isAdmin()) {
      throw new Error(errorMessage);
    }
    return await action();
  },
};

export const pageGuard = {
  canAccessAdmin() {
    if (isDevelopment && !hasSupabaseCredentials) return true;
    if (isPublicMode) return false;
    return authService.isAdmin();
  },

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
  },
};

export const envConfig = {
  isPublicMode,
  isDevelopment,
  adminEnabled: !isPublicMode,
  showDebugInfo: isDevelopment && !isPublicMode,
  logLevel: isDevelopment ? 'debug' : 'error',
  hasSupabaseCredentials,
};

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
  },
};

authService.initialize();
