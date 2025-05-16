import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  constructor(private router: Router) {}

  goToAddEmployees() {
    this.router.navigate(['/add']);

  }
  goToManageEmployees() {
    this.router.navigate(['/manage']);
  }
}
