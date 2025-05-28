import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FiAlertOctagon } from 'react-icons/fi';


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Image gallery error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg text-red-700 h-full min-h-[200px]">
          <FiAlertOctagon className="w-10 h-10 mb-3 text-red-500" />
          <h3 className="text-lg font-medium">Something went wrong</h3>
          <p className="text-sm text-red-600">
            {this.state.error?.message || 'There was an error displaying the gallery'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;