import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Stethoscope, 
  User 
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
  { icon: Users, label: 'Patients', path: '/admin/patients' },
  { icon: Stethoscope, label: 'Doctors', path: '/admin/doctors' },
  { icon: User, label: 'Profile', path: '/admin/profile' },
];

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <BottomNav items={navItems} />
      <div className="h-16" />
    </div>
  );
};

export default AdminLayout;
