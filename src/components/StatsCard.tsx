import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'bg-card',
    primary: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    info: 'bg-info/10',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  };

  return (
    <Card
      className={cn(
        'border-0 shadow-sm cursor-pointer transition-transform active:scale-95',
        variantStyles[variant]
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={cn('p-3 rounded-xl', variantStyles[variant])}>
            <Icon className={cn('w-6 h-6', iconStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
