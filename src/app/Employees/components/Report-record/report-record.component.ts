import {Component} from '@angular/core';
import {ReportsComponent} from '../../pages/Reports/components/reports.component';

@Component({
  selector: 'report-record-app',
  templateUrl: './report-record.component.html',
  styleUrl: './report-record.component.css',
  imports: [
  ],
})
export class Report3 {

  constructor(private reporte: ReportsComponent) {}
  goToRecord() {
    this.reporte.record = true;
  }


}
