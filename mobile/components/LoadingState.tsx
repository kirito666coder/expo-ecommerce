import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingStateProps {
  message?: string;
  color?: string;
}

const LoadingState = ({ message = 'Loading...', color = '#00D9FF' }: LoadingStateProps) => {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <ActivityIndicator size={'large'} color={color} />
      <Text className="mt-4 text-white">{message}</Text>
    </View>
  );
};

export default LoadingState;
