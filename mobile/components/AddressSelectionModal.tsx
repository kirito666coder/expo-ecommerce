import { useAddresses } from '@/Hooks/useAddressess';
import { Address } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
  isProcessing: boolean;
}

const AddressSelectionModal = ({
  visible,
  onClose,
  onProceed,
  isProcessing,
}: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { addresses, isLoading: addressesLoading } = useAddresses();

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-background h-1/2 rounded-t-3xl">
          {/* Modal Header */}
          <View className="border-surface flex-row items-center justify-between border-b p-6">
            <Text className="text-text-primary text-2xl font-bold">Select Address</Text>
            <TouchableOpacity onPress={onClose} className="bg-surface rounded-full p-2">
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* ADDRESSES LIST */}
          <ScrollView className="flex-1 p-6">
            {addressesLoading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#00D9FF" />
              </View>
            ) : (
              <View className="gap-4">
                {addresses?.map((address: Address) => (
                  <TouchableOpacity
                    key={address._id}
                    className={`bg-surface rounded-3xl border-2 p-6 ${
                      selectedAddress?._id === address._id
                        ? 'border-primary'
                        : 'border-background-lighter'
                    }`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="mb-3 flex-row items-center">
                          <Text className="text-primary mr-2 text-lg font-bold">
                            {address.label}
                          </Text>
                          {address.isDefault && (
                            <View className="bg-primary/20 rounded-full px-3 py-1">
                              <Text className="text-primary text-sm font-semibold">Default</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-text-primary mb-2 text-lg font-semibold">
                          {address.fullName}
                        </Text>
                        <Text className="text-text-secondary mb-1 text-base leading-6">
                          {address.streetAddress}
                        </Text>
                        <Text className="text-text-secondary mb-2 text-base">
                          {address.city}, {address.state} {address.zipCode}
                        </Text>
                        <Text className="text-text-secondary text-base">{address.phoneNumber}</Text>
                      </View>
                      {selectedAddress?._id === address._id && (
                        <View className="bg-primary ml-3 rounded-full p-2">
                          <Ionicons name="checkmark" size={24} color="#121212" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View className="border-surface border-t p-6">
            <TouchableOpacity
              className="bg-primary rounded-2xl py-5"
              activeOpacity={0.9}
              onPress={() => {
                if (selectedAddress) onProceed(selectedAddress);
              }}
              disabled={!selectedAddress || isProcessing}
            >
              <View className="flex-row items-center justify-center">
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#121212" />
                ) : (
                  <>
                    <Text className="text-background mr-2 text-lg font-bold">
                      Continue to Payment
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#121212" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressSelectionModal;
