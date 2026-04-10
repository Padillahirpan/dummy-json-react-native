import { apiFetch } from '../../api';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  images?: string[];
  isDeleted?: boolean;
  deletedOn?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsParams {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export async function getProducts(params?: ProductsParams): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.select) queryParams.append('select', params.select);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.order) queryParams.append('order', params.order);

  const queryString = queryParams.toString();
  return await apiFetch<ProductsResponse>(`/products${queryString ? `?${queryString}` : ''}`);
}
