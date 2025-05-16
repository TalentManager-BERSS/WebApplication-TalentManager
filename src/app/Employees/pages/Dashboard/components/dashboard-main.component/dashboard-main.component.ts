import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

export interface TableInfo {
  name: string;
  input: string;
}

const DATA: TableInfo[] = [
  { name: 'Team 1', input: 'Próximamente' },
  { name: 'Team 2', input: 'Próximamente' },
  { name: 'Team 3', input: 'Próximamente' },
];

@Component({
  selector: 'app-dashboard-main',
  imports: [
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})

export class DashboardMain {
  displayedColumns: string[] = ['name', 'input'];
  dataSource = DATA;
  inputGoal: number = 0;
  constructor(private router: Router) {}

  monthYearControl = new FormControl();
  chosenYear: number = new Date().getFullYear();
  startDate = new Date();

  chosenYearHandler(normalizedYear: Date) {
    this.chosenYear = normalizedYear.getFullYear();
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    const ctrlValue = new Date();
    ctrlValue.setFullYear(this.chosenYear);
    ctrlValue.setMonth(normalizedMonth.getMonth());
    ctrlValue.setDate(1);
    this.monthYearControl.setValue(ctrlValue);
    datepicker.close();
  }

  goToDetail() {
    this.router.navigate(['/dashboards/details']);
  }

  getInputClass(input: string): string {
    const value = parseFloat(input);
    if (isNaN(value) || isNaN(this.inputGoal)) return '';
    if (value > this.inputGoal) return 'above-goal';
    if (value < this.inputGoal) return 'below-goal';
    return '';
  }
}
