import { Component } from '@angular/core';
import {SupportMessageComponent} from '../../../components/Support-message/support-message.component';
import {SupportSendComponent} from '../../../components/Support-send/support-send.component';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  imports: [SupportMessageComponent,
    SupportSendComponent, NgIf, TranslatePipe],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  public messageSend = false;
}
