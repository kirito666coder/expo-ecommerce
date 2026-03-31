import { View, Text } from 'react-native';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <View className="mt-6 px-6">
      <View className="bg-surface rounded-3xl p-5">
        <Text className="mb-4 text-xl font-bold text-white">Summary</Text>

        <View className="space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-white">Subtotal</Text>
            <Text className="text-base font-semibold text-white">${subtotal.toFixed(2)}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-white">Shipping</Text>
            <Text className="text-base font-semibold text-white">${shipping.toFixed(2)}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-white">Tax</Text>
            <Text className="text-base font-semibold text-white">${tax.toFixed(2)}</Text>
          </View>

          {/* Divider */}
          <View className="border-background-lighter mt-1 border-t pt-3" />

          {/* Total */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">Total</Text>
            <Text className="text-primary text-2xl font-bold">${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
