import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/user/Dashboard';
import Transfer from '@/pages/user/Transfer';
import TransferProgress from '@/pages/user/TransferProgress';
import History from '@/pages/user/History';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminTransactions from '@/pages/admin/Transactions';
import NotFound from '@/pages/NotFound';
import AboutUsPage from '@/pages/Aboutus';
import CareersPage from '@/pages/Careers';
import ContactPage from '@/pages/Contact';
import CookiePolicyPage from '@/pages/Cookiepolicy';
import PressPage from '@/pages/Press';
import PrivacyPolicyPage from '@/pages/Privacypolicy';
import SecurityPage from '@/pages/Security';
import TermsPage from '@/pages/Terms';

// Protected route component
function ProtectedRoute({ component: Component, adminRequired = false }: { component: React.ComponentType, adminRequired?: boolean }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Checking authentication...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          Please wait while we verify your session. This may take a moment.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    setTimeout(() => navigate('/login'), 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4 max-w-md">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">Session expired</p>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">Redirecting to login...</p>
        </div>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (adminRequired && user?.role !== 'admin') {
    setTimeout(() => navigate('/dashboard'), 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 max-w-md">
          <p className="text-red-800 dark:text-red-200 font-medium">Access denied</p>
          <p className="text-red-700 dark:text-red-300 text-sm">Redirecting to dashboard...</p>
        </div>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/aboutus" component={AboutUsPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/cookiepolicy" component={CookiePolicyPage} />
      <Route path="/press" component={PressPage} />
      <Route path="/privacypolicy" component={PrivacyPolicyPage} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/terms" component={TermsPage} />

      {/* User routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/transfer">
        <ProtectedRoute component={Transfer} />
      </Route>
      <Route path="/transfer/progress">
        <ProtectedRoute component={TransferProgress} />
      </Route>
      <Route path="/history">
        <ProtectedRoute component={History} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} adminRequired={true} />
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute component={AdminUsers} adminRequired={true} />
      </Route>
      <Route path="/admin/transactions">
        <ProtectedRoute component={AdminTransactions} adminRequired={true} />
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;