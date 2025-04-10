import React from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loginSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, navigate] = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      // Will automatically redirect in the auth hook
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
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
              <h2 className="text-xl md:text-2xl font-display font-bold">Welcome to Nivalus Bank</h2>
              <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-700 dark:text-gray-300">Sign in to your account</p>
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
                          placeholder="Enter your username"
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
                          placeholder="Enter your password"
                          {...field}
                          className="form-input text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id="remember" className="h-4 w-4 text-primary border-gray-300 rounded" />
                    <label htmlFor="remember" className="ml-2 block text-xs md:text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full py-2 md:py-3 px-4 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i> Signing In...
                    </span>
                  ) : 'Sign In'}
                </Button>
              </form>
            </Form>

            <div className="mt-5 md:mt-6 text-center">
              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline font-medium ml-1">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center space-x-4 mb-3">
                <div className="flex items-center">
                  <i className="ri-shield-check-line text-green-500 mr-1.5"></i>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Secure Login</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-lock-line text-green-500 mr-1.5"></i>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Encrypted</span>
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