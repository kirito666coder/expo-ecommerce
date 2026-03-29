import { StatusBar, View } from 'react-native';
import React, { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeScreen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-black"
      style={{
        paddingTop: insets.top,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {children}
    </View>
  );
}
