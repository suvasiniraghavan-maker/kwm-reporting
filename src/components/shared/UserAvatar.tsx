import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md';
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function UserAvatar({ name, color, size = 'sm', className }: UserAvatarProps) {
  return (
    <Avatar
      className={cn(size === 'sm' ? 'h-7 w-7' : 'h-9 w-9', className)}
    >
      <AvatarFallback
        className="text-[10px] font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
