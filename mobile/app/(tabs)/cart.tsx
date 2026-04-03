import SafeScreen from '@/components/SafeScreen';
import { useAddresses } from '@/Hooks/useAddressess';
import useCart from '@/Hooks/useCart';
import { useApi } from '@/libs/api';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { Address } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import OrderSummary from '@/components/OrderSummary';
import AddressSelectionModal from '@/components/AddressSelectionModal';

import * as Sentry from '@sentry/react-native';

const CartScreen = () => {
  const api = useApi();
  const {
    cart,
    cartItemCount,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { addresses } = useAddresses();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert('Remove Item', `Remove ${productName} from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFromCart(productId),
      },
    ]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (!addresses || addresses.length === 0) {
      Alert.alert(
        'No Address',
        'Please add a shipping address in your profile before checking out.',
        [{ text: 'OK' }],
      );
      return;
    }

    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async (selectedAddress: Address) => {
    setAddressModalVisible(false);

    // log chechkout initiated
    Sentry.logger.info('Checkout initiated', {
      itemCount: cartItemCount,
      total: total.toFixed(2),
      city: selectedAddress.city,
    });

    try {
      setPaymentLoading(true);

      const { data } = await api.post('/payment/create-intent', {
        cartItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          streetAddress: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phoneNumber: selectedAddress.phoneNumber,
        },
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: 'Your Store Name',
      });

      if (initError) {
        Sentry.logger.error('Payment sheet init failed', {
          errorCode: initError.code,
          errorMessage: initError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });

        Alert.alert('Error', initError.message);
        setPaymentLoading(false);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Sentry.logger.error('Payment cancelled', {
          errorCode: presentError.code,
          errorMessage: presentError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });

        Alert.alert('Payment cancelled', presentError.message);
      } else {
        Sentry.logger.info('Payment successful', {
          total: total.toFixed(2),
          itemCount: cartItems.length,
        });

        Alert.alert('Success', 'Your payment was successful! Your order is being processed.', [
          { text: 'OK', onPress: () => {} },
        ]);
        clearCart();
      }
    } catch (error) {
      Sentry.logger.error('Payment failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        cartTotal: total,
        itemCount: cartItems.length,
      });

      Alert.alert('Error', 'Failed to process payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;
  if (cartItems.length === 0) return <EmptyUI />;

  return (
    <SafeScreen>
      <Text className="text-text-primary px-6 pb-5 text-3xl font-bold tracking-tight">Cart</Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="gap-2 px-6">
          {cartItems.map((item) => (
            <View key={item._id} className="bg-surface overflow-hidden rounded-3xl">
              <View className="flex-row p-4">
                <View className="relative">
                  <Image
                    source={item.product.images[0].url}
                    className="bg-background-lighter"
                    contentFit="cover"
                    style={{ width: 112, height: 112, borderRadius: 16 }}
                  />
                  <View className="bg-primary absolute right-2 top-2 rounded-full px-2 py-0.5">
                    <Text className="text-background text-xs font-bold">×{item.quantity}</Text>
                  </View>
                </View>

                <View className="ml-4 flex-1 justify-between">
                  <View>
                    <Text
                      className="text-text-primary text-lg font-bold leading-tight"
                      numberOfLines={2}
                    >
                      {item.product.name}
                    </Text>
                    <View className="mt-2 flex-row items-center">
                      <Text className="text-primary text-2xl font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                      <Text className="text-text-secondary ml-2 text-sm">
                        ${item.product.price.toFixed(2)} each
                      </Text>
                    </View>
                  </View>

                  <View className="mt-3 flex-row items-center">
                    <TouchableOpacity
                      className="bg-background-lighter h-9 w-9 items-center justify-center rounded-full"
                      activeOpacity={0.7}
                      onPress={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>

                    <View className="mx-4 min-w-[32px] items-center">
                      <Text className="text-text-primary text-lg font-bold">{item.quantity}</Text>
                    </View>

                    <TouchableOpacity
                      className="bg-primary h-9 w-9 items-center justify-center rounded-full"
                      activeOpacity={0.7}
                      onPress={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Ionicons name="add" size={18} color="#121212" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="ml-auto h-9 w-9 items-center justify-center rounded-full bg-red-500/10"
                      activeOpacity={0.7}
                      onPress={() => handleRemoveItem(item.product._id, item.product.name)}
                      disabled={isRemoving}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
      </ScrollView>

      <View className="bg-background/95 border-surface absolute bottom-0 left-0 right-0 border-t px-6 pb-32 pt-4 backdrop-blur-xl">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#1DB954" />
            <Text className="text-text-secondary ml-2">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-text-primary text-xl font-bold">${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary overflow-hidden rounded-2xl"
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <View className="flex-row items-center justify-center py-5">
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Text className="text-background mr-2 text-lg font-bold">Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={paymentLoading}
      />
    </SafeScreen>
  );
};

export default CartScreen;

function LoadingUI() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#00D9FF" />
      <Text className="text-text-secondary mt-4">Loading cart...</Text>
    </View>
  );
}

function ErrorUI() {
  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
      <Text className="text-text-primary mt-4 text-xl font-semibold">Failed to load cart</Text>
      <Text className="text-text-secondary mt-2 text-center">
        Please check your connection and try again
      </Text>
    </View>
  );
}

function EmptyUI() {
  return (
    <View className="bg-background flex-1">
      <View className="px-6 pb-5 pt-16">
        <Text className="text-text-primary text-3xl font-bold tracking-tight">Cart</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color="#666" />
        <Text className="text-text-primary mt-4 text-xl font-semibold">Your cart is empty</Text>
        <Text className="text-text-secondary mt-2 text-center">
          Add some products to get started
        </Text>
      </View>
    </View>
  );
}
