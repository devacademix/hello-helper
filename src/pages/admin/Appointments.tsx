import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Appointment } from '@/types';
import { Calendar } from 'lucide-react';

const Appointments: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => api.getAppointments<Appointment[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading appointments..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const appointments = data?.map(a => ({
    id: a.id,
    title: a.patient_name,
    subtitle: `Dr. ${a.doctor_name} • ${a.date}`,
    meta: a.time,
    status: a.status === 'completed' ? 'success' as const : 
           a.status === 'cancelled' ? 'error' as const : 'info' as const,
  })) || [];

  return (
    <>
      <Header title="Appointments" showLogout />
      <main className="p-4">
        <ListCard
          title={`All Appointments (${appointments.length})`}
          icon={Calendar}
          items={appointments}
          emptyMessage="No appointments found"
        />
      </main>
    </>
  );
};

export default Appointments;
