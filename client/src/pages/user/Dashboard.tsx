import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatCurrency';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  interface UserData {
    id: number;
    username: string;
    email: string;
    balance: number;
    avatar?: string;
    role: 'user' | 'admin';
    recentTransactions?: any[];
  }

  // Fetch user dashboard data with improved error handling
  const { data, isLoading, error } = useQuery<UserData>({
    queryKey: ['/api/user'],
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated, // Only run query if authenticated
  });
  
  // Handle errors separately
  useEffect(() => {
    if (error) {
      console.error('Dashboard data fetch error:', error);
      if (error instanceof Error && error.message?.includes('401')) {
        setAuthError('Your session has expired. Please log in again.');
      }
    }
  }, [error]);
  
  const uploadAvatarMutation = useMutation({
    mutationFn: async (base64Image: string) => {
      return apiRequest('POST', '/api/user/avatar', { avatar: base64Image });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update avatar',
        variant: 'destructive',
      });
    },
  });
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };
  
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      uploadAvatarMutation.mutate(base64String);
    };
    reader.readAsDataURL(avatarFile);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            {/* Orbiting Circle */}
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            {/* Loading Text */}
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Handle auth-specific errors
  if (authError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-dark-lighter rounded-xl shadow-md">
            <div className="text-yellow-500 text-5xl mb-4">
              <i className="ri-shield-keyhole-line"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Authentication Issue</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {authError}
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full">
                  Go to Login
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setAuthError(null);
                  queryClient.invalidateQueries({ queryKey: ['/api/user'] });
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Handle other errors
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-dark-lighter rounded-xl shadow-md">
            <div className="text-red-500 text-5xl mb-4">
              <i className="ri-error-warning-line"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error instanceof Error 
                ? (error.message.includes('401') 
                    ? 'Your session has expired. Please log in again.' 
                    : error.message)
                : 'An unexpected error occurred'}
            </p>
            <div className="space-y-3">
              {error instanceof Error && error.message.includes('401') ? (
                <Link href="/login">
                  <Button className="w-full">
                    Go to Login
                  </Button>
                </Link>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/user'] })}
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Display user dashboard with data
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
              Welcome back, {data?.username || user?.username}!
            </h1>
            
            {/* Avatar & Profile Section */}
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="relative group">
                <div className="h-14 w-14 rounded-full bg-primary-200 overflow-hidden border-2 border-primary-500">
                  {data?.avatar ? (
                    <img 
                      src={data.avatar} 
                      alt={`${data?.username || user?.username}'s avatar`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-700">
                      <i className="ri-user-line text-2xl"></i>
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <i className="ri-camera-line text-white text-xl"></i>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{data?.username || user?.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{data?.email || user?.email}</p>
              </div>
              
              {avatarFile && (
                <Button 
                  size="sm" 
                  onClick={handleAvatarUpload}
                  disabled={uploadAvatarMutation.isPending}
                >
                  {uploadAvatarMutation.isPending ? 'Uploading...' : 'Save Avatar'}
                </Button>
              )}
            </div>
          </div>
          

         {/* Balance Card */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Current Balance
      </h2>
      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 rounded-full text-l font-medium">
        Personal Account
      </span>
    </div>
    
    <div className="flex items-end space-x-2">
      <span className="text-4xl font-bold text-gray-900 dark:text-white">
        {formatCurrency(Number(data?.balance))}
      </span>
    </div>
    
    <div className="mt-6 grid grid-cols-2 gap-4">
       <Link href="/transfer">
       <button className="flex items-center justify-center py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium">
          <i className="ri-send-plane-line mr-2"></i>
          Transfer
        </button>
        </Link>
        <Link href="/withdraw">
        <button className="flex items-center justify-center py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium">
          <i className="ri-send-plane-line mr-2"></i>
          Deposite
         </button>
         </Link>
    </div>
  </div>
</div>


          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/dashboard" className="block">
              <div className="dashboard-card flex flex-col items-center p-4 hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary-100 dark:bg-primary-900/50 w-12 h-12 flex items-center justify-center mb-3">
                  <i className="ri-dashboard-line text-primary-600 dark:text-primary-400 text-xl"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</span>
              </div>
            </Link>
            
            <Link href="/transfer" className="block">
              <div className="dashboard-card flex flex-col items-center p-4 hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary-100 dark:bg-primary-900/50 w-12 h-12 flex items-center justify-center mb-3">
                  <i className="ri-send-plane-line text-primary-600 dark:text-primary-400 text-xl"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Transfer</span>
              </div>
            </Link>
            
            <Link href="/history" className="block">
              <div className="dashboard-card flex flex-col items-center p-4 hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary-100 dark:bg-primary-900/50 w-12 h-12 flex items-center justify-center mb-3">
                  <i className="ri-history-line text-primary-600 dark:text-primary-400 text-xl"></i>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">History</span>
              </div>
            </Link>
            
            <div className="dashboard-card flex flex-col items-center p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="rounded-full bg-primary-100 dark:bg-primary-900/50 w-12 h-12 flex items-center justify-center mb-3">
                <i className="ri-customer-service-2-line text-primary-600 dark:text-primary-400 text-xl"></i>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Support</span>
            </div>
          </div>
          
          {/* Account Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Transfer Methods</h3>
                <i className="ri-bank-card-line text-primary-600 dark:text-primary-400"></i>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                  Direct
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                  Wire
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100">
                  Bank
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100">
                  Card
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100">
                  P2P
                </span>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Security Status</h3>
                <i className="ri-shield-check-line text-green-600 dark:text-green-400"></i>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">2FA</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                    Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Last Login</span>
                  <span className="text-sm text-gray-700 dark:text-gray-200">Today</span>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Account Type</h3>
                <i className="ri-vip-crown-line text-amber-500"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 dark:text-white mb-1">Standard</span>
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                  <i className="ri-arrow-up-line mr-1"></i>
                  <span>Upgrade for more features</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Transactions</h2>
                <Link href="/history">
                  <span className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium cursor-pointer">View All</span>
                </Link>
              </div>
              
              {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {data.recentTransactions.map((transaction: any) => {
                    const isIncoming = transaction.type === 'deposit';
                    let recipientInfo = {};
                    
                    if (transaction.recipient_info) {
                      try {
                        recipientInfo = JSON.parse(transaction.recipient_info);
                      } catch (e) {
                        console.error('Failed to parse recipient info', e);
                      }
                    }
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${isIncoming ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} rounded-full`}>
                            <i className={`${isIncoming ? 'ri-arrow-down-line text-green-600 dark:text-green-090' : 'ri-arrow-up-line text-red-600 dark:text-red-400'}`}></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-100">
                              {transaction.type === 'deposit' 
                                ? 'Deposit' 
                                : transaction.type === 'withdrawal'
                                ? 'Withdrawal'
                                : `Transfer to ${(recipientInfo as any).username || 'User'}`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-400">
                              {new Date(transaction.timestamp).toLocaleDateString()} · {new Date(transaction.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        <span className={`font-medium ${isIncoming ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {isIncoming ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-5xl mb-4">
                    <i className="ri-exchange-dollar-line"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Transactions Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Your transaction history will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Banking Tips */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Banking Tips</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className="flex-shrink-0 mr-3">
        <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-10 h-10 flex items-center justify-center">
          <i className="ri-bank-line text-blue-600 dark:text-blue-400"></i>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-100 mb-1">
          Save Automatically
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-300">
          Set up automatic transfers to your savings account each month.
        </p>
      </div>
    </div>

    <div className="flex p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className="flex-shrink-0 mr-3">
        <div className="rounded-full bg-green-100 dark:bg-green-900 w-10 h-10 flex items-center justify-center">
          <i className="ri-secure-payment-line text-green-600 dark:text-green-400"></i>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-100 mb-1">
          Secure Your Account
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-300">
          Regularly update your password and enable two-factor authentication.
        </p>
      </div>
    </div>
    <div className="flex p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className="flex-shrink-0 mr-3">
        <div className="rounded-full bg-amber-100 dark:bg-amber-900 w-10 h-10 flex items-center justify-center">
          <i className="ri-percent-line text-amber-600 dark:text-amber-400"></i>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-100 mb-1">
          Earn More Interest
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-300">
          Explore high-yield savings accounts or certificates of deposit.
        </p>
      </div>
    </div>
  </div>
  </div>
   </div>
   <br></br>


   {/* Financial Goals */}
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Financial Goals</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-200 dark:text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-green-600 dark:text-green-400"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 11.292 4.707 a 15.9155 15.9155 0 0 1 4.707 11.292"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="50, 100"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-100">
              50%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Emergency Fund</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">$2,500 / $5,000</p>
          </div>
        </div>
        <span className="text-xs text-green-600 dark:text-green-400">On Track</span>
      </div>
    </div>
  </div>
</main>

      <Footer />
    </div>
  );
}
