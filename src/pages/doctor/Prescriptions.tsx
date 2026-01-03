import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Prescription } from '@/types';
import { FileText, Pill } from 'lucide-react';

const Prescriptions: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => api.getPrescriptions<Prescription[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading prescriptions..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  return (
    <>
      <Header title="Prescriptions" showLogout />
      <main className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">{data?.length || 0} Prescriptions</span>
        </div>
        {data?.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No prescriptions found
            </CardContent>
          </Card>
        ) : (
          data?.map((rx) => (
            <Card key={rx.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{rx.patient_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rx.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-2">
                  {rx.medications?.slice(0, 3).map((med, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Pill className="w-3 h-3 text-primary" />
                      <span>{med.name}</span>
                      <span className="text-muted-foreground">- {med.dosage}</span>
                    </div>
                  ))}
                  {rx.medications?.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{rx.medications.length - 3} more medications
                    </p>
                  )}
                </div>
                {rx.notes && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {rx.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </>
  );
};

export default Prescriptions;
