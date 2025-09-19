// Admin Products List Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminProductsList from '../../../components/admin/AdminProductsList';
import { useAuth } from '../../../lib/AuthContext';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Products Management - ARPOZAN Admin</title>
        <meta name="description" content="Manage products in the ARPOZAN admin panel" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Admin Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Dashboard
                </button>
                <h1 className="text-xl font-semibold text-white">Products Management</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Welcome, {user.email}</span>
                <button
                  onClick={() => {
                    // Handle logout
                    router.push('/admin/login');
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <AdminProductsList />
        </main>
      </div>
    </>
  );
}