'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <Link href="/" className="text-xl sm:text-2xl font-bold hover:text-indigo-100 transition-colors leading-tight text-center sm:text-left">
            <span className="inline-block">🚀 宇宙スキル標準</span>
            <span className="inline-block">アセスメント</span>
          </Link>
          <nav className="flex items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base">
            <Link
              href="/skills"
              className="hover:text-indigo-100 transition-colors font-medium whitespace-nowrap"
            >
              スキル一覧
            </Link>
            <Link
              href="/results"
              className={`transition-colors whitespace-nowrap ${
                pathname?.startsWith('/results')
                  ? 'bg-white/30 px-2 sm:px-3 py-1 rounded-lg font-semibold'
                  : 'hover:text-indigo-100 font-medium'
              }`}
            >
              評価結果
            </Link>
            <Link
              href="/about"
              className="hover:text-indigo-100 transition-colors font-medium whitespace-nowrap"
            >
              このサイトについて
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
