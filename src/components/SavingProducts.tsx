import { useSavingProducts } from 'apis/queries/products';
import { Fragment } from 'react';
import { colors, ListRow } from 'tosslib';
import Skeleton from 'react-loading-skeleton';

export function SavingProducts() {
  const { data: savingProducts, isLoading } = useSavingProducts();

  if (isLoading) {
    return <Skeleton count={5} height={80} />;
  }

  return (
    <Fragment>
      {savingProducts?.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
        />
      ))}
    </Fragment>
  );
}
