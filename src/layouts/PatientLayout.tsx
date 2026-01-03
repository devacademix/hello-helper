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
  { icon: LayoutDashboard, label: 'Home', path: '/patient' },
  { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
  { icon: FileText, label: 'Prescriptions', path: '/patient/prescriptions' },
  { icon: FolderOpen, label: 'Cases', path: '/patient/cases' },
  { icon: User, label: 'Profile', path: '/patient/profile' },
];

const PatientLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <BottomNav items={navItems} />
      <div className="h-16" />
    </div>
  );
};

export default PatientLayout;
