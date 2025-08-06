'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 定义导航项的类型
interface NavItem {
  title: string;
  href: string;
}

// 定义用户信息类型
interface UserInfo {
  name: string;
  email: string;
}

// 导航菜单数据
export const NAV_ITEMS: NavItem[] = [
  { title: '首页', href: '/' },
  { title: '经验文章', href: '/articles' },
  // { title: '提效工具', href: '/tools' },
  // { title: '关于我们', href: '/about' },
  // { title: '会员介绍', href: '/membership' },
] as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 在组件加载时从localStorage获取用户信息
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // 判断当前路径是否匹配导航项
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUserInfo(null);
    setIsDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">跨境鱼友圈</div>
            <div className="hidden md:flex space-x-6 ml-10">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-800">{userInfo.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} cursor-pointer`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                登录/注册
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}