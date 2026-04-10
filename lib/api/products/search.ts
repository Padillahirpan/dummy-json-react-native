import { apiFetch } from '../../api';
import { ProductsResponse } from './index';

export async function searchProducts(query: string): Promise<ProductsResponse> {
  return await apiFetch<ProductsResponse>(`/products/search?q=${encodeURIComponent(query)}`);
}
