import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/api/auth';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user: localUser } = useAuthStore();

  // Fetch fresh user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const displayUser = user || localUser;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Welcome back!
        </Text>
        {displayUser && (
          <Text style={[styles.userName, { color: colors.tint }]}>
            {displayUser.firstName} {displayUser.lastName}
          </Text>
        )}
      </View>

      {displayUser && (
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            {displayUser.image ? (
              <Image
                source={{ uri: displayUser.image }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.inputBg }]}>
                <Ionicons name="person" size={40} color={colors.tabIconDefault} />
              </View>
            )}
          </View>

          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={colors.icon} />
              <Text style={[styles.infoLabel, { color: colors.icon }]}>Full Name</Text>
            </View>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {displayUser.firstName} {displayUser.lastName}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <Ionicons name="at-outline" size={20} color={colors.icon} />
              <Text style={[styles.infoLabel, { color: colors.icon }]}>Username</Text>
            </View>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {displayUser.username}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={colors.icon} />
              <Text style={[styles.infoLabel, { color: colors.icon }]}>Email</Text>
            </View>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {displayUser.email}
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.quickActions, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <Text style={[styles.sectionDesc, { color: colors.icon }]}>
          Browse products, add new items, and manage your inventory from the Products tab.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  quickActions: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
