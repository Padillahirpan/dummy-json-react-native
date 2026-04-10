import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/authStore";
import { tokenManager } from "@/lib/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const unstable_settings = {
  anchor: "(dashboard)",
};

// Auth protection component
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, fetchUser, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check for existing token and fetch user on app start
    const initializeAuth = async () => {
      const token = await tokenManager.getAccessToken();
      if (token) {
        try {
          await fetchUser();
        } catch (error) {
          // Token invalid, will be cleared by fetchUser
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      // Not authenticated, redirect to login
      router.replace("/auth/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Authenticated, redirect to dashboard
      router.replace("/(dashboard)");
    }
  }, [isAuthenticated, isInitialized, isLoading, segments]);

  if (!isInitialized || isLoading) {
    // Could show a loading screen here
    return null;
  }

  return <>{children}</>;
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const statusBarStyle = colorScheme === "dark" ? "light" : "dark";

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <ProtectedLayout>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="(dashboard)"
            options={{ headerShown: false, title: "Dashboard" }}
          />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        </Stack>
      </ProtectedLayout>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        value={useColorScheme() === "dark" ? DarkTheme : DefaultTheme}
      >
        <RootLayoutContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
