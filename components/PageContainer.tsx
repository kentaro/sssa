import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'default' | 'narrow' | 'wide' | 'full';
  className?: string;
}

const MAX_WIDTH_CLASSES = {
  default: 'max-w-7xl',
  narrow: 'max-w-5xl',
  wide: 'max-w-[90rem]',
  full: 'max-w-none',
} as const;

export function PageContainer({ children, maxWidth = 'default', className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full space-y-10 px-4', MAX_WIDTH_CLASSES[maxWidth], className)}>
      {children}
    </div>
  );
}
