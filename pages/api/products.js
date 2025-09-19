// Public products API for the main website
import { ProductModel } from '../../lib/database';
import { sendResponse, getPagination } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return await getProducts(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function getProducts(req, res) {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search, 
      category, 
      sortBy = 'created_at', 
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      inStock = 'true'
    } = req.query;

    // Get pagination details
    const { skip, limit: limitNum } = getPagination(page, limit);

    // Build filter options for Supabase
    const filters = {
      isActive: true // Only show active products to public
    };

    if (search) {
      filters.search = search; // Will be handled by ProductModel
    }

    if (category) {
      filters.category = category;
    }

    if (minPrice || maxPrice) {
      filters.priceRange = {
        min: minPrice ? Number(minPrice) : undefined,
        max: maxPrice ? Number(maxPrice) : undefined
      };
    }

    if (inStock === 'true') {
      filters.inStock = true;
    }

    // Get products using Supabase model
    const { products, total, categories } = await ProductModel.getProducts({
      filters,
      pagination: { page: Number(page), limit: limitNum },
      sort: { field: sortBy, order: sortOrder }
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Format response
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price,
      category: product.category,
      tags: product.tags || [],
      images: product.images || [],
      stock: product.stock_quantity,
      features: product.features || [],
      seo: product.seo_data || {},
      analytics: {
        views: product.view_count || 0,
        sales: product.total_sales || 0,
        rating: product.average_rating || 0,
        reviewCount: product.review_count || 0
      },
      inStock: product.stock_quantity > 0,
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    return sendResponse(res, 200, {
      products: formattedProducts,
      pagination: {
        page: Number(page),
        limit: limitNum,
        total,
        totalPages,
        hasNext,
        hasPrev
      },
      categories: categories || [], // Available categories
      filters: {
        search,
        category,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        inStock
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return sendResponse(res, 500, null, 'Failed to fetch products');
  }
}