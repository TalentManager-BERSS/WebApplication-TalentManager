import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MoneyPipe } from '../../core/money.pipe';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ConfirmDialogComponent } from '../../core/confirm-dialog.component';
import { CurrencyService } from '../../core/currency.service';
import { findCurrency } from '../../core/currency-catalog';
import { monthLong, monthShort as monthShortName } from '../../core/date-format';
import { I18nService } from '../../core/i18n.service';
import { DailySummary, Employee, MonthlyAggregate, Report, ReportDraft } from '../../core/models';
import { TalentApiService } from '../../core/talent-api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MoneyPipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(TalentApiService);
  private readonly auth = inject(AuthService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly currencyService = inject(CurrencyService);
  private readonly i18n = inject(I18nService);

  readonly currency = this.currencyService.code;
  readonly currencySymbol = computed(() => findCurrency(this.currency())?.symbol ?? this.currency());

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly reports = signal<Report[]>([]);
  readonly aggregates = signal<MonthlyAggregate[]>([]);
  readonly dailySummaries = signal<DailySummary[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly dailyEmployeeSearch = signal('');
  readonly reportEmployeeSearch = signal('');
  readonly selectedEmployeeId = signal(0);
  private readonly aggregateSelectionTrigger = signal(0);
  private readonly hoursTrigger = signal(0);
  private readonly dailyContextTrigger = signal(0);

  readonly selectedReport = computed(() => this.reports()[0]);
  readonly latestDailySummaries = computed(() => [...this.dailySummaries()]
    .sort((left, right) => this.dailyTime(right) - this.dailyTime(left))
    .slice(0, 5)
  );
  readonly filteredDailyEmployees = computed(() => this.filterEmployees(this.dailyEmployeeSearch()));
  readonly selectedDailyEmployee = computed(() => {
    this.dailyContextTrigger();
    const employeeId = this.dailyForm.controls.employeeId.value;
    return this.employees().find(employee => employee.id === employeeId) ?? null;
  });
  readonly existingDailySummary = computed(() => {
    this.dailyContextTrigger();
    const values = this.dailyForm.getRawValue();
    const date = values.date instanceof Date ? values.date : new Date(values.date);
    if (!values.employeeId || Number.isNaN(date.getTime())) return null;

    return this.dailySummaries().find(summary =>
      summary.employeeId === values.employeeId &&
      summary.day === date.getDate() &&
      summary.month === date.getMonth() + 1 &&
      summary.year === date.getFullYear()
    ) ?? null;
  });
  readonly filteredReportEmployees = computed(() => {
    return this.filterEmployees(this.reportEmployeeSearch());
  });
  readonly selectedEmployee = computed(() =>
    this.employees().find(employee => employee.id === this.selectedEmployeeId()) ?? null
  );
  readonly selectedEmployeeAggregates = computed(() => {
    const employeeId = this.selectedEmployeeId();
    if (!employeeId) return [];

    return this.aggregates()
      .filter(aggregate => aggregate.employeeId === employeeId)
      .sort((left, right) => {
        if (left.year !== right.year) return right.year - left.year;
        return right.month - left.month;
      });
  });

  readonly aggregateKeyOf = (aggregate: MonthlyAggregate) =>
    `${aggregate.employeeId}|${aggregate.year}|${aggregate.month}`;

  readonly selectedAggregate = computed<MonthlyAggregate | null>(() => {
    this.aggregateSelectionTrigger();
    const key = this.reportForm.controls.aggregateKey.value;
    if (!key) return null;
    return this.aggregates().find(item => this.aggregateKeyOf(item) === key) ?? null;
  });

  readonly companyId = this.auth.companyId() ?? 1;

  /** Caps the workday datepicker — a workday can't be logged in the future. */
  readonly maxDate = new Date();

  readonly reportForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    aggregateKey: ['', [Validators.required]]
  });

  readonly dailyForm = this.fb.nonNullable.group({
    employeeId: [0, [Validators.required, Validators.min(1)]],
    date: [new Date(), [Validators.required]],
    entryTime: ['09:00', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
    exitTime: ['18:00', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
    inputAmount: [null as number | null, [Validators.min(0)]],
    score: [7, [Validators.required, Validators.min(0), Validators.max(10)]]
  });

  /** Suggested income for the empty placeholder, derived from the selected employee's hourlyRate. */
  readonly suggestedIncome = computed(() => {
    this.dailyContextTrigger();
    const employee = this.selectedDailyEmployee();
    const hours = this.hoursWorkedPreview();
    if (!employee || hours <= 0) return 0;
    const rate = employee.hourlyRate || 0;
    if (rate <= 0) return 0;
    return Math.round(rate * hours * 100) / 100;
  });

  readonly incomePlaceholder = computed(() => {
    const value = this.suggestedIncome();
    return value > 0 ? value.toFixed(2) : '0';
  });

  /** The income that will actually be recorded: a manually typed amount wins, otherwise the rate-based estimate. */
  readonly effectiveIncome = computed(() => {
    this.dailyContextTrigger();
    const manual = this.dailyForm.controls.inputAmount.value;
    if (manual != null && manual > 0) return manual;
    return this.suggestedIncome();
  });

  readonly hoursWorkedPreview = computed(() => {
    this.hoursTrigger();
    const entry = this.parseTimeToHours(this.dailyForm.controls.entryTime.value);
    const exit = this.parseTimeToHours(this.dailyForm.controls.exitTime.value);
    if (entry === null || exit === null || exit <= entry) return 0;
    return Math.round((exit - entry) * 100) / 100;
  });

  ngOnInit() {
    this.dailyForm.valueChanges.subscribe(() => {
      this.hoursTrigger.update(value => value + 1);
      this.dailyContextTrigger.update(value => value + 1);
    });
    this.reportForm.controls.aggregateKey.valueChanges.subscribe(() => {
      this.aggregateSelectionTrigger.update(value => value + 1);
      this.applyNarrativeIfEmpty();
    });
    this.loadData();
  }

  createReport() {
    const aggregate = this.selectedAggregate();
    if (this.reportForm.invalid || !aggregate) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload: ReportDraft = {
      title: this.reportForm.controls.title.value.trim(),
      content: this.reportForm.controls.content.value.trim(),
      companyId: this.companyId,
      employeeId: aggregate.employeeId,
      year: aggregate.year,
      month: aggregate.month
    };

    this.api.createReport(payload).subscribe({
      next: () => {
        this.reportForm.reset({ title: '', content: '', aggregateKey: '' });
        this.lastGeneratedTitle = '';
        this.lastGeneratedContent = '';
        this.loadReports();
        this.ensureAggregateSelection();
        this.saving.set(false);
        this.snack.open(this.i18n.t('reports.toastCreated'), 'OK', { duration: 2400, panelClass: 'snack-success' });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open(this.i18n.t('reports.toastCreateError'), 'OK', { duration: 3000 });
      }
    });
  }

  selectEmployee(employee: Employee) {
    this.selectedEmployeeId.set(employee.id);
    const firstAggregate = this.firstAggregateForEmployee(employee.id);

    this.reportForm.patchValue({ aggregateKey: firstAggregate ? this.aggregateKeyOf(firstAggregate) : '' });
    if (!firstAggregate) {
      this.reportForm.patchValue({ title: '', content: '' });
      this.lastGeneratedTitle = '';
      this.lastGeneratedContent = '';
    }
  }

  selectDailyEmployee(employee: Employee) {
    this.dailyForm.patchValue({ employeeId: employee.id });
    this.dailyContextTrigger.update(value => value + 1);
  }

  createDailySummary() {
    if (this.dailyForm.invalid) {
      this.dailyForm.markAllAsTouched();
      return;
    }

    const values = this.dailyForm.getRawValue();
    const entry = this.parseTimeToHours(values.entryTime);
    const exit = this.parseTimeToHours(values.exitTime);
    if (entry === null || exit === null) return;
    if (exit <= entry) {
      this.snack.open(this.i18n.t('reports.exitAfterEntry'), 'OK', { duration: 3000 });
      return;
    }

    const date = values.date instanceof Date ? values.date : new Date(values.date);
    const inputAmount = values.inputAmount == null || values.inputAmount === 0
      ? undefined
      : values.inputAmount;

    const payload = {
      employeeId: values.employeeId,
      companyId: this.companyId,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      entryTime: entry,
      exitTime: exit,
      inputAmount,
      score: values.score
    };

    const existing = this.existingDailySummary();
    const request = existing
      ? this.api.updateDailySummary(existing.id, {
          entryTime: payload.entryTime,
          exitTime: payload.exitTime,
          inputAmount: payload.inputAmount,
          score: payload.score
        })
      : this.api.createDailySummary(payload);

    request.subscribe({
      next: summary => {
        this.dailySummaries.set(existing
          ? this.dailySummaries().map(item => item.id === summary.id ? summary : item)
          : [summary, ...this.dailySummaries()]
        );

        const hours = this.formatHours(exit - entry);
        if (existing) {
          this.dailyForm.patchValue({ inputAmount: null }, { emitEvent: false });
          this.snack.open(this.i18n.t('reports.toastRecordUpdated', { hours }), 'OK', { duration: 2400, panelClass: 'snack-success' });
        } else {
          // Advance date by one day so the duplicate-detection banner doesn't
          // appear on the record we just created (and to streamline catch-up logging).
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          this.dailyForm.patchValue({ inputAmount: null, date: nextDate }, { emitEvent: false });
          this.dailyContextTrigger.update(value => value + 1);
          const message = summary.inputAmount > 0
            ? this.i18n.t('reports.toastRecordSavedIncome', { hours, income: this.formatCurrencyShort(summary.inputAmount) })
            : this.i18n.t('reports.toastRecordSaved', { hours });
          this.snack.open(message, 'OK', { duration: 2600, panelClass: 'snack-success' });
        }
        this.loadAggregates();
      },
      error: error => {
        const message = error?.error?.message ?? this.i18n.t('reports.saveRecordError');
        this.snack.open(message, 'OK', { duration: 3000 });
      }
    });
  }

  formatCurrencyShort(amount: number) {
    const option = findCurrency(this.currency());
    const symbol = option?.symbol ?? (this.currency() || '');
    const sign = amount < 0 ? '-' : '';
    const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.abs(amount));
    if (option?.symbolAfter) return `${sign}${num} ${symbol}`;
    const gap = symbol.length > 1 ? ' ' : '';
    return `${sign}${symbol}${gap}${num}`;
  }

  deleteReport(report: Report) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'app-dialog-panel',
      width: '420px',
      data: {
        title: this.i18n.t('reports.deleteConfirmTitle'),
        message: this.i18n.t('reports.deleteConfirmText', { title: report.title }),
        confirmLabel: this.i18n.t('common.confirmDelete'),
        cancelLabel: this.i18n.t('common.cancel'),
        danger: true
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.api.deleteReport(report.id).subscribe(() => {
        this.loadReports();
        this.snack.open(this.i18n.t('reports.toastDeleted'), 'OK', { duration: 2400 });
      });
    });
  }

  aggregateCountForEmployee(employeeId: number) {
    return this.aggregates().filter(aggregate => aggregate.employeeId === employeeId).length;
  }

  employeeFullName(employee: Employee) {
    return `${employee.firstName} ${employee.lastName}`;
  }

  employeeInitials(employee: Employee) {
    return `${employee.firstName[0] ?? ''}${employee.lastName[0] ?? ''}`.toUpperCase();
  }

  employeeName(employeeId: number) {
    const employee = this.employees().find(item => item.id === employeeId);
    return employee ? this.employeeFullName(employee) : this.i18n.t('reports.employeeFallback', { id: employeeId });
  }

  monthName(month: number) {
    return monthLong(month, this.i18n.language());
  }

  monthShort(month: number) {
    return monthShortName(month, this.i18n.language());
  }

  dailyDate(summary: DailySummary) {
    return `${summary.day.toString().padStart(2, '0')}/${summary.month.toString().padStart(2, '0')}/${summary.year}`;
  }

  formatTime(decimal: number) {
    if (decimal === null || decimal === undefined || Number.isNaN(decimal)) return '--';
    const totalMinutes = Math.round(decimal * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  formatHours(decimal: number) {
    return (Math.round(decimal * 10) / 10).toFixed(1);
  }

  private parseTimeToHours(value: string | null | undefined): number | null {
    if (!value || !/^\d{1,2}:\d{2}$/.test(value)) return null;
    const [h, m] = value.split(':').map(Number);
    if (h < 0 || h > 24 || m < 0 || m >= 60) return null;
    if (h === 24 && m !== 0) return null;
    return h + m / 60;
  }

  private loadData() {
    this.loading.set(true);
    forkJoin({
      reports: this.api.getReports(this.companyId),
      aggregates: this.api.getMonthlyAggregate(this.companyId),
      dailySummaries: this.api.getDailySummaries(this.companyId),
      employees: this.api.getEmployees(this.companyId)
    }).subscribe({
      next: ({ reports, aggregates, dailySummaries, employees }) => {
        this.reports.set(reports);
        this.aggregates.set(aggregates);
        this.dailySummaries.set(dailySummaries);
        this.employees.set(employees);
        this.patchDefaultSelections(employees, aggregates);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private loadReports() {
    this.api.getReports(this.companyId).subscribe(reports => this.reports.set(reports));
  }

  private loadAggregates() {
    this.api.getMonthlyAggregate(this.companyId).subscribe(aggregates => {
      this.aggregates.set(aggregates);
      this.ensureAggregateSelection();
    });
  }

  private patchDefaultSelections(employees: Employee[], aggregates: MonthlyAggregate[]) {
    const firstEmployeeId = employees[0]?.id ?? 0;
    this.dailyForm.patchValue({ employeeId: firstEmployeeId });
    this.dailyContextTrigger.update(value => value + 1);

    if (aggregates[0]) {
      this.selectedEmployeeId.set(aggregates[0].employeeId);
      this.reportForm.patchValue({ aggregateKey: this.aggregateKeyOf(aggregates[0]) });
      return;
    }

    this.selectedEmployeeId.set(firstEmployeeId);
  }

  private ensureAggregateSelection() {
    const currentKey = this.reportForm.controls.aggregateKey.value;
    if (currentKey && this.aggregates().some(aggregate => this.aggregateKeyOf(aggregate) === currentKey)) return;

    const aggregate = this.firstAggregateForEmployee(this.selectedEmployeeId()) ?? this.aggregates()[0];
    if (aggregate) {
      this.selectedEmployeeId.set(aggregate.employeeId);
      this.reportForm.patchValue({ aggregateKey: this.aggregateKeyOf(aggregate) });
    }
  }

  private firstAggregateForEmployee(employeeId: number) {
    return this.aggregates()
      .filter(item => !employeeId || item.employeeId === employeeId)
      .sort((left, right) => {
        if (left.year !== right.year) return right.year - left.year;
        return right.month - left.month;
      })[0];
  }

  private lastGeneratedContent = '';
  private lastGeneratedTitle = '';

  private applyNarrativeIfEmpty() {
    const aggregate = this.selectedAggregate();
    if (!aggregate) return;

    const titleControl = this.reportForm.controls.title;
    const contentControl = this.reportForm.controls.content;
    const generatedTitle = this.i18n.t('reports.narrative.titleAuto', {
      month: this.monthName(aggregate.month),
      year: aggregate.year,
      name: aggregate.employeeName
    });
    const narrative = this.buildNarrative(aggregate);

    const currentTitle = titleControl.value?.trim() ?? '';
    if (!currentTitle || currentTitle === this.lastGeneratedTitle) {
      titleControl.setValue(generatedTitle);
      this.lastGeneratedTitle = generatedTitle;
    }

    const current = contentControl.value?.trim() ?? '';
    if (!current || current === this.lastGeneratedContent) {
      contentControl.setValue(narrative);
      this.lastGeneratedContent = narrative;
    }
  }

  private buildNarrative(aggregate: MonthlyAggregate): string {
    const completion = aggregate.completionRate.toFixed(0);
    const score = aggregate.averageScore.toFixed(1);
    const hours = this.formatHours(aggregate.completedHours);
    const totalHours = aggregate.totalHours;
    const days = aggregate.dayCount;
    const input = this.formatCurrencyShort(aggregate.totalInput);
    const month = this.monthName(aggregate.month);
    const name = aggregate.employeeName;
    const team = aggregate.teamName;

    if (aggregate.completionRate > 100) {
      const excessHours = this.formatHours(Math.max(0, aggregate.completedHours - aggregate.totalHours));
      return [
        this.i18n.t('reports.narrative.overP1', { month, year: aggregate.year, name, team, hours, totalHours, excessHours, score }),
        this.i18n.t('reports.narrative.overP2', { input }),
        this.i18n.t('reports.narrative.overP3')
      ].join('\n\n');
    }

    return [
      this.i18n.t('reports.narrative.normP1', { month, year: aggregate.year, name, team, completion, hours, totalHours, score, days }),
      this.i18n.t('reports.narrative.normP2', { input, tone: this.tone(aggregate) }),
      this.i18n.t('reports.narrative.normP3')
    ].join('\n\n');
  }

  private tone(aggregate: MonthlyAggregate): string {
    const completion = aggregate.completionRate;
    const score = aggregate.averageScore;
    if (completion > 100) return this.i18n.t('reports.narrative.toneOver');
    if (completion >= 90 && score >= 8.5) return this.i18n.t('reports.narrative.toneStrong');
    if (completion >= 75 && score >= 7) return this.i18n.t('reports.narrative.toneHealthy');
    if (completion < 60 || score < 6) return this.i18n.t('reports.narrative.toneRisk');
    return this.i18n.t('reports.narrative.toneStable');
  }

  private dailyTime(summary: DailySummary) {
    return new Date(summary.year, summary.month - 1, summary.day).getTime();
  }

  private filterEmployees(search: string) {
    const query = this.normalize(search);
    const employees = [...this.employees()].sort((left, right) =>
      this.employeeFullName(left).localeCompare(this.employeeFullName(right))
    );
    if (!query) return employees;

    return employees.filter(employee =>
      this.normalize([
        employee.firstName,
        employee.lastName,
        employee.occupation,
        employee.teamName
      ].join(' ')).includes(query)
    );
  }

  private normalize(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
