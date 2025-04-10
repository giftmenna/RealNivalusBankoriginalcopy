import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<'activate' | 'deactivate' | 'delete' | null>(null);
  
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['/api/admin/users'],
  });
  
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return apiRequest('PUT', `/api/admin/users/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'User Updated',
        description: `User status has been ${actionType}d successfully.`,
      });
      setSelectedUser(null);
      setActionType(null);
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update user status',
        variant: 'destructive',
      });
    },
  });
  
  const handleConfirmAction = () => {
    if (!selectedUser || !actionType) return;
    
    let newStatus = '';
    
    switch (actionType) {
      case 'activate':
        newStatus = 'active';
        break;
      case 'deactivate':
        newStatus = 'inactive';
        break;
      case 'delete':
        newStatus = 'deleted';
        break;
      default:
        return;
    }
    
    updateUserStatusMutation.mutate({ id: selectedUser.id, status: newStatus });
  };
  
  const openActionDialog = (user: any, action: 'activate' | 'deactivate' | 'delete') => {
    setSelectedUser(user);
    setActionType(action);
  };
  
  const closeActionDialog = () => {
    setSelectedUser(null);
    setActionType(null);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your users...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">
              <i className="ri-error-warning-line"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Users</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] })}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
          User Management
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(users) && users.length > 0 ? (
                    users.map((user: { id: number; username: string; email: string; balance: number; status: string; last_login: string | null; role: string }) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatCurrency(Number(user.balance))}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : user.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleString() 
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {user.status !== 'active' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => openActionDialog(user, 'activate')}
                              >
                                <i className="ri-user-follow-line mr-1"></i> Activate
                              </Button>
                            )}
                            {user.status === 'active' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                                onClick={() => openActionDialog(user, 'deactivate')}
                              >
                                <i className="ri-user-unfollow-line mr-1"></i> Deactivate
                              </Button>
                            )}
                            {user.status !== 'deleted' && user.role !== 'admin' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => openActionDialog(user, 'delete')}
                              >
                                <i className="ri-delete-bin-line mr-1"></i> Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : null}
                </TableBody>
              </Table>
              
              {Array.isArray(users) && users.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">
                    <i className="ri-user-line"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Users Found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    There are no users in the system yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <AlertDialog open={!!actionType && !!selectedUser} onOpenChange={closeActionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'activate' && 'Activate User'}
                {actionType === 'deactivate' && 'Deactivate User'}
                {actionType === 'delete' && 'Delete User'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'activate' && `Are you sure you want to activate ${selectedUser?.username}'s account?`}
                {actionType === 'deactivate' && `Are you sure you want to deactivate ${selectedUser?.username}'s account? They will no longer be able to log in.`}
                {actionType === 'delete' && `Are you sure you want to delete ${selectedUser?.username}'s account? This action cannot be undone.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                className={`
                  ${actionType === 'activate' ? 'bg-green-600 hover:bg-green-700' : ''}
                  ${actionType === 'deactivate' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                  ${actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
                `}
              >
                {actionType === 'activate' && 'Activate'}
                {actionType === 'deactivate' && 'Deactivate'}
                {actionType === 'delete' && 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      
      <Footer />
    </div>
  );
}