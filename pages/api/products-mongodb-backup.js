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
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      inStock = 'true'
    } = req.query;

    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    // Build filter query - only show active products with stock
    const filter = { 
      status: 'active'
    };
    
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort query
    const sort = {};
    if (sortBy === 'price') {
      sort.price = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'name') {
      sort.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'popularity') {
      sort['analytics.sales'] = -1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Get products with pagination
    const [products, total, categories] = await Promise.all([
      Product.find(filter)
        .select('name slug description price originalPrice category tags images stock features seo analytics')
        .sort(sort)
        .limit(limitNum)
        .skip(skip)
        .lean(),
      Product.countDocuments(filter),
      // Get available categories
      Product.distinct('category', { status: 'active', stock: { $gt: 0 } })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    // Add computed fields to products
    const enrichedProducts = products.map(product => ({
      ...product,
      onSale: product.originalPrice && product.originalPrice > product.price,
      discount: product.originalPrice && product.originalPrice > product.price ? 
        Math.round((1 - product.price / product.originalPrice) * 100) : 0,
      inStock: product.stock > 0,
      popularity: product.analytics?.sales || 0
    }));

    return sendResponse(res, 200, {
      products: enrichedProducts,
      categories,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext,
        hasPrev
      },
      filters: {
        category,
        search,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    return handleError(res, error, 'Failed to get products');
  }
}