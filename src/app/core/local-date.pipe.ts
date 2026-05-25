import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './i18n.service';

/**
 * Formats dates in the active UI language (es-ES / en-US) via Intl, so dates
 * read "25 may 2024" in Spanish and "May 25, 2024" in English instead of always
 * using en-US. Impure so it re-formats when the language toggles.
 *
 * Date-only strings ("yyyy-MM-dd") are parsed as LOCAL dates to avoid the
 * UTC midnight off-by-one; datetime values are shown with time when mode='datetime'.
 */
@Pipe({ name: 'localDate', standalone: true, pure: false })
export class LocalDatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(value: string | number | Date | null | undefined, mode: 'date' | 'datetime' = 'date'): string {
    if (value === null || value === undefined || value === '') return '';
    const date = this.toDate(value);
    if (!date || Number.isNaN(date.getTime())) return '';

    const locale = this.i18n.language() === 'es' ? 'es-ES' : 'en-US';
    const opts: Intl.DateTimeFormatOptions = mode === 'datetime'
      ? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { day: 'numeric', month: 'short', year: 'numeric' };

    return new Intl.DateTimeFormat(locale, opts).format(date);
  }

  private toDate(value: string | number | Date): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'number') return new Date(value);
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnly) {
      return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
    }
    return new Date(value);
  }
}
