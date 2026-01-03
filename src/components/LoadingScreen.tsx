import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};

export default LoadingScreen;
