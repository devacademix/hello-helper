import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Patient } from '@/types';
import { Users } from 'lucide-react';

const Patients: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.getPatients<Patient[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading patients..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const patients = data?.map(p => ({
    id: p.id,
    title: p.name,
    subtitle: `${p.phone} • ${p.gender}`,
    meta: p.blood_group || '',
  })) || [];

  return (
    <>
      <Header title="Patients" showLogout />
      <main className="p-4">
        <ListCard
          title={`All Patients (${patients.length})`}
          icon={Users}
          items={patients}
          emptyMessage="No patients found"
        />
      </main>
    </>
  );
};

export default Patients;
