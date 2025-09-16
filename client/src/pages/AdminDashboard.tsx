import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LogOut, Mail, Clock, TrendingUp, Users, Eye, MessageSquare, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ContactSubmission } from '@shared/schema';

interface AdminDashboardProps {
  onLogout: () => void;
}

const fetchSubmissions = async () => {
  const token = localStorage.getItem('admin-token');
  const response = await fetch('/api/admin/submissions', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }
  return response.json();
};

const deleteSubmission = async (id: string) => {
  const token = localStorage.getItem('admin-token');
  const response = await fetch(`/api/admin/submissions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete submission');
  }
  return response.json();
};

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading, error } = useQuery<ContactSubmission[]>({
    queryKey: ['adminSubmissions'],
    queryFn: fetchSubmissions,
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Submission deleted successfully.' });
      queryClient.invalidateQueries({ queryKey: ['adminSubmissions'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete submission.', variant: 'destructive' });
    },
    onSettled: () => {
      setSubmissionToDelete(null);
    }
  });

  useEffect(() => {
    if (error) {
      onLogout();
    }
  }, [error, onLogout]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.removeItem('admin-token');
      toast({ title: 'Logged out successfully' });
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: 'Logout error', variant: 'destructive' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  const totalSubmissions = submissions?.length || 0;
  const recentSubmissions = submissions?.filter(s => new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0;
  const uniqueContacts = submissions ? new Set(submissions.map(s => s.email)).size : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-card border-b border-card-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="admin-dashboard-title">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">E-Cell VJIT Management</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white" data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards ... */}
        </div>

        <Card className="bg-card border-card-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold" data-testid="recent-submissions-title">Contact Form Submissions</h2>
          </div>
          {submissions && submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((submission) => (
                <motion.div key={submission.id} className="p-4 rounded-lg bg-background border border-input hover:border-primary/50 transition-colors duration-300 group" layout>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedSubmission(submission)}>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white">{submission.name}</h3>
                        <span className="text-sm text-gray-400">{submission.email}</span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">{submission.message}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-500">{formatDate(submission.createdAt.toString())}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => setSelectedSubmission(submission)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => setSubmissionToDelete(submission)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No contact submissions yet</p>
            </div>
          )}
        </Card>

        {selectedSubmission && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              className="bg-card border border-card-border rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Contact Submission Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(null)}> × </Button>
              </div>
              <div className="space-y-4">
                <div><label className="text-sm font-medium text-gray-400">Name</label><p>{selectedSubmission.name}</p></div>
                <div><label className="text-sm font-medium text-gray-400">Email</label><p>{selectedSubmission.email}</p></div>
                <div><label className="text-sm font-medium text-gray-400">Message</label><p className="whitespace-pre-wrap">{selectedSubmission.message}</p></div>
                <div><label className="text-sm font-medium text-gray-400">Submitted</label><p>{formatDate(selectedSubmission.createdAt.toString())}</p></div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <AlertDialog open={!!submissionToDelete} onOpenChange={() => setSubmissionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the submission from {submissionToDelete?.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMutation.mutate(submissionToDelete!.id)} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}