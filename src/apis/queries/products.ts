import { useQuery } from '@tanstack/react-query';
import { http, isHttpError } from 'tosslib';

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export async function getSavingsProducts(): Promise<SavingsProduct[]> {
  try {
    return http.get<SavingsProduct[]>('/api/savings-products');
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
}

export function useSavingProducts() {
  return useQuery({
    queryKey: ['saving-products'],
    queryFn: getSavingsProducts,
  });
}
