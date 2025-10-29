import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        宇宙スキル標準アセスメントについて
      </h1>

      {/* 概要 */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          本アプリケーションについて
        </h2>
        <p className="text-gray-700 mb-4">
          このアプリケーションは、内閣府宇宙開発戦略推進事務局が公開している
          <a
            href="https://www8.cao.go.jp/space/skill/kaisai.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mx-1"
          >
            宇宙スキル標準（試作版）
          </a>
          を基に開発されたWebベースのスキルアセスメントツールです。
        </p>
        <p className="text-gray-700">
          Excel形式で公開されている宇宙スキル標準を、より使いやすく、
          アクセスしやすい形で提供し、宇宙産業に携わる方々や
          これから携わろうとする方々のスキル評価と成長をサポートします。
        </p>
      </section>

      {/* 宇宙スキル標準とは */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          宇宙スキル標準とは
        </h2>
        <p className="text-gray-700 mb-4">
          宇宙スキル標準は、宇宙産業で求められるスキルを体系的に整理し、
          標準化したものです。以下の要素で構成されています：
        </p>

        <div className="space-y-4">
          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-bold text-gray-900 mb-2">95のスキル項目</h3>
            <p className="text-gray-700 text-sm">
              プログラム創造・組成からコーポレートまで、
              宇宙産業に必要な幅広いスキルを網羅
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-bold text-gray-900 mb-2">8つのカテゴリ</h3>
            <ul className="text-gray-700 text-sm list-disc list-inside space-y-1">
              <li>プログラム創造・組成</li>
              <li>プロジェクトマネジメント</li>
              <li>基盤技術</li>
              <li>設計・解析</li>
              <li>試験</li>
              <li>製造・加工</li>
              <li>打上げ・衛星運用</li>
              <li>コーポレート</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-bold text-gray-900 mb-2">4つの評価軸</h3>
            <ul className="text-gray-700 text-sm list-disc list-inside space-y-1">
              <li>遂行可能な業務範囲・深さ</li>
              <li>業務遂行時の自立性</li>
              <li>資格・検定</li>
              <li>経験年数</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-bold text-gray-900 mb-2">5段階のレベル定義</h3>
            <p className="text-gray-700 text-sm">
              各スキル・評価軸ごとに、レベル1（基礎）からレベル5（エキスパート）
              までの詳細な到達基準が定義されています
            </p>
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          使い方
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">スキルを知る</h3>
              <p className="text-gray-700">
                <Link href="/skills" className="text-blue-600 hover:underline">
                  スキル一覧ページ
                </Link>
                から、8つのカテゴリに分類された95のスキル項目を確認できます。
                各スキルには詳細な説明が付いています。
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">セルフアセスメント</h3>
              <p className="text-gray-700">
                評価したいカテゴリを選択し、そのカテゴリ内のスキルを
                4つの評価軸で5段階評価します。各レベルの詳細説明を見ながら、
                自分に最も当てはまるレベルを選択してください。
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">結果の確認</h3>
              <p className="text-gray-700">
                評価が完了すると、カテゴリ別のサマリーとレーダーチャートで
                あなたのスキルプロファイルが可視化されます。
                評価の高いカテゴリに基づいて、推奨されるロールも表示されます。
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">結果の共有</h3>
              <p className="text-gray-700">
                評価結果はパーマリンク（URL）として生成されます。
                このURLを共有することで、他者にあなたのスキルプロファイルを
                簡単に見てもらうことができます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* データの保存について */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          データの保存について
        </h2>
        <p className="text-gray-700 mb-4">
          アセスメントの途中経過は、ブラウザのLocalStorageに自動的に保存されます。
          これにより、途中で中断しても、次回アクセス時に続きから評価を再開できます。
        </p>
        <p className="text-gray-700 text-sm text-gray-600">
          ※ LocalStorageのデータはブラウザごとに保存されます。
          別のブラウザやデバイスでは参照できません。
          また、ブラウザのキャッシュをクリアすると削除されます。
        </p>
      </section>

      {/* 開発者情報 */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          開発者
        </h2>
        <div className="text-gray-700 space-y-2">
          <p>
            <strong>栗林健太郎</strong>
          </p>
          <p>
            <a
              href="https://kentarokuribayashi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://kentarokuribayashi.com
            </a>
          </p>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          さっそく始めましょう
        </h2>
        <p className="text-gray-700 mb-6">
          自分のスキルを評価して、宇宙産業でのキャリアパスを見つけましょう
        </p>
        <Link
          href="/skills"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          スキル一覧を見る
        </Link>
      </section>
    </div>
  );
}
