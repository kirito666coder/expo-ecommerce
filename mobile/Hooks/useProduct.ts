import { useApi } from '@/libs/api';
import { Product } from '@/types';

import { useQuery } from '@tanstack/react-query';

const useProduct = () => {
  const api = useApi();

  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/products');
      return data;
    },
  });
};

export default useProduct;
