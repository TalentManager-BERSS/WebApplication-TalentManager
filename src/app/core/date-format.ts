import { AppLanguage } from './i18n.service';

/**
 * Bilingual month names. Centralized so the dashboard trend, the reports
 * monthly closings and any saved narrative all read in the active language
 * instead of leaking hard-coded Spanish.
 */
const MONTHS_LONG: Record<AppLanguage, string[]> = {
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const MONTHS_SHORT: Record<AppLanguage, string[]> = {
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

/** Full month name for a 1-based month index (1 = January). */
export function monthLong(month: number, lang: AppLanguage): string {
  return MONTHS_LONG[lang]?.[month - 1] ?? String(month);
}

/** Abbreviated month name for a 1-based month index (1 = January). */
export function monthShort(month: number, lang: AppLanguage): string {
  return MONTHS_SHORT[lang]?.[month - 1] ?? String(month);
}

/** Compact "MMM YY" label, e.g. "May 25" / "Ago 25", used on trend charts. */
export function monthYearShort(month: number, year: number, lang: AppLanguage): string {
  return `${monthShort(month, lang)} ${year % 100}`;
}
