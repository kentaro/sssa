import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-indigo-100 transition-colors">
            🚀 宇宙スキル標準アセスメント
          </Link>
          <nav className="flex gap-8">
            <Link
              href="/skills"
              className="hover:text-indigo-100 transition-colors font-medium text-lg"
            >
              スキル一覧
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
