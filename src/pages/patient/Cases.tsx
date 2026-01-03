import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Case } from '@/types';
import { FolderOpen } from 'lucide-react';

const PatientCases: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cases'],
    queryFn: () => api.getCases<Case[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading cases..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const cases = data?.map(c => ({
    id: c.id,
    title: c.diagnosis,
    subtitle: c.notes || 'No notes',
    meta: new Date(c.created_at).toLocaleDateString(),
    status: c.status === 'active' ? 'warning' as const : 'success' as const,
  })) || [];

  return (
    <>
      <Header title="My Cases" showLogout />
      <main className="p-4">
        <ListCard
          title={`Cases (${cases.length})`}
          icon={FolderOpen}
          items={cases}
          emptyMessage="No cases found"
        />
      </main>
    </>
  );
};

export default PatientCases;
