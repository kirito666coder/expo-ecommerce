import RatingModal from '@/components/RatingModal';
import SafeScreen from '@/components/SafeScreen';
import { useOrders } from '@/Hooks/useOrders';
import { useReviews } from '@/Hooks/useReviews';
import { capitalizeFirstLetter, formatDate, getStatusColor } from '@/libs//utils';
import { Order } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function OrdersScreen() {
  const { data: orders, isLoading, isError } = useOrders();
  const { createReviewAsync, isCreatingReview } = useReviews();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRatings, setProductRatings] = useState<{ [key: string]: number }>({});

  const handleOpenRating = (order: Order) => {
    setShowRatingModal(true);
    setSelectedOrder(order);

    const initialRatings: { [key: string]: number } = {};
    order.orderItems.forEach((item) => {
      const productId = item.product._id;
      initialRatings[productId] = 0;
    });
    setProductRatings(initialRatings);
  };

  const handleSubmitRating = async () => {
    if (!selectedOrder) return;

    const allRated = Object.values(productRatings).every((rating) => rating > 0);
    if (!allRated) {
      Alert.alert('Error', 'Please rate all products');
      return;
    }

    try {
      await Promise.all(
        selectedOrder.orderItems.map((item) => {
          createReviewAsync({
            productId: item.product._id,
            orderId: selectedOrder._id,
            rating: productRatings[item.product._id],
          });
        }),
      );

      Alert.alert('Success', 'Thank you for rating all products!');
      setShowRatingModal(false);
      setSelectedOrder(null);
      setProductRatings({});
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to submit rating');
    }
  };

  return (
    <SafeScreen>
      <View className="border-surface flex-row items-center border-b px-6 pb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">My Orders</Text>
      </View>

      {isLoading ? (
        <LoadingUI />
      ) : isError ? (
        <ErrorUI />
      ) : !orders || orders.length === 0 ? (
        <EmptyUI />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {orders.map((order) => {
              const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
              const firstImage = order.orderItems[0]?.image || '';

              return (
                <View key={order._id} className="bg-surface mb-4 rounded-3xl p-5">
                  <View className="mb-4 flex-row">
                    <View className="relative">
                      <Image
                        source={firstImage}
                        style={{ height: 80, width: 80, borderRadius: 8 }}
                        contentFit="cover"
                      />

                      {order.orderItems.length > 1 && (
                        <View className="bg-primary absolute -bottom-1 -right-1 size-7 items-center justify-center rounded-full">
                          <Text className="text-background text-xs font-bold">
                            +{order.orderItems.length - 1}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="ml-4 flex-1">
                      <Text className="text-text-primary mb-1 text-base font-bold">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </Text>
                      <Text className="text-text-secondary mb-2 text-sm">
                        {formatDate(order.createdAt)}
                      </Text>
                      <View
                        className="self-start rounded-full px-3 py-1.5"
                        style={{ backgroundColor: getStatusColor(order.status) + '20' }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: getStatusColor(order.status) }}
                        >
                          {capitalizeFirstLetter(order.status)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {order.orderItems.map((item) => (
                    <Text
                      key={item._id}
                      className="text-text-secondary flex-1 text-sm"
                      numberOfLines={1}
                    >
                      {item.name} × {item.quantity}
                    </Text>
                  ))}

                  <View className="border-background-lighter flex-row items-center justify-between border-t pt-3">
                    <View>
                      <Text className="text-text-secondary mb-1 text-xs">{totalItems} items</Text>
                      <Text className="text-primary text-xl font-bold">
                        ${order.totalPrice.toFixed(2)}
                      </Text>
                    </View>

                    {order.status === 'delivered' &&
                      (order.hasReviewed ? (
                        <View className="bg-primary/20 flex-row items-center rounded-full px-5 py-3">
                          <Ionicons name="checkmark-circle" size={18} color="#1DB954" />
                          <Text className="text-primary ml-2 text-sm font-bold">Reviewed</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          className="bg-primary flex-row items-center rounded-full px-5 py-3"
                          activeOpacity={0.7}
                          onPress={() => handleOpenRating(order)}
                        >
                          <Ionicons name="star" size={18} color="#121212" />
                          <Text className="text-background ml-2 text-sm font-bold">
                            Leave Rating
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrder}
        productRatings={productRatings}
        onSubmit={handleSubmitRating}
        isSubmitting={isCreatingReview}
        onRatingChange={(productId, rating) =>
          setProductRatings((prev) => ({ ...prev, [productId]: rating }))
        }
      />
    </SafeScreen>
  );
}
export default OrdersScreen;

function LoadingUI() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#00D9FF" />
      <Text className="text-text-secondary mt-4">Loading orders...</Text>
    </View>
  );
}

function ErrorUI() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
      <Text className="text-text-primary mt-4 text-xl font-semibold">Failed to load orders</Text>
      <Text className="text-text-secondary mt-2 text-center">
        Please check your connection and try again
      </Text>
    </View>
  );
}

function EmptyUI() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="receipt-outline" size={80} color="#666" />
      <Text className="text-text-primary mt-4 text-xl font-semibold">No orders yet</Text>
      <Text className="text-text-secondary mt-2 text-center">
        Your order history will appear here
      </Text>
    </View>
  );
}
