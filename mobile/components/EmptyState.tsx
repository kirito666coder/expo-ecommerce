import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  title: string;
  description?: string;
  header?: string;
}

export function EmptyState({
  icon = 'folder-open-outline',
  iconSize = 80,
  title,
  description,
  header,
}: EmptyStateProps) {
  return (
    <View className="bg-background flex-1">
      {header && (
        <View className="px-6 pb-5 pt-16">
          <Text className="text-text-primary text-3xl font-bold tracking-tight">{header}</Text>
        </View>
      )}
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name={icon} size={iconSize} color="#666" />
        <Text className="text-text-primary mt-4 text-xl font-semibold">{title}</Text>
        {description && <Text className="text-text-secondary mt-2 text-center">{description}</Text>}
      </View>
    </View>
  );
}
