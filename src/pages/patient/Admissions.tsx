import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Admission } from '@/types';
import { BedDouble } from 'lucide-react';

const Admissions: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admissions'],
    queryFn: () => api.getAdmissions<Admission[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading admissions..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  return (
    <>
      <Header title="Admissions" showBack showLogout />
      <main className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <BedDouble className="w-4 h-4" />
          <span className="text-sm font-medium">{data?.length || 0} Admissions</span>
        </div>
        {data?.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No admission records found
            </CardContent>
          </Card>
        ) : (
          data?.map((admission) => (
            <Card key={admission.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">Bed #{admission.bed_number}</span>
                    <span className="text-muted-foreground"> - {admission.ward}</span>
                  </div>
                  <Badge variant={admission.status === 'admitted' ? 'default' : 'secondary'}>
                    {admission.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Admitted: {new Date(admission.admitted_at).toLocaleDateString()}</p>
                  {admission.discharged_at && (
                    <p>Discharged: {new Date(admission.discharged_at).toLocaleDateString()}</p>
                  )}
                </div>
                {admission.notes && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {admission.notes}
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

export default Admissions;
