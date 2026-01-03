import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Calendar } from 'lucide-react';

const DoctorAppointments: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['doctor-appointments'],
    queryFn: () => api.getDoctorAppointments<Array<{
      id: number;
      patient_name: string;
      date: string;
      time: string;
      status: string;
      notes?: string;
    }>>(),
  });

  if (isLoading) return <LoadingScreen message="Loading appointments..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const appointments = data?.map(a => ({
    id: a.id,
    title: a.patient_name,
    subtitle: a.date,
    meta: a.time,
    status: a.status === 'completed' ? 'success' as const : 'info' as const,
  })) || [];

  return (
    <>
      <Header title="My Appointments" showLogout />
      <main className="p-4">
        <ListCard
          title={`Appointments (${appointments.length})`}
          icon={Calendar}
          items={appointments}
          emptyMessage="No appointments scheduled"
        />
      </main>
    </>
  );
};

export default DoctorAppointments;
