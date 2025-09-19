// Admin Product Form Component
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../../lib/ToastContext';
import ImageUpload from './ImageUpload';

export default function AdminProductForm({ 
  product = null, 
  onSubmit, 
  isLoading = false 
}) {
  const router = useRouter();
  const { push } = useToast();
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    // Basic product info
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    tags: [],
    images: [],
    stock: '0',
    is_featured: false,
    is_active: true,
    
    // SEO
    seo_title: '',
    seo_description: '',
    
    // Enhanced content for dynamic pages
    template_type: 'default',
    benefits: {},
    components: {},
    faq_data: [],
    comparison_data: {},
    dosage_info: {},
    hero_images: [],
    product_highlights: [],
    testimonials: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [benefitKey, setBenefitKey] = useState('');
  const [benefitValue, setBenefitValue] = useState('');
  const [componentKey, setComponentKey] = useState('');
  const [componentTitle, setComponentTitle] = useState('');
  const [componentContent, setComponentContent] = useState('');

  // Template types
  const templateTypes = [
    { value: 'default', label: 'Default Product Page' },
    { value: 'supplement', label: 'Supplement Page (like Zinc)' },
    { value: 'simple', label: 'Simple Product Page' },
    { value: 'premium', label: 'Premium Product Page' }
  ];

  // Categories
  const categories = [
    'Supplements',
    'Health & Wellness', 
    'Vitamins',
    'Minerals',
    'Sports Nutrition',
    'Men\'s Health',
    'Women\'s Health'
  ];

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      const productContent = product.product_content || {};
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        original_price: product.original_price?.toString() || '',
        category: product.category || '',
        tags: product.tags || [],
        images: product.images || [],
        stock: product.stock?.toString() || '0',
        is_featured: product.is_featured || false,
        is_active: product.is_active !== false,
        seo_title: product.seo_title || '',
        seo_description: product.seo_description || '',
        template_type: productContent.template_type || 'default',
        benefits: productContent.benefits || {},
        components: productContent.components || {},
        faq_data: productContent.faq_data || [],
        comparison_data: productContent.comparison_data || {},
        dosage_info: productContent.dosage_info || {},
        hero_images: productContent.hero_images || [],
        product_highlights: productContent.product_highlights || [],
        testimonials: productContent.testimonials || []
      });
    }
  }, [product]);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !isEditing) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleImagesChange = (images) => {
    const imageUrls = images.map(img => img.url);
    setFormData(prev => ({ ...prev, images: imageUrls }));
  };

  const addBenefit = () => {
    if (benefitKey && benefitValue) {
      setFormData(prev => ({
        ...prev,
        benefits: {
          ...prev.benefits,
          [benefitKey]: benefitValue
        }
      }));
      setBenefitKey('');
      setBenefitValue('');
    }
  };

  const removeBenefit = (key) => {
    setFormData(prev => {
      const newBenefits = { ...prev.benefits };
      delete newBenefits[key];
      return { ...prev, benefits: newBenefits };
    });
  };

  const addComponent = () => {
    if (componentKey && componentTitle && componentContent) {
      setFormData(prev => ({
        ...prev,
        components: {
          ...prev.components,
          [componentKey]: {
            title: componentTitle,
            content: componentContent
          }
        }
      }));
      setComponentKey('');
      setComponentTitle('');
      setComponentContent('');
    }
  };

  const removeComponent = (key) => {
    setFormData(prev => {
      const newComponents = { ...prev.components };
      delete newComponents[key];
      return { ...prev, components: newComponents };
    });
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faq_data: [
        ...prev.faq_data,
        { question: '', answer: '' }
      ]
    }));
  };

  const updateFAQ = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      faq_data: prev.faq_data.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const removeFAQ = (index) => {
    setFormData(prev => ({
      ...prev,
      faq_data: prev.faq_data.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.slug || !formData.description || !formData.price || !formData.category) {
      push('❌ Please fill in all required fields');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      push(`❌ ${error.message}`);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Page Content' },
    { id: 'seo', label: 'SEO' },
    { id: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {isEditing ? 'Edit Product' : 'Create New Product'}
        </h1>
        <p className="text-gray-400">
          {isEditing ? 'Update product information and content' : 'Add a new product with dynamic page generation'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Will be used as: /products/{formData.slug}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (₽) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Original Price (₽)
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template Type
                </label>
                <select
                  name="template_type"
                  value={formData.template_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {templateTypes.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <ImageUpload
              images={formData.images.map(url => ({ url }))}
              onImagesChange={handleImagesChange}
              maxImages={8}
              label="Product Images"
              description="Upload product images. The first image will be the primary image shown in listings."
            />

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-300">Featured Product</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-300">Active</span>
              </label>
            </div>
          </div>
        )}

        {/* Page Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Benefits Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Benefit key (e.g., testosterone)"
                  value={benefitKey}
                  onChange={(e) => setBenefitKey(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Benefit description"
                  value={benefitValue}
                  onChange={(e) => setBenefitValue(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={addBenefit}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Benefit
              </button>
              
              <div className="space-y-2">
                {Object.entries(formData.benefits).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                    <div>
                      <span className="font-medium text-blue-400">{key}:</span>
                      <span className="text-gray-300 ml-2">{value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBenefit(key)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Components Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product Components</h3>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Component key (e.g., bioavailability)"
                  value={componentKey}
                  onChange={(e) => setComponentKey(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Component title"
                  value={componentTitle}
                  onChange={(e) => setComponentTitle(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Component content"
                  value={componentContent}
                  onChange={(e) => setComponentContent(e.target.value)}
                  rows={3}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={addComponent}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Component
              </button>
              
              <div className="space-y-4">
                {Object.entries(formData.components).map(([key, comp]) => (
                  <div key={key} className="bg-gray-700 p-4 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-400">{key}</span>
                      <button
                        type="button"
                        onClick={() => removeComponent(key)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                    <h4 className="font-semibold text-white">{comp.title}</h4>
                    <p className="text-gray-300">{comp.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">FAQ</h3>
              <button
                type="button"
                onClick={addFAQ}
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add FAQ
              </button>
              
              <div className="space-y-4">
                {formData.faq_data.map((faq, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">FAQ #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFAQ(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 mb-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Images Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Hero Images</h3>
              <p className="text-sm text-gray-400 mb-4">
                These images will be displayed prominently on the product page and can be different from the standard product images.
              </p>
              <ImageUpload
                images={formData.hero_images.map(url => ({ url }))}
                onImagesChange={(images) => {
                  const heroUrls = images.map(img => img.url);
                  setFormData(prev => ({ ...prev, hero_images: heroUrls }));
                }}
                maxImages={5}
                label="Hero Images"
                description="Upload high-quality hero images for the product page header."
              />
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty to use product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SEO Description
              </label>
              <textarea
                name="seo_description"
                value={formData.seo_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty to use product description"
              />
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">JSON Preview</h3>
              <p className="text-sm text-gray-400 mb-4">
                This shows how the product data will be stored in the database
              </p>
              <pre className="bg-gray-900 p-4 rounded text-xs text-gray-300 overflow-auto max-h-96">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
}