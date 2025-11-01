'use client';

import Link from "next/link";
import { ArrowRight, ExternalLink, FolderCog, Layers, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { useKidsMode } from "@/lib/kids-mode-context";

const steps = [
  {
    step: "1",
    title: "診断モードを選択",
    titleKids: "診断モードを選ぶ",
    description:
      "トップページからクイック診断または詳細診断を選びます。クイック診断は約5分、詳細診断はカテゴリ単位で丁寧に評価します。",
    descriptionKids:
      "トップページから宇宙のしごと診断を選びます。診断は約5分で終わります。",
    href: "/",
    linkLabel: "トップページへ",
  },
  {
    step: "2",
    title: "カテゴリを決める",
    titleKids: "種類を決める",
    description:
      "詳細診断では6つの対象カテゴリから評価対象を選択。カテゴリごとにスキル構造が異なり、説明文も添えています。",
    descriptionKids: null,
    href: "/categories",
    linkLabel: "カテゴリ一覧を見る",
  },
  {
    step: "3",
    title: "セルフアセスメント",
    titleKids: "自分で診断",
    description:
      "各スキルについて4つの評価軸を6段階（Lv0〜Lv5）で判定。レベル詳細を確認しながら、自分の現在地に最も近いレベルを選択します。",
    descriptionKids:
      "24問の質問に答えて、自分に合っている宇宙のしごとの種類を見つけます。",
  },
  {
    step: "4",
    title: "結果を共有",
    titleKids: "結果をみんなに見せる",
    description:
      "診断結果はレーダーチャートで視覚化され、あなたに合った職種が表示されます。共有用のリンクを生成して、他の人と結果を共有できます。",
    descriptionKids:
      "診断の結果は、おすすめのしごとの種類と一緒に見せます。リンクを作ってみんなに見せることができます。",
  },
];

export default function AboutPage() {
  const { isKidsMode } = useKidsMode();

  const filteredSteps = isKidsMode ? steps.filter((step) => step.step !== "1" && step.step !== "2") : steps;
  
  // 子供モード時にステップ番号を1から順番に振り直す
  const renumberedSteps = isKidsMode 
    ? filteredSteps.map((step, index) => ({ ...step, step: String(index + 1) }))
    : filteredSteps;

  return (
    <PageContainer maxWidth="narrow">
      <PageHeader
        badge="Project Overview"
        title={isKidsMode ? 'このWebアプリについて' : '宇宙業界のキャリア診断について'}
        description={isKidsMode
          ? '内閣府宇宙開発戦略推進事務局が公開している宇宙のしごとの勉強リスト（試作版）をWebで使える診断体験に作り直しました。Excelの情報構造をそのままに、使いやすさ・見やすさ・みんなに見せることをよくしています。'
          : '内閣府宇宙開発戦略推進事務局が公開している宇宙スキル標準（試作版）に基づいたキャリア診断ツールです。24問の質問に答えることで、あなたに適した宇宙業界の職種やスキルを発見できます。'
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {isKidsMode ? 'このアプリの目的' : '本アプリケーションの狙い'}
          </CardTitle>
          <CardDescription>
            {isKidsMode ? (
              <>宇宙のしごとをやりたい（またはやりたいと思っている）人のできることを整理して、勉強の計画を立てるのを手伝うため、使いにくかった資料を誰でも使えるインターフェースに変えています。</>
            ) : (
              <>宇宙業界でのキャリアを考えている方が、自分の適性や強みを発見し、次のステップを明確にするための無料診断ツールです。</>
            )}
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
              {isKidsMode ? '宇宙のしごとの勉強リスト（試作版）' : '宇宙スキル標準（試作版）'}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            。{isKidsMode ? (
              <>公開スプレッドシートを解析して、種類／できること／見るポイントをデータモデルにして、診断フロー・結果を見えるように・コンピューターに保存・リンク生成を実装しています。</>
            ) : (
              <>クイック診断では24問の質問で全体的な傾向を把握し、詳細診断ではカテゴリごとに評価軸を見ながら丁寧にスキルを評価できます。</>
            )}
          </p>
          {!isKidsMode && (
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{isKidsMode ? '使い方' : '利用フロー'}</CardTitle>
          <CardDescription>
            {isKidsMode
              ? '診断を始めてから結果をみんなに見せるまで2ステップで終わります。'
              : '診断開始から結果共有まで4ステップで完結します。'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renumberedSteps.map((item, index) => (
            <div key={item.step}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/5 text-sm font-semibold text-primary">
                  {item.step}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {isKidsMode ? item.titleKids || item.title : item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {isKidsMode ? item.descriptionKids || item.description : item.description}
                  </p>
                  {item.href && (!isKidsMode || item.href !== "/categories") && (
                    <Button variant="link" className="px-0 text-sm" asChild>
                      <Link href={item.href}>
                        {item.linkLabel}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              {index < filteredSteps.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{isKidsMode ? 'データの扱い' : 'データの扱い'}</CardTitle>
          <CardDescription>
            {isKidsMode
              ? '診断のデータはすべてブラウザのコンピューターに保存され、サーバーには送信されません。'
              : '診断データはすべてブラウザローカルに保存され、サーバーには送信されません。'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            {isKidsMode ? (
              <>コンピューターに自動保存するため、途中でやめても続きから始めることができます（ブラウザごとに保存場所が違います）。キャッシュをクリアしたり、違うブラウザを使うとデータがなくなるので注意してください。</>
            ) : (
              <>LocalStorageに自動保存するため、途中離脱しても再開が可能です（ブラウザごとに保存領域が独立）。キャッシュクリアや異なるブラウザではデータが失われる点に注意してください。</>
            )}
          </p>
          <p>
            {isKidsMode ? (
              <>終わった後は診断の結果を圧縮して、リンクとして作ります。URLをみんなに見せることで、他の人も同じ結果を見ることができます。</>
            ) : (
              <>完了後は評価結果を圧縮し、パーマリンクとして生成します。URLを共有することで、外部の閲覧者も同じ分析ビューを再現できます。</>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{isKidsMode ? '作った人' : '開発者'}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
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
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <p className="text-base font-semibold text-foreground">横山遥乙</p>
            <a
              href="https://x.com/haruotsu_hy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 text-primary hover:text-primary/80"
            >
              @haruotsu_hy
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/40 bg-primary/5 text-center">
        <CardHeader>
          <CardTitle className="text-xl">
            {isKidsMode ? 'さっそく診断をスタートしよう！' : 'さっそく診断を始めましょう'}
          </CardTitle>
          <CardDescription>
            {isKidsMode ? (
              <>宇宙のしごと診断でどんなしごとが自分に合っているか見つけよう！</>
            ) : (
              <>クイック診断で傾向を掴み、詳細診断でキャリア戦略を具体化できます。</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/quick-assessment">
              {isKidsMode ? 'しごと診断へ' : 'クイック診断へ'}
            </Link>
          </Button>
          {!isKidsMode && (
            <Button size="lg" variant="outline" asChild>
              <Link href="/categories">詳細診断を選ぶ</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
