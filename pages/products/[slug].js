// Dynamic Product Page - [slug].js
// This generates product pages automatically based on slug
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductTemplates from '../../components/products/ProductTemplates';
import { useCart } from '../../lib/CartContext';
import { useWishlist } from '../../lib/WishlistContext';
import { useToast } from '../../lib/ToastContext';

export default function DynamicProductPage({ product, error }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { push } = useToast();

  // Handle loading state
  if (router.isFallback) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const productContent = product.product_content || {};
  const templateType = productContent.template_type || 'default';

  return (
    <>
      <Head>
        <title>{product.seo_title || product.name} - ARPOZAN</title>
        <meta
          name="description"
          content={product.seo_description || product.description}
        />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        {product.images?.[0] && (
          <meta property="og:image" content={product.images[0]} />
        )}
        <meta property="og:type" content="product" />
        <meta name="product:price:amount" content={product.price} />
        <meta name="product:price:currency" content="RUB" />
        {product.tags?.length > 0 && (
          <meta name="keywords" content={product.tags.join(', ')} />
        )}
      </Head>

      <Layout>
        <ProductTemplates 
          product={product}
          templateType={templateType}
          onAddToCart={addToCart}
          onAddToWishlist={addToWishlist}
          onRemoveFromWishlist={removeFromWishlist}
          isInWishlist={isInWishlist}
          showToast={push}
        />
      </Layout>
    </>
  );
}

// Static Site Generation for better performance
export async function getStaticPaths() {
  try {
    // In production, you might want to pre-generate paths for featured/popular products
    // For now, we'll use fallback to generate pages on-demand
    return {
      paths: [],
      fallback: 'blocking' // Generate page on first request and cache it
    };
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    // Import ProductModel server-side
    const { ProductModel } = require('../lib/supabaseModels.js');
    
    // Fetch product by slug
    const { data: products, error } = await ProductModel.getAll({
      search: slug,
      limit: 1
    });

    // Find exact slug match
    const product = products?.find(p => p.slug === slug);

    if (!product || !product.is_active) {
      return {
        notFound: true,
        revalidate: 60 // Revalidate every minute in case product becomes active
      };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)) // Ensure serializable
      },
      revalidate: 300 // Revalidate every 5 minutes for updated content
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        error: 'Failed to load product'
      },
      revalidate: 60
    };
  }
}