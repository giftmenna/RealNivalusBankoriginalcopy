import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CircleUser, CreditCard, Wallet, BarChart3, UserPlus, ArrowUpRight, Clock, ShieldCheck, Users, History, Settings } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { insertUserSchema, type User, type Transaction } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Create schema without some fields
const createUserSchema = insertUserSchema.omit({ role: true, status: true, avatar: true });

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  
  // Get user stats
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    initialData: [],
  });
  
  // Get transaction stats
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/admin/transactions'],
    initialData: [],
  });
  
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: '',
      password: '',
      pin: '',
      email: '',
      balance: 0,
    },
  });
  
  const onSubmit = async (data: z.infer<typeof createUserSchema>) => {
    try {
      setIsCreatingUser(true);
      
      await apiRequest('POST', '/api/admin/users', {
        ...data,
        role: 'user', // Default role is user
        status: 'active', // Default status is active
      });
      
      // Invalidate the users query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      
      toast({
        title: 'Success',
        description: 'User has been created successfully',
      });
      
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Calculate totals and stats
  const totalUsers = users?.length || 0;
  const totalTransactions = transactions?.length || 0;
  const totalDeposits = transactions?.filter(t => t.type === 'deposit').length || 0;
  const totalWithdrawals = transactions?.filter(t => t.type === 'withdrawal').length || 0;
  const totalTransfers = transactions?.filter(t => t.type === 'transfer').length || 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminNavbar />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your bank, users, and transactions
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                    <h3 className="text-3xl font-bold">{totalUsers}</h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">Active</span>
                  <Badge variant="outline" className="ml-2 px-2 py-0">
                    {users?.filter(user => user.status === 'active').length || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Transactions</p>
                    <h3 className="text-3xl font-bold">{totalTransactions}</h3>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Today:</span>
                    <Badge variant="outline" className="ml-1 px-2 py-0">
                      {transactions?.filter(t => {
                        const today = new Date();
                        const txDate = new Date(t.timestamp);
                        return txDate.toDateString() === today.toDateString();
                      }).length || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Deposits</p>
                    <h3 className="text-3xl font-bold">{totalDeposits}</h3>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <Wallet className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-500 font-medium">
                      {Math.round((totalDeposits / (totalTransactions || 1)) * 100)}%
                    </span>
                    <span className="text-muted-foreground ml-1">of total</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">System</p>
                    <h3 className="text-3xl font-bold">Active</h3>
                  </div>
                  <div className="p-2 bg-orange-500/10 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">Last check:</span>
                    <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content with tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="create-user">Create User</TabsTrigger>
              <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Users */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Users</CardTitle>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/users">View All</Link>
                      </Button>
                    </div>
                    <CardDescription>
                      Recently created user accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6">
                    {usersLoading ? (
                      <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : users && users.length > 0 ? (
                      <div className="space-y-4">
                        {users.slice(0, 5).map((user, index) => (
                          <div key={user.id} className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <CircleUser className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{user.username}</p>
                              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-6">No users found</p>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="py-3">
                    <p className="text-xs text-muted-foreground">
                      Total of {totalUsers} users in the system
                    </p>
                  </CardFooter>
                </Card>

                {/* Recent Transactions */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Transactions</CardTitle>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/transactions">View All</Link>
                      </Button>
                    </div>
                    <CardDescription>
                      Latest financial activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6">
                    {transactionsLoading ? (
                      <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : transactions && transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.slice(0, 5).map((transaction) => (
                          <div key={transaction.id} className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                transaction.type === 'deposit' 
                                  ? 'bg-green-100 text-green-600' 
                                  : transaction.type === 'withdrawal'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-blue-100 text-blue-600'
                              }`}>
                                {transaction.type === 'deposit' ? (
                                  <ArrowUpRight className="h-5 w-5" />
                                ) : transaction.type === 'withdrawal' ? (
                                  <CreditCard className="h-5 w-5" />
                                ) : (
                                  <History className="h-5 w-5" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate capitalize">{transaction.type}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {new Date(transaction.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <span className={`text-sm font-medium ${
                              transaction.type === 'deposit'
                                ? 'text-green-600'
                                : transaction.type === 'withdrawal'
                                  ? 'text-red-600'
                                  : 'text-blue-600'
                            }`}>
                              ${parseFloat(transaction.amount).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-6">No transactions found</p>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="py-3">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Deposits: {totalDeposits}</span>
                      <span>Withdrawals: {totalWithdrawals}</span>
                      <span>Transfers: {totalTransfers}</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Transaction chart placeholder */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Transaction Analytics</CardTitle>
                  <CardDescription>
                    Transaction volume over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center border border-dashed rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="text-lg font-medium">Transaction Analytics</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Historical transaction data visualization will appear here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="create-user" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <CardTitle>Create New User</CardTitle>
                  </div>
                  <CardDescription>
                    Add a new user to the banking system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="pin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PIN (4 digits)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Enter 4-digit PIN" 
                                  maxLength={4} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="balance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Initial Balance ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  step="0.01"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto" 
                        disabled={isCreatingUser}
                      >
                        {isCreatingUser ? 'Creating User...' : 'Create User'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quick-actions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Link href="/admin/users">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">User Management</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            View, edit, and manage all user accounts
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
                
                <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Link href="/admin/transactions">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-full">
                          <History className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Transaction History</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Review and manage all banking transactions
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
                
                <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Link href="/admin/settings">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-full">
                          <Settings className="h-8 w-8 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">System Settings</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Configure banking system parameters
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
