import { useQuery } from '@tanstack/react-query';
import { http } from 'tosslib';

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export async function getSavingsProducts(): Promise<SavingsProduct[]> {
  return http.get<SavingsProduct[]>('/api/savings-products');
}

export function useSavingProducts() {
  return useQuery({
    queryKey: ['saving-products'],
    queryFn: getSavingsProducts,
  });
}
