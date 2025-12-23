export const formatCurrency = (number: number, locale: string = 'en-US') => {
  const CURRENCY_FORMATTER = new Intl.NumberFormat(locale, {
    currency: 'USD',
    style: 'currency',
  });
  return CURRENCY_FORMATTER.format(number);
};