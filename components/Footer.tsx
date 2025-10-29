export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">データソース</h3>
            <p className="mb-2">
              <a
                href="https://www8.cao.go.jp/space/skill/kaisai.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-indigo-200 hover:underline"
              >
                内閣府 宇宙スキル標準（試作版）
              </a>
            </p>
            <p className="text-sm text-gray-400">
              本アプリケーションは、内閣府宇宙開発戦略推進事務局が公開している宇宙スキル標準（試作版）を基にしています。
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">開発者</h3>
            <p className="mb-2">栗林健太郎</p>
            <a
              href="https://kentarokuribayashi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200 hover:underline"
            >
              https://kentarokuribayashi.com
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-indigo-800 text-center text-sm text-gray-400">
          <p>&copy; 2025 Space Skill Standard Self-Assessment</p>
        </div>
      </div>
    </footer>
  );
}
