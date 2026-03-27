/* eslint-env browser */
'use client';

import { useFetch } from '@/hooks/useFetch';
import { Product } from '@/types';
import { ImageIcon, Trash2Icon, XIcon } from 'lucide-react';
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';

type Props = {
  showModal: boolean;
  editingProduct: Product | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setEditingProduct: Dispatch<SetStateAction<Product | null>>;
  setProducts: Dispatch<SetStateAction<Product[]>>;
};

export default function AddProductSection({
  showModal,
  setShowModal,
  editingProduct,
  setEditingProduct,
  setProducts,
}: Props) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [fetchError, setFetchError] = useState('');

  const { request, loading } = useFetch();

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || '',
        price: String(editingProduct.price || ''),
        stock: String(editingProduct.stock || ''),
        description: editingProduct.description || '',
      });
      setImagePreviews([]);
      setImages([]);
    }
  }, [editingProduct]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    const totalImages = [...images, ...fileArray];

    if (totalImages.length > 3) {
      alert('You can upload maximum 3 images');
      return;
    }

    setImages(totalImages);

    const previewUrls = totalImages.map((file) => URL.createObjectURL(file));

    setImagePreviews(previewUrls);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (images.length < 1 && !editingProduct) {
      return alert('At least 1 image is required');
    }

    try {
      const form = new FormData();

      form.append('name', formData.name);
      form.append('category', formData.category);
      form.append('price', formData.price);
      form.append('stock', formData.stock);
      form.append('description', formData.description);

      images.forEach((img) => {
        form.append('images', img);
      });

      let res: Product | null;

      if (editingProduct) {
        res = await request((api) => api.put(`/admin/products/${editingProduct?._id}`, form));
      } else {
        res = await request((api) => api.post('/admin/products', form));
      }

      if (res) {
        setProducts((prev) => prev.filter((pro) => pro._id !== res._id));
        setProducts((prev) => [res, ...prev]);

        setFormData({
          name: '',
          category: '',
          price: '',
          stock: '',
          description: '',
        });

        setImages([]);
        setImagePreviews([]);

        setShowModal(false);
        closeHandle();
        // refetchProducts();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError('Something went wrong');
      }
    }
  };

  const closeHandle = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
    });
    setImages([]);
    setImagePreviews([]);
  };

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={showModal} />

      <div className="modal">
        <div className="modal-box max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <button
              onClick={() => {
                (setShowModal(false), closeHandle());
              }}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {fetchError && (
            <div className="alert alert-error mb-4">
              <span>{fetchError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Product Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Category</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Price ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Stock</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="input input-bordered"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span>Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base font-semibold">
                  <ImageIcon className="h-5 w-5" />
                  Product Images
                </span>
                <span className="label-text-alt text-xs opacity-60">Max 3 images</span>
              </label>

              <div className="bg-base-200 border-base-300 hover:border-primary rounded-xl border-2 border-dashed p-4 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary w-full"
                  required={!editingProduct}
                />

                {editingProduct && (
                  <p className="text-base-content/60 mt-2 text-center text-xs">
                    Leave empty to keep current images
                  </p>
                )}
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="avatar">
                      <div className="w-20 rounded-lg">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                      </div>
                      <button
                        type="button"
                        aria-label={'Remove image'}
                        onClick={() => {
                          setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                          setImages((prev) => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <Trash2Icon className="h-5 w-5 cursor-pointer hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => closeHandle()}
                className="btn"
                disabled={loading}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : editingProduct ? (
                  'Update Product'
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
