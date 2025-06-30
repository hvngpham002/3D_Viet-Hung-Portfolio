/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      return fallback ?? (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-800 text-white">
          <p>Something went wrong. Please reload the page.</p>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary; 