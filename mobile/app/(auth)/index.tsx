import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { icons } from '@/constants/icons';

export default function AuthScreen() {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();

  return (
    <View className="flex-1 items-center justify-center">
      <Image source={icons.auth_img} className="h-[60%] w-screen" resizeMode="contain" />

      <View className="mt-10 w-[80%] gap-2">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-1"
          onPress={() => handleSocialAuth('oauth_google')}
          disabled={loadingStrategy}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          {loadingStrategy ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image source={icons.google} className="mr-3 size-10" resizeMode="contain" />
              <Text className="text-base font-medium text-black">Continue with Google</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text className="mt-6 px-2 text-center text-sm leading-4 text-gray-500">
        By signin up, you agree to our <Text className="text-blue-500">Terms</Text>
        {', '}
        <Text className="text-blue-500">Privacy policy</Text>
        {', '}
        <Text className="text-blue-500">Cookie use</Text>
      </Text>
    </View>
  );
}
