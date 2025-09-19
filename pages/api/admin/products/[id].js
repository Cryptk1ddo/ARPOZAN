// Individual product management API - Supabase version
import { ProductModel } from '../../../../lib/supabaseModels';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getProduct(req, res, id);
      case 'PUT':
        return await updateProduct(req, res, id);
      case 'DELETE':
        return await deleteProduct(req, res, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin product API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

async function getProduct(req, res, id) {
  try {
    const { data: product, error } = await ProductModel.getById(id);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch product' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
}

async function updateProduct(req, res, id) {
  try {
    // Apply admin authentication middleware
    await new Promise((resolve, reject) => {
      requireAdmin(req, res, (result) => {
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    }).catch((error) => {
      return res.status(401).json({ error: 'Admin authentication required' });
    });

    const {
      name,
      slug,
      description,
      price,
      original_price,
      category,
      tags,
      images,
      stock,
      is_featured,
      is_active,
      variants,
      seo_title,
      seo_description,
      // Enhanced fields for dynamic page generation
      benefits,
      components,
      faq_data,
      comparison_data,
      dosage_info,
      template_type,
      hero_images,
      product_highlights,
      testimonials
    } = req.body;

    // Build update object with only provided fields
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.toLowerCase().trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (original_price !== undefined) updateData.original_price = original_price ? parseFloat(original_price) : null;
    if (category !== undefined) updateData.category = category.trim();
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    if (stock !== undefined) updateData.stock = parseInt(stock) || 0;
    if (is_featured !== undefined) updateData.is_featured = Boolean(is_featured);
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);
    if (variants !== undefined) updateData.variants = typeof variants === 'object' ? variants : {};
    if (seo_title !== undefined) updateData.seo_title = seo_title?.trim() || name?.trim();
    if (seo_description !== undefined) updateData.seo_description = seo_description?.trim() || description?.trim();

    // Handle product_content updates
    if (benefits !== undefined || components !== undefined || faq_data !== undefined || 
        comparison_data !== undefined || dosage_info !== undefined || template_type !== undefined ||
        hero_images !== undefined || product_highlights !== undefined || testimonials !== undefined) {
      
      // Get current product to merge content
      const { data: currentProduct } = await ProductModel.getById(id);
      const currentContent = currentProduct?.product_content || {};

      updateData.product_content = {
        ...currentContent,
        ...(benefits !== undefined && { benefits: typeof benefits === 'object' ? benefits : {} }),
        ...(components !== undefined && { components: typeof components === 'object' ? components : {} }),
        ...(faq_data !== undefined && { faq_data: Array.isArray(faq_data) ? faq_data : [] }),
        ...(comparison_data !== undefined && { comparison_data: typeof comparison_data === 'object' ? comparison_data : {} }),
        ...(dosage_info !== undefined && { dosage_info: typeof dosage_info === 'object' ? dosage_info : {} }),
        ...(template_type !== undefined && { template_type: template_type || 'default' }),
        ...(hero_images !== undefined && { hero_images: Array.isArray(hero_images) ? hero_images : [] }),
        ...(product_highlights !== undefined && { product_highlights: Array.isArray(product_highlights) ? product_highlights : [] }),
        ...(testimonials !== undefined && { testimonials: Array.isArray(testimonials) ? testimonials : [] })
      };
    }

    const { data: product, error } = await ProductModel.update(id, updateData);

    if (error) {
      if (error.message?.includes('duplicate key value violates unique constraint')) {
        return res.status(409).json({
          error: 'Product with this slug already exists'
        });
      }
      return res.status(500).json({
        error: 'Failed to update product',
        details: error.message
      });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({
      error: 'Failed to update product',
      details: error.message
    });
  }
}

async function deleteProduct(req, res, id) {
  try {
    // Apply admin authentication middleware
    await new Promise((resolve, reject) => {
      requireAdmin(req, res, (result) => {
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    }).catch((error) => {
      return res.status(401).json({ error: 'Admin authentication required' });
    });

    const { data: product, error } = await ProductModel.delete(id);

    if (error) {
      return res.status(500).json({
        error: 'Failed to delete product',
        details: error.message
      });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      error: 'Failed to delete product',
      details: error.message
    });
  }
}