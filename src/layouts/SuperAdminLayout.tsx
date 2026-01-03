import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  Receipt, 
  User 
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin' },
  { icon: Building2, label: 'Hospitals', path: '/superadmin/hospitals' },
  { icon: CreditCard, label: 'Plans', path: '/superadmin/subscriptions' },
  { icon: Receipt, label: 'Transactions', path: '/superadmin/transactions' },
  { icon: User, label: 'Profile', path: '/superadmin/profile' },
];

const SuperAdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <BottomNav items={navItems} />
      <div className="h-16" /> {/* Spacer for bottom nav */}
    </div>
  );
};

export default SuperAdminLayout;
