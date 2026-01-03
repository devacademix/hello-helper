import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Prescription } from '@/types';
import { FileText, Pill } from 'lucide-react';

const PatientPrescriptions: React.FC = () => {
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
                  <span className="font-medium">Dr. {rx.doctor_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rx.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-2">
                  {rx.medications?.map((med, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm bg-muted p-2 rounded-lg">
                      <Pill className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {med.dosage} • {med.frequency} • {med.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {rx.notes && (
                  <p className="text-xs text-muted-foreground mt-3 p-2 bg-primary/5 rounded-lg">
                    Note: {rx.notes}
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

export default PatientPrescriptions;
