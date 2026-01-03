import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { Receipt } from 'lucide-react';

const Transactions: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.getTransactions<Transaction[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading transactions..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Header title="Transactions" showLogout />
      <main className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Receipt className="w-4 h-4" />
          <span className="text-sm font-medium">{data?.length || 0} Transactions</span>
        </div>
        {data?.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No transactions found
            </CardContent>
          </Card>
        ) : (
          data?.map((tx) => (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{tx.hospital_name}</span>
                  <Badge variant={getStatusColor(tx.status)}>{tx.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tx.payment_method}</span>
                  <span className="font-semibold text-lg">₹{tx.amount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(tx.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </>
  );
};

export default Transactions;
