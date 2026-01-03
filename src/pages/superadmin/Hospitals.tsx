import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Hospital } from '@/types';
import { Building2 } from 'lucide-react';

const Hospitals: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => api.getHospitals<Hospital[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading hospitals..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const hospitals = data?.map(h => ({
    id: h.id,
    title: h.name,
    subtitle: h.address,
    meta: h.subscription_plan || 'No plan',
    status: h.status === 'active' ? 'success' as const : 'warning' as const,
  })) || [];

  return (
    <>
      <Header title="Hospitals" showLogout />
      <main className="p-4">
        <ListCard
          title={`All Hospitals (${hospitals.length})`}
          icon={Building2}
          items={hospitals}
          emptyMessage="No hospitals found"
        />
      </main>
    </>
  );
};

export default Hospitals;
