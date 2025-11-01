export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-4xl flex-col gap-16 md:flex-row md:justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              データソース
            </h3>
            <div className="space-y-3">
              <a
                href="https://www8.cao.go.jp/space/skill/kaisai.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-medium hover:underline"
              >
                内閣府 宇宙スキル標準（試作版）
              </a>
              <p className="text-base leading-relaxed text-muted-foreground">
                本アプリは内閣府宇宙開発戦略推進事務局が公開した宇宙スキル標準（試作版）をもとに再構成しています。
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              開発者
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-base font-medium">栗林健太郎</p>
                <a
                  href="https://kentarokuribayashi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-muted-foreground hover:underline"
                >
                  kentarokuribayashi.com
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium">横山遥乙</p>
                <a
                  href="https://x.com/haruotsu_hy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-muted-foreground hover:underline"
                >
                  @haruotsu_hy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
