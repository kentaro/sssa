export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/95">
      <div className="container px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              データソース
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="https://www8.cao.go.jp/space/skill/kaisai.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
              >
                内閣府 宇宙スキル標準（試作版）
              </a>
              <p className="text-muted-foreground">
                本アプリは内閣府宇宙開発戦略推進事務局が公開した宇宙スキル標準（試作版）をもとに再構成しています。
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              開発者
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">栗林健太郎</p>
              <a
                href="https://kentarokuribayashi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
              >
                kentarokuribayashi.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
