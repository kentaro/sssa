# 宇宙業界のキャリア診断 | Career in Space

内閣府宇宙開発戦略推進事務局が公開している[宇宙スキル標準（試作版）](https://www8.cao.go.jp/space/skill/kaisai.html)に基づいた、無料のキャリア診断ツールです。

🚀 **デモサイト**: [https://career-in.space](https://career-in.space)

## 概要

あなたに合った宇宙業界のキャリアを見つけよう。24問の診断で適性のある職種やスキルを発見できます。

### 主な特徴

- ✅ **クイック診断（約5分）**: 24問の質問で適性診断
- ✅ **詳細診断**: カテゴリごとに評価軸を見ながら丁寧にスキル評価
- ✅ **子供モード**: やさしい言葉で説明する子供向け表示モード
- ✅ **結果共有**: URLで診断結果を共有可能
- ✅ **完全無料**: ログイン不要、データは全てローカル保存

## データについて

### データソース

- **元データ**: [宇宙スキル標準（試作版）2025](https://www8.cao.go.jp/space/skill/uchuskill2025.xlsx)
- **抽出日**: 2025-10-29
- **形式**: YAML ([data/space_skill_standard_complete.yaml](data/space_skill_standard_complete.yaml))
- **詳細**: データ構造の詳細は [data/README.md](data/README.md) を参照

### スキルカテゴリ

評価対象の6カテゴリ（全8カテゴリ中）:

- **プログラム創造・組成** (3スキル)
- **プロジェクトマネジメント** (10スキル)
- **基盤技術** (7スキル)
- **設計・解析** (26スキル)
- **試験** (8スキル)
- **製造・加工** (13スキル)

※「打上げ・衛星運用」(9スキル)と「コーポレート」(18スキル)は評価軸が未定義のため、詳細診断では対象外

### 評価軸

各スキルは以下の4つの評価軸で6段階（Lv0〜Lv5）評価:

1. **遂行可能な業務範囲・深さ**
2. **業務遂行時の自立性**
3. **資格・検定**
4. **経験年数**

## 機能詳細

### 1. クイック診断（約5分）

- 24問の2択質問で素早く適性診断
- 3つのセクション:
  - 働き方の志向
  - 思考・技術の方向性
  - 業務フェーズ・職種
- トップ3の推奨職種を表示
- 結果のURL共有機能
- **ロール数調整係数によるバランスの取れたスコアリング**
  - ロール数が多いカテゴリも公平に評価
  - 係数 = rolesInCategory ^ 0.45 で調整

### 2. 詳細診断（カテゴリ別）

- カテゴリ内の全スキルを一括評価
- 4つの評価軸×6段階（Lv0〜Lv5）での自己評価
- レベルごとの詳細説明の表示（展開/折りたたみ）
- 進捗表示（評価済みスキル数）
- LocalStorageへの自動保存
- スキル間のナビゲーション

### 3. 子供モード

- トップページからモード選択可能
- やさしい言葉で説明
- 難しい専門用語を避けた表現
- ヘッダーからいつでも切り替え可能

### 4. 結果表示

- カテゴリごとの平均スコアと完了率
- 評価の高いカテゴリに基づく推奨職種の提示
- パーマリンクURLによる結果共有（圧縮URL）
- 結果の印刷機能

### 5. データ管理

- LocalStorageによる進捗保存（ブラウザごとに独立）
- URLハッシュによる結果の共有
- サーバーへのデータ送信なし（完全にローカル）

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Data Format**: YAML
- **Data Parsing**: js-yaml
- **Compression**: pako (zlib)
- **Deployment**: GitHub Pages (Static Export)

## Getting Started

### 開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
npm run build
```

静的ファイルが `out/` ディレクトリに生成されます。

## プロジェクト構造

```
sssa/
├── app/                                    # Next.js App Router
│   ├── assessment/[category]/             # カテゴリ別評価ページ
│   ├── results/[[...encoded]]/            # 結果表示ページ
│   ├── quick-assessment/                  # クイック診断ページ
│   ├── categories/                        # カテゴリ一覧ページ
│   ├── skills/                            # スキル一覧ページ
│   ├── roles/                             # 職種一覧ページ
│   ├── about/                             # Aboutページ
│   ├── layout.tsx                         # ルートレイアウト
│   └── page.tsx                           # ホームページ
├── components/                             # Reactコンポーネント
│   ├── SkillAssessmentForm.tsx            # スキル評価フォーム
│   ├── QuickAssessmentQuestion.tsx        # クイック診断質問
│   ├── Header.tsx / Footer.tsx            # レイアウトコンポーネント
│   └── ui/                                # UIコンポーネント
├── lib/                                    # ユーティリティ関数
│   ├── data-loader.ts                     # YAMLデータ読み込み
│   ├── kids-data-loader.ts                # 子供モード用データ
│   ├── types.ts                           # TypeScript型定義
│   ├── storage.ts                         # LocalStorage管理
│   ├── permalink.ts                       # パーマリンク生成
│   ├── quick-assessment-scoring.ts        # クイック診断スコアリング
│   └── kids-mode-context.tsx              # 子供モードコンテキスト
├── data/                                   # データファイル
│   ├── README.md                          # データ構造詳細ドキュメント
│   ├── space_skill_standard_complete.yaml # 完全抽出データ
│   ├── space_skill_standard_kids.yaml     # 子供モード用データ
│   └── quick-assessment-questions.ts      # クイック診断質問データ
├── public/                                 # 静的ファイル
│   ├── og-image.png                       # OG画像（1200x630）
│   └── favicon.svg                        # ファビコン
└── .github/workflows/deploy.yml           # GitHub Actions デプロイ設定
```

## データ更新

### データの再抽出

Excelファイルから最新データを抽出する場合:

```bash
# 必要なライブラリのインストール
pip install openpyxl pyyaml

# Excelファイルのダウンロード
curl -o uchuskill2025.xlsx https://www8.cao.go.jp/space/skill/uchuskill2025.xlsx

# データの抽出
python3 scripts/extract_skill_levels.py uchuskill2025.xlsx
```

### データ整合性の検証

```bash
python3 scripts/verify_data.py
```

検証項目:
- ✓ 件数チェック（スキル、業務、ロール等）
- ✓ スキル名・番号の照合
- ✓ スキルレベル定義の検証
- ✓ カテゴリ分類の検証

## デプロイ

GitHub Pagesで自動デプロイされます:

1. `main` ブランチへのプッシュ
2. GitHub Actionsが自動的にビルド
3. `gh-pages` ブランチにデプロイ
4. https://career-in.space で公開

## ライセンス

このプロジェクトは、内閣府宇宙開発戦略推進事務局が公開している宇宙スキル標準（試作版）を基にしています。
元データの利用条件については、[公式サイト](https://www8.cao.go.jp/space/skill/kaisai.html)をご確認ください。

## 開発者

- 栗林健太郎 - [kentarokuribayashi.com](https://kentarokuribayashi.com)
- 横山遥乙 - [@haruotsu_hy](https://x.com/haruotsu_hy)

## 参考リンク

- [宇宙スキル標準（試作版）公式ページ](https://www8.cao.go.jp/space/skill/kaisai.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
