import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-statistics',
  imports: [
    TranslatePipe
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboards']);
  }
}

