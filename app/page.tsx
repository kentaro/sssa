import Link from 'next/link';
import { Gauge, Layers, Orbit, Sparkles, Boxes, FolderTree, Ruler, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const featureList = [
  {
    icon: <Gauge className="h-7 w-7" />,
    title: 'クイック診断',
    description: '24問でスキル傾向を素早く把握し、取り組むべきカテゴリを推薦',
    href: '/quick-assessment',
    meta: '所要時間：約5分',
  },
  {
    icon: <Layers className="h-7 w-7" />,
    title: '詳細診断',
    description: 'カテゴリごとに評価軸を見ながら丁寧にセルフアセスメント',
    href: '/categories',
    meta: 'カテゴリ別：10〜20分',
  },
];

const stats = [
  {
    label: '評価可能スキル',
    value: '67',
    sub: '全94項目中',
    icon: <Boxes className="h-5 w-5" />
  },
  {
    label: '評価カテゴリ',
    value: '6',
    sub: '全8カテゴリ中',
    icon: <FolderTree className="h-5 w-5" />
  },
  {
    label: '評価軸',
    value: '4',
    sub: '業務範囲・自立性など',
    icon: <Ruler className="h-5 w-5" />
  },
  {
    label: '評価レベル',
    value: '5段階',
    sub: 'Lv0〜Lv5で定義',
    icon: <TrendingUp className="h-5 w-5" />
  },
];

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="py-20">
        <div className="space-y-12">
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Space Career Design
            </div>
            <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              宇宙スキル標準にもとづく<br className="hidden sm:block" />セルフアセスメント
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground/80 sm:text-xl">
              宇宙産業で求められるスキルセットを体系的に整理し、あなたの現在地と次の一歩を明確化します。
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30" asChild>
              <Link href="/quick-assessment">
                クイック診断を始める
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 border-2 px-8 text-base font-medium transition-all hover:border-primary hover:bg-primary/5" asChild>
              <Link href="/categories">
                詳細診断に進む
              </Link>
            </Button>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((item) => (
              <Card key={item.label} className="group border-0 bg-transparent shadow-none transition-transform hover:scale-105">
                <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25 transition-all group-hover:shadow-xl group-hover:shadow-primary/40">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-bold tracking-tight">{item.value}</CardTitle>
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                      {item.label}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        {featureList.map((feature) => (
          <Card key={feature.title} className="group relative overflow-hidden border border-border/50 bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader className="relative space-y-4 pb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-md transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{feature.meta}</span>
                <Button variant="default" size="sm" className="shadow-sm transition-all hover:shadow-md" asChild>
                  <Link href={feature.href}>
                    開始する
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border border-border/50 bg-card shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-md">
            <Orbit className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              宇宙スキル標準とは
            </CardTitle>
            <CardDescription className="text-base">
              内閣府宇宙開発戦略推進事務局が策定した宇宙産業向けスキルフレームワークをベースに、評価基準をそのままWebアプリケーションに落とし込みました。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p className="text-base leading-relaxed">
            Excelシートで公開されている標準データを読み込み、カテゴリ・スキル・評価軸のクロス分析をそのままの粒度で提供します。アクセス不要で、診断結果はローカルに保存、 permalink で共有できます。
          </p>
          <div className="space-y-3 rounded-lg bg-background/50 p-6">
            <p className="text-sm font-medium text-foreground">
              収録コンテンツ
            </p>
            <ul className="space-y-2 text-sm">
              <li>• 評価軸別レベル定義（業務範囲・自立性・資格・経験年数）</li>
              <li>• 39種類の職種と要求スキルの紐付け</li>
              <li>• カテゴリ間の比較が容易なレーダーチャート</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
