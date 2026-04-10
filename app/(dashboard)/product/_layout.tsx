import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, Platform } from 'react-native';

export default function ProductLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        // Account for status bar on Android
        headerTopInsetEnabled: Platform.OS === 'android',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Products',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Product Details',
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          title: 'Add Product',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
