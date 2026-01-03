import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  FolderOpen, 
  User 
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor' },
  { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
  { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
  { icon: FolderOpen, label: 'Cases', path: '/doctor/cases' },
  { icon: User, label: 'Profile', path: '/doctor/profile' },
];

const DoctorLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <BottomNav items={navItems} />
      <div className="h-16" />
    </div>
  );
};

export default DoctorLayout;
