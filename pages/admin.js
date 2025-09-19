import Head from "next/head";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, auth } from "../lib/supabase";

// Import modular components
import LoadingSpinner from "../components/admin/shared/LoadingSpinner";
import AuthPage from "../components/admin/auth/AuthPage";
import Header from "../components/admin/layout/Header";
import Sidebar from "../components/admin/layout/Sidebar";
import BottomNavBar from "../components/admin/layout/BottomNavBar";
import ToastContainer from "../components/admin/shared/ToastContainer";
import DashboardView from "../components/admin/views/DashboardView";
import ProductsView from "../components/admin/views/ProductsView";
import OrdersView from "../components/admin/views/OrdersView";
import ReportsView from "../components/admin/views/ReportsView";
import SettingsView from "../components/admin/views/SettingsView";
import CustomersView from "../components/admin/views/CustomersView";
import InventoryView from "../components/admin/views/InventoryView";
import MarketingView from "../components/admin/views/MarketingView";
import MonitoringView from "../components/admin/views/MonitoringView";
import RolesPermissionsView from "../components/admin/views/RolesPermissionsView";

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("Панель управления");
  const [theme, setTheme] = useState("dark");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auth state management
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setCurrentView("Панель управления");
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthPage onAuth={(userData) => setUser(userData)} />;
  }

  return (
    <>
      <Head>
        <title>ARPOZAN - Административная панель</title>
        <meta name="description" content="Административная панель ARPOZAN" />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
        <Header 
          theme={theme}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
          user={user}
          onLogout={() => auth.signOut()}
          onChatOpen={() => console.log("Chat opened")}
        />
        
        {!isMobile && (
          <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        )}

        <main 
          className={`transition-all duration-300 ${
            !isMobile ? (isCollapsed ? "ml-20" : "ml-64") : ""
          } pt-16 ${isMobile ? "pb-16" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {currentView === "Панель управления" && <DashboardView key="dashboard" />}
              {currentView === "Продукты" && <ProductsView key="products" />}
              {currentView === "Заказы" && <OrdersView key="orders" />}
              {currentView === "Клиенты" && <CustomersView key="customers" />}
              {currentView === "Склад" && <InventoryView key="inventory" />}
              {currentView === "Маркетинг" && <MarketingView key="marketing" />}
              {currentView === "Мониторинг" && <MonitoringView key="monitoring" />}
              {currentView === "Пользователи" && <RolesPermissionsView key="users" />}
              {currentView === "Отчеты" && <ReportsView key="reports" />}
              {currentView === "Настройки" && <SettingsView key="settings" />}
            </AnimatePresence>
          </div>
        </main>

        {isMobile && (
          <BottomNavBar 
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        )}

        {/* Global Toast Container */}
        <ToastContainer />
      </div>
    </>
  );
};

export default AdminPanel;
