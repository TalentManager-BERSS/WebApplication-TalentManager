import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  imports: [MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, FormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  username: string = '';
  password: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

  async validateLogin(username: string, password: string): Promise<any> {
    try {
      const users = await this.http.get<any[]>('https://681fc1f272e59f922ef71049.mockapi.io/api/v1/users').toPromise() ?? [];
      return users.find(user => user.username === username && user.password === password) || null;
    } catch (error) {
      console.error('Error validating login:', error);
      return null;
    }
  }

  async handleLogin(): Promise<void> {
    if (!this.username || !this.password) {
      alert('Username and password are required.');
      return;
    }

    const user = await this.validateLogin(this.username, this.password);
    if (user) {
      this.router.navigate(['/home']);
    } else {
      alert('Invalid username or password.');
    }
  }
}
