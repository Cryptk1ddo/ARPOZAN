// Individual product API for the main website
import { connectDB, Product } from '../../../lib/database';
import { handleError, sendResponse } from '../../../lib/auth';

export default async function handler(req, res) {
  await connectDB();

  const { slug } = req.query;

  if (req.method === 'GET') {
    return await getProduct(req, res, slug);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function getProduct(req, res, slug) {
  try {
    const product = await Product.findOne({ 
      slug, 
      status: 'active' 
    }).lean();

    if (!product) {
      return sendResponse(res, 404, null, 'Product not found');
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, {
      $inc: { 'analytics.views': 1 }
    });

    // Get related products (same category, different product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
      stock: { $gt: 0 }
    })
    .select('name slug price originalPrice images stock')
    .limit(4)
    .lean();

    // Add computed fields
    const enrichedProduct = {
      ...product,
      onSale: product.originalPrice && product.originalPrice > product.price,
      discount: product.originalPrice && product.originalPrice > product.price ? 
        Math.round((1 - product.price / product.originalPrice) * 100) : 0,
      inStock: product.stock > 0,
      views: (product.analytics?.views || 0) + 1
    };

    const enrichedRelatedProducts = relatedProducts.map(p => ({
      ...p,
      onSale: p.originalPrice && p.originalPrice > p.price,
      discount: p.originalPrice && p.originalPrice > p.price ? 
        Math.round((1 - p.price / p.originalPrice) * 100) : 0,
      inStock: p.stock > 0
    }));

    return sendResponse(res, 200, {
      product: enrichedProduct,
      relatedProducts: enrichedRelatedProducts
    });

  } catch (error) {
    return handleError(res, error, 'Failed to get product');
  }
}