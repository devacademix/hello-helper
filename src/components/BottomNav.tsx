import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface BottomNavProps {
  items: NavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe z-50">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
              <span className={cn(
                'text-xs mt-1 font-medium',
                isActive && 'text-primary'
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
