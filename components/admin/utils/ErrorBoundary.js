import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
          <div className="glass-card bg-white/10 border border-white/20 rounded-xl max-w-lg w-full p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white mb-4">
              Что-то пошло не так
            </h1>
            <p className="text-gray-400 mb-6">
              Произошла непредвиденная ошибка в панели администратора. 
              Мы уже работаем над её устранением.
            </p>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                <h3 className="text-red-300 font-medium mb-2">Детали ошибки:</h3>
                <pre className="text-red-200 text-xs overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 glow-button text-black font-semibold py-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Перезагрузить</span>
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span>На главную</span>
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm">
                Если проблема не исчезает, обратитесь в техподдержку:
                <br />
                <a href="mailto:support@arpozan.com" className="text-blue-400 hover:underline">
                  support@arpozan.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;