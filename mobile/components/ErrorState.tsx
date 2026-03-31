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
      <Text className="text-text-primary mt-4 text-xl font-semibold">{title}</Text>
      <Text className="text-text-secondary mt-2 text-center">{description}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} className="bg-primary mt-4 rounded-xl px-6 py-3">
          <Text className="text-background font-semibold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
