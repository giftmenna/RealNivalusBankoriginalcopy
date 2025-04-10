import React, { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CircularLoader from '@/components/CircularLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Printer, Clock, FileText, ArrowLeft, Save } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function TransferProgress() {
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const { user } = useAuth();
  const { toast } = useToast();
  const params = new URLSearchParams(searchParams);
  
  const id = params.get('id');
  const amount = params.get('amount');
  const recipient = params.get('recipient');
  const memo = params.get('memo');
  const method = params.get('method') || 'direct';
  
  const [processing, setProcessing] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTimeSettings, setShowTimeSettings] = useState(false);
  const [customTime, setCustomTime] = useState(currentDate.toTimeString().substring(0, 5));
  const [customDate, setCustomDate] = useState(currentDate.toISOString().substring(0, 10));
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [receiptSaved, setReceiptSaved] = useState(false);
  
  // Change state after loader completes - don't auto-close or redirect
  const handleLoaderComplete = () => {
    setProcessing(false);
  };

  // Update the receipt date/time when custom settings are applied
  const applyCustomTime = () => {
    if (useCustomTime) {
      const [hours, minutes] = customTime.split(':').map(Number);
      const newDate = new Date(customDate);
      newDate.setHours(hours, minutes);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date());
    }
    setShowTimeSettings(false);
  };

  // Generate receipt - now with custom time support
  const generateReceiptContent = () => {
    // Format date based on user preference
    const dateStr = currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const timeStr = currentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return `
NIVALUS BANK - TRANSACTION RECEIPT
----------------------------------
Receipt #: ${id}
Date: ${dateStr}
Time: ${timeStr}

FROM: ${user?.username}
TO: ${recipient}
AMOUNT: ${formatCurrency(Number(amount))}
METHOD: ${method.charAt(0).toUpperCase() + method.slice(1)} Transfer
MEMO: ${memo || 'N/A'}

Thank you for banking with Nivalus Bank!
`;
  };
  
  // Save receipt to database
  const saveReceipt = () => {
    const receiptContent = generateReceiptContent();
    
    apiRequest('POST', `/api/transaction/${id}/receipt`, { 
      receipt: receiptContent 
    }).then(() => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      
      setReceiptSaved(true);
      
      toast({
        title: 'Receipt Saved',
        description: 'The receipt has been saved successfully.',
      });
    }).catch(error => {
      toast({
        title: 'Error Saving Receipt',
        description: 'Failed to save the receipt to the server.',
        variant: 'destructive',
      });
      console.error('Error saving receipt:', error);
    });
  };
  
  // Print/download receipt
  const handlePrintReceipt = () => {
    const receiptContent = generateReceiptContent();
    
    // If receipt not yet saved, save it first
    if (!receiptSaved) {
      saveReceipt();
    }
    
    // Create a blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nivalus-receipt-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Only navigate away when user explicitly chooses to
  const handleClose = () => {
    // If receipt not saved yet, prompt the user
    if (!receiptSaved) {
      if (confirm('Your receipt has not been saved. Do you want to save it before returning to dashboard?')) {
        saveReceipt();
      }
    }
    navigate('/dashboard');
  };
  
  // If missing parameters, redirect to transfer page
  useEffect(() => {
    if (!id || !amount || !recipient) {
      navigate('/transfer');
    }
  }, [id, amount, recipient, navigate]);
  
  if (!id || !amount || !recipient) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {processing ? (
          <div className="max-w-lg mx-auto text-center space-y-6 py-8">
            <h2 className="text-2xl font-bold">
              Processing Your Transfer
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Please wait while we securely process your transaction.
            </p>
            
            {/* Loading Circle Animation */}
            <div className="flex justify-center">
              <CircularLoader 
                duration={10} 
                onComplete={handleLoaderComplete} 
                primaryColor="var(--primary)" 
                secondaryColor="#e6e6e6" 
              />
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
              <p>Transfer to: <span className="font-medium">{recipient}</span></p>
              <p>Amount: <span className="font-medium">{formatCurrency(Number(amount))}</span></p>
              <p>Method: <span className="font-medium">{method.charAt(0).toUpperCase() + method.slice(1)} Transfer</span></p>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Please wait while your transaction completes.
            </p>
          </div>
        ) : (
          <div className="max-w-lg mx-auto space-y-6 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Transfer Completed!</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">Your money has been sent successfully.</p>
            </div>
            
            {/* Receipt Card */}
            <Card className="form-card shadow-md border">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Nivalus Bank</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transaction Receipt</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receipt #{id}</p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                        {currentDate.toLocaleDateString()}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => setShowTimeSettings(true)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">From</span>
                  <span className="font-medium">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">To</span>
                  <span className="font-medium">{recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(Number(amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time</span>
                  <span className="font-medium">
                    {currentDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method</span>
                  <span className="font-medium">{method.charAt(0).toUpperCase() + method.slice(1)} Transfer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Memo</span>
                  <span className="font-medium">{memo || 'N/A'}</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-3 border-t text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 w-full">
                  Thank you for banking with Nivalus Bank!
                </p>
              </CardFooter>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={saveReceipt}
                disabled={receiptSaved}
              >
                <Save className="h-4 w-4 mr-2" />
                {receiptSaved ? 'Receipt Saved' : 'Save Receipt'}
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={handlePrintReceipt}
              >
                <Printer className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                className="flex items-center justify-center"
                onClick={handleClose}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>
      
      {/* Custom Time Settings Dialog */}
      <Dialog open={showTimeSettings} onOpenChange={setShowTimeSettings}>
        <DialogContent className="bg-white dark:bg-[#1e293b] text-black dark:text-white">
          <DialogHeader>
            <DialogTitle>Receipt Date and Time</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Customize the date and time shown on your receipt.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-custom-time" className="text-gray-700 dark:text-gray-300">Use custom date/time</Label>
              <Switch 
                id="use-custom-time" 
                checked={useCustomTime}
                onCheckedChange={setUseCustomTime}
              />
            </div>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    disabled={!useCustomTime}
                    className="form-input"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    disabled={!useCustomTime}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeSettings(false)}>
              Cancel
            </Button>
            <Button onClick={applyCustomTime}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
