import { apiFetch } from '../../api';
import { Product } from './index';

export interface UpdateProductRequest {
  title?: string;
  price?: number;
  description?: string;
  category?: string;
  images?: string[];
}

export async function updateProduct(id: number, product: UpdateProductRequest): Promise<Product> {
  return await apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}
