'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'intro' | 'user-type' | 'science-type';
type UserType = 'science' | 'liberal-arts';
type ScienceType = 'engineering' | 'operations';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [scienceType, setScienceType] = useState<ScienceType | null>(null);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    localStorage.setItem('sssa_user_type', type);

    if (type === 'liberal-arts') {
      // 文系の場合は直接おすすめページへ
      router.push('/recommendations');
    } else {
      // 理系の場合はさらに分岐
      setStep('science-type');
    }
  };

  const handleScienceTypeSelect = (type: ScienceType) => {
    setScienceType(type);
    localStorage.setItem('sssa_science_type', type);
    // おすすめページへ遷移
    router.push('/recommendations');
  };

  const handleReset = () => {
    setStep('intro');
    setUserType(null);
    setScienceType(null);
    localStorage.removeItem('sssa_user_type');
    localStorage.removeItem('sssa_science_type');
  };

  // イントロ画面
  if (step === 'intro') {
    return (
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-16 py-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            宇宙スキル標準アセスメント
          </h1>
          <p className="text-2xl text-gray-600 mb-10 leading-relaxed">
            あなたのスキルを評価し、宇宙産業でのキャリアパスを見つけましょう
          </p>
          <button
            onClick={() => setStep('user-type')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all"
          >
            アセスメントを始める
          </button>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-10 mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            宇宙スキル標準とは
          </h2>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            内閣府宇宙開発戦略推進事務局が公開している、宇宙産業で求められるスキルを体系化した標準です。
            本アプリケーションでは、この標準に基づいて自己評価を行い、自身のスキルレベルを可視化できます。
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
            <li>95の専門スキル項目</li>
            <li>8つのスキルカテゴリ</li>
            <li>4つの評価軸（業務範囲・自立性・資格・経験年数）</li>
            <li>5段階のスキルレベル定義</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/skills" className="text-indigo-600 hover:text-purple-600 hover:underline font-semibold text-lg">
            または、すべてのスキル一覧を見る →
          </Link>
        </div>
      </div>
    );
  }

  // ユーザータイプ選択
  if (step === 'user-type') {
    return (
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            あなたの専門分野を教えてください
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            あなたに最適なカテゴリをおすすめします
          </p>
          <p className="text-lg text-gray-500 mb-8">
            宇宙産業には95のスキルがありますが、すべてを評価する必要はありません。<br />
            あなたの専門性に応じて、関連性の高いカテゴリだけをご提案します。
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <button
            onClick={() => handleUserTypeSelect('science')}
            className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl hover:scale-105 transition-all text-left border-2 border-transparent hover:border-indigo-600"
          >
            <div className="text-6xl mb-4">🔬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              理系（技術系）
            </h2>
            <p className="text-gray-600 text-lg">
              エンジニアリング、設計、開発、運用などの技術職
            </p>
          </button>

          <button
            onClick={() => handleUserTypeSelect('liberal-arts')}
            className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl hover:scale-105 transition-all text-left border-2 border-transparent hover:border-indigo-600"
          >
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              文系（ビジネス系）
            </h2>
            <p className="text-gray-600 text-lg">
              マネジメント、経営、法務、財務などのビジネス職
            </p>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            ← 戻る
          </button>
        </div>
      </div>
    );
  }

  // 理系の細分化
  if (step === 'science-type') {
    return (
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            どちらの分野に近いですか？
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            より具体的なカテゴリをおすすめします
          </p>
          <p className="text-lg text-gray-500 mb-8">
            理系の中でも、開発・設計をする方と、現場で運用・製造をする方では<br />
            必要なスキルが異なります。あなたの業務に近い方を選んでください。
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <button
            onClick={() => handleScienceTypeSelect('engineering')}
            className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl hover:scale-105 transition-all text-left border-2 border-transparent hover:border-indigo-600"
          >
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              エンジニアリング・開発系
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              ソフトウェア、設計、解析などの開発業務
            </p>
            <p className="text-sm text-gray-500">
              例: システムエンジニア、構造設計、電気設計、ソフトウェア開発など
            </p>
          </button>

          <button
            onClick={() => handleScienceTypeSelect('operations')}
            className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl hover:scale-105 transition-all text-left border-2 border-transparent hover:border-indigo-600"
          >
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              運用・製造・現場系
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              試験、製造、打上げ、衛星運用などの現場業務
            </p>
            <p className="text-sm text-gray-500">
              例: 試験エンジニア、製造技術者、射場管制、衛星運用など
            </p>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            ← 最初に戻る
          </button>
        </div>
      </div>
    );
  }


  return null;
}
