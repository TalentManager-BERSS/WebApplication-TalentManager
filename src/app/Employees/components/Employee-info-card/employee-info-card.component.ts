import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-employee-info-card',
  imports: [MatCardModule],
  templateUrl: './employee-info-card.component.html',
  styleUrl: './employee-info-card.component.css'
})
export class EmployeeInfoCardComponent {
  dato = 'dato';
}
