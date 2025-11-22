import { SavingsProduct } from 'apis/queries/products';
import { Fragment } from 'react';
import { colors, ListRow } from 'tosslib';
import { formatPrice } from 'utils';

interface Props {
  products: SavingsProduct[];
}

export function SavingProductList({ products }: Props) {
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
        />
      ))}
    </Fragment>
  );
}
