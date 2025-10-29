# SSSA - 宇宙スキル標準アセスメント

内閣府宇宙開発戦略推進事務局が公開している[宇宙スキル標準（試作版）](https://www8.cao.go.jp/space/skill/kaisai.html)をベースにした、Webベースのスキルアセスメントツールです。

## 概要

Excel形式で公開されている宇宙スキル標準をWebアプリケーション化し、より使いやすいスキルアセスメント機能を提供します。

## データについて

### データソース

- **元データ**: [宇宙スキル標準（試作版）2025](https://www8.cao.go.jp/space/skill/uchuskill2025.xlsx)
- **抽出日**: 2025-10-29
- **形式**: YAML ([data/space_skill_standard_complete.yaml](data/space_skill_standard_complete.yaml))
- **詳細**: データ構造の詳細は [data/README.md](data/README.md) を参照

### データ構造

抽出されたデータには以下の情報が含まれています：

| データ種別 | 件数 | 説明 |
|-----------|------|------|
| スキル | 95件 | 宇宙産業で必要とされるスキル項目 |
| 業務 | 58件 | 宇宙産業における業務項目 |
| スキルレベル定義 | 269件 | スキルごとの4評価軸×5段階の詳細定義（一部スキルは評価軸が定義されていない） |
| スキル×業務マッピング | 57件 | スキルと業務の関連付け |
| 評価軸 | 4件 | スキル評価の4つの軸 |
| ロール | 17件 | 職種・役割の定義と必要スキル |
| 参考プログラム | 21件 | スキル習得のための参考教育プログラム |
| 参考学問 | 13件 | 関連する学問分野 |
| 参考資格検定 | 41件 | 関連する資格・検定 |

### スキルカテゴリ

- **プログラム創造・組成** (3スキル)
- **プロジェクトマネジメント** (10スキル)
- **基盤技術** (7スキル)
- **設計・解析** (26スキル)
- **試験** (8スキル)
- **製造・加工** (13スキル)
- **打上げ・衛星運用** (9スキル)
- **コーポレート** (18スキル)

### 評価軸

各スキルは以下の4つの評価軸で5段階評価されます：

1. **遂行可能な業務範囲・深さ**
2. **業務遂行時の自立性**
3. **資格・検定**
4. **経験年数**

## 機能

### 1. スキル一覧
- ✅ 95スキル項目の表示
- ✅ 8カテゴリ別のグループ表示
- ✅ スキル詳細説明の表示
- ✅ カテゴリごとの評価ページへの直接リンク

### 2. カテゴリ別アセスメント
- ✅ カテゴリ内の全スキルを一括評価
- ✅ 4つの評価軸×5段階レベルでの自己評価
- ✅ レベルごとの詳細説明の表示（展開/折りたたみ）
- ✅ 進捗表示（評価済みスキル数）
- ✅ LocalStorageへの自動保存
- ✅ スキル間のナビゲーション

### 3. 結果表示
- ✅ カテゴリ別レーダーチャート
- ✅ カテゴリごとの平均スコアと完了率
- ✅ 評価の高いカテゴリに基づく推奨ロールの提示
- ✅ パーマリンクURLによる結果共有

### 4. データ管理
- ✅ LocalStorageによる進捗保存
- ✅ URLハッシュによる結果の共有
- ✅ GitHub Pages静的ホスティング対応

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Format**: YAML
- **Data Parsing**: js-yaml
- **Visualization**: Recharts
- **Deployment**: GitHub Pages (Static Export)

## Getting Started

### 開発サーバーの起動

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### データファイルの確認

```bash
# データファイルの場所
cat data/space_skill_standard_complete.yaml
```

### データの再抽出

Excelファイルからskill_levelsデータを再抽出する場合：

```bash
# 必要なライブラリのインストール
pip install openpyxl pyyaml

# Excelファイルのダウンロード
curl -o uchuskill2025.xlsx https://www8.cao.go.jp/space/skill/uchuskill2025.xlsx

# skill_levelsの抽出
python3 scripts/extract_skill_levels.py uchuskill2025.xlsx

# 既存YAMLファイルへの統合は手動で行う必要があります
```

### データ整合性の検証

元のExcelファイルと抽出したYAMLファイルの整合性を検証できます：

```bash
# 検証スクリプトの実行
python3 scripts/verify_data.py
```

検証項目：
- ✓ 件数チェック（スキル、業務、ロール等）
- ✓ スキル名・番号の照合
- ✓ 業務名・番号の照合
- ✓ スキルレベル定義の検証（skill_number、evaluation_axisの照合）
- ✓ カテゴリ分類の検証

## プロジェクト構造

```
sssa/
├── app/                                    # Next.js App Router
│   ├── assessment/[category]/             # カテゴリ別評価ページ
│   ├── results/[[...encoded]]/            # 結果表示ページ
│   ├── skills/                            # スキル一覧ページ
│   ├── about/                             # Aboutページ
│   └── page.tsx                           # ホームページ
├── components/                             # Reactコンポーネント
│   ├── SkillAssessmentForm.tsx            # スキル評価フォーム
│   ├── CategoryRadarChart.tsx             # レーダーチャート
│   ├── ProgressIndicator.tsx              # 進捗表示
│   ├── Header.tsx / Footer.tsx            # レイアウトコンポーネント
├── lib/                                    # ユーティリティ関数
│   ├── data-loader.ts                     # YAMLデータ読み込み（サーバーサイド）
│   ├── types.ts                           # TypeScript型定義
│   ├── storage.ts                         # LocalStorage管理
│   ├── permalink.ts                       # パーマリンク生成
│   └── assessment-utils.ts                # 評価計算ユーティリティ
├── data/                                   # データファイル
│   ├── README.md                          # データ構造詳細ドキュメント
│   └── space_skill_standard_complete.yaml # 完全抽出データ（269 skill_levels）
├── scripts/                                # データ処理スクリプト
│   ├── extract_skill_levels.py            # skill_levels抽出スクリプト
│   └── verify_data.py                     # データ整合性検証スクリプト
├── public/                                 # 静的ファイル
└── .github/workflows/deploy.yml           # GitHub Actions デプロイ設定
```

## ライセンス

このプロジェクトは、内閣府宇宙開発戦略推進事務局が公開している宇宙スキル標準（試作版）を基にしています。
元データの利用条件については、[公式サイト](https://www8.cao.go.jp/space/skill/kaisai.html)をご確認ください。

## 参考リンク

- [宇宙スキル標準（試作版）公式ページ](https://www8.cao.go.jp/space/skill/kaisai.html)
- [Next.js Documentation](https://nextjs.org/docs)
