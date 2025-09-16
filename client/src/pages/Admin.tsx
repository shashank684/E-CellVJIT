import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

// Function to check auth status with the server
const checkAuthStatus = async () => {
  const token = localStorage.getItem('admin-token');
  if (!token) return { isAuthenticated: false };

  const response = await fetch('/api/admin/status', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    // If token is invalid, remove it
    localStorage.removeItem('admin-token');
    return { isAuthenticated: false };
  }
  return response.json();
};


export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Check authentication status on component mount
  const { data: authStatus, isLoading } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ['authStatus'],
    queryFn: checkAuthStatus,
    retry: false, // Don't retry on failure
  });

  useEffect(() => {
    if (!isLoading) {
      setIsAuthenticated(authStatus?.isAuthenticated || false);
    }
  }, [authStatus, isLoading]);

  const handleLogin = () => {
    // Invalidate the auth status query to refetch it after login
    queryClient.invalidateQueries({ queryKey: ['authStatus'] });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </>
  );
}