export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        ページが見つかりませんでした
      </p>
      <a
        href="/"
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        トップページに戻る
      </a>
    </div>
  );
}
