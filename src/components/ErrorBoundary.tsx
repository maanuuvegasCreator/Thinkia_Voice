import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

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
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
                    <div className="max-w-md w-full bg-card border border-destructive/50 rounded-xl p-6 shadow-lg">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-destructive" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Something went wrong</h1>
                                <p className="text-sm text-muted-foreground mt-2">
                                    The application encountered a critical error.
                                </p>
                            </div>
                            <div className="w-full bg-muted/50 p-3 rounded-lg text-left overflow-auto max-h-40">
                                <code className="text-xs font-mono text-destructive">
                                    {this.state.error?.message}
                                </code>
                            </div>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
