import useCart from '@/Hooks/useCart';
import useWishlist from '@/Hooks/useWishlist';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
}

const ProductsGrid = ({ products, isLoading, isError }: ProductsGridProps) => {
  const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } =
    useWishlist();

  const { isAddingToCart, addToCart } = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert('Success', `${productName} added to cart!`);
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.response?.data?.error || 'Failed to add to cart');
        },
      },
    );
  };

  const renderProduct = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      className="mb-3 overflow-hidden rounded-3xl text-zinc-900"
      style={{ width: '48%' }}
      activeOpacity={0.8}
      onPress={() => router.push(`/product/${product._id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: product?.images[0]?.url || 'https://via.placeholder.com/150' }}
          className="bg-background-lighter h-44 w-full"
          resizeMode="cover"
        />

        <TouchableOpacity
          className="absolute right-3 top-3 rounded-full bg-black/30 p-2 backdrop-blur-xl"
          activeOpacity={0.7}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? 'heart' : 'heart-outline'}
              size={18}
              color={isInWishlist(product._id) ? '#FF6B6B' : '#FFFFFF'}
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="mb-1 text-xs text-white">{product.category}</Text>
        <Text className="mb-2 text-sm font-bold text-white" numberOfLines={2}>
          {product.name}
        </Text>

        <View className="mb-2 flex-row items-center">
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text className="ml-1 text-xs font-semibold text-white">
            {product.averageRating.toFixed(1)}
          </Text>
          <Text className="ml-1 text-xs text-white">({product.totalReviews})</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-white">${product.price.toFixed(2)}</Text>

          <TouchableOpacity
            className="h-8 w-8 items-center justify-center rounded-full bg-zinc-400"
            activeOpacity={0.7}
            onPress={() => handleAddToCart(product._id, product.name)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Ionicons name="add" size={18} color="#121212" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="items-center justify-center py-20">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="mt-4 text-white">Loading products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="items-center justify-center py-20">
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text className="mt-4 font-semibold text-white">Failed to load products</Text>
        <Text className="mt-2 text-sm text-white">Please try again later</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      ListEmptyComponent={NoProductsFound}
    />
  );
};

export default ProductsGrid;

function NoProductsFound() {
  return (
    <View className="items-center justify-center py-20">
      <Ionicons name="search-outline" size={48} color={'#666'} />
      <Text className="mt-4 font-semibold text-white">No products found</Text>
      <Text className="mt-2 text-sm text-white">Try adjusting your filters</Text>
    </View>
  );
}
