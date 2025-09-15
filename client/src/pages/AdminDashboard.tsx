import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  LogOut, 
  Mail, 
  Clock, 
  TrendingUp, 
  Users,
  Calendar,
  Eye,
  MessageSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ContactSubmission } from '@shared/schema';

interface DashboardStats {
  totalSubmissions: number;
  recentSubmissions: number;
  submissions: ContactSubmission[];
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  const { data: dashboardData, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: allSubmissions } = useQuery<ContactSubmission[]>({
    queryKey: ['/api/admin/submissions'],
  });

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast({
          title: 'Logged out successfully',
          description: 'You have been logged out of the admin dashboard',
        });
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout error',
        description: 'Failed to logout properly',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-card border-b border-card-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white" data-testid="admin-dashboard-title">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-400">E-Cell VJIT Management</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-card-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Messages</p>
                  <p className="text-2xl font-bold text-white" data-testid="stat-total-submissions">
                    {dashboardData?.totalSubmissions || 0}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-card border-card-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-white" data-testid="stat-recent-submissions">
                    {dashboardData?.recentSubmissions || 0}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card border-card-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Unique Contacts</p>
                  <p className="text-2xl font-bold text-white">
                    {allSubmissions ? new Set(allSubmissions.map(s => s.email)).size : 0}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-card border-card-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-white">
                    {dashboardData?.submissions?.[0] 
                      ? formatDate(dashboardData.submissions[0].createdAt.toString())
                      : 'No data'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card border-card-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-white" data-testid="recent-submissions-title">
                Recent Contact Submissions
              </h2>
            </div>

            {dashboardData?.submissions && dashboardData.submissions.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.submissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    className="p-4 rounded-lg bg-background border border-input hover:border-primary/50 transition-colors duration-300 cursor-pointer hover-elevate"
                    onClick={() => setSelectedSubmission(submission)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    data-testid={`submission-item-${index}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">{submission.name}</h3>
                          <span className="text-sm text-gray-400">{submission.email}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {submission.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-gray-500">
                          {formatDate(submission.createdAt.toString())}
                        </span>
                        <Eye className="w-4 h-4 text-gray-400" />
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
        </motion.div>

        {/* Submission Detail Modal */}
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
              data-testid="submission-detail-modal"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Contact Submission Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                  data-testid="button-close-modal"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Name</label>
                  <p className="text-white">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <p className="text-white">{selectedSubmission.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Message</label>
                  <p className="text-white whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Submitted</label>
                  <p className="text-white">{formatDate(selectedSubmission.createdAt.toString())}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}