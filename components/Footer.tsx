export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">
            データソース:{' '}
            <a
              href="https://www8.cao.go.jp/space/skill/kaisai.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              内閣府 宇宙スキル標準（試作版）
            </a>
          </p>
          <p className="text-xs text-gray-500">
            本アプリケーションは、内閣府宇宙開発戦略推進事務局が公開している宇宙スキル標準（試作版）を基にしています。
          </p>
        </div>
      </div>
    </footer>
  );
}
