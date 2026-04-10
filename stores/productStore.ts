import { create } from 'zustand';
import { Product } from '@/lib/api/products';

interface ProductState {
  products: Product[];
  searchQuery: string;
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  updateProduct: (id: number, updatedProduct: Product) => void;
  removeProduct: (id: number) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  searchQuery: '',
  selectedProduct: null,
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? updatedProduct : p
      ),
      selectedProduct:
        state.selectedProduct?.id === id
          ? updatedProduct
          : state.selectedProduct,
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      selectedProduct:
        state.selectedProduct?.id === id ? null : state.selectedProduct,
    })),

  clearError: () => set({ error: null }),
}));
