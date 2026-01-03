import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Doctor } from '@/types';
import { Stethoscope } from 'lucide-react';

const Doctors: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => api.getDoctors<Doctor[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading doctors..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'destructive';
      case 'offline': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Header title="Doctors" showLogout />
      <main className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Stethoscope className="w-4 h-4" />
          <span className="text-sm font-medium">{data?.length || 0} Doctors</span>
        </div>
        {data?.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No doctors found
            </CardContent>
          </Card>
        ) : (
          data?.map((doc) => (
            <Card key={doc.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={doc.avatar} alt={doc.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">Dr. {doc.name}</h3>
                      <Badge variant={getStatusColor(doc.status)}>{doc.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.qualification} • {doc.experience_years} yrs exp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </>
  );
};

export default Doctors;
