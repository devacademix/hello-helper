import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Stethoscope, BedDouble, Clock, Plus } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.getAdminDashboard<{
      total_appointments: number;
      total_patients: number;
      total_doctors: number;
      available_beds: number;
      today_appointments: Array<{ id: number; patient_name: string; doctor_name: string; time: string; status: string }>;
      recent_patients: Array<{ id: number; name: string; phone: string; created_at: string }>;
    }>(),
  });

  if (isLoading) return <LoadingScreen message="Loading dashboard..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const stats = [
    { title: 'Appointments', value: data?.total_appointments || 0, icon: Calendar, variant: 'primary' as const },
    { title: 'Patients', value: data?.total_patients || 0, icon: Users, variant: 'success' as const },
    { title: 'Doctors', value: data?.total_doctors || 0, icon: Stethoscope, variant: 'info' as const },
    { title: 'Beds Available', value: data?.available_beds || 0, icon: BedDouble, variant: 'warning' as const },
  ];

  const todayAppointments = data?.today_appointments?.map(a => ({
    id: a.id,
    title: a.patient_name,
    subtitle: `Dr. ${a.doctor_name}`,
    meta: a.time,
    status: a.status === 'completed' ? 'success' as const : 'info' as const,
  })) || [];

  const recentPatients = data?.recent_patients?.map(p => ({
    id: p.id,
    title: p.name,
    subtitle: p.phone,
    meta: new Date(p.created_at).toLocaleDateString(),
  })) || [];

  return (
    <>
      <Header title="Hospital Admin" showLogout />
      <main className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <Button 
          className="w-full h-12" 
          onClick={() => navigate('/admin/beds')}
        >
          <BedDouble className="w-4 h-4 mr-2" />
          Manage Bed Assignments
        </Button>

        <ListCard
          title="Today's Appointments"
          icon={Clock}
          items={todayAppointments}
          onItemClick={(item) => navigate(`/admin/appointments/${item.id}`)}
          emptyMessage="No appointments today"
        />

        <ListCard
          title="Recent Patients"
          icon={Users}
          items={recentPatients}
          onItemClick={(item) => navigate(`/admin/patients/${item.id}`)}
          emptyMessage="No patients yet"
        />
      </main>
    </>
  );
};

export default AdminDashboard;
