import { Component } from '@angular/core';
import {SupportComponent} from '../../pages/Support/components/support.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-support-message',
  imports: [
    TranslatePipe
  ],

  templateUrl: './support-message.component.html',
  styleUrl: './support-message.component.css'
})
export class SupportMessageComponent {
  email = 'talentmanager@gmail.com';

  constructor(private sack: SupportComponent) {};
  sendMessage(){
    this.sack.messageSend = true;

  };
}
