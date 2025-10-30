import Link from "next/link";
import { ArrowRight, ExternalLink, FolderCog, Layers, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    step: "1",
    title: "診断モードを選択",
    description:
      "トップページからクイック診断または詳細診断を選びます。クイック診断は約5分、詳細診断はカテゴリ単位で丁寧に評価します。",
    href: "/",
    linkLabel: "トップページへ",
  },
  {
    step: "2",
    title: "カテゴリを決める",
    description:
      "詳細診断では6つの対象カテゴリから評価対象を選択。カテゴリごとにスキル構造が異なり、説明文も添えています。",
    href: "/categories",
    linkLabel: "カテゴリ一覧を見る",
  },
  {
    step: "3",
    title: "セルフアセスメント",
    description:
      "各スキルについて4つの評価軸を6段階（Lv0〜Lv5）で判定。レベル詳細を確認しながら、自分の現在地に最も近いレベルを選択します。",
  },
  {
    step: "4",
    title: "結果を共有",
    description:
      "診断結果はレーダーチャートや推奨職種と共に整形。パーマリンクを生成して社内外で共有できます。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="space-y-3">
        <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]">
          Project Overview
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          宇宙スキル標準アセスメントについて
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          内閣府宇宙開発戦略推進事務局が公開している宇宙スキル標準（試作版）をWebコンポーザブルな診断体験に再設計しました。Excelの情報構造を忠実に反映しつつ、操作性・視覚性・共有性を高めています。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="h-5 w-5 text-primary" />
            本アプリケーションの狙い
          </CardTitle>
          <CardDescription>
            宇宙産業に携わる（あるいは志望する）個人のスキル棚卸しと育成計画策定を支援するため、アクセスしづらかった標準資料を誰でも扱えるインタラクティブなインターフェースへ変換しています。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            元データは
            <a
              href="https://www8.cao.go.jp/space/skill/kaisai.html"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-1 text-primary hover:text-primary/80"
            >
              宇宙スキル標準（試作版）
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            。公開スプレッドシートを解析し、カテゴリ／スキル／評価軸をデータモデル化した上で、診断フロー・結果可視化・ローカル保存・パーマリンク生成を実装しています。
          </p>
          <div className="grid gap-4 rounded-xl border border-dashed border-border/70 bg-muted/40 p-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Layers className="h-4 w-4 text-primary" />
                カバレッジ
              </p>
              <ul className="space-y-1.5 text-sm">
                <li>• 94スキルのうち67項目に評価基準を実装</li>
                <li>• 評価対象カテゴリ：6／8</li>
                <li>• 評価軸：遂行範囲・自立性・資格・経験年数</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <FolderCog className="h-4 w-4 text-primary" />
                付帯機能
              </p>
              <ul className="space-y-1.5 text-sm">
                <li>• 診断途中の自動保存（LocalStorage）</li>
                <li>• レベル詳細のオンデマンド表示</li>
                <li>• レーダーチャート／推奨職種の即時算出</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">利用フロー</CardTitle>
          <CardDescription>診断開始から結果共有まで4ステップで完結します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((item, index) => (
            <div key={item.step}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/5 text-sm font-semibold text-primary">
                  {item.step}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  {item.href && (
                    <Button variant="link" className="px-0 text-sm" asChild>
                      <Link href={item.href}>
                        {item.linkLabel}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">データの扱い</CardTitle>
          <CardDescription>
            診断データはすべてブラウザローカルに保存され、サーバーには送信されません。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            LocalStorageに自動保存するため、途中離脱しても再開が可能です（ブラウザごとに保存領域が独立）。キャッシュクリアや異なるブラウザではデータが失われる点に注意してください。
          </p>
          <p>
            完了後は評価結果を圧縮し、パーマリンクとして生成します。URLを共有することで、外部の閲覧者も同じ分析ビューを再現できます。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">開発者</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p className="text-base font-semibold text-foreground">栗林健太郎</p>
          <a
            href="https://kentarokuribayashi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 text-primary hover:text-primary/80"
          >
            kentarokuribayashi.com
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </CardContent>
      </Card>

      <Card className="border-primary/40 bg-primary/5 text-center">
        <CardHeader>
          <CardTitle className="text-xl">さっそく診断を始めましょう</CardTitle>
          <CardDescription>
            クイック診断で傾向を掴み、詳細診断でキャリア戦略を具体化できます。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/quick-assessment">クイック診断へ</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/categories">詳細診断を選ぶ</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

