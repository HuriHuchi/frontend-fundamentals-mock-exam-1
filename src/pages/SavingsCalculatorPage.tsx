import { SavingsProduct, useSavingProducts } from 'apis/queries/products';
import { CalculationResult } from 'components/CalculationResult';
import { RecommendProductList } from 'components/RecommendProductList';
import { SavingProductList } from 'components/SavingProductList';
import { isNil } from 'es-toolkit';
import { useMemo, useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { comma, uncomma } from 'utils';

type TabKey = 'products' | 'results';

export function SavingsCalculatorPage() {
  // states
  const [selectedTab, setSelectedTab] = useState<TabKey>('products');
  const [목표금액, set목표금액] = useState<number | null>(null);
  const [월납입액, set월납입액] = useState<number | null>(null);
  const [저축기간, set저축기간] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  // queries
  const { data: savingProducts } = useSavingProducts();

  const filteredProducts = useMemo(() => {
    return savingProducts?.filter(product => {
      const 월납입액통과 =
        isNil(월납입액) || (product.minMonthlyAmount < 월납입액 && product.maxMonthlyAmount > 월납입액);
      const 저축기간통과 = isNil(저축기간) || product.availableTerms === 저축기간;

      return 월납입액통과 && 저축기간통과;
    });
  }, [월납입액, 저축기간, savingProducts]);

  const recommendedProducts = useMemo(() => {
    if (!filteredProducts) {
      return [];
    }
    return [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [filteredProducts]);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={comma(목표금액)}
        onChange={e => set목표금액(e.target.value ? uncomma(e.target.value) : null)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={comma(월납입액)}
        onChange={e => set월납입액(e.target.value ? uncomma(e.target.value) : null)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={저축기간}
        onChange={value => set저축기간(value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as TabKey)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <SavingProductList
          products={filteredProducts ?? []}
          selectedProductId={selectedProduct?.id ?? null}
          onSelect={setSelectedProduct}
        />
      )}
      {selectedTab === 'results' && (
        <CalculationResult selectedProduct={selectedProduct} 목표금액={목표금액} 월납입액={월납입액} />
      )}

      <RecommendProductList
        products={recommendedProducts}
        selectedProductId={selectedProduct?.id ?? null}
        onSelect={setSelectedProduct}
      />

      <Spacing size={40} />
    </>
  );
}
