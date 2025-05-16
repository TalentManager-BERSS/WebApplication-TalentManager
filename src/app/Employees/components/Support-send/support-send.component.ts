import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-support-send',
  imports: [],
  templateUrl: './support-send.component.html',
  styleUrl: './support-send.component.css'
})
export class SupportSendComponent {

  constructor(private router: Router) {}
  goToHome() {
    this.router.navigate(['/home']);
  }
}
