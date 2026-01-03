import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Edit } from 'lucide-react';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
}

const Profile: React.FC = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile<ProfileData>(),
  });

  const updateMutation = useMutation({
    mutationFn: async () => api.updateProfile({ name, phone }),
    onSuccess: (data: any) => {
      if (data) {
        updateUser({ ...user!, name, phone });
      }
      toast({ title: 'Success', description: 'Profile updated successfully' });
      setIsEditing(false);
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading) return <LoadingScreen message="Loading profile..." />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={refetch} />;

  const profile = data || user;
  const initials = profile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-super-admin';
      case 'admin': return 'bg-admin';
      case 'doctor': return 'bg-doctor';
      case 'patient': return 'bg-patient';
      default: return 'bg-muted';
    }
  };

  return (
    <>
      <Header title="Profile" showLogout />
      <main className="p-4 space-y-4">
        {/* Profile Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar} alt={profile?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mt-4">{profile?.name}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium text-primary-foreground ${getRoleBadgeColor(profile?.role || '')}`}>
                {profile?.role?.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Personal Information
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={isEditing ? name : profile?.name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email}
                disabled
                className="text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={isEditing ? phone : profile?.phone || ''}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter phone number"
              />
            </div>
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => updateMutation.mutate()}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Profile;
