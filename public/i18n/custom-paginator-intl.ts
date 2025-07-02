import { MatPaginatorIntl } from '@angular/material/paginator';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function createCustomPaginatorIntl(): MatPaginatorIntl {
  const translate = inject(TranslateService);
  const paginatorIntl = new MatPaginatorIntl();

  const translateLabels = () => {
    paginatorIntl.itemsPerPageLabel = translate.instant('paginator.itemsPerPage');
    paginatorIntl.nextPageLabel = translate.instant('paginator.nextPage');
    paginatorIntl.previousPageLabel = translate.instant('paginator.previousPage');
    paginatorIntl.firstPageLabel = translate.instant('paginator.firstPage');
    paginatorIntl.lastPageLabel = translate.instant('paginator.lastPage');

    paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return translate.instant('paginator.rangeZero', { length });
      }
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, length);
      return translate.instant('paginator.range', {
        start: startIndex + 1,
        end: endIndex,
        length
      });
    };

    paginatorIntl.changes.next();
  };

  translateLabels();

  translate.onLangChange.subscribe(() => {
    translateLabels();
  });

  return paginatorIntl;
}
