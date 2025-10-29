'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-indigo-100 transition-colors">
            🚀 宇宙スキル標準アセスメント
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/skills"
              className="hover:text-indigo-100 transition-colors font-medium text-lg"
            >
              スキル一覧
            </Link>
            <Link
              href="/results"
              className={`transition-colors text-lg ${
                pathname?.startsWith('/results')
                  ? 'bg-white/30 px-3 py-1 rounded-lg font-semibold'
                  : 'hover:text-indigo-100 font-medium'
              }`}
            >
              評価結果
            </Link>
            <Link
              href="/about"
              className="hover:text-indigo-100 transition-colors font-medium text-lg"
            >
              このサイトについて
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
