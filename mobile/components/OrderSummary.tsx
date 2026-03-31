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
        <Text className="text-text-primary mb-4 text-xl font-bold">Summary</Text>

        <View className="space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-text-secondary text-base">Subtotal</Text>
            <Text className="text-text-primary text-base font-semibold">
              ${subtotal.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-text-secondary text-base">Shipping</Text>
            <Text className="text-text-primary text-base font-semibold">
              ${shipping.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-text-secondary text-base">Tax</Text>
            <Text className="text-text-primary text-base font-semibold">${tax.toFixed(2)}</Text>
          </View>

          {/* Divider */}
          <View className="border-background-lighter mt-1 border-t pt-3" />

          {/* Total */}
          <View className="flex-row items-center justify-between">
            <Text className="text-text-primary text-lg font-bold">Total</Text>
            <Text className="text-primary text-2xl font-bold">${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
