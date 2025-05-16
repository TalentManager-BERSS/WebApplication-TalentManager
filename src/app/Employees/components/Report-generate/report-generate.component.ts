import { Component } from '@angular/core';
import {ReportsComponent} from '../../pages/Reports/components/reports.component';

@Component({
  selector: 'report-generate-app',
  templateUrl: './report-generate.component.html',
  styleUrls: ['./report-generate.component.css'],
  imports: [
  ]
})

export class Report2 {



  constructor(private reporte: ReportsComponent) {}
  goToReport() {
    this.reporte.generar = true;
  }
}
