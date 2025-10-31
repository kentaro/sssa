import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { AppToaster } from "@/components/ui/sonner";
import { KidsModeProvider } from "@/lib/kids-mode-context";
import { cn } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "宇宙スキル標準アセスメント - SSSA",
  description: "内閣府宇宙開発戦略推進事務局が公開している宇宙スキル標準（試作版）を基にしたWebベースのスキルアセスメントツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          `${geistSans.variable} ${geistMono.variable}`
        )}
      >
        <ThemeProvider>
          <KidsModeProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16)_0,transparent_55%)]" />
              <Header />
              <main className="flex-1">
                <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <Footer />
              <AppToaster />
            </div>
          </KidsModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
