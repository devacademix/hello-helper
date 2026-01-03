import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileUp, Check, X } from 'lucide-react';

const DocumentUpload: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return api.uploadDocument<{ success: boolean; message: string }>(file, { notes });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Document uploaded successfully' });
      setSelectedFile(null);
      setNotes('');
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'Error', description: 'File size must be less than 10MB', variant: 'destructive' });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <>
      <Header title="Upload Document" showBack showLogout />
      <main className="p-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="hidden"
            />

            {!selectedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <FileUp className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Tap to select a file
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG, DOC (max 10MB)
                </p>
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this document..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              className="w-full h-12"
              disabled={!selectedFile || uploadMutation.isPending}
              onClick={handleUpload}
            >
              {uploadMutation.isPending ? (
                'Uploading...'
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default DocumentUpload;
