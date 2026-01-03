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
import { Calendar, Users, FileText, FolderOpen, Video, Upload } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['doctor-dashboard'],
    queryFn: async () => {
      const appointments = await api.getDoctorAppointments<Array<{
        id: number;
        patient_name: string;
        date: string;
        time: string;
        status: string;
      }>>();
      
      return {
        today_appointments: appointments?.filter(a => 
          new Date(a.date).toDateString() === new Date().toDateString()
        ).length || 0,
        total_patients: 0, // Would come from API
        pending_reports: 0,
        active_cases: 0,
        upcoming_appointments: appointments?.slice(0, 5) || [],
      };
    },
  });

  if (isLoading) return <LoadingScreen message="Loading dashboard..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const stats = [
    { title: 'Today', value: data?.today_appointments || 0, icon: Calendar, variant: 'primary' as const },
    { title: 'Patients', value: data?.total_patients || 0, icon: Users, variant: 'success' as const },
    { title: 'Reports', value: data?.pending_reports || 0, icon: FileText, variant: 'warning' as const },
    { title: 'Cases', value: data?.active_cases || 0, icon: FolderOpen, variant: 'info' as const },
  ];

  const upcomingAppointments = data?.upcoming_appointments?.map(a => ({
    id: a.id,
    title: a.patient_name,
    subtitle: a.date,
    meta: a.time,
    status: a.status === 'completed' ? 'success' as const : 'info' as const,
  })) || [];

  return (
    <>
      <Header title="Doctor Dashboard" showLogout />
      <main className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="h-12" 
            onClick={() => navigate('/doctor/consultation')}
          >
            <Video className="w-4 h-4 mr-2" />
            Consultation
          </Button>
          <Button 
            variant="outline"
            className="h-12" 
            onClick={() => navigate('/doctor/upload')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Doc
          </Button>
        </div>

        <ListCard
          title="Upcoming Appointments"
          icon={Calendar}
          items={upcomingAppointments}
          onItemClick={(item) => navigate(`/doctor/appointments/${item.id}`)}
          emptyMessage="No appointments scheduled"
        />
      </main>
    </>
  );
};

export default DoctorDashboard;
