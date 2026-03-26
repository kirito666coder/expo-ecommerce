import { useFetch } from '@/hooks/useFetch';
import { Product } from '@/types';
import { Trash2Icon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type deleteProductProps = {
  id: string;
  setProducts: Dispatch<SetStateAction<Product[]>>;
};

export default function DeleteProductSection({ id, setProducts }: deleteProductProps) {
  const { request, loading } = useFetch();

  const deleteProduct = async (id: string) => {
    await request((api) => api.delete(`/admin/products/${id}`));
    setProducts((prev) => prev.filter((product) => product._id !== id));
  };

  return (
    <button className="btn btn-square btn-ghost text-error" onClick={() => deleteProduct(id)}>
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <Trash2Icon className="h-5 w-5" />
      )}
    </button>
  );
}
