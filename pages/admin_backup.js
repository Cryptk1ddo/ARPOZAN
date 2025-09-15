import { useState, useEffect } from 'react';
import { auth } from '../lib/supabase';
import ErrorBoundary from '../components/admin/utils/ErrorBoundary';
import LoadingSpinner from '../components/admin/utils/LoadingSpinner';
import LoginForm from '../components/admin/auth/LoginForm';
import ToastContainer from '../components/admin/utils/ToastContainer';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import BottomNavBar from '../components/admin/BottomNavBar';
import Footer from '../components/admin/Footer';
import DashboardPage from '../components/admin/pages/DashboardPage';
import ProductsPage from '../components/admin/pages/ProductsPage';
import OrdersPage from '../components/admin/pages/OrdersPage';
import ReportsPage from '../components/admin/pages/ReportsPage';
import SettingsPage from '../components/admin/pages/SettingsPage';
import ConfirmModal from '../components/admin/modals/ConfirmModal';
import ExplanationModal from '../components/admin/modals/ExplanationModal';
import AIChat from '../components/admin/modals/AIChat';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);
  
  // Modals state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'default'
  });
  
  const [explanationModal, setExplanationModal] = useState({
    isOpen: false,
    title: '',
    content: '',
    actions: []
  });
  
  const [aiChat, setAIChat] = useState({
    isOpen: false,
    isMinimized: false
  });

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global modal functions
  useEffect(() => {
    window.showConfirm = (title, message, onConfirm, variant = 'default') => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        onConfirm,
        variant
      });
    };

    window.showExplanation = (title, content, actions = []) => {
      setExplanationModal({
        isOpen: true,
        title,
        content,
        actions
      });
    };

    window.openAIChat = () => {
      setAIChat(prev => ({ ...prev, isOpen: true }));
    };

    return () => {
      delete window.showConfirm;
      delete window.showExplanation;
      delete window.openAIChat;
    };
  }, []);

  const handleLogin = (userData) => {
    // Login handled by Firebase Auth hook
    window.showToast?.('Добро пожаловать в панель администратора!', 'success');
  };

  const handleLogout = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) {
        throw error;
      }
      window.showToast?.('Вы успешно вышли из системы', 'info');
    } catch (error) {
      console.error('Logout error:', error);
      window.showToast?.('Ошибка при выходе из системы', 'error');
    }
  };

  const renderPage = () => {
    const pageProps = {
      user,
      isMobile,
      onNavigate: setCurrentPage
    };

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage {...pageProps} />;
      case 'products':
        return <ProductsPage {...pageProps} />;
      case 'orders':
        return <OrdersPage {...pageProps} />;
      case 'reports':
        return <ReportsPage {...pageProps} />;
      case 'settings':
        return <SettingsPage {...pageProps} />;
      default:
        return <DashboardPage {...pageProps} />;
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Проверка авторизации..." />
      </div>
    );
  }

  // Show error if auth failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Ошибка авторизации: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="glow-button text-black font-semibold px-6 py-3 rounded-lg"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <ErrorBoundary>
        <LoginForm onSuccess={handleLogin} />
        <ToastContainer />
      </ErrorBoundary>
    );
  }

  // Main admin panel
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}

        {/* Main Content */}
        <div className={`transition-all duration-300 ${
          !isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''
        }`}>
          {/* Header */}
          <Header
            user={user}
            onLogout={handleLogout}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
          />

          {/* Page Content */}
          <main className={`min-h-screen ${isMobile ? 'pb-20' : 'pb-16'}`}>
            {renderPage()}
          </main>

          {/* Footer */}
          <Footer />
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <BottomNavBar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          />
        )}

        {/* Modals */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={() => {
            confirmModal.onConfirm?.();
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
          }}
          title={confirmModal.title}
          message={confirmModal.message}
          variant={confirmModal.variant}
        />

        <ExplanationModal
          isOpen={explanationModal.isOpen}
          onClose={() => setExplanationModal(prev => ({ ...prev, isOpen: false }))}
          title={explanationModal.title}
          content={explanationModal.content}
          actions={explanationModal.actions}
        />

        <AIChat
          isOpen={aiChat.isOpen}
          onClose={() => setAIChat(prev => ({ ...prev, isOpen: false }))}
          isMinimized={aiChat.isMinimized}
          onToggleMinimize={() => setAIChat(prev => ({ ...prev, isMinimized: !prev.isMinimized }))}
        />

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default AdminPanel;