import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login, isLoading, error, clearError } = useAuthStore();
  const insets = useSafeAreaInsets();
  const statusBarStyle = colorScheme === 'dark' ? 'light' : 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    clearError();

    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      await login(username, password);
      // Navigation is handled by the auth store on success
    } catch (err) {
      // Error is handled by the store
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Sign in to continue
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.icon }]}>Username</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor={colors.tabIconDefault}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.icon }]}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.tabIconDefault}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {error && (
              <Text style={styles.error}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.tint }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.demoHint}>
              <Text style={[styles.demoHintText, { color: colors.icon }]}>
                Demo credentials:
              </Text>
              <Text style={[styles.demoHintText, { color: colors.icon }]}>
                Username: emilys
              </Text>
              <Text style={[styles.demoHintText, { color: colors.icon }]}>
                Password: emilyspass
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoHint: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  demoHintText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
