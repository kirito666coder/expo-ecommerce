import { useSSO } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<boolean>(false);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: 'oauth_google') => {
    setLoadingStrategy(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch {
      Alert.alert(`Error Failed to sign in with ${strategy}. Please try again.`);
    } finally {
      setLoadingStrategy(false);
    }
  };

  return { loadingStrategy, handleSocialAuth };
}
