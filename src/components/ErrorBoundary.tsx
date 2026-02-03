"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Props for the error boundary component.
 */
interface Props {
  /** Child elements that the boundary should render. */
  children?: ReactNode;
}

/**
 * Error boundary state.
 */
interface State {
  /** Whether an error has been captured. */
  hasError: boolean;
  /** Captured error instance, if any. */
  error: Error | null;
}

/**
 * Error boundary component for rendering a friendly fallback UI.
 * @module components/ErrorBoundary
 * @remarks
 * Captures rendering errors in child components and allows a retry action.
 */
export class ErrorBoundary extends Component<Props, State> {
  /** Initial error boundary state. */
  public state: State = {
    hasError: false,
    error: null,
  };

  /**
   * Update state when an error is thrown in a child component.
   * @param error - The error thrown during render.
   * @returns Updated error state.
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Log the error to the console or reporting service.
   * @param error - The error thrown during render.
   * @param errorInfo - Component stack trace information.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  /**
   * Render either the fallback UI or the child content.
   * @returns React elements for the boundary state.
   */
  public render() {
    if (this.state.hasError) {
      return (
        <div className="mt-8 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <div className="mb-4 text-4xl">🫠</div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-slate-500">
            We encountered an unexpected error. Please try refreshing the page
            or check the console for details.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Reload Page
            </button>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-lg bg-slate-200 px-4 py-2 text-slate-900 transition-colors hover:bg-slate-300"
            >
              Try Again
            </button>
          </div>
          {this.state.error && (
            <pre className="mt-8 max-w-full overflow-auto rounded-lg bg-red-50 p-4 text-left text-xs text-red-600">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
