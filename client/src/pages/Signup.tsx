import React from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { insertUserSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const signupSchema = insertUserSchema.omit({ role: true, balance: true, status: true, avatar: true });

export default function Signup() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      password: '',
      pin: '',
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      setIsSubmitting(true);
      await apiRequest('POST', '/api/signup', data);
      toast({
        title: 'Account Created',
        description: 'Your account has been created successfully. You can now log in.',
        variant: 'default',
      });
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Signup Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Signup Failed',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-8 md:py-12 px-4">
        <div className="w-full max-w-md mx-auto auth-form shadow-lg">
          <div className="p-5 sm:p-8">
            <div className="text-center mb-6 md:mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="20"
                viewBox="0 0 150 50"
                className="h-14 w-20 md:h-20 md:w-30 text-primary inline-block mb-3 md:mb-4"
              >
                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20,10 L30,40 M30,10 L20,40 M40,10 L40,40 M50,10 L50,40 M60,10 L70,25 L60,40 M80,10 L75,25 L80,40 M90,10 L90,40 M90,25 L100,25 M110,10 L110,40 L120,40 M130,10 L130,40" />
                </g>
              </svg>
              <h2 className="text-xl md:text-2xl font-display font-bold">Create an Account</h2>
              <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-700 dark:text-gray-300">Join Nivalus Bank today</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label text-sm md:text-base">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Choose a username"
                          {...field}
                          className="form-input text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label text-sm md:text-base">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          className="form-input text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label text-sm md:text-base">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password"
                          {...field}
                          className="form-input text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label text-sm md:text-base">PIN (4 digits)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a 4-digit PIN"
                          maxLength={4}
                          {...field}
                          className="form-input text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-1">
                  <p className="flex items-start">
                    <i className="ri-information-line text-sm mr-1.5 mt-0.5"></i>
                    <span>Your PIN will be used to authorize transfers and other sensitive operations.</span>
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full py-2 md:py-3 px-4 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i> Creating Account...
                    </span>
                  ) : 'Create Account'}
                </Button>
              </form>
            </Form>

            <div className="mt-5 md:mt-6 text-center">
              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center space-x-4 mb-3">
                <div className="flex items-center">
                  <i className="ri-shield-check-line text-green-500 mr-1.5"></i>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Secure Signup</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-lock-line text-green-500 mr-1.5"></i>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Encrypted Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}