import SafeScreen from '@/components/SafeScreen';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

type SecurityOption = {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: 'navigation' | 'toggle';
  value?: boolean;
};

function PrivacyAndSecurityScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [shareData, setShareData] = useState(false);

  const securitySettings: SecurityOption[] = [
    {
      id: 'password',
      icon: 'lock-closed-outline',
      title: 'Change Password',
      description: 'Update your account password',
      type: 'navigation',
    },
    {
      id: 'two-factor',
      icon: 'shield-checkmark-outline',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      type: 'toggle',
      value: twoFactorEnabled,
    },
    {
      id: 'biometric',
      icon: 'finger-print-outline',
      title: 'Biometric Login',
      description: 'Use Face ID or Touch ID',
      type: 'toggle',
      value: biometricEnabled,
    },
  ];

  const privacySettings: SecurityOption[] = [
    {
      id: 'push',
      icon: 'notifications-outline',
      title: 'Push Notifications',
      description: 'Receive push notifications',
      type: 'toggle',
      value: pushNotifications,
    },
    {
      id: 'email',
      icon: 'mail-outline',
      title: 'Email Notifications',
      description: 'Receive order updates via email',
      type: 'toggle',
      value: emailNotifications,
    },
    {
      id: 'marketing',
      icon: 'megaphone-outline',
      title: 'Marketing Emails',
      description: 'Receive promotional emails',
      type: 'toggle',
      value: marketingEmails,
    },
    {
      id: 'data',
      icon: 'analytics-outline',
      title: 'Share Usage Data',
      description: 'Help us improve the app',
      type: 'toggle',
      value: shareData,
    },
  ];

  const accountSettings = [
    {
      id: 'activity',
      icon: 'time-outline',
      title: 'Account Activity',
      description: 'View recent login activity',
    },
    {
      id: 'devices',
      icon: 'phone-portrait-outline',
      title: 'Connected Devices',
      description: 'Manage devices with access',
    },
    {
      id: 'data-download',
      icon: 'download-outline',
      title: 'Download Your Data',
      description: 'Get a copy of your data',
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case 'two-factor':
        setTwoFactorEnabled(value);
        break;
      case 'biometric':
        setBiometricEnabled(value);
        break;
      case 'push':
        setPushNotifications(value);
        break;
      case 'email':
        setEmailNotifications(value);
        break;
      case 'marketing':
        setMarketingEmails(value);
        break;
      case 'data':
        setShareData(value);
        break;
    }
  };

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="border-surface flex-row items-center border-b px-6 pb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Privacy & Security</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* SECURITY SETTING */}
        <View className="px-6 pt-6">
          <Text className="mb-4 text-lg font-bold text-white">Security</Text>

          {securitySettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-surface mb-3 rounded-2xl p-4"
              activeOpacity={setting.type === 'toggle' ? 1 : 0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-primary/20 mr-4 h-12 w-12 items-center justify-center rounded-full">
                  <Ionicons name={setting.icon as any} size={24} color="#1DB954" />
                </View>

                <View className="flex-1">
                  <Text className="mb-1 text-base font-bold text-white">{setting.title}</Text>
                  <Text className="text-sm text-white">{setting.description}</Text>
                </View>

                {setting.type === 'toggle' ? (
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    thumbColor="#FFFFFF"
                    trackColor={{ false: '#2A2A2A', true: '#1DB954' }}

                    // ios_backgroundColor={"purple"}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacy Section */}
        <View className="px-6 pt-4">
          <Text className="mb-4 text-lg font-bold text-white">Privacy</Text>

          {privacySettings.map((setting) => (
            <View key={setting.id}>
              <View className="bg-surface mb-3 rounded-2xl p-4">
                <View className="flex-row items-center">
                  <View className="bg-primary/20 mr-4 h-12 w-12 items-center justify-center rounded-full">
                    <Ionicons name={setting.icon as any} size={24} color="#1DB954" />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-bold text-white">{setting.title}</Text>
                    <Text className="text-sm text-white">{setting.description}</Text>
                  </View>
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    trackColor={{ false: '#2A2A2A', true: '#1DB954' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACCOUNT SECTION */}
        <View className="px-6 pt-4">
          <Text className="mb-4 text-lg font-bold text-white">Account</Text>

          {accountSettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-surface mb-3 rounded-2xl p-4"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-primary/20 mr-4 h-12 w-12 items-center justify-center rounded-full">
                  <Ionicons name={setting.icon as any} size={24} color="#1DB954" />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-base font-bold text-white">{setting.title}</Text>
                  <Text className="text-sm text-white">{setting.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* DELETE ACC BTN */}
        <View className="px-6 pt-4">
          <TouchableOpacity
            className="bg-surface flex-row items-center justify-between rounded-2xl border-2 border-red-500/20 p-5"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </View>
              <View>
                <Text className="mb-1 text-base font-bold text-red-500">Delete Account</Text>
                <Text className="text-sm text-white">Permanently delete your account</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* INFO ALERT */}
        <View className="px-6 pb-4 pt-6">
          <View className="bg-primary/10 flex-row rounded-2xl p-4">
            <Ionicons name="information-circle-outline" size={24} color="#1DB954" />
            <Text className="ml-3 flex-1 text-sm text-white">
              We take your privacy seriously. Your data is encrypted and stored securely. You can
              manage your privacy settings at any time.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default PrivacyAndSecurityScreen;
