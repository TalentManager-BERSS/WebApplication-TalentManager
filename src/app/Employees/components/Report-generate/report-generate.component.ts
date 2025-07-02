import { Component } from '@angular/core';
import {ReportsComponent} from '../../pages/Reports/components/reports.component';
import {TranslatePipe} from '@ngx-translate/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
Chart.register(...registerables);

@Component({
  selector: 'report-generate-app',
  templateUrl: './report-generate.component.html',
  styleUrls: ['./report-generate.component.css'],
  imports: [
    TranslatePipe,
    BaseChartDirective
  ]
})

export class Report2 {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  constructor(
    private reporte: ReportsComponent,
    private translate: TranslateService
  ) {}

  setTranslatedLabel() {
    this.translate.get('performance').subscribe(label => {
      this.barChartData.datasets[0].label = label;
    });
  }

  goToReport() {
    this.reporte.generar = true;
  }

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [150, 110, 100, 80, 60, 40, 0, 0, 0, 0, 0, 0],
        label: '',
        backgroundColor: '#007bff',
        categoryPercentage: 0.4
      }
    ]
  };

  private monthsKeys = [
    'months.january',
    'months.february',
    'months.march',
    'months.april',
    'months.may',
    'months.june',
    'months.july',
    'months.august',
    'months.september',
    'months.october',
    'months.november',
    'months.december'
  ];
  ngOnInit() {
    this.setTranslatedChartData();

    this.translate.onLangChange.subscribe(() => {
      this.setTranslatedChartData();
    });
  }

  private setTranslatedChartData() {
    const allKeys = ['performance', ...this.monthsKeys];
    this.translate.get(allKeys).subscribe(translations => {
      this.barChartData.datasets[0].label = translations['performance'];
      this.barChartData.labels = this.monthsKeys.map(key => translations[key]);
      
      setTimeout(() => {
        this.chart?.update();
      });
    });
  }
}
