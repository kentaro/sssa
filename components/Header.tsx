'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
      <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4">
          <Link href="/" className="text-xl lg:text-2xl font-bold hover:text-indigo-100 transition-colors leading-tight text-center lg:text-left">
            <span className="inline-block">🚀 宇宙スキル標準</span>
            <span className="inline-block">アセスメント</span>
          </Link>
          <nav className="flex items-center justify-center flex-wrap gap-2 lg:gap-6 text-xs lg:text-base">
            <Link
              href="/categories"
              className={`transition-colors whitespace-nowrap px-2 lg:px-3 py-1 rounded-lg ${
                pathname?.startsWith('/categories')
                  ? 'bg-white/30 font-semibold'
                  : 'hover:bg-white/10 font-medium'
              }`}
            >
              <span className="hidden lg:inline">カテゴリ一覧</span>
              <span className="lg:hidden">カテゴリ</span>
            </Link>
            <Link
              href="/quick-assessment/results"
              className={`transition-colors whitespace-nowrap px-2 lg:px-3 py-1 rounded-lg ${
                pathname?.startsWith('/quick-assessment')
                  ? 'bg-white/30 font-semibold'
                  : 'hover:bg-white/10 font-medium'
              }`}
            >
              <span className="hidden lg:inline">クイック診断結果</span>
              <span className="lg:hidden">簡易結果</span>
            </Link>
            <Link
              href="/results"
              className={`transition-colors whitespace-nowrap px-2 lg:px-3 py-1 rounded-lg ${
                pathname?.startsWith('/results')
                  ? 'bg-white/30 font-semibold'
                  : 'hover:bg-white/10 font-medium'
              }`}
            >
              <span className="hidden lg:inline">詳細診断結果</span>
              <span className="lg:hidden">詳細結果</span>
            </Link>
            <Link
              href="/about"
              className={`transition-colors whitespace-nowrap px-2 lg:px-3 py-1 rounded-lg ${
                pathname?.startsWith('/about')
                  ? 'bg-white/30 font-semibold'
                  : 'hover:bg-white/10 font-medium'
              }`}
            >
              <span className="hidden lg:inline">このサイトについて</span>
              <span className="lg:hidden">サイト情報</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
