import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {

  userName = '';
  isLoggedIn = false;

  constructor(
    private router: Router
  ){}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
  
      this.userName = localStorage.getItem('userName') || '';
    }
  }

  ngDoCheck() {
    this.updateUserState();
  }

  updateUserState() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;

      this.userName = localStorage.getItem('userName') || '';
    }
  }
  

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);

    this.isLoggedIn = false;
    this.userName = '';

    this.router.navigate(['/login']);
  }
}
