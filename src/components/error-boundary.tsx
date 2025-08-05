"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>Something went wrong</CardTitle>
        </div>
        <CardDescription>
          An error occurred while loading this component. Please try again.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && process.env.NODE_ENV === "development" && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <p className="font-medium">Error details:</p>
            <p className="mt-1 font-mono text-xs">{error.message}</p>
          </div>
        )}
        <Button onClick={resetError} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}

// Specific error boundary for search components
export function SearchErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={SearchErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Search component error:", error, errorInfo);
        // You could send this to an error reporting service
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function SearchErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h3 className="font-medium text-destructive">Search Error</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        There was a problem with the search functionality. Please try refreshing or contact support if the issue persists.
      </p>
      {error && process.env.NODE_ENV === "development" && (
        <details className="mb-3">
          <summary className="text-xs text-muted-foreground cursor-pointer">
            Error details (development only)
          </summary>
          <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      <Button onClick={resetError} size="sm" variant="outline">
        <RefreshCw className="h-3 w-3 mr-1" />
        Retry
      </Button>
    </div>
  );
}
