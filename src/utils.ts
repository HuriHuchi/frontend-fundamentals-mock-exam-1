export function formatPrice(price: number) {
  return comma(price) + '원';
}

export function comma(value: number | null): string {
  if (value == null) {
    return '';
  }

  return value.toLocaleString('ko-KR');
}

export function uncomma(value: string): number {
  return parseInt(value.replace(/,/g, ''));
}
