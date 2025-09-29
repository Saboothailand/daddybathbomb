// @ts-nocheck
import React, { useState } from 'react';
import { authService, ADMIN_EMAIL_DISPLAY } from '../utils/auth';

export default function AuthModal({ isOpen, onClose, language = 'th' }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        // authService를 통한 로그인
        const result = await authService.login(formData.email, formData.password);
        if (result.success) {
          if (authService.isAdmin(result.user)) {
            setSuccess('관리자로 로그인되었습니다!');
            setTimeout(() => {
              onClose();
              // 관리자 페이지로 이동하는 이벤트 발생
              window.dispatchEvent(new CustomEvent('navigate', { detail: 'admin' }));
            }, 1000);
          } else {
            setSuccess('로그인되었습니다!');
            setTimeout(() => {
              onClose();
            }, 1000);
          }
        } else {
          setError(result.error || '로그인에 실패했습니다.');
        }
      } else {
        // 임시 회원가입 로직
        if (!formData.nickname) {
          setError('닉네임을 입력해주세요.');
          return;
        }
        setSuccess('회원가입이 완료되었습니다! 로그인해주세요.');
        setTimeout(() => {
          setMode('login');
          setFormData({ ...formData, password: '', nickname: '', phone: '' });
        }, 1000);
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const texts = {
    th: {
      login: 'เข้าสู่ระบบ',
      signup: 'สมัครสมาชิก',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      nickname: 'ชื่อเล่น',
      phone: 'เบอร์โทรศัพท์',
      loginTitle: 'เข้าสู่ระบบ',
      signupTitle: 'สมัครสมาชิก',
      loginSubtitle: 'เข้าสู่ระบบ Daddy Bath Bomb',
      signupSubtitle: 'สมัครเป็นสมาชิก Daddy Bath Bomb',
      noAccount: 'ยังไม่มีบัญชี?',
      hasAccount: 'มีบัญชีแล้ว?',
      processing: 'กำลังดำเนินการ...'
    },
    en: {
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      nickname: 'Nickname',
      phone: 'Phone Number',
      loginTitle: 'Login',
      signupTitle: 'Sign Up',
      loginSubtitle: 'Login to Daddy Bath Bomb',
      signupSubtitle: 'Join Daddy Bath Bomb',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      processing: 'Processing...'
    }
  };

  const t = texts[language] || texts.th;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-theme border border-white/20 rounded-2xl max-w-md w-full p-6 relative backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl cursor-pointer"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? t.loginTitle : t.signupTitle}
          </h2>
          <p className="text-gray-300">
            {mode === 'login' ? t.loginSubtitle : t.signupSubtitle}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder={language === 'th' ? 'อีเมลของคุณ' : 'Your email'}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              {t.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder={language === 'th' ? 'รหัสผ่าน (อย่างน้อย 6 ตัว)' : 'Password (min 6 chars)'}
            />
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1">
                  {t.nickname}
                </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={language === 'th' ? 'ชื่อเล่นของคุณ' : 'Your nickname'}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  {t.phone} ({language === 'th' ? 'ไม่บังคับ' : 'Optional'})
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone number'}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
          >
            {loading ? t.processing : mode === 'login' ? t.login : t.signup}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            {mode === 'login' ? t.noAccount : t.hasAccount}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
                setSuccess(null);
                setFormData({ email: '', password: '', nickname: '', phone: '' });
              }}
              className="ml-2 text-pink-400 hover:text-pink-300 font-medium cursor-pointer"
            >
              {mode === 'login' ? t.signup : t.login}
            </button>
          </p>
        </div>

        {/* Admin hint */}
        {mode === 'login' && (
          <div className="mt-4 text-center text-xs text-gray-500">
            {language === 'th'
              ? `เคล็ดลับ: ใช้ ${ADMIN_EMAIL_DISPLAY} เพื่อเข้าสู่ระบบผู้ดูแล`
              : `Tip: Use ${ADMIN_EMAIL_DISPLAY} for admin access`}
          </div>
        )}
      </div>
    </div>
  );
}
