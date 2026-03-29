import React from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href={'/(auth)'} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#ddd',
          borderTopWidth: 0,
          height: 32 + insets.bottom,
          paddingTop: 4,
          marginHorizontal: 100,
          marginBottom: insets.bottom,
          borderRadius: 24,
          overflow: 'hidden',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 600,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
