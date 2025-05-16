import { Component } from '@angular/core';

import {Report} from '../../../components/Report-home/report-home.component';
import {Report2} from '../../../components/Report-generate/report-generate.component';
import {NgIf} from '@angular/common';
import {Report3} from '../../../components/Report-record/report-record.component';


@Component({
  selector: 'app-reports',
  imports: [Report, Report2, Report3, NgIf],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  public generar = true;
  public record = true;
}
