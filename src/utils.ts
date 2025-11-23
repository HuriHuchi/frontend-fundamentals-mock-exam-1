export function formatPrice(price: number) {
  return comma(price) + '원';
}

export function comma(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '';
  }

  return value.toLocaleString('ko-KR');
}

export function uncomma(value: string): number {
  return parseInt(value.replace(/,/g, ''), 10);
}
