import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProduct, deleteProduct, updateProduct } from '@/lib/api/products';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '@/stores/productStore';

export default function ProductDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { setSelectedProduct } = useProductStore();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Alert.alert('Success', 'Product deleted successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete product');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate() },
      ]
    );
  };

  const handleEdit = () => {
    if (product) {
      setSelectedProduct(product);
      router.push(`/product/form?id=${id}`);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={[styles.errorTitle, { color: colors.text }]}>Product Not Found</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.card }]}>
        <Image
          source={{ uri: product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400' }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
          <Text style={[styles.price, { color: colors.tint }]}>${product.price.toFixed(2)}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.icon }]}>Category</Text>
          <Text style={[styles.sectionValue, { color: colors.text }]}>{product.category}</Text>
        </View>

        {product.description && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.icon }]}>Description</Text>
              <Text style={[styles.sectionValue, { color: colors.text }]}>{product.description}</Text>
            </View>
          </>
        )}

        {product.rating && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.icon }]}>Rating</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#F59E0B" />
                <Text style={[styles.sectionValue, { color: colors.text }]}>
                  {product.rating.toFixed(1)}
                </Text>
              </View>
            </View>
          </>
        )}

        {product.stock !== undefined && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.icon }]}>Stock</Text>
              <Text style={[styles.sectionValue, { color: colors.text }]}>{product.stock} units</Text>
            </View>
          </>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton, { backgroundColor: colors.tint }]}
            onPress={handleEdit}
          >
            <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton, { backgroundColor: '#EF4444' }]}
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingBottom: 24,
  },
  imageContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  detailsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {},
  deleteButton: {},
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 20,
  },
});
