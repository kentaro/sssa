import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-6xl font-semibold text-foreground">404</h1>
      <p className="text-base text-muted-foreground">ページが見つかりませんでした。</p>
      <Button asChild size="lg">
        <Link href="/">トップページに戻る</Link>
      </Button>
    </div>
  );
}
