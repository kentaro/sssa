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
| スキルレベル定義 | 68件 | スキルごとの4評価軸×5段階の詳細定義 |
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

## 機能（予定）

### 1. スキル選択
- 95スキルからアセスメント対象を選択
- カテゴリ別フィルタリング
- スキル詳細情報の表示

### 2. アセスメント
- 4つの評価軸ごとの自己評価
- 5段階レベルの詳細説明表示
- 直感的なレベル選択UI

### 3. 結果表示
- スキルマップのビジュアル化（レーダーチャート等）
- 推奨ロールの提示
- 学習推奨リソースの提示

### 4. データ管理
- アセスメント結果の保存
- 履歴管理・経時比較機能
- エクスポート機能（PDF等）

## 技術スタック

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Format**: YAML

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

### データ整合性の検証

元のExcelファイルと抽出したYAMLファイルの整合性を検証できます：

```bash
# 必要なライブラリのインストール
pip install openpyxl pyyaml

# Excelファイルのダウンロード（初回のみ）
curl -L -o /tmp/uchuskill2025.xlsx "https://www8.cao.go.jp/space/skill/uchuskill2025.xlsx"

# 検証スクリプトの実行
python3 scripts/verify_data.py
```

検証項目：
- ✓ 件数チェック（スキル、業務、ロール等）
- ✓ スキル名・番号の照合
- ✓ 業務名・番号の照合
- ✓ スキルレベル定義の検証
- ✓ カテゴリ分類の検証

## プロジェクト構造

```
sssa/
├── app/                    # Next.js App Router
├── data/                   # データファイル
│   ├── README.md          # データ構造詳細ドキュメント
│   └── space_skill_standard_complete.yaml
├── scripts/                # ユーティリティスクリプト
│   └── verify_data.py     # データ整合性検証スクリプト
├── components/             # Reactコンポーネント
├── lib/                    # ユーティリティ関数
└── public/                 # 静的ファイル
```

## ライセンス

このプロジェクトは、内閣府宇宙開発戦略推進事務局が公開している宇宙スキル標準（試作版）を基にしています。
元データの利用条件については、[公式サイト](https://www8.cao.go.jp/space/skill/kaisai.html)をご確認ください。

## 参考リンク

- [宇宙スキル標準（試作版）公式ページ](https://www8.cao.go.jp/space/skill/kaisai.html)
- [Next.js Documentation](https://nextjs.org/docs)
