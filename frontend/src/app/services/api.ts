import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API = environment.apiUrl;
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
  
    return this.http.delete(`${this.API}/trips/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}