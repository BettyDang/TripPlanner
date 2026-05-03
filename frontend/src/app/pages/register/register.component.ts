import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ FormsModule, RouterLink ],
  templateUrl: '././register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register() {
    this.http.post('http://localhost:3000/auth/register', {
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        alert('User registered successfully!');

        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log("FULL ERROR:", err);
        console.log("BACKEND MESSAGE:", err.error);
        alert(err.error?.message || 'Registration failed');
      }
    });
  }

}
