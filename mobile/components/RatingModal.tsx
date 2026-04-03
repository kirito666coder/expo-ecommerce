import { Order } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  productRatings: { [key: string]: number };
  onRatingChange: (productId: string, rating: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const RatingModal = ({
  visible,
  onClose,
  order,
  productRatings,
  onRatingChange,
  onSubmit,
  isSubmitting,
}: RatingModalProps) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      {/* backdrop layer */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/70 px-4">
          <TouchableWithoutFeedback>
            <View className="bg-surface max-h-[80%] w-full max-w-md rounded-3xl p-6">
              <View className="mb-4 items-center">
                <View className="bg-primary/20 mb-3 h-16 w-16 items-center justify-center rounded-full">
                  <Ionicons name="star" size={32} color="#1DB954" />
                </View>
                <Text className="text-text-primary mb-1 text-2xl font-bold">
                  Rate Your Products
                </Text>
                <Text className="text-text-secondary text-center text-sm">
                  Rate each product from your order
                </Text>
              </View>

              <ScrollView className="mb-4">
                {order?.orderItems.map((item, index) => {
                  const productId = item.product._id;
                  const currentRating = productRatings[productId] || 0;

                  return (
                    <View
                      key={item._id}
                      className={`bg-background-lighter rounded-2xl p-4 ${
                        index < order.orderItems.length - 1 ? 'mb-3' : ''
                      }`}
                    >
                      <View className="mb-3 flex-row items-center">
                        <Image
                          source={item.image}
                          style={{ height: 64, width: 64, borderRadius: 8 }}
                        />
                        <View className="ml-3 flex-1">
                          <Text
                            className="text-text-primary text-sm font-semibold"
                            numberOfLines={2}
                          >
                            {item.name}
                          </Text>
                          <Text className="text-text-secondary mt-1 text-xs">
                            Qty: {item.quantity} • ${item.price.toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => onRatingChange(productId, star)}
                            activeOpacity={0.7}
                            className="mx-1.5"
                          >
                            <Ionicons
                              name={star <= currentRating ? 'star' : 'star-outline'}
                              size={32}
                              color={star <= currentRating ? '#1DB954' : '#666'}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>

              <View className="gap-3">
                <TouchableOpacity
                  className="bg-primary items-center rounded-2xl py-4"
                  activeOpacity={0.8}
                  onPress={onSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#121212" />
                  ) : (
                    <Text className="text-background text-base font-bold">Submit All Ratings</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-surface-lighter border-background-lighter items-center rounded-2xl border py-4"
                  activeOpacity={0.7}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text className="text-text-secondary text-base font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RatingModal;
