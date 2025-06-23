type FormatCurrencyOptions = {
  locale?: string;
  digits?: number;
  showCurrency?: boolean;
  currency?: string;
};

export function formatCurrency(
  value: number,
  optional?: FormatCurrencyOptions
) {


  return value.toLocaleString(optional?.locale || "pt-br", {
    minimumFractionDigits: optional?.digits || 2,
    currency: optional?.showCurrency ? optional?.currency || "BRL" : undefined,
    style: optional?.showCurrency ? 'currency' : undefined,
  });
}
