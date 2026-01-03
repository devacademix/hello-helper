import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Report } from '@/types';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Reports: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: () => api.getReports<Report[]>(),
  });

  if (isLoading) return <LoadingScreen message="Loading reports..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  return (
    <>
      <Header title="Reports" showBack showLogout />
      <main className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">{data?.length || 0} Reports</span>
        </div>
        {data?.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No reports found
            </CardContent>
          </Card>
        ) : (
          data?.map((report) => (
            <Card key={report.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{report.patient_name}</p>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {report.file_url && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(report.file_url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {report.notes && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {report.notes}
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

export default Reports;
