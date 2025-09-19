-- Database update to support dynamic product pages
-- Run this SQL in your Supabase SQL Editor to add product_content field

-- Add product_content JSONB field to products table
ALTER TABLE products 
ADD COLUMN product_content JSONB DEFAULT '{}';

-- Update existing products to have empty product_content structure
UPDATE products 
SET product_content = '{
  "benefits": {},
  "components": {},
  "faq_data": [],
  "comparison_data": {},
  "dosage_info": {},
  "template_type": "default",
  "hero_images": [],
  "product_highlights": [],
  "testimonials": []
}'::jsonb
WHERE product_content = '{}'::jsonb OR product_content IS NULL;

-- Add comment to document the field structure
COMMENT ON COLUMN products.product_content IS 
'JSONB field containing structured content for dynamic product pages including benefits, components, FAQ data, comparison tables, dosage information, template type, hero images, product highlights, and testimonials';