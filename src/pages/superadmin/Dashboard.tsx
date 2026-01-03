import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import ListCard from '@/components/ListCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Building2, CreditCard, DollarSign, Clock, Hospital } from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['superadmin-dashboard'],
    queryFn: () => api.getSuperAdminDashboard<{
      total_hospitals: number;
      active_subscriptions: number;
      total_revenue: number;
      pending_transactions: number;
      recent_hospitals: Array<{ id: number; name: string; status: string; created_at: string }>;
      recent_transactions: Array<{ id: number; hospital_name: string; amount: number; status: string }>;
    }>(),
  });

  if (isLoading) return <LoadingScreen message="Loading dashboard..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const stats = [
    { title: 'Total Hospitals', value: data?.total_hospitals || 0, icon: Building2, variant: 'primary' as const },
    { title: 'Active Plans', value: data?.active_subscriptions || 0, icon: CreditCard, variant: 'success' as const },
    { title: 'Total Revenue', value: `₹${data?.total_revenue?.toLocaleString() || 0}`, icon: DollarSign, variant: 'info' as const },
    { title: 'Pending', value: data?.pending_transactions || 0, icon: Clock, variant: 'warning' as const },
  ];

  const recentHospitals = data?.recent_hospitals?.map(h => ({
    id: h.id,
    title: h.name,
    subtitle: new Date(h.created_at).toLocaleDateString(),
    status: h.status === 'active' ? 'success' as const : 'warning' as const,
  })) || [];

  const recentTransactions = data?.recent_transactions?.map(t => ({
    id: t.id,
    title: t.hospital_name,
    subtitle: `₹${t.amount.toLocaleString()}`,
    status: t.status === 'completed' ? 'success' as const : 'warning' as const,
  })) || [];

  return (
    <>
      <Header title="Super Admin" showLogout />
      <main className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <ListCard
          title="Recent Hospitals"
          icon={Hospital}
          items={recentHospitals}
          onItemClick={(item) => navigate(`/superadmin/hospitals/${item.id}`)}
          emptyMessage="No hospitals yet"
        />

        <ListCard
          title="Recent Transactions"
          icon={DollarSign}
          items={recentTransactions}
          onItemClick={(item) => navigate(`/superadmin/transactions/${item.id}`)}
          emptyMessage="No transactions yet"
        />
      </main>
    </>
  );
};

export default SuperAdminDashboard;
