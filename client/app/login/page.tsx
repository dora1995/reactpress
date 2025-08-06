'use client';

import { useState } from 'react';
import './styles.css';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.API_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCodeSent(true);
        setCountdown(300); // 5分钟倒计时
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.message || '发送验证码失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('请输入6位验证码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const res = await response.json();
      if (res.statusCode === 200) {
        const data = res.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        router.push('/');
      } else {
        setError(res.msg || '验证码错误');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto">
          {/* Logo 和标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">欢迎回来</h1>
            <p className="text-gray-600">登录后开启您的学习之旅</p>
          </div>

          {/* 登录卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-lg backdrop-filter">
            <div className="space-y-6">
              {/* 邮箱输入框 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isCodeSent}
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-all duration-200"
                    placeholder="请输入邮箱地址"
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={loading || countdown > 0 || isCodeSent}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md active:scale-95"
                  >
                    {countdown > 0 ? `${countdown}秒` : '获取验证码'}
                  </button>
                </div>
              </div>

              {/* 验证码输入框 */}
              {isCodeSent && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    验证码
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, ''))}
                    maxLength={6}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest font-mono"
                    placeholder="请输入6位验证码"
                  />
                </div>
              )}
              {/* 登录按钮 */}
              {isCodeSent && (
                <button
                  onClick={handleVerifyCode}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登录中...
                    </span>
                  ) : '登录'}
                </button>
              )}

              {/* 提示文本 */}
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  未注册的邮箱将自动创建账号
                </p>
              </div>
            </div>
          </div>

          {/* 底部文本 */}
          <div className="mt-8 text-center text-sm text-gray-500">
            登录即表示您同意我们的
            <a href="/terms" className="text-blue-600 hover:text-blue-700">服务条款</a>
            和
            <a href="/privacy" className="text-blue-600 hover:text-blue-700">隐私政策</a>
          </div>
        </div>
      </div>
    </div>
  );
}