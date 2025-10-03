import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProductFormProps {
  product?: Product | null;
  onSave: (productData: any, imageFile: File | null) => void;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    image_url: product?.image_url || '',
    tags: product?.tags?.join(', ') || '',
    tag: product?.tag || '',
    category: product?.category || 'new-arrivals',
    is_active: product?.is_active ?? true, // Default true for new products
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };




    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  async function uploadImage(file: File): Promise<string> {
  const filePath = `products/${Date.now()}_${file.name}`; // optional: you can keep folder inside bucket

  const { error } = await supabase.storage
    .from('product-images')  // use your correct bucket name
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('product-images')  // again, correct bucket
    .getPublicUrl(filePath);

  return data.publicUrl;
}

  useEffect(() => {
  // Store the original overflow value
  const originalStyle = window.getComputedStyle(document.body).overflow;
  
  // Disable scroll on body
  document.body.style.overflow = 'hidden';
  
  // Cleanup function to re-enable scroll when modal closes
  return () => {
    document.body.style.overflow = originalStyle;
  };
}, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, image_url: '' })); // Clear URL if file is selected
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    let image_url = formData.image_url;

    if (imageFile) {
      // Upload image to Supabase
      image_url = await uploadImage(imageFile);
    }

    await onSave({ ...formData, image_url }, null); // send image_url instead of file
  } catch (error) {
    console.error('Error saving product:', error);
  } finally {
    setIsSubmitting(false);
  }
};


  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
    setImageFile(null);
    setImagePreview('');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border-2 border-pink-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white font-baloo">
                {product ? 'Edit Product ✏️' : 'Add New Product 🛍️'}
              </h3>
              <p className="text-pink-100 text-sm font-poppins mt-1">
                {product ? 'Update your product details' : 'Fill in the details to add a new product'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white hover:text-pink-200 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>
        </div>

        {/* Form Content with Scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cute-charcoal font-poppins">
                Product Image 🖼️
              </label>
              
              {/* Image Preview */}
              {(imagePreview || formData.image_url) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-pink-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-cute-charcoal font-poppins">
                        {imageFile ? imageFile.name : 'Image URL'}
                      </p>
                      <p className="text-xs text-cute-charcoal/60">
                        Click to change or remove
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={removeImage}
                      className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                    Upload Image
                  </label>
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-pink-300 rounded-2xl cursor-pointer bg-pink-50 hover:bg-pink-100 transition-colors group"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-pink-400 group-hover:text-pink-500" />
                      <p className="text-sm text-cute-charcoal font-poppins">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-cute-charcoal/60">PNG, JPG, WEBP (Max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </motion.label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                    Or Use Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all font-poppins bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cute-charcoal font-poppins">
                Basic Information 📝
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all font-poppins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all font-poppins"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all font-poppins resize-none"
                />
              </div>
            </div>

            {/* Categories & Tags */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-cute-charcoal font-poppins">
                Categories & Tags 
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all font-poppins bg-white"
                  >
                    <option value="new-arrivals"> New Arrivals</option>
                    <option value="best-sellers"> Best Sellers</option>
                    <option value="sale"> Sale</option>
                    <option value="gift"> Gift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                    Tag *
                  </label>
                  <select
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all font-poppins bg-white"
                  >
                    <option value="">Select a tag</option>
                    <option value="New"> New</option>
                    <option value="Hot"> Hot</option>
                    <option value="Sale"> Sale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                  Tags (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="dress, pink, casual, summer"
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all font-poppins"
                />
                <p className="text-xs text-cute-charcoal/60 mt-1 font-poppins">
                  Separate tags with commas for better searchability
                </p>
              </div>
            </div>

            {/* Status (Only for editing) */}
            {product && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border-2 border-pink-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      formData.is_active ? 'bg-purple-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        formData.is_active ? 'transform translate-x-6' : ''
                      }`} />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-cute-charcoal font-poppins">
                      Active Product
                    </span>
                    <p className="text-xs text-cute-charcoal/60">
                      {formData.is_active ? 'Product is visible to customers' : 'Product is hidden from customers'}
                    </p>
                  </div>
                </label>
              </div>
            )}
          </form>
        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-pink-200">
          <div className="flex items-center justify-between">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 border-2 border-pink-300 text-pink-600 rounded-2xl font-poppins font-medium hover:bg-pink-50 transition-colors"
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-poppins font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{product ? 'Update Product' : 'Add Product'}</span>
                  <span>✨</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style >{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fdf2f8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ec4899, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #db2777, #7c3aed);
        }
      `}</style>
    </div>
  );
};