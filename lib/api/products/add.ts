import { apiFetch } from '../../api';
import { Product } from './index';

export interface AddProductRequest {
  title: string;
  price?: number;
  description?: string;
  category?: string;
  images?: string[];
}

export async function addProduct(product: AddProductRequest): Promise<Product> {
  return await apiFetch<Product>('/products/add', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}
