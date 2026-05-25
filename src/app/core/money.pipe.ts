import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';
import { findCurrency } from './currency-catalog';

/**
 * Formats money using the workspace currency's real symbol from the catalog
 * (e.g. PEN -> "S/", BRL -> "R$"), which Angular's CurrencyPipe can't resolve
 * under the en-US locale and would render as the raw code. Honors symbol
 * position so currencies like NOK/PLN read "1,234 kr" / "100 zl" correctly.
 *
 *   {{ amount | money:currencyCode }}            -> "$1,234"
 *   {{ amount | money:currencyCode:'1.2-2' }}    -> "S/ 1,234.50"
 */
@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  transform(value: number | null | undefined, code: string, digits = '1.0-0'): string {
    const amount = Number(value) || 0;
    const option = findCurrency(code);
    const symbol = option?.symbol ?? (code || '');
    const sign = amount < 0 ? '-' : '';
    const num = formatNumber(Math.abs(amount), 'en-US', digits);

    // Some currencies place the symbol after the amount (e.g. "1,234 kr").
    if (option?.symbolAfter) {
      return `${sign}${num} ${symbol}`;
    }

    // Multi-character prefix symbols (S/, R$, MX$) read better with a thin gap.
    const gap = symbol.length > 1 ? ' ' : '';
    return `${sign}${symbol}${gap}${num}`;
  }
}
