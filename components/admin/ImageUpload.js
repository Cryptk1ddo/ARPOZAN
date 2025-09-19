// Image Upload Component
// Provides drag-and-drop image upload with preview and management
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

export default function ImageUpload({
  images = [],
  onImagesChange,
  maxImages = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  label = 'Product Images',
  description = 'Upload product images (JPEG, PNG, WebP). Max 5MB per file.',
  className = ''
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type: ${file.name}. Accepted types: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize) {
      return `File too large: ${file.name}. Maximum size: ${Math.round(maxFileSize / 1024 / 1024)}MB`;
    }
    
    return null;
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      const validFiles = [];

      // Validate all files first
      for (const file of files) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          setUploading(false);
          return;
        }
        validFiles.push(file);
      }

      // Check if we would exceed max images
      if (images.length + validFiles.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed. You have ${images.length} images and are trying to add ${validFiles.length} more.`);
        setUploading(false);
        return;
      }

      // Add files to form data
      validFiles.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      if (result.errors && result.errors.length > 0) {
        setError(result.errors.join(', '));
      }

      if (result.files && result.files.length > 0) {
        const newImages = result.files.map(file => ({
          url: file.url,
          filename: file.filename,
          originalName: file.originalName,
          size: file.size
        }));

        onImagesChange([...images, ...newImages]);
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      uploadFiles(files);
    }
  }, [uploadFiles]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      uploadFiles(files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onImagesChange(newImages);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
        </label>
        <p className="text-sm text-gray-400 mb-4">
          {description}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50/10'
            : 'border-gray-600 hover:border-gray-500'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="space-y-3">
          {uploading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-300">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-300">
                  Drag and drop images here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {images.length}/{maxImages} images uploaded
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group bg-gray-800 rounded-lg overflow-hidden aspect-square"
            >
              {/* Image */}
              <div className="relative w-full h-full">
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.originalName || `Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  {/* Move left */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="p-1 bg-gray-800 hover:bg-gray-700 text-white rounded"
                      title="Move left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Move right */}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="p-1 bg-gray-800 hover:bg-gray-700 text-white rounded"
                      title="Move right"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs text-white truncate">
                  {image.originalName || `Image ${index + 1}`}
                </p>
                {image.size && (
                  <p className="text-xs text-gray-300">
                    {formatFileSize(image.size)}
                  </p>
                )}
              </div>

              {/* Primary image indicator */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Instructions */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No images uploaded yet</p>
          <p className="text-sm mt-1">The first image will be used as the primary product image</p>
        </div>
      )}
    </div>
  );
}