import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import { getProducts, searchProducts, Product } from "@/lib/api/products";
import { Ionicons } from "@expo/vector-icons";
import { useProductStore } from "@/stores/productStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProductScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useProductStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // FAB position: bottom padding + tab bar height + extra margin
  const fabBottom = Platform.select({
    ios: insets.bottom + 5,
    android: insets.bottom,
    default: 50,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: async () => {
      if (searchQuery.trim()) {
        return await searchProducts(searchQuery);
      }
      return await getProducts({ limit: 100 });
    },
  });

  const products = data?.products || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={{
          uri:
            item.thumbnail ||
            item.images?.[0] ||
            "https://via.placeholder.com/80",
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text
          style={[styles.productTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.productCategory, { color: colors.icon }]}
          numberOfLines={1}
        >
          {item.category}
        </Text>
        <Text style={[styles.productPrice, { color: colors.tint }]}>
          ${item.price.toFixed(2)}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.tabIconDefault}
      />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color={colors.tabIconDefault} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Products Found
      </Text>
      <Text style={[styles.emptyText, { color: colors.icon }]}>
        {searchQuery
          ? "Try a different search term"
          : "Products will appear here"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons
          name="search"
          size={20}
          color={colors.icon}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products..."
          placeholderTextColor={colors.tabIconDefault}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={colors.icon} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Error Loading Products
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={
            products.length === 0 ? styles.emptyList : styles.list
          }
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.tint}
            />
          }
        />
      )}

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: colors.tint, bottom: fabBottom },
        ]}
        onPress={() => router.push("/product/form")}
      >
        <Ionicons name="add" size={28} color="#F1f2f3" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
