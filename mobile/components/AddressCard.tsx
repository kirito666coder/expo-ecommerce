import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address } from '@/types';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string, label: string) => void;
  isUpdatingAddress: boolean;
  isDeletingAddress: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  isUpdatingAddress,
  isDeletingAddress,
}: AddressCardProps) {
  return (
    <View className="bg-surface mb-3 rounded-3xl p-5">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-primary/20 mr-3 h-12 w-12 items-center justify-center rounded-full">
            <Ionicons name="location" size={24} color="#1DB954" />
          </View>
          <Text className="text-text-primary text-lg font-bold">{address.label}</Text>
        </View>
        {address.isDefault && (
          <View className="bg-primary rounded-full px-3 py-1">
            <Text className="text-background text-xs font-bold">Default</Text>
          </View>
        )}
      </View>
      <View className="ml-15">
        <Text className="text-text-primary mb-1 font-semibold">{address.fullName}</Text>
        <Text className="text-text-secondary mb-1 text-sm">{address.streetAddress}</Text>
        <Text className="text-text-secondary mb-2 text-sm">
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text className="text-text-secondary text-sm">{address.phoneNumber}</Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <TouchableOpacity
          className="bg-primary/20 flex-1 items-center rounded-xl py-3"
          activeOpacity={0.7}
          onPress={() => onEdit(address)}
          disabled={isUpdatingAddress}
        >
          <Text className="text-primary font-bold">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 items-center rounded-xl bg-red-500/20 py-3"
          activeOpacity={0.7}
          onPress={() => onDelete(address._id, address.label)}
          disabled={isDeletingAddress}
        >
          <Text className="font-bold text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
