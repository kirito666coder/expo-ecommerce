'use client';
import { useCallback, useEffect, useState } from 'react';
import { PlusIcon, PencilIcon } from 'lucide-react';
import { getStockStatusBadge } from '@/utils';
import { useFetch } from '@/hooks/useFetch';
import { Product } from '@/types';
import DeleteProductSection from './DeleteProductSection';
import AddProductSection from './AddProductSection';

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { request } = useFetch();

  const productData = useCallback(async () => {
    const data = await request((api) => api.get('/admin/products'));
    setProducts(data);
  }, [request]);

  useEffect(() => {
    productData();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1">Manage your product inventory</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 gap-4">
        {products?.map((product) => {
          const status = getStockStatusBadge(product.stock);

          return (
            <div key={product._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-6">
                  <div className="avatar">
                    <div className="w-20 rounded-xl">
                      <img src={`${product.images?.[0]?.url}`} alt={product.name} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title">{product.name}</h3>
                        <p className="text-base-content/70 text-sm">{product.category}</p>
                      </div>
                      <div className={`badge ${status.class}`}>{status.text}</div>
                    </div>
                    <div className="mt-4 flex items-center gap-6">
                      <div>
                        <p className="text-base-content/70 text-xs">Price</p>
                        <p className="text-lg font-bold">${product.price}</p>
                      </div>
                      <div>
                        <p className="text-base-content/70 text-xs">Stock</p>
                        <p className="text-lg font-bold">{product.stock} units</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEdit(product)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <DeleteProductSection id={product._id} setProducts={setProducts} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddProductSection
        showModal={showModal}
        setShowModal={setShowModal}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        refetchProducts={productData}
      />
    </div>
  );
}

export default ProductsPage;
