import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Doctor } from '@/types';
import { Calendar, Stethoscope } from 'lucide-react';

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const { data: doctors, isLoading, error, refetch } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => api.getDoctors<Doctor[]>(),
  });

  const createMutation = useMutation({
    mutationFn: async () => api.createAppointment({
      doctor_id: parseInt(doctorId),
      date,
      time,
      notes,
    }),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Appointment booked successfully' });
      navigate('/patient/appointments');
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading) return <LoadingScreen message="Loading doctors..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !date || !time) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    createMutation.mutate();
  };

  return (
    <>
      <Header title="Book Appointment" showBack showLogout />
      <main className="p-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              New Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor *</Label>
                <Select value={doctorId} onValueChange={setDoctorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors?.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          <span>Dr. {doc.name} - {doc.specialization}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe your symptoms or reason for visit..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                type="submit"
                className="w-full h-12"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Booking...' : 'Book Appointment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default BookAppointment;
