import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please check your connection and try again',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
      <Text className="mt-4 text-xl font-semibold text-white">{title}</Text>
      <Text className="mt-2 text-center text-white">{description}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} className="bg-primary mt-4 rounded-xl px-6 py-3">
          <Text className="text-background font-semibold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
