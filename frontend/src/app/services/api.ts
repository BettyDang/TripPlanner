import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API = 'http://localhost:3000';
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getTrips() {
    const token = this.getToken();

    return this.http.get(`${this.API}/trips`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  deleteTrip(id: string) {
    const token = localStorage.getItem('token');
  
    return this.http.delete(`http://localhost:3000/trips/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}