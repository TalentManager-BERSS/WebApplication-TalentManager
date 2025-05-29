import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-support-send',
  imports: [
    TranslatePipe
  ],
  templateUrl: './support-send.component.html',
  styleUrl: './support-send.component.css'
})
export class SupportSendComponent {

  constructor(private router: Router) {}
  goToHome() {
    this.router.navigate(['/home']);
  }
}
