import { SavingsProduct, useSavingProducts } from 'apis/queries/products';
import { CalculationResult } from 'components/CalculationResult';
import { RecommendProductList } from 'components/RecommendProductList';
import { SavingProductList } from 'components/SavingProductList';
import { isNil } from 'es-toolkit';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { Border, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { comma, uncomma } from 'utils';

const TabKeys = ['products', 'results'] as const;
type TabKey = (typeof TabKeys)[number];

export function SavingsCalculatorPage() {
  // query states
  const [selectedTab, setSelectedTab] = useQueryState('tab', parseAsStringLiteral(TabKeys).withDefault('products'));
  const [목표금액, set목표금액] = useQueryState('goal', parseAsInteger);
  const [월납입액, set월납입액] = useQueryState('monthly', parseAsInteger);
  const [저축기간, set저축기간] = useQueryState('term', parseAsInteger);
  const [selectedProductId, setSelectedProductId] = useQueryState('productId', parseAsString);

  // queries
  const { data: savingProducts, isLoading, isError, error } = useSavingProducts();

  const selectedProduct = useMemo(() => {
    if (!selectedProductId || !savingProducts) {
      return null;
    }
    return savingProducts.find(product => product.id === selectedProductId) ?? null;
  }, [selectedProductId, savingProducts]);

  // products
  const filteredProducts =
    savingProducts?.filter(product => {
      const 월납입액통과 =
        isNil(월납입액) || (product.minMonthlyAmount < 월납입액 && product.maxMonthlyAmount > 월납입액);
      const 저축기간통과 = isNil(저축기간) || product.availableTerms === 저축기간;

      return 월납입액통과 && 저축기간통과;
    }) ?? [];

  const recommendedProducts =
    filteredProducts && filteredProducts.length > 0
      ? [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2)
      : [];

  // handlers
  const handleSelectProduct = (product: SavingsProduct) => {
    setSelectedProductId(product.id);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={comma(목표금액)}
        onChange={e => {
          const value = e.target.value ? uncomma(e.target.value) : null;
          set목표금액(value);
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={comma(월납입액)}
        onChange={e => {
          const value = e.target.value ? uncomma(e.target.value) : null;
          set월납입액(value);
        }}
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

      {isLoading && <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 목록을 불러오는 중..." />} />}

      {isError && (
        <ListRow
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top={error instanceof Error ? error.message : '상품 목록을 불러오는 중 오류가 발생했습니다.'}
            />
          }
        />
      )}

      {!isLoading && !isError && (
        <>
          {selectedTab === 'products' && (
            <SavingProductList
              products={filteredProducts}
              selectedProductId={selectedProductId}
              onSelect={handleSelectProduct}
            />
          )}
          {selectedTab === 'results' && (
            <CalculationResult selectedProduct={selectedProduct} 목표금액={목표금액} 월납입액={월납입액} />
          )}

          <RecommendProductList
            products={recommendedProducts}
            selectedProductId={selectedProductId}
            onSelect={handleSelectProduct}
          />
        </>
      )}

      <Spacing size={40} />
    </>
  );
}
