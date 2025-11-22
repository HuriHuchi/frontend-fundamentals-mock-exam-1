import { SavingsProduct } from 'apis/queries/products';
import { isNil } from 'es-toolkit';
import { Assets, colors, ListRow } from 'tosslib';
import { comma, formatPrice } from 'utils';

interface Props {
  selectedProduct: SavingsProduct | null;
  목표금액: number | null;
  월납입액: number | null;
}

export function CalculationResult({ selectedProduct, 목표금액, 월납입액 }: Props) {
  // 1. 상품을 선택하지 않으면 메시지를 출력한다.
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  // 2. 목표 금액을 입력하지 않으면 메시지를 출력한다.
  if (isNil(목표금액)) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="목표 금액을 입력해주세요." />} />;
  }

  const { name, annualRate, availableTerms, minMonthlyAmount, maxMonthlyAmount } = selectedProduct;

  // 연이자율을 소수로 변환
  const 연이자율 = annualRate / 100;

  // 예상 수익 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
  const 예상_수익_금액 = (월납입액 ?? maxMonthlyAmount) * availableTerms * (1 + 연이자율 * 0.5);

  // 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
  const 목표금액과의차이 = 목표금액 - 예상_수익_금액;

  // 추천 월 납입 금액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
  const 추천_월납입액 = Math.round(목표금액 / (availableTerms * (1 + 연이자율 * 0.5)) / 1000) * 1000;

  return (
    <>
      {isNil(월납입액) && (
        <ListRow
          contents={
            <ListRow.Texts type="1RowTypeA" top="월 납입액을 입력하지 않은 경우, 최대 납입 금액을 계산에 적용합니다." />
          }
        />
      )}

      {/* 선택된 상품 정보를 보여주기 */}
      <div style={{ backgroundColor: colors.blue50 }}>
        <ListRow
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatPrice(minMonthlyAmount)} ~ ${formatPrice(maxMonthlyAmount)} | ${availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={<Assets.Icon name="icon-check-circle-green" />}
        />
      </div>

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${comma(Math.round(예상_수익_금액))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${comma(Math.round(목표금액과의차이))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${comma(추천_월납입액)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
