import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/api/auth';
import { Ionicons } from '@expo/vector-icons';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user: localUser, logout } = useAuthStore();

  // Fetch fresh user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const displayUser = user || localUser;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (!displayUser) {
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.avatarSection}>
          {displayUser.image ? (
            <Image
              source={{ uri: displayUser.image }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="person" size={48} color={colors.tabIconDefault} />
            </View>
          )}
          <Text style={[styles.userName, { color: colors.text }]}>
            {displayUser.firstName} {displayUser.lastName}
          </Text>
          <Text style={[styles.userRole, { color: colors.icon }]}>User</Text>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Information</Text>

        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="person-outline" size={22} color={colors.tint} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.icon }]}>Full Name</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {displayUser.firstName} {displayUser.lastName}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="at-outline" size={22} color={colors.tint} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.icon }]}>Username</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{displayUser.username}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="mail-outline" size={22} color={colors.tint} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.icon }]}>Email</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{displayUser.email}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="transgender-outline" size={22} color={colors.tint} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.icon }]}>Gender</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {displayUser.gender.charAt(0).toUpperCase() + displayUser.gender.slice(1)}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="finger-print-outline" size={22} color={colors.tint} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.icon }]}>User ID</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>#{displayUser.id}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Text style={[styles.versionText, { color: colors.icon }]}>
        Dashboard App v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  headerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
