import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProduct, addProduct, updateProduct } from '@/lib/api/products';
import { useProductStore } from '@/stores/productStore';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'mobile-accessories',
  'motorcycle',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches',
];

export default function ProductFormScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const { selectedProduct, setSelectedProduct } = useProductStore();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!id;

  // Fetch product if editing
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id)),
    enabled: isEditing && !!id,
    onSuccess: (data) => {
      setTitle(data.title || '');
      setPrice(data.price ? data.price.toString() : '');
      setDescription(data.description || '');
      setCategory(data.category || '');
    },
  });

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Alert.alert('Success', 'Product added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; product: any }) =>
      updateProduct(data.id, data.product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      Alert.alert('Success', 'Product updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update product');
    },
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(price))) newErrors.price = 'Price must be a number';
    if (!category.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const productData = {
      title: title.trim(),
      price: parseFloat(price),
      description: description.trim(),
      category: category.trim(),
    };

    if (isEditing) {
      updateMutation.mutate({ id: Number(id), product: productData });
    } else {
      addMutation.mutate(productData);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.icon }]}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: errors.title ? '#EF4444' : colors.border,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter product title"
            placeholderTextColor={colors.tabIconDefault}
          />
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.icon }]}>Price *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: errors.price ? '#EF4444' : colors.border,
              },
            ]}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={colors.tabIconDefault}
          />
          {errors.price && <Text style={styles.error}>{errors.price}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.icon }]}>Category *</Text>
          <View style={[styles.categoryContainer, { backgroundColor: colors.inputBg, borderColor: errors.category ? '#EF4444' : colors.border }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: category === cat ? colors.tint : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: category === cat ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {errors.category && <Text style={styles.error}>{errors.category}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.icon }]}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter product description"
            placeholderTextColor={colors.tabIconDefault}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.tint },
            (addMutation.isPending || updateMutation.isPending) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={addMutation.isPending || updateMutation.isPending}
        >
          {addMutation.isPending || updateMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Product' : 'Add Product'}
            </Text>
          )}
        </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  field: {},
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
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  categoryContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
