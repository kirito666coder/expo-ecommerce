import React, { useMemo, useState } from 'react';
import SafeScreen from '@/components/SafeScreen';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { icons } from '@/constants/icons';
import ProductsGrid from '@/components/ProductsGrid';
import useProduct from '@/Hooks/useProduct';

const CATEGORIES = [
  { name: 'All', icon: 'grid-outline' as const },
  { name: 'Electronics', image: icons.electronics },
  { name: 'Fashion', image: icons.fashion },
  { name: 'Sports', image: icons.sports },
  { name: 'Books', image: icons.books },
];

export default function ShopScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: products, isLoading, isError } = useProduct();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((products) => products.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pb-4 pt-6">
          <View className="mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-black tracking-tight text-white">Shop</Text>
              <Text className="mt-1 text-sm text-white">Browse all products</Text>
            </View>

            <TouchableOpacity className="rounded-full p-3" activeOpacity={0.7}>
              <Ionicons name="options-outline" size={22} color={'#fff'} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center rounded-2xl bg-zinc-800 px-5 py-1">
            <Ionicons color={'#ddd'} size={22} name="search" />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor={'#ddd'}
              className="flex-1 text-base text-white"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;
              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 size-20 items-center justify-center overflow-hidden ${isSelected ? 'bg-white' : 'bg-zinc-800'}`}
                  style={{ borderRadius: 14 }}
                >
                  {category.icon ? (
                    <Ionicons
                      name={category.icon}
                      size={36}
                      color={isSelected ? '#121212' : '#fff'}
                    />
                  ) : (
                    <Image source={category.image} className="size-12" resizeMode="contain" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="mb-6 px-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">Products</Text>
            <Text className="text-sm text-white/90">{filteredProducts.length} items</Text>
          </View>
          <ProductsGrid products={filteredProducts} isLoading={isLoading} isError={isError} />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
