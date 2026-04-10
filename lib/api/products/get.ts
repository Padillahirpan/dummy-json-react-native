import { apiFetch } from '../../api';
import { Product } from './index';

export async function getProduct(id: number): Promise<Product> {
  return await apiFetch<Product>(`/products/${id}`);
}
