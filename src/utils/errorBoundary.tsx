import React, { ReactNode } from 'react';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    console.error('Error Boundary caught:', error, errorInfo);
    
    if (import.meta.env.DEV) {
      console.debug('Component Stack:', errorInfo.componentStack);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.retry);
      }

      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={this.retry} variant="default">
                Try Again
              </Button>
              <Button onClick={() => (window.location.href = '/')} variant="outline">
                <Home size={16} className="mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * API Error Boundary Component
 * Handles errors from API calls gracefully
 */
interface ApiErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: any) => void;
}

export const ApiErrorBoundary = ({ children, onError }: ApiErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-destructive">Error Loading Data</h3>
              <p className="text-sm text-destructive/80 mt-1">
                {error?.message || 'Failed to load data from server'}
              </p>
              <Button
                onClick={retry}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
