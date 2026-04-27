/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ReactNode, ErrorInfo } from 'react';

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

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      return fallback ?? (
        <div className="flex h-screen w-screen items-center justify-center bg-paper-0 px-6 text-ink-900">
          <div className="plate corners max-w-md px-6 py-5 text-center shadow-card">
            <span className="corner-tl" aria-hidden="true" />
            <span className="corner-br" aria-hidden="true" />
            <p className="t-eyebrow mb-3 text-accent">Runtime Fault</p>
            <p className="font-display text-2xl italic leading-snug">
              Something went wrong. Please reload the page.
            </p>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
