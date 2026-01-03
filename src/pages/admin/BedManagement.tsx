import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bed, Patient } from '@/types';
import { BedDouble, UserPlus } from 'lucide-react';

const BedManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedPatient, setSelectedPatient] = useState('');

  const { data: beds, isLoading: bedsLoading, error: bedsError, refetch } = useQuery({
    queryKey: ['beds'],
    queryFn: () => api.getBedStatus<Bed[]>(),
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.getPatients<Patient[]>(),
  });

  const assignMutation = useMutation({
    mutationFn: (data: { bed_id: number; patient_id: number }) => api.assignBed(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({ title: 'Success', description: 'Bed assigned successfully' });
      setSelectedBed(null);
      setSelectedPatient('');
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  if (bedsLoading) return <LoadingScreen message="Loading beds..." />;
  if (bedsError) return <ErrorScreen message={(bedsError as Error).message} onRetry={refetch} />;

  const availableBeds = beds?.filter(b => b.status === 'available').length || 0;
  const occupiedBeds = beds?.filter(b => b.status === 'occupied').length || 0;

  const handleAssign = () => {
    if (selectedBed && selectedPatient) {
      assignMutation.mutate({ bed_id: selectedBed.id, patient_id: parseInt(selectedPatient) });
    }
  };

  return (
    <>
      <Header title="Bed Management" showBack showLogout />
      <main className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-sm bg-success/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{availableBeds}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-warning/10">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">{occupiedBeds}</p>
              <p className="text-sm text-muted-foreground">Occupied</p>
            </CardContent>
          </Card>
        </div>

        {/* Bed List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-primary" />
              All Beds
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {beds?.map((bed) => (
                <div key={bed.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bed #{bed.bed_number}</p>
                    <p className="text-sm text-muted-foreground">{bed.ward}</p>
                    {bed.patient_name && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Patient: {bed.patient_name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={bed.status === 'available' ? 'default' : 'secondary'}>
                      {bed.status}
                    </Badge>
                    {bed.status === 'available' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedBed(bed)}
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Bed #{bed.bed_number}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Patient" />
                              </SelectTrigger>
                              <SelectContent>
                                {patients?.map((p) => (
                                  <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              className="w-full" 
                              onClick={handleAssign}
                              disabled={!selectedPatient || assignMutation.isPending}
                            >
                              {assignMutation.isPending ? 'Assigning...' : 'Assign Bed'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default BedManagement;
