import { Component } from '@angular/core';
import {SupportMessageComponent} from '../../../components/Support-message/support-message.component';
import {SupportSendComponent} from '../../../components/Support-send/support-send.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-support',
  imports: [SupportMessageComponent,
    SupportSendComponent, NgIf],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  public messageSend = false;

}
