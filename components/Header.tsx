import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-blue-200 transition">
            宇宙スキル標準アセスメント
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/skills"
              className="hover:text-blue-200 transition font-medium"
            >
              スキル一覧
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-200 transition font-medium"
            >
              について
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
