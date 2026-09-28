import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Gracefully absorb errors so they don't break the preview container
    console.warn('ErrorBoundary caught error:', error?.message, errorInfo?.componentStack);
  }

  private handleRecover = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleFullReset = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-display text-white mb-2">
              BrainGrid Studio Recovered
            </h2>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              An unexpected render issue was safely intercepted. You can resume your study session or reload clean data.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={this.handleRecover}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resume App</span>
              </button>
              <button
                type="button"
                onClick={this.handleFullReset}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-xs transition-all cursor-pointer"
              >
                Reset Stored Data & Refresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
