import Link from 'next/link';
import { Gauge, Layers, Orbit, Sparkles, Boxes, FolderTree, Ruler, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const featureList = [
  {
    icon: <Gauge className="h-5 w-5 text-primary" />,
    title: 'クイック診断',
    description: '24問でスキル傾向を素早く把握し、取り組むべきカテゴリを推薦',
    href: '/quick-assessment',
    meta: '所要時間：約5分',
  },
  {
    icon: <Layers className="h-5 w-5 text-primary" />,
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
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-accent/30 p-10 shadow-sm">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 translate-x-10 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)_/_35%)_0,_transparent_70%)] sm:block" />
        <div className="relative space-y-6">
          <Badge variant="secondary" className="inline-flex items-center gap-1 rounded-full px-4 py-1 text-xs uppercase tracking-[0.25em]">
            <Sparkles className="h-3 w-3" />
            Space Career Design
          </Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              宇宙スキル標準にもとづく<br className="hidden sm:block" />セルフアセスメント
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              宇宙産業で求められるスキルセットを体系的に整理し、あなたの現在地と次の一歩を明確化します。診断結果はそのまま共有・記録が可能です。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30" asChild>
              <Link href="/quick-assessment">
                クイック診断を始める
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="font-semibold" asChild>
              <Link href="/categories">
                詳細診断に進む
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4 sm:gap-4">
            {stats.map((item) => (
              <Card key={item.label} className="border-border/40 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:border-border/60 hover:shadow-md dark:bg-white/10">
                <CardContent className="flex flex-col items-center gap-3 p-4 text-center sm:flex-row sm:items-center sm:gap-4 sm:p-5 sm:text-left">
                  <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2 text-primary sm:p-2.5">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">{item.value}</CardTitle>
                    <CardDescription className="text-[0.625rem] font-medium uppercase leading-tight tracking-wider text-muted-foreground/70 sm:text-xs">
                      {item.label}
                    </CardDescription>
                    <p className="text-[0.625rem] leading-tight text-muted-foreground/80 sm:text-xs">
                      {item.sub}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {featureList.map((feature) => (
          <Card key={feature.title} className="relative overflow-hidden border border-border/70 bg-card/80 backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {feature.icon}
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between border-t border-border/60 pt-4 text-sm">
              <span className="text-muted-foreground">{feature.meta}</span>
              <Button variant="default" size="sm" className="font-medium" asChild>
                <Link href={feature.href}>
                  開始する
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Orbit className="h-5 w-5 text-primary" />
            宇宙スキル標準とは
          </CardTitle>
          <CardDescription>
            内閣府宇宙開発戦略推進事務局が策定した宇宙産業向けスキルフレームワークをベースに、評価基準をそのままWebアプリケーションに落とし込みました。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Excelシートで公開されている標準データを読み込み、カテゴリ・スキル・評価軸のクロス分析をそのままの粒度で提供します。アクセス不要で、診断結果はローカルに保存、 permalink で共有できます。
          </p>
          <div className="space-y-2 rounded-xl border border-dashed border-border/70 bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
