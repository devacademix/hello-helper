import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message = 'Something went wrong',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-4">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground">Error</h3>
        <p className="text-muted-foreground text-sm mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorScreen;
