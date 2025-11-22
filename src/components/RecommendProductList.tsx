import { SavingsProduct } from 'apis/queries/products';
import { isEmpty } from 'es-toolkit/compat';
import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { formatPrice } from 'utils';

interface Props {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelect: (product: SavingsProduct) => void;
}

export function RecommendProductList({ products, selectedProductId, onSelect }: Props) {
  if (isEmpty(products)) {
    return null;
  }

  const isSelected = (productId: string) => selectedProductId === productId;

  return (
    <>
      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {products.map(product => {
        return (
          <ListRow
            key={product.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={product.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${product.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${formatPrice(product.minMonthlyAmount)} ~ ${formatPrice(product.maxMonthlyAmount)} | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={isSelected(product.id) ? <Assets.Icon name="icon-check-circle-green" /> : null}
            onClick={() => onSelect(product)}
          />
        );
      })}
    </>
  );
}
