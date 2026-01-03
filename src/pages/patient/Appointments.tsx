import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

const PatientAppointments: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: () => api.getAppointments<Array<{
      id: number;
      doctor_name: string;
      date: string;
      time: string;
      status: string;
    }>>(),
  });

  if (isLoading) return <LoadingScreen message="Loading appointments..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const appointments = data?.map(a => ({
    id: a.id,
    title: `Dr. ${a.doctor_name}`,
    subtitle: a.date,
    meta: a.time,
    status: a.status === 'completed' ? 'success' as const : 
           a.status === 'cancelled' ? 'error' as const : 'info' as const,
  })) || [];

  return (
    <>
      <Header title="My Appointments" showLogout />
      <main className="p-4 space-y-4">
        <Button 
          className="w-full h-12"
          onClick={() => navigate('/patient/book-appointment')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Book New Appointment
        </Button>
        
        <ListCard
          title={`Appointments (${appointments.length})`}
          icon={Calendar}
          items={appointments}
          emptyMessage="No appointments yet"
        />
      </main>
    </>
  );
};

export default PatientAppointments;
