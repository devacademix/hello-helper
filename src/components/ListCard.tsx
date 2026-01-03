import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListItem {
  id: string | number;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface ListCardProps {
  title: string;
  icon?: LucideIcon;
  items: ListItem[];
  onItemClick?: (item: ListItem) => void;
  emptyMessage?: string;
}

const ListCard: React.FC<ListCardProps> = ({
  title,
  icon: Icon,
  items,
  onItemClick,
  emptyMessage = 'No items found',
}) => {
  const statusColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
    info: 'bg-info',
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">
            {emptyMessage}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => onItemClick?.(item)}
                className={cn(
                  'flex items-center justify-between p-4',
                  onItemClick && 'cursor-pointer active:bg-muted transition-colors'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.status && (
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        statusColors[item.status]
                      )}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {item.meta && (
                    <span className="text-xs text-muted-foreground">{item.meta}</span>
                  )}
                  {onItemClick && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ListCard;
