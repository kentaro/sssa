import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  badge: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ badge, title, description, actions }: PageHeaderProps) {
  return (
    <header className="space-y-3">
      <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-wider">
        {badge}
      </Badge>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </header>
  );
}
