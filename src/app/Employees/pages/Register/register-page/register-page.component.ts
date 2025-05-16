import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [ MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, TranslatePipe, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  registerUser() {
    if (
      this.username &&
      this.password &&
      this.confirmPassword &&
      this.password === this.confirmPassword &&
      this.email
    ) {
      const newUser = {
        username: this.username,
        password: this.password,
        email: this.email,
      };

      this.http.post('https://681fc1f272e59f922ef71049.mockapi.io/api/v1/users', newUser).subscribe({
        next: () => {
          this.goToLogin();
        },
        error: err => {
          console.error('Error creating user:', err);
          alert('Error al registrar usuario.');
        }
      });
    } else {
      alert('Complete correctamente todos los campos.');
    }
  }
}
