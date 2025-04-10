import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { transferSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency } from '@/utils/formatCurrency';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AtSign, User, Landmark, Globe, CreditCard, Banknote, Zap } from 'lucide-react';

export default function Transfer() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [recipientType, setRecipientType] = useState<'email' | 'username'>('email');
  const [transferMethod, setTransferMethod] = useState<'direct' | 'wire' | 'bank' | 'card' | 'p2p'>('direct');
  
  // Additional data for different transfer methods
  const [additionalData, setAdditionalData] = useState<{
    // Wire Transfer
    swiftCode?: string;
    bankName?: string;
    accountNumber?: string;
    country?: string;
    
    // Bank Transfer
    routingNumber?: string;
    accountType?: string;
    
    // Card Transfer
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
    
    // P2P Transfer
    phoneNumber?: string;
    platform?: string;
  }>({});
  
  // Handle additional data changes
  const handleAdditionalDataChange = (field: string, value: string) => {
    setAdditionalData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  interface UserData {
    id: number;
    username: string;
    email: string;
    balance: number;
    avatar?: string;
    role: string;
    recentTransactions?: any[];
  }
  
  const { data: userData } = useQuery<UserData>({
    queryKey: ['/api/user'],
  });
  
  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipient: '',
      recipientType: 'email',
      amount: 0,
      memo: '',
      pin: '',
    },
  });
  
  // Update form when recipient type or transfer method changes
  React.useEffect(() => {
    form.setValue('recipientType', recipientType);
    form.setValue('transferMethod', transferMethod);
  }, [recipientType, transferMethod, form]);
  
  // Prepare a custom schema validator based on the transfer method
  React.useEffect(() => {
    // For non-direct transfers, we don't need a valid recipient
    if (transferMethod !== 'direct') {
      form.setValue('recipient', 'external-recipient');
    }
  }, [transferMethod, form]);

  const onSubmit = async (data: z.infer<typeof transferSchema>) => {
    try {
      // Prepare the transfer data
      const transferData = {
        ...data,
        transferMethod,
        additionalData: transferMethod !== 'direct' ? additionalData : undefined
      };
      
      console.log("Transfer data:", transferData);
      
      const response = await apiRequest('POST', '/api/transfer', transferData);
      const result = await response.json();
      
      // Navigate to the progress page with transfer details
      navigate(`/transfer/progress?id=${result.transaction.id}&amount=${data.amount}&recipient=${result.transaction.recipient}&memo=${data.memo || ''}&method=${transferMethod}`);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Transfer Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Transfer Failed',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Transfer Money
        </h1>
        
        {/* Transfer Form */}
        <div className="max-w-2xl mx-auto form-container rounded-lg">
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Only show recipient input for direct transfers */}
                {transferMethod === 'direct' && (
                  <>
                    <div className="space-y-4">
                      <Label className="form-label">Send money to</Label>
                      <RadioGroup 
                        defaultValue="email" 
                        value={recipientType}
                        onValueChange={(value) => setRecipientType(value as 'email' | 'username')}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email" className="flex items-center cursor-pointer">
                            <AtSign className="w-4 h-4 mr-2" /> Email Address
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="username" id="username" />
                          <Label htmlFor="username" className="flex items-center cursor-pointer">
                            <User className="w-4 h-4 mr-2" /> Username
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="form-label">
                            {recipientType === 'email' ? 'Recipient Email' : 'Recipient Username'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type={recipientType === 'email' ? 'email' : 'text'}
                              placeholder={
                                recipientType === 'email' 
                                  ? 'recipient@example.com' 
                                  : 'Enter username'
                              }
                              {...field}
                              className="form-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Amount (USD)</FormLabel>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 dark:text-gray-300">$</span>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            className="form-input pl-8"
                          />
                        </FormControl>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Available balance: {userData?.balance ? formatCurrency(Number(userData.balance)) : '$0.00'}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <Label className="form-label">Transfer Method</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div 
                      className={`transfer-method-card ${transferMethod === 'direct' ? 'active' : ''}`}
                      onClick={() => setTransferMethod('direct')}
                    >
                      <Zap className="h-5 w-5" />
                      <span>Direct</span>
                    </div>
                    <div 
                      className={`transfer-method-card ${transferMethod === 'wire' ? 'active' : ''}`}
                      onClick={() => setTransferMethod('wire')}
                    >
                      <Globe className="h-5 w-5" />
                      <span>Wire Transfer</span>
                    </div>
                    <div 
                      className={`transfer-method-card ${transferMethod === 'bank' ? 'active' : ''}`}
                      onClick={() => setTransferMethod('bank')}
                    >
                      <Landmark className="h-5 w-5" />
                      <span>Bank Transfer</span>
                    </div>
                    <div 
                      className={`transfer-method-card ${transferMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setTransferMethod('card')}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Card Transfer</span>
                    </div>
                    <div 
                      className={`transfer-method-card ${transferMethod === 'p2p' ? 'active' : ''}`}
                      onClick={() => setTransferMethod('p2p')}
                    >
                      <Banknote className="h-5 w-5" />
                      <span>P2P Transfer</span>
                    </div>
                  </div>
                </div>
                
                {/* Different forms based on transfer method */}
                {transferMethod === 'direct' && (
                  <div className="p-4 border rounded-md bg-muted/30">
                    <h3 className="font-medium mb-2">Direct Transfer</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Instant transfer to another Nivalus Bank user. No fees.
                    </p>
                  </div>
                )}
                
                {transferMethod === 'wire' && (
                  <div className="p-4 border rounded-md bg-muted/30 space-y-4">
                    <h3 className="font-medium">International Wire Transfer</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer to international bank accounts. 2-3 business days, $25 fee.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="SWIFT/BIC Code" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('swiftCode', e.target.value)}
                      />
                      <Input 
                        placeholder="Bank Name" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('bankName', e.target.value)}
                      />
                      <Input 
                        placeholder="Account Number/IBAN" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('accountNumber', e.target.value)}
                      />
                      <Input 
                        placeholder="Recipient Country" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('country', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {transferMethod === 'bank' && (
                  <div className="p-4 border rounded-md bg-muted/30 space-y-4">
                    <h3 className="font-medium">Bank Transfer</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer to other US bank accounts. 1-2 business days, $5 fee.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Routing Number" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('routingNumber', e.target.value)}
                      />
                      <Input 
                        placeholder="Account Number" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('accountNumber', e.target.value)}
                      />
                      <Input 
                        placeholder="Bank Name" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('bankName', e.target.value)}
                      />
                      <Input 
                        placeholder="Account Type" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('accountType', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {transferMethod === 'card' && (
                  <div className="p-4 border rounded-md bg-muted/30 space-y-4">
                    <h3 className="font-medium">Card Transfer</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer to a debit or credit card. Instant to 1 business day, $3 fee.
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      <Input 
                        placeholder="Card Number" 
                        className="form-input" 
                        onChange={(e) => handleAdditionalDataChange('cardNumber', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Expiry (MM/YY)" 
                          className="form-input" 
                          onChange={(e) => handleAdditionalDataChange('expiryDate', e.target.value)}
                        />
                        <Input 
                          placeholder="CVV" 
                          type="password" 
                          maxLength={4} 
                          className="form-input"
                          onChange={(e) => handleAdditionalDataChange('cvv', e.target.value)}
                        />
                      </div>
                      <Input 
                        placeholder="Cardholder Name" 
                        className="form-input"
                        onChange={(e) => handleAdditionalDataChange('cardholderName', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {transferMethod === 'p2p' && (
                  <div className="p-4 border rounded-md bg-muted/30 space-y-4">
                    <h3 className="font-medium">P2P Transfer</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer via peer-to-peer payment platform. Instant, no fees.
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Phone Number" 
                          className="form-input"
                          onChange={(e) => handleAdditionalDataChange('phoneNumber', e.target.value)}
                        />
                        <select 
                          className="form-input w-1/3"
                          onChange={(e) => handleAdditionalDataChange('platform', e.target.value)}
                          defaultValue="Venmo"
                        >
                          <option value="Venmo">Venmo</option>
                          <option value="PayPal">PayPal</option>
                          <option value="CashApp">CashApp</option>
                          <option value="Zelle">Zelle</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Memo (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What's this for?"
                          {...field}
                          className="form-input min-h-[80px]"
                          rows={2}
                        />
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
                      <FormLabel className="form-label">PIN Verification</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          maxLength={4}
                          placeholder="Enter your 4-digit PIN"
                          {...field}
                          className="form-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full py-3"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Processing...' : 'Continue'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
