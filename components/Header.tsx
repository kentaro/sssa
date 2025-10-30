'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href?: string;
  submenu?: SubMenuItem[];
}

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'コンテンツ',
      submenu: [
        { label: 'スキル一覧', href: '/skills' },
        { label: '職種一覧', href: '/roles' },
      ],
    },
    {
      label: '診断',
      submenu: [
        { label: 'クイック診断', href: '/quick-assessment' },
        { label: '詳細診断', href: '/categories' },
      ],
    },
    {
      label: '結果',
      submenu: [
        { label: 'クイック診断結果', href: '/quick-assessment/results' },
        { label: '詳細診断結果', href: '/results' },
      ],
    },
    { label: 'このサイトについて', href: '/about' },
  ];

  const handleMouseEnter = (label: string) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    setOpenSubmenu(label);
  };

  const handleMouseLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 200);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  const toggleMobileSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  const isActive = (href?: string, submenu?: SubMenuItem[]) => {
    if (href) {
      return pathname === href || pathname?.startsWith(href + '/');
    }
    if (submenu) {
      return submenu.some((item) => pathname === item.href || pathname?.startsWith(item.href + '/'));
    }
    return false;
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
      <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Title */}
          <Link
            href="/"
            className="text-xl lg:text-2xl font-bold hover:text-indigo-100 transition-colors leading-tight"
            onClick={() => closeMobileMenu()}
          >
            <span className="inline-block">🚀 宇宙スキル標準</span>
            <span className="inline-block">アセスメント</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.submenu && handleMouseEnter(item.label)}
                onMouseLeave={() => item.submenu && handleMouseLeave()}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap ${
                      isActive(item.href)
                        ? 'bg-white/30 font-semibold'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap flex items-center gap-1 ${
                      isActive(undefined, item.submenu)
                        ? 'bg-white/30 font-semibold'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openSubmenu === item.label ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Desktop Submenu */}
                {item.submenu && openSubmenu === item.label && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`block px-4 py-2 transition ${
                          pathname === subItem.href || pathname?.startsWith(subItem.href + '/')
                            ? 'bg-purple-50 text-purple-600 font-semibold'
                            : 'text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="メニュー"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-2">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-colors font-medium ${
                        isActive(item.href)
                          ? 'bg-white/30 font-semibold'
                          : 'hover:bg-white/10'
                      }`}
                      onClick={() => closeMobileMenu()}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors font-medium ${
                          isActive(undefined, item.submenu)
                            ? 'bg-white/30 font-semibold'
                            : 'hover:bg-white/10'
                        }`}
                        onClick={() => toggleMobileSubmenu(item.label)}
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            openSubmenu === item.label ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Mobile Submenu */}
                      {item.submenu && openSubmenu === item.label && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
                                pathname === subItem.href || pathname?.startsWith(subItem.href + '/')
                                  ? 'bg-white/30 font-semibold'
                                  : 'hover:bg-white/10'
                              }`}
                              onClick={() => closeMobileMenu()}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
