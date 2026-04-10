import { apiFetch } from '../../api';
import { Product } from './index';

export async function deleteProduct(id: number): Promise<Product> {
  return await apiFetch<Product>(`/products/${id}`, {
    method: 'DELETE',
  });
}
