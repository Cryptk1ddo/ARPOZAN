// Create Product Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminProductForm from '../../../components/admin/AdminProductForm';
import { useAuth } from '../../../lib/AuthContext';
import { useToast } from '../../../lib/ToastContext';

export default function CreateProductPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { push } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const handleCreateProduct = async (productData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (response.ok) {
        push('✅ Product created successfully!');
        router.push('/admin/products');
      } else {
        throw new Error(result.error || 'Failed to create product');
      }
    } catch (error) {
      throw error; // Re-throw for form to handle
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <title>Create Product - ARPOZAN Admin</title>
        <meta name="description" content="Create a new product in the ARPOZAN admin panel" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Admin Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/products')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Products
                </button>
                <h1 className="text-xl font-semibold text-white">Create New Product</h1>
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
          <AdminProductForm 
            onSubmit={handleCreateProduct}
            isLoading={isSubmitting}
          />
        </main>
      </div>
    </>
  );
}