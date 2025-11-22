import { SavingsProduct } from 'apis/queries/products';
import { Fragment } from 'react';
import { Assets, colors, ListRow } from 'tosslib';
import { formatPrice } from 'utils';

interface Props {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelect: (product: SavingsProduct) => void;
}

export function SavingProductList({ products, selectedProductId, onSelect }: Props) {
  const isSelected = (productId: string) => selectedProductId === productId;
  return (
    <Fragment>
      {products.map(product => (
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
      ))}
    </Fragment>
  );
}
