import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Subscription } from '@/types';
import { CreditCard, Edit, Check } from 'lucide-react';

const Subscriptions: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<Subscription | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => api.getSubscriptions<Subscription[]>(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; price: number }) => 
      api.updateSubscription(data.id, { price: data.price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({ title: 'Success', description: 'Plan updated successfully' });
      setEditingPlan(null);
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading) return <LoadingScreen message="Loading plans..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const handleSave = () => {
    if (editingPlan && editPrice) {
      updateMutation.mutate({ id: editingPlan.id, price: parseFloat(editPrice) });
    }
  };

  return (
    <>
      <Header title="Subscription Plans" showLogout />
      <main className="p-4 space-y-4">
        {data?.map((plan) => (
          <Card key={plan.id} className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  {plan.name}
                </CardTitle>
                <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                  {plan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">₹{plan.price}</span>
                <span className="text-muted-foreground">/{plan.duration_months} months</span>
              </div>
              <ul className="space-y-1">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => {
                      setEditingPlan(plan);
                      setEditPrice(plan.price.toString());
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit {plan.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder="Enter price"
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </main>
    </>
  );
};

export default Subscriptions;
