import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency } from '@/utils/formatCurrency';

const createTransactionSchema = z.object({
  userId: z.coerce.number().min(1, "User is required"),
  type: z.enum(["deposit", "withdrawal", "transfer"], {
    required_error: "Transaction type is required",
  }),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  timestamp: z.string().min(1, "Date and time are required"),
  recipientInfo: z.string().optional(),
});

export default function AdminTransactions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
  });
  
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['/api/admin/transactions'],
  });
  
  const form = useForm<z.infer<typeof createTransactionSchema>>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      userId: 0,
      type: "deposit",
      amount: 0,
      timestamp: new Date().toISOString().split('.')[0],
      recipientInfo: '',
    },
  });
  
  const createTransactionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createTransactionSchema>) => {
      return apiRequest('POST', '/api/admin/transactions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Transaction Created',
        description: 'The transaction has been created successfully.',
      });
      form.reset({
        userId: 0,
        type: "deposit",
        amount: 0,
        timestamp: new Date().toISOString().split('.')[0],
        recipientInfo: '',
      });
    },
    onError: (error) => {
      toast({
        title: 'Transaction Failed',
        description: error instanceof Error ? error.message : 'Failed to create transaction',
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = async (data: z.infer<typeof createTransactionSchema>) => {
    createTransactionMutation.mutate(data);
  };
  
  const renderTransactionType = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <div className="flex items-center">
            <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full mr-2">
              <i className="ri-arrow-down-line text-success"></i>
            </div>
            <span>Deposit</span>
          </div>
        );
      case 'withdrawal':
        return (
          <div className="flex items-center">
            <div className="p-1 bg-red-100 dark:bg-red-900 rounded-full mr-2">
              <i className="ri-arrow-up-line text-error"></i>
            </div>
            <span>Withdrawal</span>
          </div>
        );
      case 'transfer':
        return (
          <div className="flex items-center">
            <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full mr-2">
              <i className="ri-send-plane-line text-info"></i>
            </div>
            <span>Transfer</span>
          </div>
        );
      default:
        return type;
    }
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your transaction...</p>
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Transactions</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] })}>
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
          Transaction Management
        </h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">User</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Select a user</SelectItem>
                          {Array.isArray(users) &&
                            users.map((user: { id: number; username: string; email: string }) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.username} ({user.email})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Transaction Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Amount</FormLabel>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timestamp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Date & Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('type') === 'transfer' && (
                  <FormField
                    control={form.control}
                    name="recipientInfo"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-700 dark:text-gray-300">Recipient Info (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='{"email": "recipient@example.com", "username": "recipient_name", "memo": "Payment for services"}'
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          For transfers, enter recipient details as JSON with email, username, and optional memo
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className={form.watch('type') === 'transfer' ? "md:col-span-2" : "md:col-span-1"}>
                  <Button
                    type="submit"
                    className="py-3 px-6 bg-primary-700 hover:bg-primary-800 text-white rounded-lg transition-colors font-medium"
                    disabled={createTransactionMutation.isPending}
                  >
                    {createTransactionMutation.isPending ? 'Creating...' : 'Create Transaction'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Recipient</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((transaction: { id: number; user_id: number; type: string; amount: number; timestamp: string; created_by: string | null; recipient_info: string | null }) => {
                      let recipientInfo = {};
                      try {
                        if (transaction.recipient_info) {
                          recipientInfo = JSON.parse(transaction.recipient_info);
                        }
                      } catch (e) {
                        console.error('Failed to parse recipient info', e);
                      }
                      
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{transaction.user_id}</TableCell>
                          <TableCell>{renderTransactionType(transaction.type)}</TableCell>
                          <TableCell className={`font-medium ${
                            transaction.type === 'deposit' 
                              ? 'text-success' 
                              : 'text-error'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}
                            {formatCurrency(Number(transaction.amount))}
                          </TableCell>
                          <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{transaction.created_by || 'System'}</TableCell>
                          <TableCell>
                            {transaction.type === 'transfer' 
                              ? (recipientInfo as any).email || 'N/A' 
                              : 'N/A'
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : null}
                </TableBody>
              </Table>
              
              {Array.isArray(transactions) && transactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">
                    <i className="ri-exchange-dollar-line"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Transactions Found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    There are no transactions in the system yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}