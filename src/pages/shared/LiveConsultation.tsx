import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Video, Calendar } from 'lucide-react';

interface LiveConsultationProps {
  role: 'doctor' | 'patient';
}

const LiveConsultation: React.FC<LiveConsultationProps> = ({ role }) => {
  const { toast } = useToast();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [patientId, setPatientId] = useState('');

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      const data: Record<string, unknown> = {
        scheduled_at: `${date}T${time}:00`,
        notes,
      };
      if (role === 'doctor' && patientId) {
        data.patient_id = parseInt(patientId);
      }
      return api.createLiveConsultation(data);
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Consultation scheduled successfully' });
      setDate('');
      setTime('');
      setNotes('');
      setPatientId('');
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast({ title: 'Error', description: 'Please select date and time', variant: 'destructive' });
      return;
    }
    scheduleMutation.mutate();
  };

  return (
    <>
      <Header title="Live Consultation" showBack showLogout />
      <main className="p-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Schedule Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSchedule} className="space-y-4">
              {role === 'doctor' && (
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    type="number"
                    placeholder="Enter patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
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
                  placeholder="Any special notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                type="submit"
                className="w-full h-12"
                disabled={scheduleMutation.isPending}
              >
                {scheduleMutation.isPending ? (
                  'Scheduling...'
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default LiveConsultation;
