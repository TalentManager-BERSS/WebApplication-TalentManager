import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatAnchor} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    MatAnchor,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'catch-up';

  options = [
    {link: '/home', label: 'Home', icon: 'home'},
    {link: '/reports', label: 'Reports', icon: 'insert_chart'},
    {link: '/dashboards', label: 'Dashboards', icon: 'dashboard'},
    {link: '/support', label: 'Support', icon: 'headset_mic'},
    {link: '/logout', label: 'Logout', icon: 'logout'},
  ]


  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
