// Edit Product Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminProductForm from '../../../../components/admin/AdminProductForm';
import { useAuth } from '../../../../lib/AuthContext';
import { useToast } from '../../../../lib/ToastContext';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const { push } = useToast();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // Fetch product data
  useEffect(() => {
    if (id && user?.role === 'admin') {
      fetchProduct();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/products/${id}`);
      const result = await response.json();

      if (response.ok) {
        setProduct(result.data);
      } else {
        push('❌ Failed to fetch product');
        router.push('/admin/products');
      }
    } catch (error) {
      push('❌ Error fetching product');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (productData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (response.ok) {
        push('✅ Product updated successfully!');
        router.push('/admin/products');
      } else {
        throw new Error(result.error || 'Failed to update product');
      }
    } catch (error) {
      throw error; // Re-throw for form to handle
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Product Not Found</h2>
          <button
            onClick={() => router.push('/admin/products')}
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit {product.name} - ARPOZAN Admin</title>
        <meta name="description" content={`Edit ${product.name} in the ARPOZAN admin panel`} />
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
                <h1 className="text-xl font-semibold text-white">
                  Edit: {product.name}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href={`/products/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Live Page →
                </a>
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
            product={product}
            onSubmit={handleUpdateProduct}
            isLoading={isSubmitting}
          />
        </main>
      </div>
    </>
  );
}