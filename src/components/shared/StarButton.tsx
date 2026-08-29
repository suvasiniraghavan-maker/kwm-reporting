import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarButtonProps {
  starred: boolean;
  onToggle: () => void;
  className?: string;
  size?: number;
}

export function StarButton({ starred, onToggle, className, size = 16 }: StarButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-1 transition-colors hover:bg-accent',
        className
      )}
      aria-label={starred ? 'Unstar report' : 'Star report'}
      aria-pressed={starred}
    >
      <Star
        size={size}
        className={cn(
          'transition-all',
          starred ? 'fill-amber-400 text-amber-400' : 'fill-none text-muted-foreground hover:text-foreground'
        )}
      />
    </button>
  );
}
