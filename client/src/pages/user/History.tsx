import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatCurrency';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function History() {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const { toast } = useToast();
  
  const { data: transactions = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/history'],
  });
  
  const handleViewReceipt = (transaction: any) => {
    setSelectedTransaction(transaction);
  };
  
  const handlePrintReceipt = () => {
    if (!selectedTransaction) return;
    
    const receipt = selectedTransaction.receipt;
    
    if (receipt) {
      // Receipt already exists, use it
      const blob = new Blob([receipt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nivalus-receipt-${selectedTransaction.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Create new receipt
      let recipientInfo = {};
      try {
        if (selectedTransaction.recipient_info) {
          recipientInfo = JSON.parse(selectedTransaction.recipient_info);
        }
      } catch (e) {
        console.error('Failed to parse recipient info', e);
      }
      
      const transactionDate = new Date(selectedTransaction.timestamp);
      const receiptContent = `
        NIVALUS BANK - TRANSACTION RECEIPT
        ----------------------------------
        Receipt #: ${selectedTransaction.id}
        Date: ${transactionDate.toLocaleDateString()}
        Time: ${transactionDate.toLocaleTimeString()}
        
        TYPE: ${selectedTransaction.type.toUpperCase()}
        AMOUNT: ${formatCurrency(Number(selectedTransaction.amount))}
        ${selectedTransaction.type === 'transfer' ? `RECIPIENT: ${(recipientInfo as any).email || 'N/A'}` : ''}
        MEMO: ${(recipientInfo as any).memo || 'N/A'}
        
        Thank you for banking with Nivalus Bank!
      `;
      
      // Save to localStorage
      localStorage.setItem(`receipt-${selectedTransaction.id}.txt`, receiptContent);
      
      // Download
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nivalus-receipt-${selectedTransaction.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Receipt Generated',
        description: 'The receipt has been generated and downloaded.',
      });
    }
  };
  
  const closeReceiptModal = () => {
    setSelectedTransaction(null);
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <i className="ri-arrow-down-line text-success"></i>;
      case 'withdrawal':
        return <i className="ri-arrow-up-line text-error"></i>;
      case 'transfer':
        return <i className="ri-send-plane-line text-info"></i>;
      default:
        return <i className="ri-exchange-dollar-line text-gray-500"></i>;
    }
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your history...</p>
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading History</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
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
          Transaction History
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="text-left text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Details</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction: any) => {
                      let recipientInfo = {};
                      try {
                        if (transaction.recipient_info) {
                          recipientInfo = JSON.parse(transaction.recipient_info);
                        }
                      } catch (e) {
                        console.error('Failed to parse recipient info', e);
                      }
                      
                      return (
                        <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-4 py-4 text-gray-900 dark:text-white">
                            <div>{new Date(transaction.timestamp).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(transaction.timestamp).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full mr-2 ${
                                transaction.type === 'deposit' 
                                  ? 'bg-green-100 dark:bg-green-900' 
                                  : transaction.type === 'withdrawal'
                                  ? 'bg-red-100 dark:bg-red-900'
                                  : 'bg-blue-100 dark:bg-blue-900'
                              }`}>
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <span className="capitalize text-gray-900 dark:text-white">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className={`px-4 py-4 font-medium ${
                            transaction.type === 'deposit' 
                              ? 'text-success' 
                              : 'text-error'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}
                            {formatCurrency(Number(transaction.amount))}
                          </td>
                          <td className="px-4 py-4 text-gray-900 dark:text-white">
                            {transaction.type === 'transfer' && (
                              <div>
                                <div className="flex items-center">
                                  <span>To: {(recipientInfo as any).email || 'N/A'}</span>
                                </div>
                                {(recipientInfo as any).transferMethod && (
                                  <div className="mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      (recipientInfo as any).transferMethod === 'direct' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                      (recipientInfo as any).transferMethod === 'wire' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                                      (recipientInfo as any).transferMethod === 'bank' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                      (recipientInfo as any).transferMethod === 'card' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                                      'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                                    }`}>
                                      {(recipientInfo as any).transferMethod === 'direct' ? 'Direct' :
                                       (recipientInfo as any).transferMethod === 'wire' ? 'Wire' :
                                       (recipientInfo as any).transferMethod === 'bank' ? 'Bank' :
                                       (recipientInfo as any).transferMethod === 'card' ? 'Card' :
                                       (recipientInfo as any).transferMethod === 'p2p' ? 'P2P' : 
                                       'Transfer'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            {transaction.type === 'deposit' && (
                              <div>
                                <span>Deposit</span>
                                <div className="mt-1">
                                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                    Incoming
                                  </span>
                                </div>
                              </div>
                            )}
                            {transaction.type === 'withdrawal' && (
                              <div>
                                <span>Withdrawal</span>
                                <div className="mt-1">
                                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                    Outgoing
                                  </span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewReceipt(transaction)}
                              className="text-primary-600 dark:text-primary-400"
                            >
                              <i className="ri-file-list-line mr-1"></i> Receipt
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">
                  <i className="ri-history-line"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Transaction History</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  You haven't made any transactions yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Receipt Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction Receipt</h3>
                  <button onClick={closeReceiptModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">#{selectedTransaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedTransaction.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedTransaction.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium capitalize text-gray-900 dark:text-white">
                      {selectedTransaction.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className={`font-medium ${
                      selectedTransaction.type === 'deposit' 
                        ? 'text-green-600 dark:text-green-400s' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {selectedTransaction.type === 'deposit' ? '+' : '-'}
                      {formatCurrency(Number(selectedTransaction.amount))}
                    </span>
                  </div>
                  
                  {selectedTransaction.type === 'transfer' && selectedTransaction.recipient_info && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Recipient</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(() => {
                          try {
                            const info = JSON.parse(selectedTransaction.recipient_info);
                            return info.email || 'N/A';
                          } catch (e) {
                            return 'N/A';
                          }
                        })()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={closeReceiptModal}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handlePrintReceipt}
                    className="bg-primary-700 hover:bg-primary-800"
                  >
                    <i className="ri-printer-line mr-2"></i>
                    Print Receipt
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex-grow"></div>
        <div className="flex justify-center mt-10">
          <Link href="dashboard">
            <Button variant="outline" className="w-1/2 md:w-1/2 mr-20">
              Dashboard
            </Button>
          </Link>
        </div>
      </main>
     
      <Footer />
    </div>
  );
}
