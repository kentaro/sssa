'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  href?: string;
  description?: string;
  submenu?: Array<{ label: string; href: string; description?: string }>;
}

const menuItems: MenuItem[] = [
  {
    label: 'コンテンツ',
    submenu: [
      { label: 'スキル一覧', href: '/skills', description: 'カテゴリ横断のスキル定義を俯瞰' },
      { label: '職種一覧', href: '/roles', description: '宇宙産業の役割と責務を確認' },
    ],
  },
  {
    label: '診断',
    submenu: [
      { label: 'クイック診断', href: '/quick-assessment', description: '数分で傾向を把握' },
      { label: '詳細診断', href: '/categories', description: 'カテゴリごとに丁寧に自己評価' },
    ],
  },
  {
    label: '結果',
    submenu: [
      { label: 'クイック診断結果', href: '/quick-assessment/results', description: '直近のクイック診断結果を再確認' },
      { label: '詳細診断結果', href: '/results', description: 'カテゴリ単位の評価結果を可視化' },
    ],
  },
  {
    label: 'このサイトについて',
    href: '/about',
    description: 'コンセプトやデータソースを整理',
  },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const isMenuActive = (item: MenuItem) => {
    if (item.href) return isActive(item.href);
    if (item.submenu) {
      return item.submenu.some((subItem) => isActive(subItem.href));
    }
    return false;
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-sm font-bold tracking-tight sm:text-base">
          <span className="text-2xl">🚀</span>
          <span className="whitespace-nowrap">
            宇宙スキル標準
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex lg:items-center lg:gap-2">
          {menuItems.map((item) => {
            if (item.submenu) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'gap-1',
                        isMenuActive(item) && 'bg-muted text-foreground'
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px] text-left">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild className="justify-start">
                        <Link
                          href={subItem.href}
                          className={cn(
                            'flex flex-col items-start gap-1 py-3 text-left',
                            isActive(subItem.href) && 'bg-accent'
                          )}
                        >
                          <span className="font-medium">{subItem.label}</span>
                          {subItem.description && (
                            <span className="text-xs text-muted-foreground">
                              {subItem.description}
                            </span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Button
                key={item.label}
                variant="ghost"
                className={cn(isActive(item.href) && 'bg-muted text-foreground')}
                asChild
              >
                <Link href={item.href ?? '#'}>{item.label}</Link>
              </Button>
            );
          })}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">メニュー</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[320px] flex-col gap-6 border-l border-border/60">
              <SheetHeader>
                <SheetTitle>ナビゲーション</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <div key={item.label}>
                    {item.submenu ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {item.label}
                        </p>
                        <div className="space-y-1">
                          {item.submenu.map((subItem) => (
                            <Button
                              key={subItem.href}
                              variant={isActive(subItem.href) ? 'secondary' : 'ghost'}
                              className="w-full justify-start"
                              asChild
                            >
                              <Link href={subItem.href} onClick={handleMobileLinkClick}>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-medium">{subItem.label}</span>
                                  {subItem.description && (
                                    <span className="text-xs text-muted-foreground">
                                      {subItem.description}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant={isActive(item.href) ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href={item.href ?? '#'} onClick={handleMobileLinkClick}>{item.label}</Link>
                      </Button>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
      </div>
    </header>
  );
}
