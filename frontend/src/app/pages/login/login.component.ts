import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ FormsModule, RouterLink ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  email =  '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ){}

  login() {
    this.http.post('http://localhost:3000/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        console.log("Login response:", res);

        // save
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userName', res.data.user.name);
        }

        // redirect
        this.router.navigate(['/']);
      },
      error: err => {
        console.error(err);
        alert('Invalid login');
      }
    });
  }
}
