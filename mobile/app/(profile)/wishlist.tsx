import SafeScreen from '@/components/SafeScreen';
import useCart from '@/Hooks/useCart';
import useWishlist from '@/Hooks/useWishlist';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function WishlistScreen() {
  const { wishlist, isLoading, isError, removeFromWishlist, isRemovingFromWishlist } =
    useWishlist();

  const { addToCart, isAddingToCart } = useCart();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    Alert.alert('Remove from wishlist', `Remove ${productName} from wishlist`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',

        onPress: () => removeFromWishlist(productId),
      },
    ]);
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => Alert.alert('Success', `${productName} added to cart!`),
        onError: (error: any) => {
          Alert.alert('Error', error?.response?.data?.error || 'Failed to add to cart');
        },
      },
    );
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="border-surface flex-row items-center border-b px-6 pb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Wishlist</Text>
        <Text className="ml-auto text-sm text-white">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={80} color="#666" />
          <Text className="mt-4 text-xl font-semibold text-white">Your wishlist is empty</Text>
          <Text className="mt-2 text-center text-white">Start adding products you love!</Text>
          <TouchableOpacity
            className="mt-6 rounded-2xl bg-zinc-200 px-8 py-4"
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)')}
          >
            <Text className="text-background text-base font-bold">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {wishlist.map((item) => (
              <TouchableOpacity
                key={item._id}
                className="mb-3 overflow-hidden rounded-3xl bg-zinc-900"
                activeOpacity={0.8}
                // onPress={() => router.push(`/product/${item._id}`)}
              >
                <View className="flex-row p-4">
                  <Image
                    source={item.images[0].url}
                    className="bg-background-lighter rounded-2xl"
                    style={{ width: 96, height: 96, borderRadius: 8 }}
                  />

                  <View className="ml-4 flex-1">
                    <Text className="mb-2 text-base font-bold text-white" numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text className="mb-2 text-xl font-bold text-green-500">
                      ${item.price.toFixed(2)}
                    </Text>

                    {item.stock > 0 ? (
                      <View className="flex-row items-center">
                        <View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                        <Text className="text-sm font-semibold text-green-500">
                          {item.stock} in stock
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center">
                        <View className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                        <Text className="text-sm font-semibold text-red-500">Out of Stock</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    className="self-start rounded-full bg-red-500/20 p-2"
                    activeOpacity={0.7}
                    onPress={() => handleRemoveFromWishlist(item._id, item.name)}
                    disabled={isRemovingFromWishlist}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                {item.stock > 0 && (
                  <View className="px-4 pb-4">
                    <TouchableOpacity
                      className="items-center rounded-xl bg-zinc-200 py-3"
                      activeOpacity={0.8}
                      onPress={() => handleAddToCart(item._id, item.name)}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Text className="text-background font-bold">Add to Cart</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
}
export default WishlistScreen;

function LoadingUI() {
  return (
    <SafeScreen>
      <View className="border-surface flex-row items-center border-b px-6 pb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Wishlist</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="mt-4 text-white">Loading wishlist...</Text>
      </View>
    </SafeScreen>
  );
}

function ErrorUI() {
  return (
    <SafeScreen>
      <View className="border-surface flex-row items-center border-b px-6 pb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Wishlist</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="mt-4 text-xl font-semibold text-white">Failed to load wishlist</Text>
        <Text className="mt-2 text-center text-white">
          Please check your connection and try again
        </Text>
      </View>
    </SafeScreen>
  );
}
