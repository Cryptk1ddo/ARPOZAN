// Products management API - Supabase version
import { ProductModel } from '../../../../lib/supabaseModels';
import { supabaseAuth, rateLimit } from '../../../../lib/supabaseAuth';

const { requireAdmin, optionalAuth } = supabaseAuth.middleware;

export default async function handler(req, res) {
  // Apply rate limiting
  await new Promise((resolve, reject) => {
    rateLimit()(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  if (req.method === 'GET') {
    return await getProducts(req, res);
  }

  if (req.method === 'POST') {
    return await createProduct(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function getProducts(req, res) {
  try {
    // Use optional auth - public can see products, but admin gets more data
    await new Promise((resolve, reject) => {
      optionalAuth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { 
      page = 1, 
      limit = 20, 
      search, 
      category, 
      status, 
      sortBy = 'created_at', 
      sortOrder = 'desc',
      inStock,
      is_featured
    } = req.query;

    // Build filters object
    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    // Add search filter
    if (search) {
      filters.search = search;
    }

    // Add category filter
    if (category) {
      filters.category = category;
    }

    // Add featured filter
    if (is_featured !== undefined) {
      filters.is_featured = is_featured === 'true';
    }

    // For public users, only show active products
    if (!req.user) {
      filters.is_active = true;
    } else {
      // Admin can filter by status
      if (status) {
        filters.is_active = status === 'active';
      }
    }

    // Get products using Supabase model
    const { data: products, error } = await ProductModel.getAll(filters);
    
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      });
    }

    // Calculate additional metrics for admin users
    let totalProducts = 0;
    let totalValue = 0;
    
    if (req.user) {
      // Get total count and value for admin dashboard
      const { data: allProducts } = await ProductModel.getAll({ is_active: true });
      totalProducts = allProducts?.length || 0;
      totalValue = allProducts?.reduce((sum, product) => sum + (product.price * product.stock), 0) || 0;
    }

    return res.status(200).json({
      success: true,
      data: {
        products: products || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products?.length || 0
        },
        ...(req.user && {
          summary: {
            totalProducts,
            totalValue,
            categories: [...new Set(products?.map(p => p.category) || [])]
          }
        })
      }
    });

  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function createProduct(req, res) {
  try {
    // Require admin authentication for creating products
    await new Promise((resolve, reject) => {
      requireAdmin(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const {
      name,
      slug,
      description,
      price,
      original_price,
      category,
      tags = [],
      images = [],
      stock = 0,
      is_featured = false,
      is_active = true,
      variants = {},
      seo_title,
      seo_description
    } = req.body;

    // Validate required fields
    if (!name || !slug || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, slug, description, price, category'
      });
    }

    // Validate price
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Create product data object
    const productData = {
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      description: description.trim(),
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : null,
      category: category.trim(),
      tags: Array.isArray(tags) ? tags : [],
      images: Array.isArray(images) ? images : [],
      stock: parseInt(stock) || 0,
      is_featured: Boolean(is_featured),
      is_active: Boolean(is_active),
      variants: typeof variants === 'object' ? variants : {},
      seo_title: seo_title ? seo_title.trim() : name.trim(),
      seo_description: seo_description ? seo_description.trim() : description.trim()
    };

    // Create product using Supabase model
    const { data: product, error } = await ProductModel.create(productData);
    
    if (error) {
      console.error('Error creating product:', error);
      
      // Handle specific errors
      if (error.error?.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: 'Product with this slug already exists'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.error
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}