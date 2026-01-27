import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/store';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { FormWrapper, FormInput } from '@/components/forms/FormComponents';
import { AlertCircle, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Login Form Schema
 */
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Page
 * Example page demonstrating:
 * - API client usage with JWT
 * - Zustand store for auth state
 * - Form abstractions
 * - Error handling
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthUser, setAccessToken } = useAppStore();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handle login submission
   * 1. Call login API
   * 2. Store token in localStorage
   * 3. Update Zustand state
   * 4. Redirect to dashboard
   */
  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    setIsLoading(true);

    try {
      // Call login endpoint
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, accessToken } = response.data;

      // Store in localStorage (for persistence across page reloads)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Update Zustand store (for immediate UI updates)
      setAccessToken(accessToken);
      setAuthUser(user);

      // Redirect to dashboard
      navigate('/');
    } catch (error: any) {
      setApiError(error?.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <LogIn size={24} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Welcome to Opex</h1>
          <p className="text-center text-muted-foreground text-sm">
            Sales Engagement Dashboard
          </p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Login Error</p>
              <p className="text-sm text-destructive/80">{apiError}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <FormWrapper form={form} onSubmit={onSubmit} className="space-y-4">
          <FormInput
            name="email"
            label="Email"
            placeholder="john@example.com"
            type="email"
            required
            disabled={isLoading}
          />

          <FormInput
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
            required
            disabled={isLoading}
          />

          <Button type="submit" className="w-full" disabled={isLoading} size="lg">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </FormWrapper>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs">
            <p>
              <span className="font-medium">Admin:</span> admin@opex.com / password
            </p>
            <p>
              <span className="font-medium">Manager:</span> manager@opex.com / password
            </p>
            <p>
              <span className="font-medium">Rep:</span> rep@opex.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
