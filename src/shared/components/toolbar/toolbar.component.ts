import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {LanguageSwitcherComponent} from '../../../public/components/language-switcher/language-switcher.component';

@Component({
  selector: 'toolbar-app',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, LanguageSwitcherComponent],
})
export class Toolbar {}
