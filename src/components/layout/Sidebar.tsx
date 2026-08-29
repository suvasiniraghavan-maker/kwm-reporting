import { useState } from 'react';
import {
  BarChart3,
  Star,
  Clock,
  PanelLeftClose,
  PanelLeft,
  MoreHorizontal,
  Star as StarIcon,
  Pencil,
  Share2,
  FolderPlus,
  Trash2,
} from 'lucide-react';
import { useFavourites } from '@/context/FavouritesContext';
import { mockReports } from '@/data/mockReports';
import { mockHistory } from '@/data/mockHistory';
import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { toast } from 'sonner';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { favourites, toggleFavourite } = useFavourites();
  const [recent] = useState(() =>
    [...mockReports].slice(0, 5).map((r) => ({ id: r.id, name: r.name }))
  );

  const recentItems = [...recent, ...mockHistory.slice(0, 3).map((h) => ({ id: h.id, name: h.name }))];

  const handleAction = (action: string, name: string) => {
    toast(`${action}: ${name}`);
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
          <BarChart3 size={20} />
        </div>
        {!collapsed && (
          <div className="flex flex-1 items-center justify-between">
            <span className="text-base font-bold tracking-tight text-foreground">ReportAI</span>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {/* Starred */}
        {!collapsed && (
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Starred
          </p>
        )}
        <nav className="space-y-0.5">
          {favourites.length === 0 && !collapsed && (
            <p className="px-3 py-2 text-xs text-muted-foreground">No starred reports yet</p>
          )}
          {favourites.map((fav) => (
            <SidebarItem
              key={fav.id}
              id={fav.id}
              name={fav.name}
              collapsed={collapsed}
              icon={<Star size={15} className="fill-amber-400 text-amber-400" />}
              onToggleFav={() => {
                toggleFavourite(fav);
                toast.success('Report unstarred');
              }}
              onAction={handleAction}
            />
          ))}
        </nav>

        {/* Recent */}
        {!collapsed && (
          <p className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recent
          </p>
        )}
        <nav className="space-y-0.5">
          {recentItems.map((item) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              name={item.name}
              collapsed={collapsed}
              icon={<Clock size={15} className="text-muted-foreground" />}
              onAction={handleAction}
            />
          ))}
        </nav>
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={onToggle}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  id: string;
  name: string;
  collapsed: boolean;
  icon: React.ReactNode;
  onToggleFav?: () => void;
  onAction: (action: string, name: string) => void;
}

function SidebarItem({ id, name, collapsed, icon, onToggleFav, onAction }: SidebarItemProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={cn(
            'group flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? name : undefined}
        >
          <span className="shrink-0">{icon}</span>
          {!collapsed && (
            <span className="flex-1 truncate text-left text-[13px]">{name}</span>
          )}
          {!collapsed && (
            <MoreHorizontal size={14} className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground" />
          )}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {onToggleFav ? (
          <ContextMenuItem onClick={onToggleFav}>
            <StarIcon size={14} className="mr-2" /> Unstar
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={() => onAction('Star', name)}>
            <StarIcon size={14} className="mr-2" /> Add to Starred
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => onAction('Rename', name)}>
          <Pencil size={14} className="mr-2" /> Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('Share', name)}>
          <Share2 size={14} className="mr-2" /> Share
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('Add to Space', name)}>
          <FolderPlus size={14} className="mr-2" /> Add to Space
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onAction('Delete', name)}
        >
          <Trash2 size={14} className="mr-2" /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
