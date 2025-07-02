import {Component} from '@angular/core';
import {ReportsComponent} from '../../pages/Reports/components/reports.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'report-home-app',
  templateUrl: './report-home.component.html',
  styleUrl: './report-home.component.css',
  imports: [
    TranslatePipe
  ],
})
export class Report {

  constructor(private report: ReportsComponent) {};
  changeGenerate(){
    this.report.generar = false;

  };
  changeRecord(){
    this.report.record = false;

  };
}
