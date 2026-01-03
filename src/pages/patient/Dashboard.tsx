import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, FileText, Video, Upload, BedDouble } from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['patient-dashboard'],
    queryFn: async () => {
      const [prescriptions, cases] = await Promise.all([
        api.getPrescriptions<Array<{
          id: number;
          doctor_name: string;
          created_at: string;
        }>>(),
        api.getCases<Array<{
          id: number;
          diagnosis: string;
          status: string;
          created_at: string;
        }>>(),
      ]);
      
      return {
        prescriptions: prescriptions?.slice(0, 3) || [],
        cases: cases?.slice(0, 3) || [],
      };
    },
  });

  if (isLoading) return <LoadingScreen message="Loading..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const recentPrescriptions = data?.prescriptions?.map(p => ({
    id: p.id,
    title: `Dr. ${p.doctor_name}`,
    subtitle: new Date(p.created_at).toLocaleDateString(),
    status: 'info' as const,
  })) || [];

  const recentCases = data?.cases?.map(c => ({
    id: c.id,
    title: c.diagnosis,
    subtitle: new Date(c.created_at).toLocaleDateString(),
    status: c.status === 'active' ? 'warning' as const : 'success' as const,
  })) || [];

  return (
    <>
      <Header title="Welcome" showLogout />
      <main className="p-4 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Hello, {user?.name?.split(' ')[0]}!</h2>
            <p className="text-sm opacity-90 mt-1">How are you feeling today?</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="h-20 flex-col gap-2" 
            onClick={() => navigate('/patient/book-appointment')}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Book Appointment</span>
          </Button>
          <Button 
            variant="outline"
            className="h-20 flex-col gap-2" 
            onClick={() => navigate('/patient/consultation')}
          >
            <Video className="w-6 h-6" />
            <span className="text-sm">Consultation</span>
          </Button>
          <Button 
            variant="outline"
            className="h-20 flex-col gap-2" 
            onClick={() => navigate('/patient/admissions')}
          >
            <BedDouble className="w-6 h-6" />
            <span className="text-sm">Admissions</span>
          </Button>
          <Button 
            variant="outline"
            className="h-20 flex-col gap-2" 
            onClick={() => navigate('/patient/upload')}
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm">Upload Doc</span>
          </Button>
        </div>

        <ListCard
          title="Recent Prescriptions"
          icon={FileText}
          items={recentPrescriptions}
          onItemClick={(item) => navigate(`/patient/prescriptions/${item.id}`)}
          emptyMessage="No prescriptions yet"
        />

        <ListCard
          title="Active Cases"
          icon={FileText}
          items={recentCases}
          onItemClick={(item) => navigate(`/patient/cases/${item.id}`)}
          emptyMessage="No active cases"
        />
      </main>
    </>
  );
};

export default PatientDashboard;
